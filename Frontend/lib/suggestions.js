(function (root, factory) {
  const dependency = typeof module === "object" && module.exports
    ? require("./page-analysis.js")
    : root.GovAssistPageAnalysis;
  const api = factory(dependency);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GovAssistSuggestions = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (pageAnalysis) {
  "use strict";

  const TARGET_TYPES = new Set(["link", "button", "form", "section", "navigation", "explanation"]);
  const FORBIDDEN = /\b(enter|submit|provide|upload|confirm|send|share|type)\b.{0,35}\b(password|otp|passcode|credit card|cvv|bank(?:ing)? (?:details|information)|identity document|government id|nric|passport|crypto(?:currency)?|transaction)\b/i;
  const DESTRUCTIVE = /\b(delete|remove account|close account|purchase now|pay now|transfer now|confirm payment)\b/i;

  function cleanLabel(value) {
    return pageAnalysis.compactText(value, 90).replace(/[.!?:;,]+$/, "");
  }

  function intentForTarget(text, targetType, category) {
    const value = cleanLabel(text);
    const lower = value.toLowerCase();
    if (/\b(contact|support|help centre|help center)\b/.test(lower)) return "Find contact information";
    if (/\b(return|refund)\b/.test(lower)) return "Find the return policy";
    if (/\b(delivery|shipping)\b/.test(lower)) return "Check delivery information";
    if (/\b(cart|basket)\b/.test(lower)) return "View the shopping cart";
    if (/\b(compare|comparison)\b/.test(lower)) return "Compare product options";
    if (/\b(course|programme|program)\b/.test(lower) && category === "university") return "Find course information";
    if (/\b(academic calendar|calendar)\b/.test(lower) && category === "university") return "View the academic calendar";
    if (/\b(admission|entry requirement)\b/.test(lower)) return "Find admission requirements";
    if (/\b(student services?)\b/.test(lower)) return "Locate student services";
    if (/\b(eligibility|eligible)\b/.test(lower)) return "Check eligibility information";
    if (/\b(resale)\b/.test(lower)) return "Find resale information";
    if (/\b(login|log in|sign in)\b/.test(lower)) return category.startsWith("banking") ? "Find account login" : "Find the login page";
    if (/\b(card support|lost card|stolen card)\b/.test(lower)) return "Locate card support";
    if (/\b(transfer)\b/.test(lower)) return "View transfer information";
    if (/\b(search)\b/.test(lower) || targetType === "form") {
      return category === "ecommerce" ? "Search for a product" : "Search this website";
    }
    if (/\b(application process|how to apply|process)\b/.test(lower)) return "Explain this application process";
    if (targetType === "button") return `Find ${value}`;
    return `Open ${value}`;
  }

  function availableTargets(context) {
    const safe = pageAnalysis.sanitizePageContext(context);
    return [
      ...safe.navigation,
      ...safe.links,
      ...safe.buttons,
      ...safe.forms.flatMap((form, formIndex) => (
        form.type === "search" || form.labels.some((label) => /\bsearch\b/i.test(label))
          ? [{ text: form.labels[0] || "Search", targetType: "form", id: `form-${formIndex}` }]
          : []
      )),
    ].filter((target) => target.text);
  }

  function localSuggestions(context) {
    const safe = pageAnalysis.sanitizePageContext(context);
    const candidates = [];
    const priorityPattern = {
      ecommerce: /\b(cart|basket|delivery|shipping|return|refund|compare|search|products?)\b/i,
      ecommerce_checkout: /\b(delivery|shipping|return|support|order summary)\b/i,
      university: /\b(course|programme|program|academic calendar|student service|admission|contact)\b/i,
      government: /\b(eligibility|available|flat|resale|contact|application process|service|portal)\b/i,
      banking: /\b(login|log in|card support|lost card|transfer|contact|support)\b/i,
      banking_login: /\b(card support|contact|support|security|login|log in)\b/i,
    }[safe.pageCategory] || /\b(contact|support|help|about|services?|search)\b/i;

    for (const target of availableTargets(safe)) {
      const label = intentForTarget(target.text, target.targetType, safe.pageCategory);
      const confidence = priorityPattern.test(target.text) ? 0.92 : 0.79;
      candidates.push({
        id: `local-${pageAnalysis.createPageFingerprint({ ...safe, title: target.text })}`,
        label,
        intent: label,
        targetType: target.targetType,
        targetText: target.text,
        confidence,
        reason: `Matches the visible ${target.targetType} "${target.text}".`,
      });
    }

    const validated = validateSuggestions(candidates, safe);
    if (validated.length >= 3) return validated.slice(0, 5);

    const fallback = [
      {
        id: "fallback-explain",
        label: "Explain this page",
        intent: "Explain the purpose and important information on this page",
        targetType: "explanation",
        confidence: safe.title || safe.headings.length ? 0.72 : 0.45,
        reason: "Uses the page title and visible headings.",
      },
      {
        id: "fallback-sections",
        label: "Show the main sections",
        intent: "Show and explain the main sections on this page",
        targetType: "section",
        targetText: safe.headings[0],
        confidence: safe.headings.length ? 0.74 : 0.42,
        reason: "Uses visible page headings.",
      },
      {
        id: "fallback-navigate",
        label: "Help me navigate this website",
        intent: "Help me navigate this website using visible links and controls",
        targetType: "explanation",
        confidence: 0.62,
        reason: "A neutral navigation request.",
      },
    ];
    return validateSuggestions([...validated, ...fallback], safe).slice(0, Math.max(2, Math.min(5, validated.length + 3)));
  }

  function findMatchingTarget(suggestion, context) {
    if (!suggestion.targetText) return null;
    const needle = cleanLabel(suggestion.targetText).toLocaleLowerCase();
    const type = suggestion.targetType;
    return availableTargets(context).find((target) => {
      const haystack = cleanLabel(target.text).toLocaleLowerCase();
      const typeMatches = type === "section" || target.targetType === type;
      return typeMatches && (haystack === needle || haystack.includes(needle) || needle.includes(haystack));
    }) || null;
  }

  function normalizeSuggestion(input, index) {
    const value = input || {};
    const label = cleanLabel(value.label);
    const intent = pageAnalysis.compactText(value.intent || label, 180);
    const targetType = TARGET_TYPES.has(value.targetType) ? value.targetType : "explanation";
    const confidence = Math.max(0, Math.min(1, Number(value.confidence)));
    return {
      id: pageAnalysis.compactText(value.id, 100) || `suggestion-${index + 1}`,
      label,
      intent,
      targetType,
      targetText: cleanLabel(value.targetText) || undefined,
      targetSelector: pageAnalysis.compactText(value.targetSelector, 300) || undefined,
      confidence: Number.isFinite(confidence) ? confidence : 0,
      reason: pageAnalysis.compactText(value.reason, 220) || undefined,
    };
  }

  function validateSuggestions(suggestions, context) {
    const seen = new Set();
    const valid = [];
    for (const [index, raw] of (suggestions || []).entries()) {
      const suggestion = normalizeSuggestion(raw, index);
      const key = suggestion.label.toLocaleLowerCase();
      if (!suggestion.label || !suggestion.intent || seen.has(key)) continue;
      if (FORBIDDEN.test(`${suggestion.label} ${suggestion.intent}`) || DESTRUCTIVE.test(suggestion.label)) continue;

      if (!["explanation", "section"].includes(suggestion.targetType)) {
        const match = findMatchingTarget(suggestion, context);
        if (!match || suggestion.confidence < 0.7) {
          suggestion.targetType = "explanation";
          delete suggestion.targetText;
          delete suggestion.targetSelector;
          suggestion.confidence = Math.min(suggestion.confidence, 0.69);
          suggestion.reason = "No sufficiently confident live page target was found.";
        } else {
          suggestion.targetText = match.text;
        }
      }
      seen.add(key);
      valid.push(suggestion);
      if (valid.length >= 5) break;
    }
    return valid;
  }

  class SuggestionCache {
    constructor(options) {
      const config = options || {};
      this.ttlMs = config.ttlMs || 5 * 60 * 1000;
      this.maxEntries = config.maxEntries || 30;
      this.now = config.now || (() => Date.now());
      this.entries = new Map();
    }

    get(key) {
      const entry = this.entries.get(key);
      if (!entry) return null;
      if (this.now() - entry.createdAt > this.ttlMs) {
        this.entries.delete(key);
        return null;
      }
      this.entries.delete(key);
      this.entries.set(key, entry);
      return entry.value;
    }

    set(key, value) {
      if (this.entries.has(key)) this.entries.delete(key);
      this.entries.set(key, { createdAt: this.now(), value });
      while (this.entries.size > this.maxEntries) {
        this.entries.delete(this.entries.keys().next().value);
      }
    }

    invalidate(predicate) {
      for (const key of this.entries.keys()) {
        if (!predicate || predicate(key)) this.entries.delete(key);
      }
    }
  }

  return {
    localSuggestions,
    validateSuggestions,
    findMatchingTarget,
    SuggestionCache,
  };
});
