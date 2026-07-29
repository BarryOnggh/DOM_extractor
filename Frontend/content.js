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
  console.log("[GovAssist Content Script] Injected and active on:", window.location.href);

  const PageAnalysis = globalThis.GovAssistPageAnalysis;
  const TrustAnalyst = globalThis.GovAssistTrust;
  const ActionRiskAnalyst = globalThis.GovAssistActionRisk;
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
      return getAssociatedLabel(el) || el.getAttribute("aria-label") || el.getAttribute("name") || "";
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

  function getAssociatedLabel(el) {
    if (!el) return "";
    const aria = el.getAttribute("aria-label");
    if (aria) return aria.trim();
    if (el.labels && el.labels.length) {
      const text = Array.from(el.labels).map((label) => label.innerText || label.textContent).join(" ");
      if (text.trim()) return text.trim();
    }
    if (el.id) {
      try {
        const explicit = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
        if (explicit) return (explicit.innerText || explicit.textContent || "").trim();
      } catch {
        /* Ignore invalid or unsupported CSS escaping. */
      }
    }
    const parentLabel = el.closest("label");
    if (parentLabel) return (parentLabel.innerText || parentLabel.textContent || "").trim();
    return el.placeholder || el.name || "";
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

  const BLOCKED_TEXT_PATTERNS = [
    "see more", "next advisory", "previous advisory",
    "next slide", "previous slide", "carousel", "back to top",
    "›", "‹", "1 of 5", "2 of 5", "3 of 5", "1 of 3", "2 of 3"
  ];

  function isBlockedElement(el) {
    // 1. Aggressive fuzzy-match for banner/advisory ancestors
    let curr = el;
    while (curr && curr !== document.body && curr !== document.documentElement) {
      const cls = (typeof curr.className === 'string') ? curr.className.toLowerCase() : '';
      const id = (curr.id || '').toLowerCase();
      
      // If any parent container looks like an advisory, banner, or masthead, block EVERYTHING inside it.
      if (
        cls.includes('advisory') || cls.includes('banner') || cls.includes('masthead') || cls.includes('alert') || cls.includes('notice') || cls.includes('notification') ||
        id.includes('advisory') || id.includes('banner') || id.includes('masthead') || id.includes('alert') || id.includes('notice') || id.includes('notification')
      ) {
        return true;
      }
      curr = curr.parentElement;
    }

    // 2. Exact text pattern blocks
    const t = (el.innerText || el.getAttribute("aria-label") || el.getAttribute("title") || "").toLowerCase().trim();
    if (BLOCKED_TEXT_PATTERNS.some(p => t === p || t.includes(p))) return true;

    // 3. Carousel arrow buttons
    if (el.closest(".swiper, .swiper-container, .carousel")) {
      if (el.tagName === "BUTTON" && (!el.innerText || el.innerText.trim().length < 3)) return true;
    }
    
    // 4. Site footers
    if (el.closest("footer, [role='contentinfo'], .site-footer")) return true;

    return false;
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
      if (isBlockedElement(el)) return;

      // Skip current-page indicators
      if (
        el.getAttribute("aria-current") === "page" ||
        el.getAttribute("aria-selected") === "true" ||
        (el.classList.contains("active") && el.tagName === "A")
      ) return;
      if (el.tagName === "A" && el.href === window.location.href) return;

      // Skip inline text links embedded inside paragraphs
      if (el.tagName === "A") {
        const parentP = el.closest("p, li");
        if (parentP && parentP.textContent.trim().length > el.textContent.trim().length + 20) return;
      }

      const text = getElementText(el);
      const ariaLabel = el.getAttribute("aria-label") || "";
      const title = el.getAttribute("title") || "";
      const displayText = text || ariaLabel || title;
      if (!displayText) return;
      const safeDisplayText = PageAnalysis.redactSensitiveText(displayText, 120);

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
      const primary = isPrimaryAction(safeDisplayText);
      const exactPrimary = isExactPrimary(safeDisplayText);
      const lowPri = isLowPriority(safeDisplayText);

      // Priority: lower = shown first to AI
      let priority = 5;
      const isNavMenu = el.closest(".primary-nav, .primary-inner, #primary-links, nav[aria-label='Main navigation']");

      if (lowPri) priority = 7;
      else if (close) priority = 6;
      else if (exactPrimary) priority = -1;
      else if (primary && isBtn) priority = 0;
      else if (primary && isLink) priority = 1;
      else if (isNavMenu && isLink) priority = 2;
      else if (isBtn) priority = 4;

      const safeSection = PageAnalysis.redactSensitiveText(section, 120);
      const labeledText = safeSection
        ? `[${safeSection}] [${kind}] ${safeDisplayText}`
        : `[${kind}] ${safeDisplayText}`;

      const entry = { id, tag: el.tagName.toLowerCase(), text: labeledText, _priority: priority };
      if (el.type) entry.type = el.type;
      if (el.placeholder) entry.placeholder = PageAnalysis.redactSensitiveText(el.placeholder, 120);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT") {
        const sensitiveKind = PageAnalysis.classifySensitiveField({
          type: el.type,
          label: getAssociatedLabel(el),
          name: el.name,
          placeholder: el.placeholder,
          ariaLabel: el.getAttribute("aria-label"),
          autocomplete: el.autocomplete,
        });
        if (sensitiveKind !== "none") entry.sensitive_kind = sensitiveKind;
      }

      elements.push(entry);
    });

    // Singpass QR code injection
    const isSingpassLogin = elements.some(e => e.text.toLowerCase().includes("use password"));
    if (isSingpassLogin) {
      elements.push({
        id: "singpass-qr-synthetic",
        tag: "img",
        text: "[QR SCANNER] Scan with Singpass app",
        _priority: -2
      });
      selectorCache["singpass-qr-synthetic"] = { path: "body", text: "QR Code", tag: "img" };
    }

    elements.sort((a, b) => a._priority - b._priority);
    elements.forEach(e => delete e._priority);

    const trimmed = elements.slice(0, 40);
    console.log(`[GovAssist] Scanned ${trimmed.length} elements (context: ${context})`);
    console.table(trimmed.map(e => ({ id: e.id, text: e.text.substring(0, 80) })));
    return { elements: trimmed, context };

  }

  // =====================================================================
  // 3. COMPACT PAGE CONTEXT + LOCAL TRUST ANALYSIS
  // =====================================================================

  function visibleText(el) {
    if (!el || !isVisible(el) || isInert(el)) return "";
    return PageAnalysis.compactText(el.innerText || el.textContent || "", 220);
  }

  function targetSummary(el, targetType) {
    const text = PageAnalysis.redactSensitiveText(getElementText(el), 120);
    if (!text) return null;
    return {
      id: ensureId(el),
      text,
      targetType,
    };
  }

  function collectTargets(selector, targetType, limit) {
    const results = [];
    const seen = new Set();
    for (const el of document.querySelectorAll(selector)) {
      if (!isVisible(el) || isInert(el) || el.disabled || isBlockedElement(el)) continue;
      const item = targetSummary(el, targetType);
      const key = item && item.text.toLocaleLowerCase();
      if (!item || seen.has(key)) continue;
      seen.add(key);
      results.push(item);
      if (results.length >= limit) break;
    }
    return results;
  }

  function collectForms() {
    const roots = Array.from(document.querySelectorAll("form, [role='search']")).slice(0, 8);
    const standaloneInputs = Array.from(document.querySelectorAll(
      "input:not([type='hidden']), select, textarea"
    )).filter((field) => !field.closest("form, [role='search']")).slice(0, 12);
    if (standaloneInputs.length) {
      roots.push({ querySelectorAll: () => standaloneInputs, getAttribute: () => null });
    }

    return roots.map((form) => {
      const fields = [];
      const labels = [];
      for (const field of Array.from(form.querySelectorAll("input:not([type='hidden']), select, textarea")).slice(0, 12)) {
        if (!isVisible(field)) continue;
        const label = PageAnalysis.compactText(getAssociatedLabel(field), 100);
        const classification = PageAnalysis.classifySensitiveField({
          type: field.type,
          label,
          name: field.name,
          placeholder: field.placeholder,
          ariaLabel: field.getAttribute("aria-label"),
          autocomplete: field.autocomplete,
        });
        const dataKind = PageAnalysis.classifyFieldPurpose({
          type: field.type,
          label,
          name: field.name,
          placeholder: field.placeholder,
          ariaLabel: field.getAttribute("aria-label"),
          autocomplete: field.autocomplete,
        });
        if (label) labels.push(label);
        fields.push({
          type: field.type || field.tagName.toLowerCase(),
          label,
          classification,
          dataKind,
          disabled: Boolean(field.disabled),
        });
      }
      const role = form.getAttribute && form.getAttribute("role");
      const type = role === "search" || fields.some((field) => field.type === "search") ? "search" : "form";
      return { type, labels: PageAnalysis.uniqueText(labels, 8, 100), fields };
    }).filter((form) => form.fields.length);
  }

  function extractPageContext(skipInteractiveScan) {
    if (!skipInteractiveScan) scanDOM();
    const description = document.querySelector(
      'meta[name="description"], meta[property="og:description"]'
    );
    const headings = Array.from(document.querySelectorAll("h1,h2,h3"))
      .map(visibleText).filter(Boolean).slice(0, 12);
    const navigation = collectTargets(
      "nav a[href], nav button, [role='navigation'] a[href], [role='navigation'] button",
      "navigation",
      20
    );
    const buttons = collectTargets(
      "button, [role='button'], input[type='button'], input[type='submit']",
      "button",
      20
    );
    const links = collectTargets("main a[href], article a[href], a[href]", "link", 30);
    const breadcrumbs = Array.from(document.querySelectorAll(
      "[aria-label*='breadcrumb' i] a, .breadcrumb a, .breadcrumbs a"
    )).map(visibleText).filter(Boolean).slice(0, 10);
    const ariaLabels = Array.from(document.querySelectorAll("[aria-label]"))
      .filter(isVisible)
      .map((el) => el.getAttribute("aria-label"))
      .filter(Boolean).slice(0, 20);
    const main = document.querySelector("main, [role='main'], article") || document.body;
    const importantText = Array.from(main.querySelectorAll("p, li"))
      .filter((el) => !el.closest("nav, footer, [role='contentinfo']"))
      .map(visibleText)
      .filter((text) => text.length >= 30)
      .slice(0, 12);
    const raw = {
      url: window.location.href,
      hostname: window.location.hostname,
      title: document.title,
      description: description ? description.getAttribute("content") : "",
      headings,
      navigation,
      buttons,
      links,
      forms: collectForms(),
      breadcrumbs,
      ariaLabels,
      visibleText: importantText,
    };
    raw.pageCategory = PageAnalysis.classifyPage(raw);
    return PageAnalysis.sanitizePageContext(raw);
  }

  function editDistance(a, b) {
    const left = String(a || "");
    const right = String(b || "");
    const row = Array.from({ length: right.length + 1 }, (_, index) => index);
    for (let i = 1; i <= left.length; i += 1) {
      let previous = row[0];
      row[0] = i;
      for (let j = 1; j <= right.length; j += 1) {
        const current = row[j];
        row[j] = Math.min(
          row[j] + 1,
          row[j - 1] + 1,
          previous + (left[i - 1] === right[j - 1] ? 0 : 1)
        );
        previous = current;
      }
    }
    return row[right.length];
  }

  function detectBrandSimilarity(pageContext) {
    const brands = [
      { name: "PayPal", token: "paypal", domains: ["paypal.com"] },
      { name: "HDB", token: "hdb", domains: ["hdb.gov.sg"] },
      { name: "CPF", token: "cpf", domains: ["cpf.gov.sg"] },
      { name: "Singpass", token: "singpass", domains: ["singpass.gov.sg"] },
      { name: "DBS", token: "dbs", domains: ["dbs.com", "dbs.com.sg"] },
      { name: "OCBC", token: "ocbc", domains: ["ocbc.com"] },
      { name: "UOB", token: "uob", domains: ["uob.com.sg"] },
    ];
    const identityText = `${pageContext.title} ${pageContext.headings.slice(0, 3).join(" ")}`.toLowerCase();
    const hostname = pageContext.hostname.toLowerCase();
    const hostToken = (hostname.split(".").slice(-2, -1)[0] || hostname)
      .replace(/[01]/g, (value) => value === "0" ? "o" : "l")
      .replace(/[^a-z]/g, "");
    for (const brand of brands) {
      if (!new RegExp(`\\b${brand.token}\\b`, "i").test(identityText)) continue;
      const isOfficialDomain = brand.domains.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
      );
      const distance = editDistance(hostToken, brand.token);
      const similarityScore = hostToken
        ? Math.max(0, 1 - distance / Math.max(hostToken.length, brand.token.length))
        : 0;
      const titleStartsWithBrand = pageContext.title.toLowerCase().startsWith(brand.token);
      const containsBrandToken = hostToken.includes(brand.token);
      return {
        suspectedBrand: brand.name,
        similarityScore: containsBrandToken ? Math.max(0.92, similarityScore) : similarityScore,
        isOfficialDomain,
        contextStrength: titleStartsWithBrand ? 0.9 : 0.68,
      };
    }
    return null;
  }

  function collectTrustEvidence(pageContext) {
    const visible = [
      pageContext.title,
      pageContext.description,
      ...pageContext.headings,
      ...pageContext.visibleText,
      ...pageContext.buttons.map((item) => item.text),
    ].join(" ").toLowerCase();
    const sensitiveFields = pageContext.forms.flatMap((form) => form.fields);
    const mixedContentCount = window.location.protocol === "https:"
      ? document.querySelectorAll(
          'script[src^="http:"], img[src^="http:"], iframe[src^="http:"], link[href^="http:"], form[action^="http:"]'
        ).length
      : 0;
    const navigationEntry = performance.getEntriesByType
      ? performance.getEntriesByType("navigation")[0]
      : null;
    const popupCount = Array.from(document.querySelectorAll(
      "[role='dialog'], [role='alertdialog'], dialog[open], .popup, .modal, [class*='popup']"
    )).filter(isVisible).length;
    const permissionsRequested = [
      ["notifications", /\b(?:allow|enable|turn on|grant).{0,25}notifications?\b/i],
      ["camera", /\b(?:allow|enable|grant).{0,25}camera\b/i],
      ["microphone", /\b(?:allow|enable|grant).{0,25}microphone\b/i],
      ["location", /\b(?:allow|enable|share|grant).{0,25}location\b/i],
    ].filter(([, pattern]) => pattern.test(visible)).map(([name]) => name);

    return {
      pageContext,
      urlSignals: PageAnalysis.extractUrlSignals(window.location.href),
      mixedContentCount,
      redirectCount: navigationEntry ? navigationEntry.redirectCount : 0,
      sensitiveFields,
      popupCount,
      permissionsRequested,
      urgencyLanguage: /\b(urgent|immediately|act now|expires? (?:today|soon|in)|limited time|last chance|within \d+ minutes?)\b/i.test(visible),
      urgencyEvidence: (visible.match(/.{0,35}\b(?:urgent|immediately|act now|expires? soon|limited time)\b.{0,35}/i) || [])[0],
      infectionClaim: /\b(device|computer|phone).{0,30}\b(infected|virus|compromised)\b/i.test(visible),
      remoteAccessRequest: /\b(anydesk|teamviewer|remote access|remote desktop)\b/i.test(visible),
      softwareInstallRequest: /\b(download and install|install (?:this |the )?(?:software|package|security update))\b/i.test(visible),
      unexpectedDownload: /\b(download and install|immediate.{0,20}download|security update.{0,20}download)\b/i.test(visible),
      requestsCrypto: /\b(?:send|pay|transfer).{0,35}\b(?:bitcoin|crypto(?:currency)?|usdt|ethereum|wallet)\b/i.test(visible),
      governmentBranding: pageContext.pageCategory === "government",
      brandSimilarity: detectBrandSimilarity(pageContext),
      domainAgeDays: null,
      knownMaliciousMatch: null,
    };
  }

  let lastAnalysis = null;
  let lastAnalysisFingerprint = "";
  let securityModeEnabled = true;
  let securityPreferenceReady = false;

  function analysePage(options) {
    const pageContext = extractPageContext(Boolean(options && options.skipInteractiveScan));
    const evidence = collectTrustEvidence(pageContext);
    const trustAssessment = TrustAnalyst.assessTrust(evidence);
    const fingerprint = PageAnalysis.createPageFingerprint(pageContext);
    lastAnalysis = {
      pageContext,
      trustAssessment,
      cacheKey: PageAnalysis.createCacheKey(pageContext),
      fingerprint,
      analysedAt: new Date().toISOString(),
    };
    lastAnalysisFingerprint = fingerprint;
    return lastAnalysis;
  }

  function ensureAnalysis() {
    const currentUrl = PageAnalysis.sanitizeUrl(window.location.href);
    if (!lastAnalysis || lastAnalysis.pageContext.url !== currentUrl) return analysePage();
    return lastAnalysis;
  }

  function actionMetadataForElement(el) {
    if (!el) return null;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) {
      const label = getAssociatedLabel(el);
      return {
        type: el.type,
        label,
        name: el.name,
        placeholder: el.placeholder,
        ariaLabel: el.getAttribute("aria-label"),
        autocomplete: el.autocomplete,
        disabled: el.disabled,
      };
    }
    return {
      text: getElementText(el),
      label: el.getAttribute("aria-label"),
      href: el.href || "",
    };
  }

  function evaluateElementAction(el) {
    if (!securityModeEnabled) return null;
    const analysis = ensureAnalysis();
    const direct = ActionRiskAnalyst.detectSensitiveAction(actionMetadataForElement(el));
    const form = el && el.closest ? el.closest("form") : null;
    const formActions = form
      ? Array.from(form.querySelectorAll("input:not([type='hidden']), textarea, select"))
          .filter((field) => !field.disabled)
          .map((field) => ActionRiskAnalyst.detectSensitiveAction(actionMetadataForElement(field)))
          .filter(Boolean)
      : [];
    const actions = direct ? [direct, ...formActions] : formActions;
    if (!actions.length) return null;
    const requestedInformation = Array.from(new Set(actions.flatMap((action) => action.requestedInformation)));
    const primary = actions.sort((a, b) => (
      ActionRiskAnalyst.evaluateActionRisk({
        websiteRisk: analysis.trustAssessment,
        action: a.action,
        requestedInformation: a.requestedInformation,
        classification: a.classification,
        context: analysis.pageContext,
      }).riskScore -
      ActionRiskAnalyst.evaluateActionRisk({
        websiteRisk: analysis.trustAssessment,
        action: b.action,
        requestedInformation: b.requestedInformation,
        classification: b.classification,
        context: analysis.pageContext,
      }).riskScore
    )).pop();
    return ActionRiskAnalyst.evaluateActionRisk({
      websiteRisk: analysis.trustAssessment,
      action: primary.action,
      requestedInformation,
      classification: primary.classification,
      context: {
        pageCategory: analysis.pageContext.pageCategory,
        pagePurpose: PageAnalysis.classifyPagePurpose(analysis.pageContext).purpose,
        brandConflict: analysis.trustAssessment.contributingSignals.some((item) => item.id === "brand-lookalike"),
      },
    });
  }

  const warnedActions = new Map();

  function notifySensitiveAction(el, eventType) {
    if (!securityModeEnabled) return;
    const assessment = evaluateElementAction(el);
    if (!assessment || !assessment.shouldWarn) return;
    const metadata = actionMetadataForElement(el) || {};
    const key = `${eventType}:${PageAnalysis.compactText(metadata.label || metadata.text || metadata.name, 80)}`;
    const lastWarned = warnedActions.get(key) || 0;
    if (Date.now() - lastWarned < 30000) return;
    warnedActions.set(key, Date.now());
    chrome.runtime.sendMessage({
      type: "SENSITIVE_ACTION_WARNING",
      assessment,
      pageUrl: PageAnalysis.sanitizeUrl(window.location.href),
    }).catch(() => {});
  }

  document.addEventListener("focusin", (event) => {
    if (event.target && event.target.matches && event.target.matches("input, textarea, select")) {
      notifySensitiveAction(event.target, "focus");
    }
  }, true);

  document.addEventListener("click", (event) => {
    const target = event.target && event.target.closest
      ? event.target.closest("button, a[href], input[type='submit'], input[type='button']")
      : null;
    if (target) notifySensitiveAction(target, "click");
  }, true);

  // =====================================================================
  // 4. ELEMENT RESOLVER  (used at highlight time)
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
  // 5. HIGHLIGHTER
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

  function drawOverlay(el, actionType, typeValue) {
    const PAD = 5;
    const container = getOpenModal() || document.body;

    const overlay = document.createElement("div");
    overlay.className = HIGHLIGHT_CLASS;
    container.appendChild(overlay);

    const tooltip = document.createElement("div");
    tooltip.className = TOOLTIP_CLASS;
    tooltip.textContent =
      actionType === "type"  ? (typeValue ? `⌨️ Type: "${typeValue}"` : "⌨️ Type here") :
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
    drawOverlay(el, actionType, typeValue);

    // For type actions, focus and pre-fill
    const sensitiveAction = ActionRiskAnalyst.detectSensitiveAction(actionMetadataForElement(el));
    if (actionType === "type" && typeValue && !sensitiveAction) {
      el.focus();
      el.value = typeValue;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    } else if (actionType === "type") {
      el.focus();
    }

    return true;
  }

  // =====================================================================
  // 6. MESSAGE LISTENER
  // =====================================================================

  let activeRecognizer = null;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "setSecurityMode") {
      applySecurityMode(message.enabled, "sidepanel-toggle", false);
      sendResponse({ success: true, enabled: securityModeEnabled });
      return false;
    }

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
      const analysis = securityModeEnabled
        ? analysePage({ skipInteractiveScan: true })
        : null;
      sendResponse({
        success: true,
        elements,
        context,
        url: PageAnalysis.sanitizeUrl(window.location.href),
        analysis,
      });
      return false;
    }

    if (message.action === "analysePage") {
      if (!securityModeEnabled) {
        sendResponse({ success: true, disabled: true, analysis: null });
      } else {
        sendResponse({ success: true, analysis: analysePage() });
      }
      return false;
    }

    if (message.action === "evaluateAction") {
      scanDOM();
      const el = resolveElement(message.element_id);
      sendResponse({
        success: Boolean(el),
        assessment: securityModeEnabled && el ? evaluateElementAction(el) : null,
      });
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
        const actionAssessment = securityModeEnabled ? evaluateElementAction(el) : null;
        if (actionAssessment && actionAssessment.shouldWarn) {
          chrome.runtime.sendMessage({
            type: "SENSITIVE_ACTION_WARNING",
            assessment: actionAssessment,
            pageUrl: PageAnalysis.sanitizeUrl(window.location.href),
          }).catch(() => {});
          sendResponse({
            success: false,
            requiresUserAction: true,
            assessment: actionAssessment,
            reason: "Sensitive action requires user control.",
          });
          return false;
        }
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

  // Debounced invalidation covers hash/history routes, tab-side URL updates,
  // and meaningful SPA DOM changes without repeatedly scanning the full page.
  let analysisTimer = null;
  let observedUrl = window.location.href;

  function applySecurityMode(enabled, reason, scheduleWhenEnabled) {
    const nextEnabled = Boolean(enabled);
    const changed = !securityPreferenceReady || nextEnabled !== securityModeEnabled;
    securityModeEnabled = nextEnabled;
    securityPreferenceReady = true;
    if (!changed) return;
    clearTimeout(analysisTimer);
    if (!securityModeEnabled) {
      lastAnalysis = null;
      lastAnalysisFingerprint = "";
      return;
    }
    if (scheduleWhenEnabled !== false) {
      scheduleAnalysis(reason || "security-enabled", 50);
    }
  }

  function scheduleAnalysis(reason, delay) {
    clearTimeout(analysisTimer);
    if (!securityPreferenceReady || !securityModeEnabled) return;
    analysisTimer = setTimeout(() => {
      if (!securityModeEnabled) return;
      const previousFingerprint = lastAnalysisFingerprint;
      const previousUrl = lastAnalysis && lastAnalysis.pageContext.url;
      const analysis = analysePage();
      if (analysis.fingerprint !== previousFingerprint || analysis.pageContext.url !== previousUrl) {
        chrome.runtime.sendMessage({
          type: "PAGE_ANALYSIS_INVALIDATED",
          reason,
          url: analysis.pageContext.url,
          cacheKey: analysis.cacheKey,
        }).catch(() => {});
      }
    }, delay || 850);
  }

  window.addEventListener("hashchange", () => scheduleAnalysis("route", 150));
  window.addEventListener("popstate", () => scheduleAnalysis("route", 150));
  const urlPoll = window.setInterval(() => {
    if (window.location.href !== observedUrl) {
      observedUrl = window.location.href;
      scheduleAnalysis("url", 150);
    }
  }, 1000);

  const pageObserver = new MutationObserver((mutations) => {
    const meaningful = mutations.some((mutation) => {
      if (mutation.type === "characterData") return Boolean(mutation.target.parentElement);
      return Array.from(mutation.addedNodes).some((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return Boolean(node.textContent && node.textContent.trim());
        return !node.matches(`.${HIGHLIGHT_CLASS}, .${TOOLTIP_CLASS}, #govassist-highlight-styles`);
      }) || Array.from(mutation.removedNodes).some((node) => node.nodeType === Node.ELEMENT_NODE);
    });
    if (meaningful) scheduleAnalysis("dom", 900);
  });
  pageObserver.observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  window.addEventListener("pagehide", () => {
    clearInterval(urlPoll);
    clearTimeout(analysisTimer);
    pageObserver.disconnect();
  }, { once: true });

  if (chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.securityModePreference) {
        applySecurityMode(changes.securityModePreference.newValue !== false, "security-preference");
      }
    });
  }

  chrome.storage.local.get("securityModePreference")
    .then(({ securityModePreference }) => {
      applySecurityMode(securityModePreference !== false, "initial");
    })
    .catch(() => {
      applySecurityMode(true, "initial");
    });

  console.log("[GovAssist] Content script v3 loaded on", window.location.href);
})();
