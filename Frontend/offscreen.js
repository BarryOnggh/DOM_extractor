let activeRecognizer = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startVoiceOffscreen") {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) {
      chrome.runtime.sendMessage({ type: "VOICE_RESULT", error: "not-supported" });
      sendResponse({ success: false });
      return false;
    }
    try {
      if (activeRecognizer) activeRecognizer.stop();
      const recognizer = new Speech();
      activeRecognizer = recognizer;
      recognizer.lang = "en-US";
      recognizer.continuous = false;
      recognizer.interimResults = false;
      
      let hasSentResult = false;
      recognizer.onresult = (e) => {
        hasSentResult = true;
        chrome.runtime.sendMessage({ type: "VOICE_RESULT", text: e.results[0][0].transcript });
      };
      recognizer.onerror = (e) => {
        hasSentResult = true;
        chrome.runtime.sendMessage({ type: "VOICE_RESULT", error: e.error });
      };
      recognizer.onend = () => {
        if (!hasSentResult) {
          chrome.runtime.sendMessage({ type: "VOICE_RESULT", error: "no-speech" });
        }
      };
      recognizer.start();
      sendResponse({ success: true });
    } catch (e) {
      chrome.runtime.sendMessage({ type: "VOICE_RESULT", error: e.message });
      sendResponse({ success: false });
    }
    return false;
  }

  if (message.action === "stopVoiceOffscreen") {
    if (activeRecognizer) activeRecognizer.stop();
    sendResponse({ success: true });
    return false;
  }
});
