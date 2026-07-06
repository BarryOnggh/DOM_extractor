# GovAssist — Extension UI Shell

This is the sidebar UI shell only. It runs entirely against mocked data — no
dependency on the backend, the DOM-scan content script, or a real mock
government page.

Chrome/Edge only (both Chromium, both use the `chrome.sidePanel` API).

## What's in scope here
- Popup/sidebar layout: header, current-task banner, chat thread, step
  cards, composer with text input + mic
- A tiny mock "backend" (`mock-data.js`) that returns two canned flows
  (housing grant, CPF balance check) one step at a time
- Read-aloud (Web Speech API `speechSynthesis`) and voice input
  (`SpeechRecognition`) — both work fully client-side, no backend needed
- Step-through loop: user confirms a step → next step appears, matching the
  "one step at a time" mechanism in the project brief; task banner resets
  back to idle once a flow is marked complete
- The conversation (chat log, current step, task banner) is mirrored to
  session storage on every change and rehydrated on load, so re-opening the
  panel picks up where you left off instead of starting blank
- Light/dark theme: follows the system setting by default, with a manual
  toggle (sun/moon icon) that overrides it and persists across sessions
- Attach button and language button are both explicit, labeled placeholders
  (hover or tap for a tooltip/hint) — no fake functionality behind them

## How to test it
1. Open `chrome://extensions` (or `edge://extensions`)
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**, select this folder
4. Click the GovAssist icon in the toolbar — the side panel opens
5. **After any code update, click the reload icon on this extensions page**
   — Chrome caches the old version otherwise

## The JSON contract

This is the shape the mock currently returns, and the only thing that
needs to change when the real backend is wired in — see `callBackend()`
in `sidepanel.js`.

```jsonc
{
  "task_name": "Applying for Housing Grant",
  "step_index": 1,           // 1-based
  "total_steps": 3,          // null if unknown until the flow finishes
  "target": {
    "data_ai_id": "start-application-btn",  // must match the injected DOM attribute
    "label": "Start Application button"
  },
  "action_type": "click",    // "click" | "input" | "select" | "read"
  "instruction": "Click the \"Start Application\" button",
  "explanation": "I've highlighted it on the screen for you.",
  "done": false
}
```

If the real response shape ends up different (field names, nesting, etc.),
only `callBackend()` needs to change — everything else reads from the
already-normalized `step` object.

## File map
- `manifest.json` — MV3 config, side panel + background worker
- `background.js` — opens the docked panel on toolbar icon click
- `sidepanel.html/css/js` — the UI shell itself
- `mock-data.js` — canned flows + mock `fetchNextStep()`
