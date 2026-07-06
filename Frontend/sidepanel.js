/**
 * GovAssist — Extension UI Shell
 *
 * This file drives the sidebar UI against the MOCK backend in mock-data.js.
 * Everything below `callBackend()` is UI plumbing that won't need to change
 * when the real backend is wired in — only `callBackend()` itself gets
 * swapped from `fetchNextStep()` to a real `fetch()` call, as long as the
 * response shape matches the contract documented in mock-data.js.
 *
 * STATE PERSISTENCE: the conversation is mirrored to session storage (via
 * the sessionGet/sessionSet helpers below) as `chatState` on every change.
 * This is what lets the docked panel and the popped-out "full window" show
 * the exact same conversation — they are two separate page loads of this
 * same file, with no other link between them, so without this the full
 * window would always start blank.
 */

(function () {
  "use strict";

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
  // `conversation` = what the mock/real backend needs (flow + next step index).
  // `chatLog` = every rendered entry, in order, so we can rebuild the thread
  // exactly when a different window/panel loads this same page.
  let conversation = { flowId: null, stepIndex: 0 };
  let chatLog = []; // [{kind:'user', text}] | [{kind:'note', text}] | [{kind:'step', step, resolved}]
  let currentStatus = "Ready to help";
  let currentTaskBanner = { visible: false, name: "—" };

  // ==========================================================================
  // Backend boundary — swap this function's body once the real backend is
  // ready, keep its shape.
  // ==========================================================================
  async function callBackend(goal) {
    return fetchNextStep(goal, conversation);
    // --- Real backend version will look roughly like: -----------------------
    // const res = await fetch("https://api.govassist.example/next-step", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ goal, history: conversation, dom_elements: scannedElements }),
    // });
    // return res.json();
    // -------------------------------------------------------------------------
  }

  // ---- Storage helpers -------------------------------------------------
  // storage.session is standard in modern Chrome/Edge; fall back to
  // storage.local just in case of an older browser version.
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
        chatState: { chatLog, conversation, status: currentStatus, taskBanner: currentTaskBanner }
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

    const progress =
      step.total_steps != null
        ? `Step ${step.step_index} of ${step.total_steps}`
        : `Step ${step.step_index}`;

    wrap.innerHTML = `
      <div class="assistant-label"><span class="assistant-avatar">AI</span> Assistant</div>
      <div class="step-card ${resolved ? "is-done" : ""}" data-step-index="${step.step_index}">
        <div class="step-number">${step.step_index}</div>
        <div class="step-body">
          <div class="step-title">${escapeHtml(step.instruction)}</div>
          <div class="step-detail">${escapeHtml(step.explanation)}</div>
          <div class="step-progress">${progress}</div>
          <div class="step-actions">
            ${
              resolved
                ? ""
                : `<button type="button" class="pill-btn primary" data-action="confirm">
                     ${step.done ? "Mark complete" : "I did this — next step"}
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
      readAloud(`${step.instruction}. ${step.explanation}`);
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
        if (entry.step.done) {
          pushEntry({ kind: "note", text: "Nicely done — that completes this task! 🎉" });
          setStatus("Ready to help");
          setTaskBanner(false, "—");
          conversation = { flowId: null, stepIndex: 0 };
          persistState();
        } else {
          requestNextStep();
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
  async function requestNextStep(goalForFirstCall) {
    setStatus("Thinking…");
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

    const step = await callBackend(goalForFirstCall || "");

    document.getElementById("typingIndicator")?.remove();
    sendBtn.disabled = false;

    if (!step) {
      pushEntry({
        kind: "note",
        text: "I couldn't find a matching task for that yet. Try \u201cApply for housing grant\u201d or \u201cCheck CPF balance.\u201d"
      });
      setStatus("Ready to help");
      return;
    }

    conversation.flowId = step.flowId;
    conversation.stepIndex = step.step_index; // next step to request
    persistState();

    if (step.step_index === 1) setTaskBanner(true, step.task_name);
    pushEntry({ kind: "step", step, resolved: false });
    setStatus(step.done ? "Ready to help" : "Waiting on you");
  }

  function startNewGoal(goalText) {
    conversation = { flowId: null, stepIndex: 0 };
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

  // ---- Attach button (placeholder only, same pattern as language toggle) --
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
      conversation = saved.conversation || { flowId: null, stepIndex: 0 };
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
