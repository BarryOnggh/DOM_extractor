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

  // ---- Conversation state ---------------------------------------------------
  let currentGoal = "";
  let stepCount = 0;
  let lastResponse = null; // the previous NavigationResponse, sent as context to the next step
  let stepHistory = []; // full ordered list of every step taken this session
  let chatLog = []; // [{kind:'user', text}] | [{kind:'note', text}] | [{kind:'step', step, resolved}]
  let currentStatus = "Ready to help";
  let currentTaskBanner = { visible: false, name: "—" };
  let autoPress = false;
  let selectedLang = "en"; // dialect code for TTS

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
        return { elements: response.elements, url: response.url, context: response.context || "page" };
      }
    } catch (err) {
      console.error("[GovAssist] DOM scan failed:", err);
      if (err.message === "EXTENSION_RELOADED") {
        return { elements: [], url: "", context: "EXTENSION_RELOADED" };
      }
      if (err.message === "INVALID_URL") {
        return { elements: [], url: "", context: "INVALID_URL" };
      }
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
      let explanation = "I can't read this page yet. Please make sure you're on a website and try again.";
      if (context === "EXTENSION_RELOADED") {
        explanation = "The extension was just updated. Please **refresh the webpage** (F5) so I can reconnect to it.";
      } else if (context === "INVALID_URL") {
        explanation = "I cannot read Chrome settings pages. Please navigate to a normal website (like the HDB portal) and try again.";
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
          autoPress,
          selectedLang,
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
    let actionLabel = t("actionClick");
    if (step.action_type === "type") {
      actionIcon = "⌨️";
      actionLabel = t("actionType");
    } else if (step.action_type === "done") {
      actionIcon = "✅";
      actionLabel = t("actionComplete");
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
          ${step.element_id ? `<div class="step-target">Target: <code>${escapeHtml(step.element_id)}</code></div>` : ""}
          ${step.type_value ? `<div class="step-target">Value: <code>${escapeHtml(step.type_value)}</code></div>` : ""}
          <div class="step-progress">${t("stepLabel")} ${stepNum}</div>
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
        // Auto-press mode: show the step as done, auto-execute, then continue
        pushEntry({
          kind: "step",
          step: { ...response, step_number: stepCount },
          resolved: true,
        });
        setStatus("Auto-pressing…");

        // Execute the action on the page
        try {
          await sendToContentScript({
            action: "autoClick",
            element_id: response.element_id,
            action_type: response.action_type,
            type_value: response.type_value,
          });
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
  }

  boot();
})();
