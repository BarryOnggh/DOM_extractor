/**
 * GovAssist — background service worker (Chrome/Edge only).
 * BUILD: v1
 */
console.log("[GovAssist] background.js BUILD v1 loaded");

// Opens the docked panel automatically when the toolbar icon is clicked.
// This is the gesture-safe way to do it — Chrome handles the click-to-open internally.
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("[GovAssist] setPanelBehavior failed:", error));
