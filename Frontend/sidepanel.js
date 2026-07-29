/**
 * GovAssist — Extension UI Shell (v2 — Real Backend Integration)
 *
 * This file drives the sidebar UI against the REAL FastAPI + Gemini backend.
 *
 * Flow:
 *   1. User types a goal
 *   2. We ask the content script to scan the page DOM
 *   3. We POST {goal, current_url, elements} to the backend
 *   4. Backend returns {element_id, action_type, explanation, type_value}
 *   5. We render a step card and tell the content script to highlight the element
 *   6. User confirms → cycle repeats
 *
 * STATE PERSISTENCE: the conversation is mirrored to session storage (via
 * the sessionGet/sessionSet helpers below) as `chatState` on every change.
 */

(function () {
  "use strict";

  const API_URL = "http://127.0.0.1:8000";
  const PageAnalysis = globalThis.GovAssistPageAnalysis;
  const Suggestions = globalThis.GovAssistSuggestions;

  // ---- DOM references ------------------------------------------------------
  const chatThread = document.getElementById("chatThread");
  const emptyState = document.getElementById("emptyState");
  const taskBanner = document.getElementById("taskBanner");
  const taskName = document.getElementById("taskName");
  const changeTaskBtn = document.getElementById("changeTaskBtn");
  const composerForm = document.getElementById("composerForm");
  const goalInput = document.getElementById("goalInput");
  const sendBtn = document.getElementById("sendBtn");
  const micBtn = document.getElementById("micBtn");
  const langBtn = document.getElementById("langBtn");
  const langDropdown = document.getElementById("langDropdown");
  const langDropdownWrap = document.getElementById("langDropdownWrap");
  const attachBtn = document.getElementById("attachBtn");
  const themeBtn = document.getElementById("themeBtn");
  const themeIconSun = document.getElementById("themeIconSun");
  const themeIconMoon = document.getElementById("themeIconMoon");
  const composerHint = document.getElementById("composerHint");
  const statusLabel = document.getElementById("statusLabel");
  const autoPressToggle = document.getElementById("autoPressToggle");
  const autoPressLabel = document.getElementById("autoPressLabel");
  const suggestionRow = document.getElementById("suggestionRow");
  const trustIndicator = document.getElementById("trustIndicator");
  const trustSummaryBtn = document.getElementById("trustSummaryBtn");
  const trustDetails = document.getElementById("trustDetails");
  const trustEyebrow = document.getElementById("trustEyebrow");
  const trustLevel = document.getElementById("trustLevel");
  const trustConfidence = document.getElementById("trustConfidence");
  const trustExplanation = document.getElementById("trustExplanation");
  const trustSignals = document.getElementById("trustSignals");
  const trustRecommendation = document.getElementById("trustRecommendation");
  const trustReadBtn = document.getElementById("trustReadBtn");
  const trustIcon = document.getElementById("trustIcon");
  const securityModeToggle = document.getElementById("securityModeToggle");
  const securityModeTitle = document.getElementById("securityModeTitle");
  const securityModeLabel = document.getElementById("securityModeLabel");
  const actionWarning = document.getElementById("actionWarning");
  const actionWarningTitle = document.getElementById("actionWarningTitle");
  const actionWarningReason = document.getElementById("actionWarningReason");
  const actionWarningRecommendation = document.getElementById("actionWarningRecommendation");
  const actionWarningReadBtn = document.getElementById("actionWarningReadBtn");
  const actionWarningBackBtn = document.getElementById("actionWarningBackBtn");
  const actionWarningContinueBtn = document.getElementById("actionWarningContinueBtn");

  // ---- Conversation state ---------------------------------------------------
  let currentGoal = "";
  let stepCount = 0;
  let lastResponse = null; // the previous NavigationResponse, sent as context to the next step
  let stepHistory = []; // full ordered list of every step taken this session
  let chatLog = []; // [{kind:'user', text}] | [{kind:'note', text}] | [{kind:'step', step, resolved}]
  let currentStatus = "Ready to help";
  let currentTaskBanner = { visible: false, name: "—" };
  let autoPress = false;
  let securityModeEnabled = true;
  let selectedLang = "en"; // dialect code for TTS
  let currentPageAnalysis = null;
  let currentSuggestions = [];
  let currentActionAssessment = null;
  let featureRefreshTimer = null;
  let featureRequestGeneration = 0;
  const ORIGINAL_SUGGESTIONS = [
    {
      id: "original-housing-grant",
      label: "Apply for housing grant",
      intent: "I want to apply for a housing grant",
      reason: "Original GovAssist housing-grant shortcut.",
    },
    {
      id: "original-cpf-balance",
      label: "Check CPF balance",
      intent: "I want to log in to check my CPF balance",
      reason: "Original GovAssist CPF-balance shortcut.",
    },
  ];

  // ==========================================================================
  // Backend + Content Script Communication
  // ==========================================================================

  // ---- Content Script Communication ---------------------------------------------
  async function sendToContentScript(message) {
    // 1. First try the current window (where the sidepanel is attached)
    let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    let tab = tabs.find(t => t.url && !t.url.startsWith("chrome://") && !t.url.startsWith("chrome-extension://"));

    // 2. Fallback to last focused window if the sidepanel isn't considered the current window
    if (!tab) {
      tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      tab = tabs.find(t => t.url && !t.url.startsWith("chrome://") && !t.url.startsWith("chrome-extension://"));
    }
    
    // 3. Fallback to ANY active window if the above fail
    if (!tab) {
      tabs = await chrome.tabs.query({ active: true });
      tab = tabs.find(t => t.url && !t.url.startsWith("chrome://") && !t.url.startsWith("chrome-extension://"));
    }

    if (!tab) {
      // If we only found invalid tabs, throw INVALID_URL
      const allActive = await chrome.tabs.query({ active: true });
      console.warn("[GovAssist Sidepanel] No valid target tab found. All active tabs:", allActive);
      if (allActive.length > 0) throw new Error("INVALID_URL");
      throw new Error("No active tab found");
    }

    console.log("[GovAssist Sidepanel] Targeting tab ID:", tab.id, "URL:", tab.url, "Title:", tab.title);

    try {
      const res = await chrome.tabs.sendMessage(tab.id, message);
      console.log("[GovAssist Sidepanel] sendMessage success response:", res);
      return res;
    } catch (err) {
      console.error("[GovAssist Sidepanel] sendMessage failed with error:", err.message, err);
      if (err.message.includes("Receiving end does not exist") || err.message.includes("context invalidated")) {
        throw new Error("EXTENSION_RELOADED");
      }
      throw err;
    }
  }

  async function scanPageDOM() {
    try {
      const response = await sendToContentScript({ action: "scanDOM" });
      if (response && response.success) {
        return {
          elements: response.elements,
          url: response.url,
          context: response.context || "page",
          analysis: response.analysis || null,
        };
      }
    } catch (err) {
      console.error("[GovAssist] DOM scan failed:", err);
      if (err.message === "EXTENSION_RELOADED") {
        return { elements: [], url: "", context: "EXTENSION_RELOADED", analysis: null };
      }
      if (err.message === "INVALID_URL") {
        return { elements: [], url: "", context: "INVALID_URL", analysis: null };
      }
    }
    return { elements: [], url: "", context: "page", analysis: null };
  }

  /**
   * Ask the content script to highlight an element.
   */
  async function highlightOnPage(elementId, actionType, explanation, typeValue) {
    try {
      await sendToContentScript({
        action: "highlight",
        element_id: elementId,
        action_type: actionType,
        explanation: explanation,
        type_value: typeValue,
      });
    } catch (err) {
      console.error("[GovAssist] Highlight failed:", err);
    }
  }

  /**
   * Clear any existing highlights on the page.
   */
  async function clearPageHighlight() {
    try {
      await sendToContentScript({ action: "clearHighlight" });
    } catch (err) {
      console.error("[GovAssist] Clear highlight failed:", err);
    }
  }

  function riskPresentation(level) {
    return {
      Low: { className: "is-low", icon: "✓", key: "riskLow" },
      Medium: { className: "is-medium", icon: "!", key: "riskMedium" },
      High: { className: "is-high", icon: "!", key: "riskHigh" },
      Unknown: { className: "is-unknown", icon: "?", key: "riskUnknown" },
    }[level] || { className: "is-unknown", icon: "?", key: "riskUnknown" };
  }

  function updateSecurityModeUI() {
    securityModeToggle.checked = securityModeEnabled;
    securityModeToggle.setAttribute("aria-checked", String(securityModeEnabled));
    securityModeTitle.textContent = securityText("securityMode");
    securityModeLabel.textContent = securityText(securityModeEnabled ? "securityOn" : "securityOff");
  }

  function renderSecurityDisabled() {
    trustIndicator.classList.remove("is-low", "is-medium", "is-high", "is-unknown");
    trustIndicator.classList.add("is-disabled");
    trustIcon.textContent = "○";
    trustEyebrow.textContent = securityText("websiteRisk");
    trustLevel.textContent = securityText("securityDisabled");
    trustConfidence.textContent = "—";
    trustExplanation.textContent = securityText("securityDisabledSummary");
    trustSignals.replaceChildren();
    trustRecommendation.textContent = securityText("securityDisabledRecommendation");
    trustReadBtn.hidden = true;
  }

  function renderTrustAssessment(assessment) {
    if (!securityModeEnabled) {
      renderSecurityDisabled();
      return;
    }
    trustIndicator.classList.remove("is-low", "is-medium", "is-high", "is-unknown", "is-disabled");
    trustEyebrow.textContent = securityText("websiteRisk");
    trustReadBtn.hidden = false;
    if (!assessment) {
      trustIndicator.classList.add("is-unknown");
      trustIcon.textContent = "…";
      trustLevel.textContent = securityText("assessing");
      trustConfidence.textContent = "—";
      trustExplanation.textContent = securityText("assessingSummary");
      trustSignals.replaceChildren();
      trustRecommendation.textContent = "";
      return;
    }

    const presentation = riskPresentation(assessment.riskLevel);
    trustIndicator.classList.add(presentation.className);
    trustIcon.textContent = presentation.icon;
    trustLevel.textContent = securityText(presentation.key);
    trustConfidence.textContent = securityText("confidence").replace("{score}", assessment.confidenceScore);
    trustExplanation.textContent = securityText(`summary${assessment.riskLevel}`);
    trustRecommendation.textContent = securityText(`recommendation${assessment.riskLevel}`);
    trustReadBtn.textContent = `🔊 ${securityText("readAloud")}`;

    const visibleSignals = (assessment.contributingSignals || [])
      .filter((item) => ["critical", "warning"].includes(item.status))
      .slice(0, 5);
    const fallbackSignals = (assessment.contributingSignals || []).filter((item) => item.status === "unknown").slice(0, 2);
    trustSignals.replaceChildren();
    for (const item of (visibleSignals.length ? visibleSignals : fallbackSignals)) {
      const li = document.createElement("li");
      li.textContent = localizeSignal(item);
      trustSignals.appendChild(li);
    }
  }

  function localizeSuggestionLabel(label) {
    if (selectedLang === "en") return label;
    const common = {
      "Explain this page": "explainPage",
      "Show the main sections": "showSections",
      "Help me navigate this website": "helpNavigate",
      "Find contact information": "findContact",
      "Search this website": "searchWebsite",
      "Search for a product": "searchProduct",
      "Apply for housing grant": "applyHousingGrant",
      "Check CPF balance": "checkCpfBalance",
    };
    if (common[label]) return securityText(common[label]);
    const prefixes = [
      ["Open ", "openPrefix"],
      ["Find ", "findPrefix"],
      ["View ", "viewPrefix"],
      ["Check ", "checkPrefix"],
    ];
    const matched = prefixes.find(([prefix]) => label.startsWith(prefix));
    return matched ? `${securityText(matched[1])}${label.slice(matched[0].length)}` : label;
  }

  function renderSuggestions(suggestions) {
    currentSuggestions = suggestions || [];
    suggestionRow.replaceChildren();
    suggestionRow.setAttribute("aria-busy", "false");
    if (!currentSuggestions.length) {
      const unavailable = document.createElement("span");
      unavailable.className = "suggestion-loading";
      unavailable.textContent = securityText("noActions");
      suggestionRow.appendChild(unavailable);
      return;
    }

    for (const suggestion of currentSuggestions) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "suggestion-chip";
      chip.textContent = localizeSuggestionLabel(suggestion.label);
      chip.dataset.goal = suggestion.intent;
      chip.title = suggestion.reason || "";
      suggestionRow.appendChild(chip);
    }
  }

  suggestionRow.addEventListener("click", (event) => {
    const chip = event.target.closest(".suggestion-chip");
    if (!chip || !suggestionRow.contains(chip)) return;
    startNewGoal(chip.dataset.goal, chip.textContent);
  });

  async function refreshPageFeatures(reason) {
    renderSuggestions(ORIGINAL_SUGGESTIONS);
    if (!securityModeEnabled) {
      renderSecurityDisabled();
      return;
    }
    const generation = ++featureRequestGeneration;
    renderTrustAssessment(null);

    try {
      const response = await sendToContentScript({ action: "analysePage", reason });
      if (
        !securityModeEnabled ||
        generation !== featureRequestGeneration ||
        !response ||
        !response.success ||
        !response.analysis
      ) return;
      currentPageAnalysis = response.analysis;
      renderTrustAssessment(currentPageAnalysis.trustAssessment);
    } catch (error) {
      if (!securityModeEnabled) return;
      console.warn("[GovAssist] Page analysis unavailable:", error);
      currentPageAnalysis = null;
      renderTrustAssessment(null);
    }
  }

  function scheduleFeatureRefresh(reason, delay) {
    clearTimeout(featureRefreshTimer);
    if (!securityModeEnabled) return;
    featureRefreshTimer = setTimeout(() => refreshPageFeatures(reason), delay || 250);
  }

  function showActionWarning(assessment) {
    if (!securityModeEnabled || !assessment || !assessment.shouldWarn) return;
    currentActionAssessment = assessment;
    actionWarning.hidden = false;
    actionWarningTitle.textContent = securityText("actionWarningTitle");
    actionWarningReason.textContent = selectedLang === "en"
      ? assessment.reason
      : securityText("actionWarningReason");
    actionWarningRecommendation.textContent = selectedLang === "en"
      ? assessment.recommendation
      : securityText("actionWarningRecommendation");
    actionWarningReadBtn.textContent = `🔊 ${securityText("readAloud")}`;
    actionWarningBackBtn.textContent = securityText("goBack");
    actionWarningContinueBtn.textContent = securityText("continueAnyway");
  }

  function hideActionWarning() {
    currentActionAssessment = null;
    actionWarning.hidden = true;
  }

  /**
   * Call the real backend: scan DOM → POST to API → highlight result.
   * Returns a normalized step object for the UI.
   */
  async function callBackend(goal, previousAction, history) {
    // Step 1: Scan the DOM (modal-aware)
    const { elements, url, context, analysis } = await scanPageDOM();
    if (securityModeEnabled && analysis) {
      currentPageAnalysis = analysis;
      renderTrustAssessment(analysis.trustAssessment);
    }

    if (elements.length === 0) {
      let explanation = "I can't read this page yet. Please make sure you're on a website and try again.";
      if (context === "EXTENSION_RELOADED") {
        explanation = "The extension was just updated. Please **refresh the webpage** (F5) so I can reconnect to it.";
      } else if (context === "INVALID_URL") {
        explanation = "I cannot read browser settings pages. Please navigate to a normal website and try again.";
      }
      return {
        action_type: "fail",
        element_id: null,
        explanation: explanation,
        type_value: null,
      };
    }

    // Step 2: POST to the backend with full context + step history
    const body = {
      goal: PageAnalysis.redactSensitiveText(goal, 500),
      current_url: url,
      elements: elements,
      page_context: context,
      page_summary: securityModeEnabled && analysis ? analysis.pageContext : null,
    };
    if (previousAction) body.previous_action = previousAction;
    if (history && history.length > 0) body.step_history = history;

    const res = await fetch(`${API_URL}/api/next-step`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[GovAssist] Backend error:", res.status, detail);
      return {
        action_type: "fail",
        element_id: null,
        explanation: "Something went wrong talking to the AI. Please try again in a moment.",
        type_value: null,
      };
    }

    const data = await res.json();
    const validActionTypes = new Set(["click", "type", "done", "fail"]);
    const responseIsValid =
      data &&
      validActionTypes.has(data.action_type) &&
      typeof data.explanation === "string" &&
      (data.element_id === null || data.element_id === undefined || typeof data.element_id === "string") &&
      (data.type_value === null || data.type_value === undefined || typeof data.type_value === "string");
    if (!responseIsValid) {
      console.error("[GovAssist] Rejected invalid navigation response:", data);
      return {
        action_type: "fail",
        element_id: null,
        explanation: "The assistant returned an unexpected response. Please try again.",
        type_value: null,
      };
    }
    if (data.action_type === "type") {
      const target = elements.find((element) => element.id === data.element_id);
      if (target && target.sensitive_kind) {
        return {
          action_type: "fail",
          element_id: null,
          explanation: "For your privacy, I will not enter sensitive information. I can guide you to the field, but you must complete it yourself.",
          type_value: null,
        };
      }
    }

    // Step 3: Highlight the target element on the page
    if (data.element_id && data.action_type !== "done" && data.action_type !== "fail") {
      await highlightOnPage(data.element_id, data.action_type, data.explanation, data.type_value);
    }

    return data;
  }

  // ---- Storage helpers -------------------------------------------------
  async function sessionGet(keys) {
    try {
      if (chrome.storage.session) return await chrome.storage.session.get(keys);
    } catch (error) {
      /* fall through */
    }
    return chrome.storage.local.get(keys);
  }

  async function sessionSet(items) {
    try {
      if (chrome.storage.session) return await chrome.storage.session.set(items);
    } catch (error) {
      /* fall through */
    }
    return chrome.storage.local.set(items);
  }

  // ---- Persistence -----------------------------------------------------------
  async function persistState() {
    try {
      await sessionSet({
        chatState: {
          chatLog,
          currentGoal,
          stepCount,
          status: currentStatus,
          taskBanner: currentTaskBanner,
          autoPress,
          selectedLang,
        },
      });
    } catch (error) {
      console.error("[GovAssist] couldn't persist chat state:", error);
    }
  }

  function resolveAllSteps() {
    // Mark all steps in state as resolved
    chatLog.forEach(entry => {
      if (entry.kind === "step") {
        entry.resolved = true;
      }
    });
    // Remove all confirm buttons from the DOM
    chatThread.querySelectorAll('[data-action="confirm"]').forEach(btn => {
      const card = btn.closest(".step-card");
      if (card) card.classList.add("is-done");
      btn.remove();
    });
    persistState();
  }

  async function loadPersistedState() {
    try {
      const { chatState } = await sessionGet("chatState");
      return chatState || null;
    } catch (error) {
      console.error("[GovAssist] couldn't load chat state:", error);
      return null;
    }
  }

  // ---- Rendering helpers -------------------------------------------------
  function scrollToBottom() {
    chatThread.scrollTop = chatThread.scrollHeight;
  }

  function hideEmptyState() {
    if (emptyState) emptyState.hidden = true;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function setStatus(text) {
    currentStatus = text;
    statusLabel.textContent = text;
    persistState();
  }

  function setTaskBanner(visible, name) {
    currentTaskBanner = { visible, name: name || "—" };
    taskName.textContent = currentTaskBanner.name;
    taskBanner.hidden = !visible;
    persistState();
  }

  function renderUserMessage(text) {
    hideEmptyState();
    const wrap = document.createElement("div");
    wrap.className = "msg msg-user";
    wrap.innerHTML = `<div class="bubble-user">${escapeHtml(text)}</div>`;
    chatThread.appendChild(wrap);
  }

  function renderAssistantNote(text) {
    hideEmptyState();
    const wrap = document.createElement("div");
    wrap.className = "msg msg-assistant";
    wrap.innerHTML = `
      <div class="assistant-label"><span class="assistant-avatar">AI</span> ${t("assistantLabel")}</div>
      <div class="assistant-text">${escapeHtml(text)}</div>
    `;
    chatThread.appendChild(wrap);
  }

  function renderStepCard(step, resolved, onConfirm) {
    hideEmptyState();
    const wrap = document.createElement("div");
    wrap.className = "msg msg-assistant";

    const stepNum = step.step_number || stepCount;
    const isDone = step.action_type === "done";
    const isFail = step.action_type === "fail";

    // Choose icon based on action type
    let actionIcon = "👆";
    let actionLabel = step.title || t("actionClick");
    if (step.action_type === "type") {
      actionIcon = "⌨️";
      actionLabel = step.title || t("actionType");
    } else if (step.action_type === "done") {
      actionIcon = "✅";
      actionLabel = step.title || t("actionComplete");
    } else if (step.action_type === "fail") {
      actionIcon = "⚠️";
      actionLabel = t("actionFail");
    }

    // Build the step card
    wrap.innerHTML = `
      <div class="assistant-label"><span class="assistant-avatar">AI</span> ${t("assistantLabel")}</div>
      <div class="step-card ${resolved || isDone ? "is-done" : ""} ${isFail ? "is-fail" : ""}">
        <div class="step-number">${isFail ? "!" : stepNum}</div>
        <div class="step-body">
          <div class="step-title">${actionIcon} ${escapeHtml(actionLabel)}</div>
          <div class="step-detail">${escapeHtml(step.explanation)}</div>
          <div class="step-actions">
            ${
              resolved || isDone
                ? ""
                : isFail
                ? `<button type="button" class="pill-btn primary" data-action="confirm">
                     ${t("btnRetry")}
                   </button>`
                : `<button type="button" class="pill-btn primary" data-action="confirm">
                     ${t("btnNext")}
                   </button>`
            }
            <button type="button" class="pill-btn" data-action="read-aloud">🔊 ${t("btnRead")}</button>
          </div>
        </div>
      </div>
    `;
    chatThread.appendChild(wrap);

    const card = wrap.querySelector(".step-card");
    const confirmBtn = card.querySelector('[data-action="confirm"]');
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        card.classList.add("is-done");
        confirmBtn.remove();
        onConfirm();
      });
    }
    card.querySelector('[data-action="read-aloud"]').addEventListener("click", () => {
      readAloud(step.explanation);
    });
  }

  // Renders one chatLog entry (used both for fresh messages and rehydration).
  function renderEntry(entry) {
    if (entry.kind === "user") {
      renderUserMessage(entry.text);
    } else if (entry.kind === "note") {
      renderAssistantNote(entry.text);
    } else if (entry.kind === "step") {
      renderStepCard(entry.step, entry.resolved, () => {
        entry.resolved = true;
        persistState();
        if (entry.step.action_type === "done") {
          pushEntry({ kind: "note", text: "Nicely done — that completes this task! 🎉" });
          setStatus("Ready to help");
          setTaskBanner(false, "—");
          currentGoal = "";
          stepCount = 0;
          persistState();
        } else if (entry.step.action_type === "fail") {
          pushEntry({ kind: "note", text: "Let's try a different approach. Type your goal again or rephrase it." });
          setStatus("Ready to help");
        } else {
          requestNextStep(null, entry.step); // pass the completed step as previousAction
        }
      });
    }
  }

  function pushEntry(entry) {
    chatLog.push(entry);
    renderEntry(entry);
    scrollToBottom();
    persistState();
  }

  // ---- Core flow -------------------------------------------------------
  async function requestNextStep(goalForFirstCall, previousActionOverride) {
    setStatus("Thinking…");

    // Clear previous highlights
    await clearPageHighlight();

    const typingWrap = document.createElement("div");
    typingWrap.className = "msg msg-assistant";
    typingWrap.id = "typingIndicator";
    typingWrap.innerHTML = `
      <div class="assistant-label"><span class="assistant-avatar">AI</span> Assistant</div>
      <div class="typing-indicator"><span></span><span></span><span></span></div>
    `;
    chatThread.appendChild(typingWrap);
    scrollToBottom();
    sendBtn.disabled = true;

    try {
      const goal = goalForFirstCall || currentGoal;
      // previousActionOverride = step passed directly from the confirm button
      // lastResponse = stored from the previous API response
      const rawPrev = previousActionOverride || lastResponse;
      const previousAction = rawPrev
        ? { element_id: rawPrev.element_id, action_type: rawPrev.action_type, explanation: rawPrev.explanation }
        : null;
      const response = await callBackend(goal, previousAction, stepHistory);

      document.getElementById("typingIndicator")?.remove();
      sendBtn.disabled = false;

      if (!response) {
        pushEntry({
          kind: "note",
          text: "I couldn't figure out what to do on this page. Try describing your goal differently.",
        });
        setStatus("Ready to help");
        return;
      }

      stepCount++;

      // Handle terminal states
      if (response.action_type === "done") {
        resolveAllSteps();
        pushEntry({
          kind: "step",
          step: { ...response, step_number: stepCount },
          resolved: true,
        });
        pushEntry({ kind: "note", text: "All done! Your task is complete. 🎉" });
        setStatus("Ready to help");
        setTaskBanner(false, "—");
        currentGoal = "";
        stepCount = 0;
        stepHistory = [];
        persistState();
        return;
      }

      if (response.action_type === "fail") {
        pushEntry({
          kind: "step",
          step: { ...response, step_number: stepCount },
          resolved: false,
        });
        setStatus("Ready to help");
        stepCount--;
        return;
      }

      // Normal action step — store response so next cycle knows what happened
      lastResponse = response;
      // Push to full history so AI never repeats a used element
      stepHistory.push({ element_id: response.element_id, action_type: response.action_type, explanation: response.explanation });

      if (autoPress && response.element_id !== "singpass-qr-synthetic") {
        // Preflight the exact action before marking it complete. Sensitive
        // actions remain manual even when auto-press is enabled.
        try {
          const preflight = await sendToContentScript({
            action: "evaluateAction",
            element_id: response.element_id,
          });
          if (preflight && preflight.assessment && preflight.assessment.shouldWarn) {
            showActionWarning(preflight.assessment);
            pushEntry({
              kind: "step",
              step: { ...response, step_number: stepCount },
              resolved: false,
            });
            pushEntry({
              kind: "note",
              text: "I paused auto-press because this action involves sensitive information. Please review the caution and continue manually if appropriate.",
            });
            setStatus("Waiting on you");
            return;
          }
        } catch (error) {
          console.info("[GovAssist] Action preflight unavailable; content script will enforce it:", error.message);
        }

        // Auto-press mode: show the step as done, auto-execute, then continue
        pushEntry({
          kind: "step",
          step: { ...response, step_number: stepCount },
          resolved: true,
        });
        setStatus("Auto-pressing…");

        // Execute the action on the page
        try {
          const execution = await sendToContentScript({
            action: "autoClick",
            element_id: response.element_id,
            action_type: response.action_type,
            type_value: response.type_value,
          });
          if (execution && execution.requiresUserAction) {
            showActionWarning(execution.assessment);
            pushEntry({
              kind: "note",
              text: "I paused auto-press because this action involves sensitive information. Please review the caution and continue manually if appropriate.",
            });
            setStatus("Waiting on you");
            return;
          }
        } catch (err) {
          console.warn("[GovAssist] Auto-click failed:", err);
        }

        // Wait 2 seconds so user can see what happened, then auto-continue
        await new Promise(r => setTimeout(r, 2000));
        requestNextStep(null, response);
      } else {
        pushEntry({
          kind: "step",
          step: { ...response, step_number: stepCount },
          resolved: false,
        });
        setStatus("Waiting on you");
      }
    } catch (err) {
      document.getElementById("typingIndicator")?.remove();
      sendBtn.disabled = false;
      console.error("[GovAssist] requestNextStep error:", err);

      pushEntry({
        kind: "note",
        text: "Something went wrong. Is the backend running at " + API_URL + "? Error: " + err.message,
      });
      setStatus("Error — check backend");
    }
  }

  function startNewGoal(goalText, displayText) {
    currentGoal = goalText;
    stepCount = 0;
    lastResponse = null; // reset context for a fresh goal
    stepHistory = []; // reset full history for a fresh goal
    if (!currentTaskBanner.visible) {
      setTaskBanner(true, displayText || goalText);
    }
    pushEntry({ kind: "user", text: displayText || goalText });
    requestNextStep(goalText);
  }

  // ---- Composer ----------------------------------------------------------
  composerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = goalInput.value.trim();
    if (!text) return;
    goalInput.value = "";
    startNewGoal(text);
  });

  // ---- Read aloud (Web Speech API — dialect-aware) --------------------------
  // Map our dialect codes to speechSynthesis lang values
  const DIALECT_MAP = {
    "en":           { lang: "en-US",  rate: 0.95 },
    "zh-CN":        { lang: "zh-CN",  rate: 0.9 },
    "zh-HK":        { lang: "zh-HK",  rate: 0.9 },
    "zh-CN-hokkien":{ lang: "zh-CN",  rate: 0.85 }, // Hokkien fallback to Mandarin voice
    "ms":           { lang: "ms-MY",  rate: 0.9 },
    "ta":           { lang: "ta-IN",  rate: 0.85 },
  };

  function findVoiceForLang(langCode) {
    const voices = window.speechSynthesis.getVoices();
    // Try exact match first
    let voice = voices.find(v => v.lang === langCode);
    if (voice) return voice;
    // Try prefix match (e.g. "zh" matches "zh-CN")
    const prefix = langCode.split("-")[0];
    voice = voices.find(v => v.lang.startsWith(prefix));
    return voice || null;
  }

  function readAloud(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const dialect = DIALECT_MAP[selectedLang] || DIALECT_MAP["en"];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = dialect.rate;
    utterance.lang = dialect.lang;
    const voice = findVoiceForLang(dialect.lang);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }

  // Pre-load voices (some browsers load them async)
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.getVoices();
  }

  // ---- Mic input (opens dedicated voice tab — the only approach that works
  //      reliably in Chrome extension side panels) --------------------------
  let isListening = false;
  let micTabId = null;
  let originalTabId = null;

  micBtn.addEventListener("click", async () => {
    if (isListening) {
      // Close the mic tab if user cancels
      if (micTabId !== null) {
        try { await chrome.tabs.remove(micTabId); } catch {}
        micTabId = null;
      }
      isListening = false;
      micBtn.classList.remove("is-listening");
      micBtn.setAttribute("aria-pressed", "false");
      composerHint.textContent = "Tap the blue mic button to speak naturally";
      return;
    }

    isListening = true;
    micBtn.classList.add("is-listening");
    micBtn.setAttribute("aria-pressed", "true");
    composerHint.textContent = "Speak in the tab that just opened…";

    try {
      const [currTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (currTab) originalTabId = currTab.id;

      const tab = await chrome.tabs.create({
        url: chrome.runtime.getURL("mic_permission.html") + `?lang=${encodeURIComponent(selectedLang)}`,
        active: true,
      });
      micTabId = tab.id;
    } catch (err) {
      isListening = false;
      micBtn.classList.remove("is-listening");
      micBtn.setAttribute("aria-pressed", "false");
      composerHint.textContent = "Could not open voice tab.";
    }
  });

  // Voice results come back from mic_permission.js via chrome.runtime.sendMessage
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "VOICE_RESULT") {
      if (originalTabId !== null) {
        chrome.tabs.update(originalTabId, { active: true }).catch(() => {});
        originalTabId = null;
      }

      isListening = false;
      micTabId = null;
      micBtn.classList.remove("is-listening");
      micBtn.setAttribute("aria-pressed", "false");

      if (msg.text) {
        goalInput.value = msg.text;
        composerHint.textContent = "Tap send or press Enter to start";
        goalInput.focus();
      } else if (msg.error === "not-allowed") {
        composerHint.textContent = "Microphone blocked — allow it in the tab that opened.";
      } else if (msg.error === "no-speech") {
        composerHint.textContent = "No speech detected — tap the mic and try again.";
      } else {
        composerHint.textContent = "Didn't catch that — tap the mic to retry.";
      }
    } else if (msg.type === "PAGE_ANALYSIS_INVALIDATED") {
      if (securityModeEnabled) scheduleFeatureRefresh(msg.reason || "page-change", 300);
    } else if (msg.type === "SENSITIVE_ACTION_WARNING") {
      if (securityModeEnabled) showActionWarning(msg.assessment);
    }
  });

  chrome.tabs.onActivated.addListener(() => scheduleFeatureRefresh("tab-change", 250));
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (!changeInfo.url && changeInfo.status !== "complete") return;
    const activeTabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (activeTabs[0] && activeTabs[0].id === tabId) {
      scheduleFeatureRefresh("tab-update", changeInfo.status === "complete" ? 250 : 500);
    }
  });

  trustSummaryBtn.addEventListener("click", () => {
    const expanded = trustSummaryBtn.getAttribute("aria-expanded") === "true";
    trustSummaryBtn.setAttribute("aria-expanded", String(!expanded));
    trustDetails.hidden = expanded;
  });

  trustReadBtn.addEventListener("click", () => {
    if (!securityModeEnabled || !currentPageAnalysis) return;
    const assessment = currentPageAnalysis.trustAssessment;
    readAloud(
      `${securityText(riskPresentation(assessment.riskLevel).key)}. ` +
      `${securityText(`summary${assessment.riskLevel}`)} ` +
      securityText(`recommendation${assessment.riskLevel}`)
    );
  });

  actionWarningReadBtn.addEventListener("click", () => {
    if (!currentActionAssessment) return;
    readAloud(`${actionWarningReason.textContent} ${actionWarningRecommendation.textContent}`);
  });

  actionWarningContinueBtn.addEventListener("click", hideActionWarning);
  actionWarningBackBtn.addEventListener("click", async () => {
    hideActionWarning();
    try {
      const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if (tabs[0]) await chrome.tabs.goBack(tabs[0].id);
    } catch (error) {
      console.info("[GovAssist] Could not navigate back:", error.message);
    }
  });

  // ---- Attach button (placeholder only) --
  attachBtn.addEventListener("click", () => {
    composerHint.textContent = "Attachments are a placeholder — not wired up yet";
    setTimeout(() => {
      composerHint.textContent = "Tap the blue mic button to speak naturally";
    }, 1800);
  });

  // ---- Dialect voice dropdown & UI Localization ------------------------------
  const UI_STRINGS = {
    "en": {
      statusReady: "Ready to help", statusWaiting: "Waiting on you", statusThinking: "Thinking…", statusSpeaking: "Speaking…",
      taskEyebrow: "CURRENT TASK", emptyState: "Tell me what you'd like to do, and I'll walk you through it one step at a time.",
      inputPlaceholder: "Type or speak here…", sendBtn: "Send",
      hintMic: "Tap the blue mic button to speak naturally", hintSend: "Tap send or press Enter to start",
      assistantLabel: "Assistant", actionClick: "Click the element", actionType: "Type in the field", 
      actionComplete: "Task complete", actionFail: "Couldn't proceed",
      btnNext: "I did this — next step", btnRetry: "Retry", btnRead: "Read aloud", stepLabel: "Step"
    },
    "zh-CN": {
      statusReady: "准备就绪", statusWaiting: "等待您的操作", statusThinking: "思考中…", statusSpeaking: "朗读中…",
      taskEyebrow: "当前任务", emptyState: "告诉我您想做什么，我将一步一步引导您完成。",
      inputPlaceholder: "在此输入或说话…", sendBtn: "发送",
      hintMic: "点击蓝色麦克风按钮自然说话", hintSend: "点击发送或按回车键开始",
      assistantLabel: "助手", actionClick: "点击元素", actionType: "输入文本", 
      actionComplete: "任务完成", actionFail: "无法继续",
      btnNext: "已完成 — 下一步", btnRetry: "重试", btnRead: "朗读", stepLabel: "步骤"
    },
    "zh-HK": {
      statusReady: "準備就緒", statusWaiting: "等待您的操作", statusThinking: "思考中…", statusSpeaking: "朗讀中…",
      taskEyebrow: "當前任務", emptyState: "話畀我知你想做咩，我會一步步引導你。",
      inputPlaceholder: "喺度輸入或者講嘢…", sendBtn: "發送",
      hintMic: "點擊藍色咪高峰自然講嘢", hintSend: "點擊發送或按回車開始",
      assistantLabel: "助手", actionClick: "點擊元素", actionType: "輸入文字", 
      actionComplete: "任務完成", actionFail: "無法繼續",
      btnNext: "已完成 — 下一步", btnRetry: "重試", btnRead: "朗讀", stepLabel: "步驟"
    },
    "zh-CN-hokkien": {
      statusReady: "準備就緒", statusWaiting: "等待您的操作", statusThinking: "思考中…", statusSpeaking: "朗讀中…",
      taskEyebrow: "當前任務", emptyState: "告訴我您想做什麼，我將一步一步引導您完成。",
      inputPlaceholder: "在此輸入或說話…", sendBtn: "發送",
      hintMic: "點擊藍色麥克風按鈕自然說話", hintSend: "點擊發送或按回車鍵開始",
      assistantLabel: "助手", actionClick: "點擊元素", actionType: "輸入文本", 
      actionComplete: "任務完成", actionFail: "無法繼續",
      btnNext: "已完成 — 下一步", btnRetry: "重試", btnRead: "朗讀", stepLabel: "步驟"
    },
    "ms": {
      statusReady: "Sedia membantu", statusWaiting: "Menunggu anda", statusThinking: "Sedang berfikir…", statusSpeaking: "Bercakap…",
      taskEyebrow: "TUGASAN SEMASA", emptyState: "Beritahu saya apa yang anda ingin lakukan, saya akan membimbing anda selangkah demi selangkah.",
      inputPlaceholder: "Taip atau bercakap di sini…", sendBtn: "Hantar",
      hintMic: "Tekan butang mikrofon biru untuk bercakap", hintSend: "Tekan hantar atau Enter untuk mula",
      assistantLabel: "Pembantu", actionClick: "Tekan elemen", actionType: "Taip teks", 
      actionComplete: "Tugasan selesai", actionFail: "Gagal meneruskan",
      btnNext: "Saya dah buat — seterusnya", btnRetry: "Cuba lagi", btnRead: "Baca kuat", stepLabel: "Langkah"
    },
    "ta": {
      statusReady: "உதவ தயார்", statusWaiting: "காத்திருக்கிறது", statusThinking: "சிந்திக்கிறது…", statusSpeaking: "பேசுகிறது…",
      taskEyebrow: "தற்போதைய பணி", emptyState: "நீங்கள் என்ன செய்ய விரும்புகிறீர்கள் என்று சொல்லுங்கள், நான் உங்களுக்கு வழிகாட்டுகிறேன்.",
      inputPlaceholder: "இங்கே தட்டச்சு செய்யவும் அல்லது பேசவும்…", sendBtn: "அனுப்பு",
      hintMic: "பேச நீல மைக் பட்டனை அழுத்தவும்", hintSend: "தொடங்க அனுப்பு அல்லது Enter ஐ அழுத்தவும்",
      assistantLabel: "உதவியாளர்", actionClick: "உறுப்பைக் கிளிக் செய்க", actionType: "உரையை உள்ளிடவும்", 
      actionComplete: "பணி முடிந்தது", actionFail: "தொடர முடியவில்லை",
      btnNext: "செய்துவிட்டேன் — அடுத்த படி", btnRetry: "மீண்டும் முயற்சி செய்", btnRead: "படித்து காட்டு", stepLabel: "படி"
    }
  };

  const SECURITY_EN = {
    websiteRisk: "Website risk",
    securityMode: "Security mode",
    securityOn: "On",
    securityOff: "Off",
    securityDisabled: "Security checks off",
    securityDisabledSummary: "Automatic website security checks are paused.",
    securityDisabledRecommendation: "Turn Security Mode on when you want this page assessed.",
    assessing: "Assessing…",
    assessingSummary: "Collecting local page and URL signals.",
    riskLow: "Low Risk",
    riskMedium: "Some Risk Indicators",
    riskHigh: "High Risk Indicators",
    riskUnknown: "Unable to Assess",
    confidence: "Confidence {score}%",
    summaryLow: "No strong local warning indicators were detected. This is not a guarantee that the website is safe.",
    summaryMedium: "Some indicators suggest that you should check this website more carefully.",
    summaryHigh: "Several high-risk indicators were detected on this page.",
    summaryUnknown: "There is not enough reliable evidence to assess this website confidently.",
    recommendationLow: "Keep checking the domain and page purpose before sharing sensitive information.",
    recommendationMedium: "Verify the domain before entering sensitive information or downloading files.",
    recommendationHigh: "Avoid entering sensitive information. Verify the organisation using its official app or an address you type yourself.",
    recommendationUnknown: "Use caution and verify the website independently before sharing sensitive information.",
    readAloud: "Read aloud",
    findingActions: "Finding useful actions for this page…",
    noActions: "I found too little page information to suggest a specific action.",
    actionWarningTitle: "Caution before continuing",
    actionWarningReason: "This action involves sensitive information and the current page has meaningful risk indicators.",
    actionWarningRecommendation: "Pause and verify the website through the organisation's official app or web address.",
    goBack: "Go back",
    continueAnyway: "Continue anyway",
    explainPage: "Explain this page",
    showSections: "Show the main sections",
    helpNavigate: "Help me navigate this website",
    findContact: "Find contact information",
    searchWebsite: "Search this website",
    searchProduct: "Search for a product",
    applyHousingGrant: "Apply for housing grant",
    checkCpfBalance: "Check CPF balance",
    openPrefix: "Open ",
    findPrefix: "Find ",
    viewPrefix: "View ",
    checkPrefix: "Check ",
    warningSignal: "Warning indicator",
    unknownSignal: "Unavailable evidence",
  };

  const SECURITY_ZH_CN = {
    websiteRisk: "网站风险",
    securityMode: "安全模式",
    securityOn: "开启",
    securityOff: "关闭",
    securityDisabled: "安全检查已关闭",
    securityDisabledSummary: "自动网站安全检查已暂停。",
    securityDisabledRecommendation: "需要评估此页面时，请开启安全模式。",
    assessing: "正在评估…",
    assessingSummary: "正在收集本地网页和网址信号。",
    riskLow: "低风险",
    riskMedium: "发现一些风险指标",
    riskHigh: "发现高风险指标",
    riskUnknown: "无法评估",
    confidence: "置信度 {score}%",
    summaryLow: "未发现明显的本地风险指标，但这并不保证网站安全。",
    summaryMedium: "部分指标显示您应更仔细地检查此网站。",
    summaryHigh: "此页面检测到多个高风险指标。",
    summaryUnknown: "可靠证据不足，无法有把握地评估此网站。",
    recommendationLow: "分享敏感信息前，请继续核对域名和页面用途。",
    recommendationMedium: "输入敏感信息或下载文件前，请先核实域名。",
    recommendationHigh: "请勿输入敏感信息。请使用机构的官方应用或自行输入官方网址核实。",
    recommendationUnknown: "分享敏感信息前，请谨慎并独立核实网站。",
    readAloud: "朗读",
    findingActions: "正在查找适合此页面的操作…",
    noActions: "页面信息太少，无法建议具体操作。",
    actionWarningTitle: "继续前请小心",
    actionWarningReason: "此操作涉及敏感信息，而当前页面有明显的风险指标。",
    actionWarningRecommendation: "请暂停，并通过机构的官方应用或官方网址核实网站。",
    goBack: "返回",
    continueAnyway: "仍然继续",
    explainPage: "解释此页面",
    showSections: "显示主要部分",
    helpNavigate: "帮助我浏览此网站",
    findContact: "查找联系信息",
    searchWebsite: "搜索此网站",
    searchProduct: "搜索商品",
    applyHousingGrant: "申请住房补助",
    checkCpfBalance: "查询 CPF 余额",
    openPrefix: "打开",
    findPrefix: "查找",
    viewPrefix: "查看",
    checkPrefix: "检查",
    warningSignal: "风险指标",
    unknownSignal: "无法取得的证据",
  };

  const SECURITY_ZH_TRAD = {
    websiteRisk: "網站風險",
    securityMode: "安全模式",
    securityOn: "開啟",
    securityOff: "關閉",
    securityDisabled: "安全檢查已關閉",
    securityDisabledSummary: "自動網站安全檢查已暫停。",
    securityDisabledRecommendation: "需要評估此頁面時，請開啟安全模式。",
    assessing: "正在評估…",
    assessingSummary: "正在收集本地網頁和網址訊號。",
    riskLow: "低風險",
    riskMedium: "發現一些風險指標",
    riskHigh: "發現高風險指標",
    riskUnknown: "無法評估",
    confidence: "信心分數 {score}%",
    summaryLow: "未發現明顯的本地風險指標，但這並不保證網站安全。",
    summaryMedium: "部分指標顯示您應更仔細地檢查此網站。",
    summaryHigh: "此頁面偵測到多個高風險指標。",
    summaryUnknown: "可靠證據不足，無法有把握地評估此網站。",
    recommendationLow: "分享敏感資料前，請繼續核對網域和頁面用途。",
    recommendationMedium: "輸入敏感資料或下載檔案前，請先核實網域。",
    recommendationHigh: "請勿輸入敏感資料。請使用機構的官方應用程式或自行輸入官方網址核實。",
    recommendationUnknown: "分享敏感資料前，請謹慎並獨立核實網站。",
    readAloud: "朗讀",
    findingActions: "正在尋找適合此頁面的操作…",
    noActions: "頁面資料太少，無法建議具體操作。",
    actionWarningTitle: "繼續前請小心",
    actionWarningReason: "此操作涉及敏感資料，而目前頁面有明顯的風險指標。",
    actionWarningRecommendation: "請暫停，並透過機構的官方應用程式或官方網址核實網站。",
    goBack: "返回",
    continueAnyway: "仍然繼續",
    explainPage: "解釋此頁面",
    showSections: "顯示主要部分",
    helpNavigate: "幫助我瀏覽此網站",
    findContact: "尋找聯絡資料",
    searchWebsite: "搜尋此網站",
    searchProduct: "搜尋商品",
    applyHousingGrant: "申請住房補助",
    checkCpfBalance: "查詢 CPF 餘額",
    openPrefix: "開啟",
    findPrefix: "尋找",
    viewPrefix: "查看",
    checkPrefix: "檢查",
    warningSignal: "風險指標",
    unknownSignal: "無法取得的證據",
  };

  const SECURITY_MS = {
    websiteRisk: "Risiko laman web",
    securityMode: "Mod keselamatan",
    securityOn: "Hidup",
    securityOff: "Mati",
    securityDisabled: "Semakan keselamatan dimatikan",
    securityDisabledSummary: "Semakan keselamatan laman automatik dihentikan sementara.",
    securityDisabledRecommendation: "Hidupkan Mod Keselamatan apabila anda mahu halaman ini dinilai.",
    assessing: "Sedang menilai…",
    assessingSummary: "Mengumpul isyarat halaman dan URL secara setempat.",
    riskLow: "Risiko Rendah",
    riskMedium: "Beberapa Petunjuk Risiko",
    riskHigh: "Petunjuk Risiko Tinggi",
    riskUnknown: "Tidak Dapat Dinilai",
    confidence: "Keyakinan {score}%",
    summaryLow: "Tiada petunjuk amaran setempat yang kuat dikesan. Ini bukan jaminan bahawa laman web selamat.",
    summaryMedium: "Beberapa petunjuk menunjukkan bahawa laman web ini perlu diperiksa dengan lebih teliti.",
    summaryHigh: "Beberapa petunjuk berisiko tinggi dikesan pada halaman ini.",
    summaryUnknown: "Bukti yang boleh dipercayai tidak mencukupi untuk menilai laman web ini.",
    recommendationLow: "Semak domain dan tujuan halaman sebelum berkongsi maklumat sensitif.",
    recommendationMedium: "Sahkan domain sebelum memasukkan maklumat sensitif atau memuat turun fail.",
    recommendationHigh: "Jangan masukkan maklumat sensitif. Sahkan organisasi melalui aplikasi rasmi atau alamat yang anda taip sendiri.",
    recommendationUnknown: "Berhati-hati dan sahkan laman web secara bebas sebelum berkongsi maklumat sensitif.",
    readAloud: "Baca kuat",
    findingActions: "Mencari tindakan yang berguna untuk halaman ini…",
    noActions: "Maklumat halaman terlalu sedikit untuk mencadangkan tindakan khusus.",
    actionWarningTitle: "Berhati-hati sebelum meneruskan",
    actionWarningReason: "Tindakan ini melibatkan maklumat sensitif dan halaman semasa mempunyai petunjuk risiko yang bermakna.",
    actionWarningRecommendation: "Berhenti sebentar dan sahkan laman web melalui aplikasi atau alamat rasmi organisasi.",
    goBack: "Kembali",
    continueAnyway: "Teruskan juga",
    explainPage: "Terangkan halaman ini",
    showSections: "Tunjukkan bahagian utama",
    helpNavigate: "Bantu saya melayari laman web ini",
    findContact: "Cari maklumat hubungan",
    searchWebsite: "Cari dalam laman web ini",
    searchProduct: "Cari produk",
    applyHousingGrant: "Mohon geran perumahan",
    checkCpfBalance: "Semak baki CPF",
    openPrefix: "Buka ",
    findPrefix: "Cari ",
    viewPrefix: "Lihat ",
    checkPrefix: "Semak ",
    warningSignal: "Petunjuk amaran",
    unknownSignal: "Bukti tidak tersedia",
  };

  const SECURITY_TA = {
    websiteRisk: "இணையதள ஆபத்து",
    securityMode: "பாதுகாப்பு முறை",
    securityOn: "இயக்கு",
    securityOff: "நிறுத்து",
    securityDisabled: "பாதுகாப்புச் சோதனை நிறுத்தப்பட்டுள்ளது",
    securityDisabledSummary: "தானியங்கி இணையதள பாதுகாப்புச் சோதனைகள் இடைநிறுத்தப்பட்டுள்ளன.",
    securityDisabledRecommendation: "இந்தப் பக்கத்தை மதிப்பிட பாதுகாப்பு முறையை இயக்கவும்.",
    assessing: "மதிப்பிடுகிறது…",
    assessingSummary: "பக்க மற்றும் URL அறிகுறிகள் உள்ளூராக சேகரிக்கப்படுகின்றன.",
    riskLow: "குறைந்த ஆபத்து",
    riskMedium: "சில ஆபத்து அறிகுறிகள்",
    riskHigh: "அதிக ஆபத்து அறிகுறிகள்",
    riskUnknown: "மதிப்பிட முடியவில்லை",
    confidence: "நம்பிக்கை {score}%",
    summaryLow: "வலுவான உள்ளூர் எச்சரிக்கை அறிகுறிகள் இல்லை. இது தளம் பாதுகாப்பானது என்பதற்கான உத்தரவாதமல்ல.",
    summaryMedium: "இந்த இணையதளத்தை மேலும் கவனமாகச் சரிபார்க்க வேண்டிய சில அறிகுறிகள் உள்ளன.",
    summaryHigh: "இந்தப் பக்கத்தில் பல அதிக ஆபத்து அறிகுறிகள் கண்டறியப்பட்டன.",
    summaryUnknown: "இந்த இணையதளத்தை நம்பிக்கையுடன் மதிப்பிட போதுமான ஆதாரம் இல்லை.",
    recommendationLow: "முக்கிய தகவலைப் பகிரும் முன் domain மற்றும் பக்க நோக்கத்தைச் சரிபார்க்கவும்.",
    recommendationMedium: "முக்கிய தகவலை உள்ளிடும் அல்லது கோப்பைப் பதிவிறக்கும் முன் domain-ஐ உறுதிப்படுத்தவும்.",
    recommendationHigh: "முக்கிய தகவலை உள்ளிட வேண்டாம். அதிகாரப்பூர்வ செயலி அல்லது நீங்களே தட்டச்சு செய்த முகவரி மூலம் நிறுவனத்தை உறுதிப்படுத்தவும்.",
    recommendationUnknown: "முக்கிய தகவலைப் பகிரும் முன் எச்சரிக்கையுடன் இணையதளத்தை தனியாகச் சரிபார்க்கவும்.",
    readAloud: "உரக்கப் படி",
    findingActions: "இந்தப் பக்கத்திற்கான பயனுள்ள செயல்கள் தேடப்படுகின்றன…",
    noActions: "குறிப்பிட்ட செயலை பரிந்துரைக்க பக்கத் தகவல் போதவில்லை.",
    actionWarningTitle: "தொடர்வதற்கு முன் எச்சரிக்கை",
    actionWarningReason: "இந்தச் செயலில் முக்கிய தகவல் உள்ளது; தற்போதைய பக்கத்தில் பொருத்தமான ஆபத்து அறிகுறிகள் உள்ளன.",
    actionWarningRecommendation: "நிறுவனத்தின் அதிகாரப்பூர்வ செயலி அல்லது முகவரி மூலம் தளத்தை உறுதிப்படுத்தவும்.",
    goBack: "திரும்பிச் செல்",
    continueAnyway: "இருந்தும் தொடரவும்",
    explainPage: "இந்தப் பக்கத்தை விளக்கு",
    showSections: "முக்கிய பகுதிகளைக் காட்டு",
    helpNavigate: "இந்த இணையதளத்தில் வழிகாட்டு",
    findContact: "தொடர்பு தகவலைக் கண்டுபிடி",
    searchWebsite: "இந்த இணையதளத்தில் தேடு",
    searchProduct: "பொருளைத் தேடு",
    applyHousingGrant: "வீட்டு மானியத்திற்கு விண்ணப்பிக்கவும்",
    checkCpfBalance: "CPF இருப்பைச் சரிபார்க்கவும்",
    openPrefix: "திற: ",
    findPrefix: "கண்டுபிடி: ",
    viewPrefix: "பார்: ",
    checkPrefix: "சரிபார்: ",
    warningSignal: "எச்சரிக்கை அறிகுறி",
    unknownSignal: "கிடைக்காத ஆதாரம்",
  };

  const SECURITY_STRINGS = {
    "en": SECURITY_EN,
    "zh-CN": SECURITY_ZH_CN,
    "zh-HK": SECURITY_ZH_TRAD,
    "zh-CN-hokkien": SECURITY_ZH_TRAD,
    "ms": SECURITY_MS,
    "ta": SECURITY_TA,
  };

  function securityText(key) {
    const language = SECURITY_STRINGS[selectedLang] || SECURITY_EN;
    return language[key] || SECURITY_EN[key] || key;
  }

  function localizeSignal(item) {
    if (selectedLang === "en") return item.description;
    const prefix = item.status === "unknown"
      ? securityText("unknownSignal")
      : securityText("warningSignal");
    const evidence = item.evidence ? `: ${item.evidence}` : `: ${item.category}`;
    return `${prefix}${evidence}`;
  }

  function t(key) {
    const langObj = UI_STRINGS[selectedLang] || UI_STRINGS["en"];
    return langObj[key] || UI_STRINGS["en"][key];
  }

  function updateDialectUI() {
    document.querySelectorAll(".lang-option").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.lang === selectedLang);
    });
    
    const activeOpt = document.querySelector(`.lang-option[data-lang="${selectedLang}"]`);
    const label = activeOpt ? activeOpt.dataset.label : "English";
    
    // Update header button label
    const labelSpan = document.getElementById("currentLangLabel");
    if (labelSpan) labelSpan.textContent = activeOpt ? activeOpt.textContent : "🇬🇧 English";

    // Update global static texts
    const eyebrow = document.querySelector(".task-eyebrow");
    if (eyebrow) {
      eyebrow.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> ${t("taskEyebrow")}`;
    }
    document.querySelector(".empty-state p").textContent = t("emptyState");
    document.getElementById("goalInput").placeholder = t("inputPlaceholder");
    document.getElementById("sendBtn").textContent = t("sendBtn");

    // Reset composer hint
    composerHint.textContent = t("hintMic");
    
    // Re-apply current status text
    if (document.getElementById("statusLabel").textContent === UI_STRINGS["en"].statusReady || 
        document.getElementById("statusLabel").textContent === UI_STRINGS["zh-CN"].statusReady) {
      setStatus(t("statusReady"));
    } else if (document.getElementById("statusLabel").textContent === UI_STRINGS["en"].statusWaiting ||
               document.getElementById("statusLabel").textContent === UI_STRINGS["zh-CN"].statusWaiting) {
      setStatus(t("statusWaiting"));
    }
    updateSecurityModeUI();
    if (!securityModeEnabled) renderSecurityDisabled();
    else if (currentPageAnalysis) renderTrustAssessment(currentPageAnalysis.trustAssessment);
    if (currentSuggestions.length) renderSuggestions(currentSuggestions);
    if (currentActionAssessment) showActionWarning(currentActionAssessment);
  }

  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    langDropdown.hidden = !langDropdown.hidden;
  });

  document.querySelectorAll(".lang-option").forEach(btn => {
    btn.addEventListener("click", async () => {
      selectedLang = btn.dataset.lang;
      langDropdown.hidden = true;
      updateDialectUI();
      persistState();
      try { await chrome.storage.local.set({ dialectPreference: selectedLang }); } catch {}
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!langDropdownWrap.contains(e.target)) langDropdown.hidden = true;
  });

  // ---- Change Task button ----------------------------------------------------
  changeTaskBtn.addEventListener("click", async () => {
    resolveAllSteps();
    currentGoal = "";
    stepCount = 0;
    lastResponse = null;
    stepHistory = [];
    setTaskBanner(false, "—");
    await clearPageHighlight();
    window.speechSynthesis?.cancel();
    pushEntry({ kind: "note", text: "Task cancelled. What would you like to do next?" });
    setStatus("Ready to help");
    persistState();
  });

  // ---- Auto-press toggle -----------------------------------------------------
  autoPressToggle.addEventListener("change", async () => {
    autoPress = autoPressToggle.checked;
    autoPressLabel.textContent = autoPress ? "Auto ✓" : "Auto";
    persistState();
    try { await chrome.storage.local.set({ autoPressPreference: autoPress }); } catch {}
  });

  async function applySecurityMode(enabled, refreshCurrentPage) {
    securityModeEnabled = Boolean(enabled);
    updateSecurityModeUI();
    clearTimeout(featureRefreshTimer);
    featureRequestGeneration += 1;

    if (securityModeEnabled) {
      renderTrustAssessment(null);
    } else {
      currentPageAnalysis = null;
      hideActionWarning();
      renderSecurityDisabled();
      renderSuggestions(ORIGINAL_SUGGESTIONS);
    }

    try {
      await sendToContentScript({
        action: "setSecurityMode",
        enabled: securityModeEnabled,
      });
    } catch (error) {
      console.info("[GovAssist] Security preference will apply when a supported page is active:", error.message);
    }

    if (securityModeEnabled && refreshCurrentPage) {
      await refreshPageFeatures("security-enabled");
    }
  }

  securityModeToggle.addEventListener("change", async () => {
    const enabled = securityModeToggle.checked;
    await applySecurityMode(enabled, enabled);
    try {
      await chrome.storage.local.set({ securityModePreference: enabled });
    } catch (error) {
      console.error("[GovAssist] couldn't persist Security Mode preference:", error);
    }
  });

  // ---- Theme (light/dark), auto-detected from system + manual override ----
  const prefersDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    themeIconSun.hidden = mode === "dark";
    themeIconMoon.hidden = mode !== "dark";
    themeBtn.title = mode === "dark" ? "Switch to light mode" : "Switch to dark mode";
  }

  async function initTheme() {
    let stored;
    try {
      stored = (await chrome.storage.local.get("themePreference")).themePreference;
    } catch {
      stored = null;
    }
    const mode = stored || (prefersDarkQuery.matches ? "dark" : "light");
    applyTheme(mode);
  }

  prefersDarkQuery.addEventListener("change", async (e) => {
    const { themePreference } = await chrome.storage.local.get("themePreference");
    if (!themePreference) applyTheme(e.matches ? "dark" : "light");
  });

  if (chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.themePreference) {
        applyTheme(changes.themePreference.newValue);
      }
    });
  }

  themeBtn.addEventListener("click", async () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      await chrome.storage.local.set({ themePreference: next });
    } catch (error) {
      console.error("[GovAssist] couldn't persist theme preference:", error);
    }
  });

  // ---- Boot ---------------------------------------------------------------
  async function boot() {
    initTheme();

    // Restore dialect preference
    try {
      const { dialectPreference } = await chrome.storage.local.get("dialectPreference");
      if (dialectPreference) selectedLang = dialectPreference;
    } catch {}

    // Security Mode defaults to on for existing users and persists across restarts.
    try {
      const { securityModePreference } = await chrome.storage.local.get("securityModePreference");
      securityModeEnabled = securityModePreference !== false;
    } catch {
      securityModeEnabled = true;
    }
    updateDialectUI();

    // Restore auto-press preference
    try {
      const { autoPressPreference } = await chrome.storage.local.get("autoPressPreference");
      if (autoPressPreference != null) autoPress = autoPressPreference;
    } catch {}
    autoPressToggle.checked = autoPress;
    autoPressLabel.textContent = autoPress ? "Auto ✓" : "Auto";

    const saved = await loadPersistedState();
    if (saved && Array.isArray(saved.chatLog) && saved.chatLog.length > 0) {
      chatLog = saved.chatLog;
      currentGoal = saved.currentGoal || "";
      stepCount = saved.stepCount || 0;
      currentStatus = saved.status || "Ready to help";
      currentTaskBanner = saved.taskBanner || { visible: false, name: "—" };
      if (saved.selectedLang) selectedLang = saved.selectedLang;
      if (saved.autoPress != null) autoPress = saved.autoPress;

      chatLog.forEach(renderEntry);
      scrollToBottom();
      statusLabel.textContent = currentStatus;
      taskName.textContent = currentTaskBanner.name;
      taskBanner.hidden = !currentTaskBanner.visible;
      autoPressToggle.checked = autoPress;
      autoPressLabel.textContent = autoPress ? "Auto ✓" : "Auto";
      updateDialectUI();
    }
    if (securityModeEnabled) {
      await refreshPageFeatures("boot");
    } else {
      renderSecurityDisabled();
      renderSuggestions(ORIGINAL_SUGGESTIONS);
    }
  }

  boot();
})();
