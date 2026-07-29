(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GovAssistPageAnalysis = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SENSITIVE_PATTERNS = {
    password: /\b(password|passcode|passwd|pin)\b/i,
    otp: /\b(otp|one[- ]?time (?:password|passcode|code)|verification code|security code|tac)\b/i,
    payment: /\b(credit card|debit card|card number|cvv|cvc|expiry|billing)\b/i,
    banking: /\b(bank account|account number|routing number|iban|swift|internet banking)\b/i,
    government_id: /\b(nric|fin\b|passport|government id|identity card|national id|mykad)\b/i,
    document_upload: /\b(upload|attachment|supporting document|document)\b/i,
    crypto: /\b(bitcoin|cryptocurrency|crypto|wallet address|usdt|ethereum)\b/i,
  };

  const SENSITIVE_FIELD_KINDS = new Set([
    "password", "otp", "payment", "banking", "government_id", "document_upload", "email",
  ]);

  const IDENTITY_TYPOS = [
    { pattern: /\bgovernement\b/gi, found: "governement", expected: "government" },
    { pattern: /\bgoverment\b/gi, found: "goverment", expected: "government" },
    { pattern: /\bgovernemnt\b/gi, found: "governemnt", expected: "government" },
    { pattern: /\boffical\b/gi, found: "offical", expected: "official" },
    { pattern: /\boficial\b/gi, found: "oficial", expected: "official" },
    { pattern: /\bminstry\b/gi, found: "minstry", expected: "ministry" },
    { pattern: /\bminstery\b/gi, found: "minstery", expected: "ministry" },
    { pattern: /\bvaucher\b/gi, found: "vaucher", expected: "voucher" },
    { pattern: /\bredemtion\b/gi, found: "redemtion", expected: "redemption" },
    { pattern: /\bredeemption\b/gi, found: "redeemption", expected: "redemption" },
    { pattern: /\beligiblity\b/gi, found: "eligiblity", expected: "eligibility" },
    { pattern: /\bcongradulations\b/gi, found: "congradulations", expected: "congratulations" },
    { pattern: /\brecieve\b/gi, found: "recieve", expected: "receive" },
    { pattern: /\bimmediatly\b/gi, found: "immediatly", expected: "immediately" },
  ];

  function compactText(value, maxLength) {
    const limit = Number.isFinite(maxLength) ? maxLength : 180;
    return String(value || "")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function redactSensitiveText(value, maxLength) {
    const text = compactText(value, maxLength || 220);
    return text
      .replace(/\b[A-Z]\d{7}[A-Z]\b/gi, "[identifier]")
      .replace(/\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/gi, "[email]")
      .replace(/\beyJ[a-z0-9_-]{10,}\.[a-z0-9_-]{10,}(?:\.[a-z0-9_-]{5,})?\b/gi, "[token]")
      .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi, "[identifier]")
      .replace(/\b(?:\d[ -]?){8,19}\b/g, "[number]")
      .replace(
        /\b(password|passcode|otp|cvv|cvc|card number|account number)\s*(?:is|=|:)\s*[^\s,;]+/gi,
        "$1 [redacted]"
      );
  }

  function uniqueText(items, limit, maxLength, redact) {
    const seen = new Set();
    const result = [];
    for (const item of items || []) {
      const raw = typeof item === "string" ? item : item && (item.text || item.label || item.name);
      const text = redact === false
        ? compactText(raw, maxLength || 120)
        : redactSensitiveText(raw, maxLength || 120);
      const key = text.toLocaleLowerCase();
      if (!text || seen.has(key)) continue;
      seen.add(key);
      result.push(text);
      if (result.length >= limit) break;
    }
    return result;
  }

  function sanitizeUrl(input) {
    try {
      const parsed = new URL(input);
      if (!["http:", "https:", "file:"].includes(parsed.protocol)) return "";
      if (parsed.protocol === "file:") {
        return `file://${compactText(parsed.pathname, 240)}`;
      }
      let safeHash = "";
      if (/^#\/[a-z0-9/_-]*$/i.test(parsed.hash)) safeHash = parsed.hash;
      return `${parsed.protocol}//${parsed.host}${parsed.pathname}${safeHash}`;
    } catch {
      return "";
    }
  }

  function routeFromUrl(input) {
    try {
      const parsed = new URL(input);
      const hashRoute = /^#\/[a-z0-9/_-]*$/i.test(parsed.hash) ? parsed.hash.slice(1) : "";
      return `${parsed.pathname || "/"}${hashRoute}`;
    } catch {
      return "/";
    }
  }

  function isIpHostname(hostname) {
    const value = String(hostname || "").replace(/^\[|\]$/g, "");
    if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(value)) {
      return value.split(".").every((part) => Number(part) >= 0 && Number(part) <= 255);
    }
    return value.includes(":") && /^[0-9a-f:]+$/i.test(value);
  }

  function extractUrlSignals(input) {
    try {
      const parsed = new URL(input);
      const hostname = parsed.hostname.toLowerCase();
      const labels = hostname.split(".").filter(Boolean);
      const encodedCount = (input.match(/%[0-9a-f]{2}/gi) || []).length;
      const unusualTlds = new Set([
        "zip", "mov", "click", "country", "gq", "tk", "work", "support", "xyz", "top",
      ]);
      const tld = labels[labels.length - 1] || "";
      const suspiciousTerms = (
        hostname + parsed.pathname
      ).match(/\b(?:verify|verification|secure|account-update|wallet|claim-prize|urgent)\b/gi) || [];

      return {
        protocol: parsed.protocol.replace(":", ""),
        hostname,
        https: parsed.protocol === "https:" ? true : parsed.protocol === "http:" ? false : null,
        suspiciousProtocol: !["http:", "https:"].includes(parsed.protocol),
        isIpHostname: isIpHostname(hostname),
        hasPunycode: labels.some((label) => label.startsWith("xn--")),
        subdomainCount: Math.max(0, labels.length - 2),
        excessiveSubdomains: labels.length > 5,
        suspiciousUrlLength: input.length > 140,
        encodedCharacterCount: encodedCount,
        hasObfuscatedCharacters: encodedCount >= 4 || /@/.test(parsed.host),
        hasCredentialsInUrl: Boolean(parsed.username || parsed.password),
        unusualTld: unusualTlds.has(tld),
        suspiciousTermCount: suspiciousTerms.length,
      };
    } catch {
      return {
        protocol: "unknown",
        hostname: "",
        https: null,
        suspiciousProtocol: true,
        isIpHostname: false,
        hasPunycode: false,
        subdomainCount: 0,
        excessiveSubdomains: false,
        suspiciousUrlLength: false,
        encodedCharacterCount: 0,
        hasObfuscatedCharacters: false,
        hasCredentialsInUrl: false,
        unusualTld: false,
        suspiciousTermCount: 0,
      };
    }
  }

  function fieldDescriptor(field) {
    const data = field || {};
    return [
      data.label,
      data.name,
      data.placeholder,
      data.ariaLabel,
      data.autocomplete,
    ].map((value) => compactText(value, 120)).join(" ");
  }

  function classifyFieldPurpose(field) {
    const data = field || {};
    if (data.dataKind && /^[a-z_]{2,40}$/.test(data.dataKind)) {
      return data.dataKind;
    }
    if (data.classification && data.classification !== "none") {
      return data.classification;
    }
    const type = compactText(data.type, 40).toLowerCase();
    const autocomplete = compactText(data.autocomplete, 80).toLowerCase();
    const descriptor = fieldDescriptor(data);

    if (type === "password" || autocomplete.includes("current-password") || autocomplete.includes("new-password")) {
      return "password";
    }
    if (autocomplete.includes("one-time-code") || SENSITIVE_PATTERNS.otp.test(descriptor)) return "otp";
    if (autocomplete.startsWith("cc-") || SENSITIVE_PATTERNS.payment.test(descriptor)) return "payment";
    if (SENSITIVE_PATTERNS.banking.test(descriptor)) return "banking";
    if (SENSITIVE_PATTERNS.government_id.test(descriptor)) return "government_id";
    if (type === "file") {
      return SENSITIVE_PATTERNS.government_id.test(descriptor) ? "government_id" : "document_upload";
    }
    if (type === "email" || autocomplete === "email" || /\bemail\b/i.test(descriptor)) return "email";
    if (type === "tel" || autocomplete.startsWith("tel") || /\b(phone|mobile|telephone|contact number)\b/i.test(descriptor)) {
      return "phone";
    }
    if (
      ["street-address", "address-line1", "address-line2", "postal-code", "country", "country-name"].includes(autocomplete) ||
      /\b(address|postal code|postcode|zip code|unit number)\b/i.test(descriptor)
    ) return "postal_address";
    if (autocomplete === "bday" || /\b(date of birth|birth date|birthday|dob)\b/i.test(descriptor)) {
      return "date_of_birth";
    }
    if (
      ["name", "given-name", "additional-name", "family-name"].includes(autocomplete) ||
      /\b(full name|first name|last name|given name|family name|your name)\b/i.test(descriptor)
    ) return "personal_name";
    if (autocomplete === "username" || /\b(user ?name|login id|user id)\b/i.test(descriptor)) return "username";
    if (type === "search" || /\b(search|find|query)\b/i.test(descriptor)) return "search_query";
    if (/\b(voucher|redemption|claim|promo|promotion|entry|reference) (?:code|number)\b/i.test(descriptor)) {
      return "claim_code";
    }
    if (type === "textarea" || /\b(message|comments?|feedback|enquiry|inquiry)\b/i.test(descriptor)) {
      return "message";
    }
    return "generic_text";
  }

  function classifySensitiveField(field) {
    const data = field || {};
    if (["password", "otp", "payment", "banking", "government_id", "document_upload", "email", "none"].includes(data.classification)) {
      return data.classification;
    }
    const kind = classifyFieldPurpose(data);
    return SENSITIVE_FIELD_KINDS.has(kind) ? kind : "none";
  }

  function hasSensitiveMeaning(text) {
    const value = compactText(text, 300);
    return Object.entries(SENSITIVE_PATTERNS)
      .filter(([key]) => key !== "document_upload")
      .some(([, pattern]) => pattern.test(value));
  }

  function contextText(context) {
    const data = context || {};
    const parts = [
      data.title,
      data.description,
      ...(data.headings || []),
      ...(data.navigation || []).map((item) => typeof item === "string" ? item : item.text),
      ...(data.buttons || []).map((item) => typeof item === "string" ? item : item.text),
      ...(data.links || []).map((item) => typeof item === "string" ? item : item.text),
      ...(data.forms || []).flatMap((form) => [
        ...(form.labels || []),
        ...(form.fields || []).map((field) => field.label),
      ]),
      ...(data.visibleText || []),
    ];
    return compactText(parts.join(" "), 6000).toLocaleLowerCase();
  }

  function classifyPagePurpose(context) {
    const data = context || {};
    const text = contextText(data);
    const route = compactText(data.route || data.pathname || routeFromUrl(data.url), 300).toLowerCase();
    const searchable = `${text} ${route}`;
    const category = data.pageCategory || classifyPage(data);
    const has = (pattern) => pattern.test(searchable);
    const governmentIdentity = category === "government" ||
      isRecognizedGovernmentHostname(data.hostname) ||
      has(/\b(government|governement|goverment|governemnt|public service|ministry|minstry|singpass|hdb|cpf)\b/i);

    if (
      governmentIdentity &&
      has(/\b(voucher|vaucher|benefit|rebate|payout|grant)\b/i) &&
      has(/\b(redeem|redemption|redemtion|claim|collect|activate|eligibility|eligible)\b/i)
    ) return { purpose: "government_voucher", confidence: 0.94 };
    if (
      has(/\b(lucky draw|prize draw|sweepstakes?|giveaway|contest)\b/i) &&
      has(/\b(winner|won|claim|redeem|collect|selected|congratulations?|congradulations)\b/i)
    ) return { purpose: "prize_claim", confidence: 0.92 };
    if (has(/\b(lucky draw|prize draw|sweepstakes?|giveaway|contest)\b/i)) {
      return { purpose: "prize_entry", confidence: 0.86 };
    }
    if (category === "ecommerce_checkout") return { purpose: "checkout", confidence: 0.96 };
    if (["login", "banking_login"].includes(category) || has(/\b(log in|login|sign in|authentication)\b/i)) {
      return { purpose: "login", confidence: 0.9 };
    }
    if (has(/\b(newsletter|mailing list|email updates|subscribe)\b/i)) {
      return { purpose: "newsletter", confidence: 0.86 };
    }
    if (
      has(/\b(apply|application|registration|register for|licen[cs]e|permit|admission|enrolment|enrollment)\b/i) &&
      !has(/\b(lucky draw|prize draw|sweepstakes?|giveaway|contest)\b/i)
    ) return { purpose: "application", confidence: 0.8 };
    if (category === "contact" || has(/\b(contact us|send (?:us )?a message|feedback|enquiry|inquiry)\b/i)) {
      return { purpose: "contact", confidence: 0.86 };
    }
    if (category === "search" || (data.forms || []).some((form) => form.type === "search")) {
      return { purpose: "search", confidence: 0.9 };
    }
    if (["article", "informational", "university", "ecommerce", "banking", "government"].includes(category)) {
      return { purpose: "information", confidence: 0.65 };
    }
    return { purpose: "unknown", confidence: 0.25 };
  }

  function isRecognizedGovernmentHostname(hostname) {
    const value = compactText(hostname, 200).toLowerCase().replace(/\.$/, "");
    if (!value) return false;
    return (
      /(^|\.)gov$/.test(value) ||
      /(^|\.)gov\.(?:sg|uk|au|in|my|ph|nz|za|br)$/.test(value) ||
      /(^|\.)govt\.nz$/.test(value) ||
      /(^|\.)go\.(?:jp|kr|th|id)$/.test(value) ||
      /(^|\.)gc\.ca$/.test(value) ||
      /(^|\.)gouv\.fr$/.test(value) ||
      /(^|\.)bund\.de$/.test(value) ||
      /(^|\.)europa\.eu$/.test(value)
    );
  }

  function detectContentQuality(context) {
    const text = contextText(context);
    const typos = [];
    for (const typo of IDENTITY_TYPOS) {
      const matches = text.match(typo.pattern) || [];
      for (let index = 0; index < matches.length; index += 1) {
        typos.push({ found: typo.found, expected: typo.expected });
      }
    }
    return {
      checked: Boolean(text),
      typoCount: typos.length,
      identityTypoCount: typos.length,
      typos: typos.slice(0, 6),
    };
  }

  function classifyPage(context) {
    const text = contextText(context);
    const route = compactText((context && (context.route || context.pathname)) || "", 300).toLowerCase();
    const searchable = `${text} ${route}`;
    const sensitiveFields = ((context && context.forms) || [])
      .flatMap((form) => form.fields || [])
      .map(classifySensitiveField);

    const has = (pattern) => pattern.test(searchable);
    if (
      has(/\b(checkout|shopping cart|your cart|order summary|shipping address|billing address|bayar|pembayaran)\b/i) ||
      route.includes("checkout")
    ) return "ecommerce_checkout";
    if (
      has(/\b(products?|shop|shopping|add to cart|delivery|returns?|compare|catalogue|store)\b/i) ||
      has(/(?:购物|商品|购物车|பொருள்|கடை)/)
    ) return "ecommerce";
    if (
      has(/\b(bank|banking|credit union|accounts?|cards?|money transfer|pinjaman|perbankan)\b/i) &&
      (sensitiveFields.includes("password") || has(/\b(log in|login|sign in|masuk)\b/i))
    ) return "banking_login";
    if (has(/\b(bank|banking|credit union|accounts?|cards?|money transfer|pinjaman|perbankan)\b/i)) {
      return "banking";
    }
    if (
      has(/\b(university|college|polytechnic|admissions?|academic calendar|courses?|faculty|student services)\b/i) ||
      has(/(?:大学|学院|课程|பல்கலைக்கழகம்|கல்லூரி)/)
    ) return "university";
    if (
      has(/\b(government|governement|goverment|governemnt|public service|ministry|minstry|municipal|citizen|singpass|hdb|cpf|eligibility|eligiblity)\b/i) ||
      /\.gov(?:\.sg)?$/i.test((context && context.hostname) || "")
    ) return "government";
    if (sensitiveFields.includes("password") || has(/\b(log in|login|sign in|authentication)\b/i)) return "login";
    if (has(/\b(contact us|contact information|help centre|support centre)\b/i)) return "contact";
    if (has(/\b(article|news|blog|published|read more)\b/i)) return "article";
    if (has(/\b(search results|search this site|results for)\b/i)) return "search";
    if ((context && context.title) || ((context && context.headings) || []).length) return "informational";
    return "unknown";
  }

  function sanitizeTarget(item, allowedTypes) {
    const value = item || {};
    const targetType = allowedTypes.includes(value.targetType) ? value.targetType : allowedTypes[0];
    return {
      text: redactSensitiveText(value.text || value.label, 120),
      targetType,
      id: compactText(value.id, 100) || undefined,
    };
  }

  function sanitizePageContext(context) {
    const input = context || {};
    const forms = (input.forms || []).slice(0, 8).map((form) => ({
      type: compactText(form.type, 40) || "form",
      labels: uniqueText(form.labels || [], 8, 100),
      fields: (form.fields || []).slice(0, 12).map((field) => ({
        type: compactText(field.type, 30) || "text",
        label: redactSensitiveText(field.label, 100),
        classification: compactText(field.classification, 40) || classifySensitiveField(field),
        dataKind: compactText(field.dataKind, 40) || classifyFieldPurpose(field),
        disabled: Boolean(field.disabled),
      })),
    }));
    const safeUrl = sanitizeUrl(input.url);
    let hostname = "";
    try { hostname = new URL(safeUrl).hostname; } catch { hostname = compactText(input.hostname, 160); }

    return {
      url: safeUrl,
      hostname,
      route: routeFromUrl(safeUrl || input.url),
      title: redactSensitiveText(input.title, 180),
      description: redactSensitiveText(input.description, 240),
      headings: uniqueText(input.headings, 12, 140),
      navigation: (input.navigation || []).slice(0, 20).map((item) => sanitizeTarget(item, ["navigation"])),
      buttons: (input.buttons || []).slice(0, 20).map((item) => sanitizeTarget(item, ["button"])),
      links: (input.links || []).slice(0, 30).map((item) => sanitizeTarget(item, ["link"])),
      forms,
      breadcrumbs: uniqueText(input.breadcrumbs, 10, 120),
      ariaLabels: uniqueText(input.ariaLabels, 20, 120),
      visibleText: uniqueText(input.visibleText, 12, 220),
      pageCategory: compactText(input.pageCategory, 60) || classifyPage(input),
    };
  }

  function hashString(value) {
    let hash = 0x811c9dc5;
    const text = String(value || "");
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(36);
  }

  function createPageFingerprint(context) {
    const safe = sanitizePageContext(context);
    const fingerprintSource = JSON.stringify({
      hostname: safe.hostname,
      route: safe.route,
      title: safe.title,
      description: safe.description,
      headings: safe.headings,
      navigation: safe.navigation.map((item) => item.text),
      buttons: safe.buttons.map((item) => item.text),
      links: safe.links.map((item) => item.text),
      forms: safe.forms,
      pageCategory: safe.pageCategory,
    });
    return hashString(fingerprintSource);
  }

  function createCacheKey(context) {
    const safe = sanitizePageContext(context);
    return `${safe.hostname || "unknown"}${safe.route || "/"}:${createPageFingerprint(safe)}`;
  }

  return {
    compactText,
    redactSensitiveText,
    uniqueText,
    sanitizeUrl,
    routeFromUrl,
    isIpHostname,
    extractUrlSignals,
    classifyFieldPurpose,
    classifySensitiveField,
    hasSensitiveMeaning,
    classifyPage,
    classifyPagePurpose,
    isRecognizedGovernmentHostname,
    detectContentQuality,
    sanitizePageContext,
    createPageFingerprint,
    createCacheKey,
  };
});
