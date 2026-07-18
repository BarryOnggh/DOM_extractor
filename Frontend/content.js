/**
 * GovAssist — Content Script (v3)
 *
 * Key improvements over v2:
 *  - Computes a unique CSS selector path per element at scan time and caches it
 *  - Highlight resolves elements via the cached path first (survives SPA re-renders)
 *  - Includes parent section heading in element context so LLM can distinguish
 *    e.g. "Apply for HFE (e-services card)" vs "HFE application (article card)"
 *  - Highlight re-scans the DOM to refresh cache before drawing the overlay
 *  - Fixed-position overlay with proper scroll-settle wait
 */

(function () {
  "use strict";

  const GA_ID_ATTR = "data-ga-id";
  const HIGHLIGHT_CLASS = "govassist-highlight-overlay";
  const TOOLTIP_CLASS  = "govassist-tooltip";

  // Persistent across calls — never reset
  let idCounter = 0;

  // Cache: ga-id → { selectorPath, elementText, tag }
  // Survives between scanDOM and highlight calls even if DOM re-renders
  const selectorCache = {};

  // =====================================================================
  // 1. SELECTOR PATH
  // =====================================================================

  /**
   * Build a unique CSS selector path for an element that works even after
   * a SPA re-render (uses tag + nth-of-type chain, avoids generated classes).
   */
  function computeSelectorPath(el) {
    const parts = [];
    let node = el;
    while (node && node !== document.body) {
      let part = node.tagName.toLowerCase();
      if (node.id && /^[a-zA-Z][\w-]*$/.test(node.id)) {
        // Stable real id — this anchors the selector
        parts.unshift(`#${node.id}`);
        return parts.join(" > ");
      }
      const siblings = node.parentElement
        ? Array.from(node.parentElement.children).filter(c => c.tagName === node.tagName)
        : [];
      if (siblings.length > 1) {
        const idx = siblings.indexOf(node) + 1;
        part += `:nth-of-type(${idx})`;
      }
      parts.unshift(part);
      node = node.parentElement;
    }
    return parts.join(" > ");
  }

  /**
   * Find the nearest ancestor's text heading to give element context.
   * e.g. "Recommended e-Services", "Recommended topics"
   */
  function getSectionContext(el) {
    let node = el.parentElement;
    for (let i = 0; i < 8 && node && node !== document.body; i++) {
      const heading = node.querySelector("h1,h2,h3,h4");
      if (heading) {
        const t = heading.innerText.trim();
        if (t) return t;
      }
      node = node.parentElement;
    }
    return "";
  }

  // =====================================================================
  // 2. DOM SCANNER
  // =====================================================================

  const INTERACTIVE_SELECTOR = [
    "a[href]",
    "button",
    "input:not([type='hidden'])",
    "select",
    "textarea",
    "[role='button']",
    "[role='link']",
    "[role='tab']",
    "[role='menuitem']",
    "[role='option']",
  ].join(", ");

  function isVisible(el) {
    if (el.offsetWidth === 0 && el.offsetHeight === 0) return false;
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (parseFloat(style.opacity) === 0) return false;
    return true;
  }

  function isInert(el) {
    let node = el;
    while (node && node !== document.body) {
      if (node.hasAttribute("inert")) return true;
      if (node.getAttribute("aria-hidden") === "true") return true;
      node = node.parentElement;
    }
    return false;
  }

  function getOpenModal() {
    const dialogs = Array.from(document.querySelectorAll("dialog[open]")).filter(isVisible);
    if (dialogs.length) return dialogs[dialogs.length - 1];
    const roleModals = Array.from(
      document.querySelectorAll("[role='dialog'][aria-modal='true'],[role='alertdialog']")
    ).filter(isVisible);
    if (roleModals.length) return roleModals[roleModals.length - 1];
    const ariaModals = Array.from(document.querySelectorAll("[aria-modal='true']")).filter(isVisible);
    if (ariaModals.length) return ariaModals[ariaModals.length - 1];
    return null;
  }

  function getElementText(el) {
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      return el.placeholder || el.getAttribute("aria-label") || el.getAttribute("name") || "";
    }
    if (el.tagName === "SELECT") {
      const sel = el.options[el.selectedIndex];
      return sel ? sel.text : el.getAttribute("aria-label") || "";
    }

    // For buttons/links: try innerText first
    let text = (el.innerText || el.textContent || "").trim().replace(/\s+/g, " ").substring(0, 120);
    if (text) return text;

    // Fallback 1: aria-label on the element itself
    if (el.getAttribute("aria-label")) return el.getAttribute("aria-label").trim();

    // Fallback 2: img[alt] inside the element (e.g. Singpass button with logo image)
    const img = el.querySelector("img[alt]");
    if (img && img.alt.trim()) return img.alt.trim();

    // Fallback 3: title attribute
    if (el.getAttribute("title")) return el.getAttribute("title").trim();

    // Fallback 4: SVG title element inside (for icon-only buttons)
    const svgTitle = el.querySelector("title");
    if (svgTitle && svgTitle.textContent.trim()) return svgTitle.textContent.trim();

    return "";
  }

  function ensureId(el) {
    // Use real stable id if available
    if (el.id && /^[a-zA-Z][\w-]*$/.test(el.id)) return el.id;
    if (el.getAttribute(GA_ID_ATTR)) return el.getAttribute(GA_ID_ATTR);
    idCounter++;
    const gaId = `ga-${el.tagName.toLowerCase()}-${idCounter}`;
    el.setAttribute(GA_ID_ATTR, gaId);
    return gaId;
  }

  function isCloseButton(el) {
    const label = (el.getAttribute("aria-label") || "").toLowerCase();
    const text = (el.innerText || el.textContent || "").trim().toLowerCase();
    const closes = ["close", "dismiss", "×", "x"];
    if (closes.some(c => label === c || text === c)) return true;
    if (el.getAttribute("data-close-dialog") !== null) return true;
    if (el.classList.contains("dialog-close")) return true;
    return false;
  }

  // Keywords that indicate a high-priority action
  const HIGH_PRIORITY_KEYWORDS = [
    "login", "log in", "sign in", "singpass", "myhdb", "residents",
    "apply", "submit", "continue", "proceed", "next step", "confirm", "register",
    "qr", "scan", "app", "mobile app", "hfe"
  ];

  // Exact phrases that are THE primary action on their page — always shown first
  const EXACT_PRIMARY_PHRASES = [
    "log in with singpass",
    "login with singpass",
    "sign in with singpass",
    "scan qr code",
    "scan with singpass app",
    "log in",
    "sign in",
  ];

  // Keywords that indicate a low-priority / last-resort action
  const LOW_PRIORITY_KEYWORDS = [
    "password", "forgot password", "reset password"
  ];

  function isPrimaryAction(text) {
    const t = text.toLowerCase();
    return HIGH_PRIORITY_KEYWORDS.some(k => t.includes(k));
  }

  function isExactPrimary(text) {
    const t = text.toLowerCase().trim();
    return EXACT_PRIMARY_PHRASES.some(p => t === p || t.startsWith(p));
  }

  function isLowPriority(text) {
    const t = text.toLowerCase();
    return LOW_PRIORITY_KEYWORDS.some(k => t.includes(k));
  }

  function getElementKind(el, isClose) {
    if (isClose) return "CLOSE BUTTON";
    const tag = el.tagName;
    if (tag === "BUTTON" || el.getAttribute("role") === "button") return "BUTTON";
    if (tag === "A") return "LINK";
    if (tag === "INPUT") return `INPUT[${el.type || "text"}]`;
    if (tag === "SELECT") return "SELECT";
    if (tag === "TEXTAREA") return "TEXTAREA";
    return "BUTTON";
  }

  function scanDOM() {
    const modal = getOpenModal();
    const root = modal || document;
    const context = modal ? "modal" : "page";
    const elements = [];
    const seen = new Set();

    root.querySelectorAll(INTERACTIVE_SELECTOR).forEach((el) => {
      if (!isVisible(el)) return;
      if (el.disabled) return;
      if (isInert(el)) return;

      // Skip links/buttons inside footer — they are never the right next step
      if (el.closest("footer, [role='contentinfo'], .site-footer")) return;

      // Skip elements that are the CURRENT active tab or page (clicking them does nothing)
      if (el.getAttribute("aria-current") === "page" || el.getAttribute("aria-selected") === "true") return;

      // Skip carousel/banner navigation arrows
      if (el.closest(".swiper, .swiper-container, .carousel")) {
        // If it's a structural arrow inside a carousel, skip it
        if (el.tagName === "BUTTON" && (!el.innerText || el.innerText.length < 3)) return;
      }
      const lowerTextForSkip = (el.innerText || el.getAttribute("aria-label") || el.getAttribute("title") || "").toLowerCase();
      if (lowerTextForSkip.includes("next slide") || lowerTextForSkip.includes("previous slide") || lowerTextForSkip.includes("carousel")) return;

      // Skip inline text links — <a> tags embedded inside a sentence/paragraph
      // (e.g. "reset it on the Singpass website ↗"). These are never actionable steps.
      if (el.tagName === "A") {
        const parentP = el.closest("p, li");
        if (parentP && parentP.textContent.trim().length > el.textContent.trim().length + 20) return;
      }

      const text = getElementText(el);
      const ariaLabel = el.getAttribute("aria-label") || "";
      const title = el.getAttribute("title") || "";
      const displayText = text || ariaLabel || title;
      if (!displayText) return;

      const id = ensureId(el);
      if (seen.has(id)) return;
      seen.add(id);

      const path = computeSelectorPath(el);
      const section = getSectionContext(el);
      selectorCache[id] = { path, text: displayText, tag: el.tagName.toLowerCase() };

      const close = isCloseButton(el);
      const kind = getElementKind(el, close);
      const isBtn = kind === "BUTTON";
      const isLink = kind === "LINK";
      const primary = isPrimaryAction(displayText);
      const exactPrimary = isExactPrimary(displayText);
      const lowPri = isLowPriority(displayText);

      // Sort priority:
      // -1: exact match ("Log in with Singpass", "Scan QR code")
      //  0: primary action button
      //  1: primary action link
      //  2: other button
      //  3: other link
      //  4: misc
      //  5: close button
      //  6: password/low-priority (always last)
      let priority = 4;
      if (lowPri) priority = 6;
      else if (close) priority = 5;
      else if (exactPrimary) priority = -1;
      else if (primary && isBtn) priority = 0;
      else if (primary && isLink) priority = 1;
      else if (isBtn) priority = 2;
      else if (isLink) priority = 3;

      const labeledText = section
        ? `[${section}] [${kind}] ${displayText}`
        : `[${kind}] ${displayText}`;

      const entry = { id, tag: el.tagName.toLowerCase(), text: labeledText, _priority: priority };
      if (el.type) entry.type = el.type;
      if (el.placeholder) entry.placeholder = el.placeholder;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT") {
        entry.value = el.value;
      }

      elements.push(entry);
    });

    // If this looks like the Singpass login page, inject a synthetic QR code element.
    // The real QR code is an unclickable canvas/img, so the scanner misses it.
    // This guarantees the AI sees the QR code option and can instruct the user to scan it.
    const isSingpassLogin = elements.some(e => e.text.toLowerCase().includes("use password"));
    if (isSingpassLogin) {
      elements.push({
        id: "singpass-qr-synthetic",
        tag: "img",
        text: "[QR SCANNER] Scan with Singpass app",
        _priority: -2 // Absolute highest priority
      });
      // Cache a dummy selector so highlight resolution doesn't crash
      selectorCache["singpass-qr-synthetic"] = { path: "body", text: "QR Code", tag: "img" };
    }

    // Sort so AI sees the most relevant elements at the top
    elements.sort((a, b) => a._priority - b._priority);
    elements.forEach(e => delete e._priority);

    const trimmed = elements.slice(0, 40);
    console.log(`[GovAssist] Scanned ${trimmed.length} elements (context: ${context})`);
    console.table(trimmed.map(e => ({ id: e.id, text: e.text.substring(0, 80) })));
    return { elements: trimmed, context };
  }

  // =====================================================================
  // 3. ELEMENT RESOLVER  (used at highlight time)
  // =====================================================================

  /**
   * Find a live DOM element using multiple strategies, most reliable first.
   */
  function resolveElement(elementId) {
    // Strategy 1: cached CSS selector path (survives SPA re-renders)
    const cached = selectorCache[elementId];
    if (cached) {
      try {
        const el = document.querySelector(cached.path);
        if (el && isVisible(el)) {
          console.log(`[GovAssist] Resolved "${elementId}" via cached path: ${cached.path}`);
          return el;
        }
      } catch (e) { /* invalid selector — fall through */ }
    }

    // Strategy 2: real DOM id
    const byId = document.getElementById(elementId);
    if (byId && isVisible(byId)) {
      console.log(`[GovAssist] Resolved "${elementId}" via getElementById`);
      return byId;
    }

    // Strategy 3: data-ga-id attribute
    const byAttr = document.querySelector(`[${GA_ID_ATTR}="${elementId}"]`);
    if (byAttr && isVisible(byAttr)) {
      console.log(`[GovAssist] Resolved "${elementId}" via data-ga-id`);
      return byAttr;
    }

    // Strategy 4: text-content fuzzy match using cached text
    if (cached && cached.text) {
      const needle = cached.text.replace(/^\[.*?\]\s*/, "").toLowerCase().trim();
      const candidates = document.querySelectorAll(INTERACTIVE_SELECTOR);
      for (const el of candidates) {
        const t = getElementText(el).toLowerCase().trim();
        if (t && (t === needle || t.includes(needle) || needle.includes(t)) && isVisible(el)) {
          console.log(`[GovAssist] Resolved "${elementId}" via text fuzzy match: "${t}"`);
          return el;
        }
      }
    }

    console.warn(`[GovAssist] Could not resolve element "${elementId}"`);
    return null;
  }

  // =====================================================================
  // 4. HIGHLIGHTER
  // =====================================================================

  function injectStyles() {
    if (document.getElementById("govassist-highlight-styles")) return;
    const style = document.createElement("style");
    style.id = "govassist-highlight-styles";
    style.textContent = `
      @keyframes govassist-pulse {
        0%   { box-shadow: 0 0 0 0 rgba(47,111,237,0.65); }
        70%  { box-shadow: 0 0 0 18px rgba(47,111,237,0); }
        100% { box-shadow: 0 0 0 0 rgba(47,111,237,0); }
      }
      @keyframes govassist-bounce {
        0%,100% { transform: translateX(-50%) translateY(0); }
        50%     { transform: translateX(-50%) translateY(-5px); }
      }
      .${HIGHLIGHT_CLASS} {
        position: fixed;
        border: 3px solid #2F6FED;
        border-radius: 8px;
        pointer-events: none;
        z-index: 2147483646;
        animation: govassist-pulse 1.6s infinite;
        background: rgba(47,111,237,0.07);
        box-sizing: border-box;
        transition: top 0.15s, left 0.15s, width 0.15s, height 0.15s;
      }
      .${TOOLTIP_CLASS} {
        position: fixed;
        z-index: 2147483647;
        background: #2F6FED;
        color: #fff;
        font-family: -apple-system,"Segoe UI",Roboto,sans-serif;
        font-size: 14px;
        font-weight: 700;
        padding: 6px 14px;
        border-radius: 10px;
        white-space: nowrap;
        pointer-events: none;
        box-shadow: 0 4px 20px rgba(47,111,237,0.4);
        animation: govassist-bounce 1.2s ease-in-out infinite;
        transform: translateX(-50%);
      }
      .${TOOLTIP_CLASS}::after {
        content: '';
        position: absolute;
        bottom: -7px;
        left: 50%;
        transform: translateX(-50%);
        border: 8px solid transparent;
        border-top-color: #2F6FED;
        border-bottom: none;
      }
    `;
    document.head.appendChild(style);
  }

  function clearHighlight() {
    document.querySelectorAll(`.${HIGHLIGHT_CLASS},.${TOOLTIP_CLASS}`).forEach(e => e.remove());
  }

  function drawOverlay(el, actionType) {
    const PAD = 5;
    const container = getOpenModal() || document.body;

    const overlay = document.createElement("div");
    overlay.className = HIGHLIGHT_CLASS;
    container.appendChild(overlay);

    const tooltip = document.createElement("div");
    tooltip.className = TOOLTIP_CLASS;
    tooltip.textContent =
      actionType === "type"  ? "⌨️ Type here"  :
      actionType === "click" ? "👆 Click here"  : "👀 Look here";
    container.appendChild(tooltip);

    // Continuous update loop to stick to the element during scroll
    function updatePosition() {
      // If the overlay was removed by clearHighlight, stop the loop
      if (!overlay.isConnected) return;

      const rect = el.getBoundingClientRect();
      
      // Hide if element is out of bounds or invisible
      if (rect.width === 0 || rect.height === 0 || rect.bottom < 0 || rect.top > window.innerHeight) {
        overlay.style.display = 'none';
        tooltip.style.display = 'none';
      } else {
        overlay.style.display = 'block';
        tooltip.style.display = 'block';
        
        overlay.style.top    = (rect.top  - PAD) + "px";
        overlay.style.left   = (rect.left - PAD) + "px";
        overlay.style.width  = (rect.width  + PAD * 2) + "px";
        overlay.style.height = (rect.height + PAD * 2) + "px";

        const tipTop = Math.max(rect.top - PAD - 44, 8);
        const tipLeft = rect.left + rect.width / 2;
        tooltip.style.top  = tipTop + "px";
        tooltip.style.left = tipLeft + "px";
      }
      
      requestAnimationFrame(updatePosition);
    }
    
    updatePosition();
  }

  async function highlightElement(elementId, actionType, typeValue) {
    clearHighlight();
    injectStyles();

    // Refresh the selector cache with a fresh scan before resolving
    scanDOM();

    const el = resolveElement(elementId);
    if (!el) return false;

    // Scroll into view, then wait for animation to settle
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    await new Promise(r => setTimeout(r, 600));

    // If element moved off screen during scroll, re-check
    drawOverlay(el, actionType);

    // For type actions, focus and pre-fill
    if (actionType === "type" && typeValue) {
      el.focus();
      el.value = typeValue;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }

    return true;
  }

  // =====================================================================
  // 5. MESSAGE LISTENER
  // =====================================================================

  let activeRecognizer = null;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startVoice") {
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

    if (message.action === "stopVoice") {
      if (activeRecognizer) activeRecognizer.stop();
      sendResponse({ success: true });
      return false;
    }

    if (message.action === "scanDOM") {
      const { elements, context } = scanDOM();
      sendResponse({ success: true, elements, context, url: window.location.href });
      return false;
    }

    if (message.action === "highlight") {
      highlightElement(message.element_id, message.action_type, message.type_value)
        .then(ok => sendResponse({ success: ok }));
      return true; // async response
    }

    if (message.action === "autoClick") {
      // Auto-press mode: resolve the element and click/type it programmatically
      scanDOM(); // refresh cache
      const el = resolveElement(message.element_id);
      if (!el) {
        sendResponse({ success: false, reason: "Element not found" });
        return false;
      }
      try {
        if (message.action_type === "type" && message.type_value) {
          el.focus();
          el.value = message.type_value;
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.click();
        }
        sendResponse({ success: true });
      } catch (err) {
        console.error("[GovAssist] autoClick error:", err);
        sendResponse({ success: false, reason: err.message });
      }
      return false;
    }

    if (message.action === "clearHighlight") {
      clearHighlight();
      sendResponse({ success: true });
      return false;
    }
  });

  console.log("[GovAssist] Content script v3 loaded on", window.location.href);
})();
