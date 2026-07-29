# GovAssist browser extension

This directory contains the active Chromium Manifest V3 extension. The side
panel uses the content script for bounded page analysis and the FastAPI backend
for user-initiated navigation. The original HDB and CPF shortcuts are local, and
the website risk assessment does not require the backend.

## Features

- Side-panel chatbot, step cards, highlighting, and opt-in auto-press.
- Original “Apply for housing grant” and “Check CPF balance” quick suggestions.
- Compact expandable website-risk indicator with separate risk and confidence.
- Persistent Security Mode toggle for pausing automatic checks and page-load API requests.
- Advisory sensitive-action warnings that never read field values.
- Debounced route/DOM observation and fingerprint-based suggestion caching.
- Read-aloud, voice input, English, Mandarin, Cantonese, Hokkien, Malay, and Tamil.
- Session-persisted chat state plus light/dark themes.

Chrome and Edge are supported through the `chrome.sidePanel` API.

## Local setup

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable Developer mode.
3. Choose **Load unpacked** and select this directory.
4. Start the FastAPI backend in `../Backend` when AI navigation/refinement is needed.
5. Click the GovAssist toolbar icon to open the side panel.
6. Reload the extension and target web page after extension code changes.

The trust score and deterministic fallback suggestions do not require the
backend. Domain age, certificate-chain inspection, and authoritative reputation
remain unavailable unless a reliable service is configured in the future.

Security Mode is on by default. Turning it off pauses automatic page analysis
and sensitive-action warnings. Page loads do not POST suggestions to the API;
AI navigation and voice contact the backend only when the user explicitly
starts those actions.

## Navigation response

The backend returns a Pydantic-validated navigation step. `sidepanel.js`
performs a second runtime validation before rendering it.

```json
{
  "element_id": "visible-element-id",
  "action_type": "click",
  "type_value": null,
  "explanation": "Open the visible course information link."
}
```

Sensitive fields can be identified by metadata, but field values are never
collected. The backend and content script both prevent automatic typing into
sensitive fields.

## File map

- `manifest.json` — MV3 configuration, side panel, content scripts, and worker.
- `background.js` — opens the docked panel on toolbar-icon click.
- `content.js` — compact DOM/page extraction, highlighting, navigation observation, and action detection.
- `sidepanel.html/css/js` — chatbot, suggestions, trust UI, warnings, language, and voice.
- `lib/page-analysis.js` — sanitisation, page/field classification, URL signals, and fingerprints.
- `lib/suggestions.js` — local generation, AI validation, target resolution, and cache.
- `lib/trust.js` — deterministic trust signals, risk, confidence, and explanations.
- `lib/action-risk.js` — sensitive-action detection and separate action-risk scoring.
- `mock-data.js` — unused historical prototype retained for reference.

See `../SECURITY_AND_CONTEXT.md` for the scoring model, privacy boundaries,
verification commands, and current limitations.
