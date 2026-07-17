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

  // ---- DOM references ------------------------------------------------------
  const chatThread = document.getElementById("chatThread");
  const emptyState = document.getElementById("emptyState");
  const taskBanner = document.getElementById("taskBanner");
  const taskName = document.getElementById("taskName");
  const composerForm = document.getElementById("composerForm");
  const goalInput = document.getElementById("goalInput");
  const sendBtn = document.getElementById("sendBtn");
  const micBtn = document.getElementById("micBtn");
  const langBtn = document.getElementById("langBtn");
  const attachBtn = document.getElementById("attachBtn");
  const themeBtn = document.getElementById("themeBtn");
  const themeIconSun = document.getElementById("themeIconSun");
  const themeIconMoon = document.getElementById("themeIconMoon");
  const composerHint = document.getElementById("composerHint");
  const statusLabel = document.getElementById("statusLabel");

  // ---- Conversation state ---------------------------------------------------
  let currentGoal = "";
  let stepCount = 0;
  let lastResponse = null; // the previous NavigationResponse, sent as context to the next step
  let stepHistory = []; // full ordered list of every step taken this session
  let chatLog = []; // [{kind:'user', text}] | [{kind:'note', text}] | [{kind:'step', step, resolved}]
  let currentStatus = "Ready to help";
  let currentTaskBanner = { visible: false, name: "—" };

  // ==========================================================================
  // Backend + Content Script Communication
  // ==========================================================================

  /**
   * Send a message to the content script in the active tab.
   */
  async function sendToContentScript(message) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error("No active tab found");
    return chrome.tabs.sendMessage(tab.id, message);
  }

  /**
   * Scan the active tab's DOM for interactive elements.
   */
  async function scanPageDOM() {
    try {
      const response = await sendToContentScript({ action: "scanDOM" });
      if (response && response.success) {
        return { elements: response.elements, url: response.url, context: response.context || "page" };
      }
    } catch (err) {
      console.error("[GovAssist] DOM scan failed:", err);
    }
    return { elements: [], url: "", context: "page" };
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

  /**
   * Call the real backend: scan DOM → POST to API → highlight result.
   * Returns a normalized step object for the UI.
   */
  async function callBackend(goal, previousAction, history) {
    // Step 1: Scan the DOM (modal-aware)
    const { elements, url, context } = await scanPageDOM();

    if (elements.length === 0) {
      return {
        action_type: "fail",
        element_id: null,
        explanation: "I can't read this page yet. Please make sure you're on a website and try again.",
        type_value: null,
      };
    }

    // Step 2: POST to the backend with full context + step history
    const body = {
      goal: goal,
      current_url: url,
      elements: elements,
      page_context: context,
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
        },
      });
    } catch (error) {
      console.error("[GovAssist] couldn't persist chat state:", error);
    }
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
      <div class="assistant-label"><span class="assistant-avatar">AI</span> Assistant</div>
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
    let actionLabel = "Click the element";
    if (step.action_type === "type") {
      actionIcon = "⌨️";
      actionLabel = "Type in the field";
    } else if (step.action_type === "done") {
      actionIcon = "✅";
      actionLabel = "Task complete";
    } else if (step.action_type === "fail") {
      actionIcon = "⚠️";
      actionLabel = "Couldn't proceed";
    }

    // Build the step card
    wrap.innerHTML = `
      <div class="assistant-label"><span class="assistant-avatar">AI</span> Assistant</div>
      <div class="step-card ${resolved || isDone ? "is-done" : ""} ${isFail ? "is-fail" : ""}">
        <div class="step-number">${isFail ? "!" : stepNum}</div>
        <div class="step-body">
          <div class="step-title">${actionIcon} ${escapeHtml(actionLabel)}</div>
          <div class="step-detail">${escapeHtml(step.explanation)}</div>
          ${step.element_id ? `<div class="step-target">Target: <code>${escapeHtml(step.element_id)}</code></div>` : ""}
          ${step.type_value ? `<div class="step-target">Value: <code>${escapeHtml(step.type_value)}</code></div>` : ""}
          <div class="step-progress">Step ${stepNum}</div>
          <div class="step-actions">
            ${
              resolved || isDone
                ? ""
                : isFail
                ? `<button type="button" class="pill-btn primary" data-action="confirm">
                     Retry
                   </button>`
                : `<button type="button" class="pill-btn primary" data-action="confirm">
                     I did this — next step
                   </button>`
            }
            <button type="button" class="pill-btn" data-action="read-aloud">🔊 Read aloud</button>
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
          resolved: true,
        });
        setStatus("Ready to help");
        stepCount--;
        return;
      }

      // Normal action step — store response so next cycle knows what happened
      lastResponse = response;
      // Push to full history so AI never repeats a used element
      stepHistory.push({ element_id: response.element_id, action_type: response.action_type, explanation: response.explanation });
      pushEntry({
        kind: "step",
        step: { ...response, step_number: stepCount },
        resolved: false,
      });
      setStatus("Waiting on you");
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

  function startNewGoal(goalText) {
    currentGoal = goalText;
    stepCount = 0;
    lastResponse = null; // reset context for a fresh goal
    stepHistory = []; // reset full history for a fresh goal
    if (!currentTaskBanner.visible) {
      setTaskBanner(true, goalText);
    }
    pushEntry({ kind: "user", text: goalText });
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

  document.querySelectorAll(".suggestion-chip").forEach((chip) => {
    chip.addEventListener("click", () => startNewGoal(chip.dataset.goal));
  });

  // ---- Read aloud (Web Speech API — works fully client-side) --------------
  function readAloud(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  // ---- Mic input (Web Speech API, progressive enhancement) ---------------
  const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognizer = null;
  let isListening = false;

  if (SpeechRecognitionImpl) {
    recognizer = new SpeechRecognitionImpl();
    recognizer.continuous = false;
    recognizer.interimResults = false;
    recognizer.lang = "en-US";

    recognizer.addEventListener("result", (event) => {
      const transcript = event.results[0][0].transcript;
      goalInput.value = transcript;
    });
    recognizer.addEventListener("end", () => {
      isListening = false;
      micBtn.classList.remove("is-listening");
      micBtn.setAttribute("aria-pressed", "false");
      composerHint.textContent = "Tap the blue mic button to speak naturally";
    });
    recognizer.addEventListener("error", () => {
      isListening = false;
      micBtn.classList.remove("is-listening");
      micBtn.setAttribute("aria-pressed", "false");
      composerHint.textContent = "Didn't catch that — try typing instead, or tap the mic to retry.";
    });
  } else {
    micBtn.title = "Voice input isn't supported in this browser yet";
  }

  micBtn.addEventListener("click", () => {
    if (!recognizer) {
      composerHint.textContent = "Voice input isn't supported in this browser yet — please type instead.";
      return;
    }
    if (isListening) {
      recognizer.stop();
      return;
    }
    isListening = true;
    micBtn.classList.add("is-listening");
    micBtn.setAttribute("aria-pressed", "true");
    composerHint.textContent = "Listening… speak now";
    recognizer.start();
  });

  // ---- Attach button (placeholder only) --
  attachBtn.addEventListener("click", () => {
    composerHint.textContent = "Attachments are a placeholder — not wired up yet";
    setTimeout(() => {
      composerHint.textContent = "Tap the blue mic button to speak naturally";
    }, 1800);
  });

  // ---- Language toggle (placeholder — cycles a label only) ----------------
  const LANGS = ["EN", "中文", "Melayu", "தமிழ்"];
  let langIndex = 0;
  langBtn.addEventListener("click", () => {
    langIndex = (langIndex + 1) % LANGS.length;
    langBtn.title = `Language: ${LANGS[langIndex]} (placeholder — real translation not wired up yet)`;
    composerHint.textContent = `Language set to ${LANGS[langIndex]} (placeholder)`;
    setTimeout(() => {
      composerHint.textContent = "Tap the blue mic button to speak naturally";
    }, 1800);
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
    const saved = await loadPersistedState();
    if (saved && Array.isArray(saved.chatLog) && saved.chatLog.length > 0) {
      chatLog = saved.chatLog;
      currentGoal = saved.currentGoal || "";
      stepCount = saved.stepCount || 0;
      currentStatus = saved.status || "Ready to help";
      currentTaskBanner = saved.taskBanner || { visible: false, name: "—" };

      chatLog.forEach(renderEntry);
      scrollToBottom();
      statusLabel.textContent = currentStatus;
      taskName.textContent = currentTaskBanner.name;
      taskBanner.hidden = !currentTaskBanner.visible;
    }
  }

  boot();
})();
