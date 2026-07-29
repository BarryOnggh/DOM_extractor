(function (root, factory) {
  const dependency = typeof module === "object" && module.exports
    ? require("./page-analysis.js")
    : root.GovAssistPageAnalysis;
  const api = factory(dependency);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GovAssistTrust = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (pageAnalysis) {
  "use strict";

  const STATUS_FACTOR = {
    positive: 0,
    neutral: 0,
    warning: 1,
    critical: 1.2,
    unknown: 0,
  };

  function signal(id, category, status, weight, reliability, description, evidence, overlapGroup) {
    return {
      id,
      category,
      status,
      weight,
      reliability,
      description,
      evidence: evidence || undefined,
      overlapGroup: overlapGroup || id,
    };
  }

  function enabledSensitiveFields(evidence) {
    return (evidence.sensitiveFields || []).filter((field) => !field.disabled && field.classification !== "none");
  }

  function enabledFormFields(context, evidence) {
    const contextFields = (context.forms || [])
      .flatMap((form) => form.fields || [])
      .filter((field) => !field.disabled);
    if (contextFields.length) return contextFields;
    return (evidence.sensitiveFields || []).filter((field) => !field.disabled);
  }

  function fieldJudgement(purpose, dataKind) {
    const expected = {
      search: new Set(["search_query", "generic_text"]),
      contact: new Set(["personal_name", "email", "phone", "message", "generic_text"]),
      newsletter: new Set(["email", "personal_name"]),
      login: new Set(["username", "email", "password", "otp"]),
      checkout: new Set(["personal_name", "email", "phone", "postal_address", "payment", "banking", "claim_code"]),
      application: new Set([
        "personal_name", "email", "phone", "postal_address", "date_of_birth",
        "government_id", "document_upload", "username", "claim_code", "generic_text",
      ]),
      government_voucher: new Set(["claim_code"]),
      prize_entry: new Set(["personal_name", "email", "phone", "claim_code"]),
      prize_claim: new Set(["personal_name", "email", "phone", "claim_code"]),
      information: new Set(["search_query", "message"]),
      unknown: new Set(["search_query"]),
    };
    const expectedForPurpose = expected[purpose] || expected.unknown;
    if (expectedForPurpose.has(dataKind)) {
      return { necessity: "expected", severity: "neutral" };
    }

    if (dataKind === "generic_text") {
      return { necessity: "unknown", severity: "unknown" };
    }

    if (purpose === "government_voucher") {
      if (["password", "otp", "payment", "banking"].includes(dataKind)) {
        return { necessity: "unexpected", severity: "critical" };
      }
      if (["government_id", "document_upload", "date_of_birth", "postal_address"].includes(dataKind)) {
        return { necessity: "unexpected", severity: "warning" };
      }
      if (["personal_name", "email", "phone", "username"].includes(dataKind)) {
        return { necessity: "questionable", severity: "warning" };
      }
    }

    if (purpose === "prize_entry") {
      if (["password", "otp", "payment", "banking", "government_id", "document_upload"].includes(dataKind)) {
        return { necessity: "unexpected", severity: "critical" };
      }
      if (["postal_address", "date_of_birth", "username"].includes(dataKind)) {
        return { necessity: "questionable", severity: "warning" };
      }
    }

    if (purpose === "prize_claim") {
      if (["password", "otp", "payment", "banking", "government_id", "document_upload"].includes(dataKind)) {
        return { necessity: "unexpected", severity: "critical" };
      }
      if (["postal_address", "date_of_birth", "username"].includes(dataKind)) {
        return { necessity: "questionable", severity: "warning" };
      }
    }

    if (purpose === "checkout" && ["password", "government_id", "document_upload", "date_of_birth"].includes(dataKind)) {
      return { necessity: "questionable", severity: "warning" };
    }
    if (purpose === "application" && ["payment", "password", "otp"].includes(dataKind)) {
      return { necessity: "questionable", severity: "warning" };
    }
    if (
      ["password", "otp", "payment", "banking", "government_id", "document_upload"].includes(dataKind)
    ) return { necessity: "unexpected", severity: "critical" };
    if (["postal_address", "date_of_birth", "personal_name", "email", "phone", "username"].includes(dataKind)) {
      return { necessity: "questionable", severity: "warning" };
    }
    return { necessity: "unknown", severity: "unknown" };
  }

  function assessFormAppropriateness(rawContext, rawEvidence) {
    const context = pageAnalysis.sanitizePageContext(rawContext || {});
    const evidence = rawEvidence || {};
    const purposeResult = pageAnalysis.classifyPagePurpose(context);
    const fields = enabledFormFields(context, evidence);
    const assessments = fields.map((field) => {
      const dataKind = pageAnalysis.classifyFieldPurpose(field);
      const judgement = fieldJudgement(purposeResult.purpose, dataKind);
      return {
        label: pageAnalysis.redactSensitiveText(field.label, 80),
        dataKind,
        necessity: judgement.necessity,
        severity: judgement.severity,
      };
    });
    return {
      checked: true,
      purpose: purposeResult.purpose,
      purposeConfidence: purposeResult.confidence,
      officialGovernmentDomain: pageAnalysis.isRecognizedGovernmentHostname(context.hostname),
      fields: assessments,
      unexpected: assessments.filter((item) => item.necessity === "unexpected"),
      questionable: assessments.filter((item) => item.necessity === "questionable"),
      unknown: assessments.filter((item) => item.necessity === "unknown"),
    };
  }

  function fieldKindSummary(items) {
    const names = {
      password: "a password",
      otp: "a one-time passcode",
      payment: "card or payment details",
      banking: "bank-account details",
      government_id: "a government identifier",
      document_upload: "a document upload",
      email: "an email address",
      phone: "a phone number",
      personal_name: "a personal name",
      postal_address: "a postal address",
      date_of_birth: "a date of birth",
      username: "a username",
    };
    return Array.from(new Set(items.map((item) => names[item.dataKind] || item.dataKind)))
      .slice(0, 4)
      .join(", ");
  }

  function collectTrustSignals(rawEvidence) {
    const evidence = rawEvidence || {};
    const context = pageAnalysis.sanitizePageContext(evidence.pageContext || {});
    const url = evidence.urlSignals || pageAnalysis.extractUrlSignals(context.url);
    const signals = [];
    const purposeAssessment = evidence.formAppropriateness || assessFormAppropriateness(context, evidence);
    const contentQuality = evidence.contentQuality || pageAnalysis.detectContentQuality(context);
    const governmentThemed = context.pageCategory === "government" || Boolean(evidence.governmentBranding);
    const officialBrandDomain = Boolean(
      evidence.brandSimilarity && evidence.brandSimilarity.isOfficialDomain === true
    );

    signals.push(signal(
      `page-purpose-${purposeAssessment.purpose}`, "page-purpose", "neutral", 0,
      Math.max(0.25, Number(purposeAssessment.purposeConfidence) || 0.25),
      `The page appears to be for ${purposeAssessment.purpose.replace(/_/g, " ")}.`
    ));

    if (url.https === true) {
      signals.push(signal(
        "https-connection", "connection", "positive", 0, 1,
        "The page uses HTTPS. This protects the connection but does not prove the site is trustworthy."
      ));
    } else if (url.https === false) {
      signals.push(signal(
        "no-https", "connection", "warning", 18, 1,
        "The page is not using an HTTPS connection.", context.url, "connection-security"
      ));
    } else {
      signals.push(signal(
        "https-unknown", "connection", "unknown", 0, 1,
        "Connection security could not be assessed for this page."
      ));
    }

    if (url.suspiciousProtocol) {
      signals.push(signal(
        "unusual-protocol", "connection", "warning", 15, 1,
        "The page uses a protocol that is not a normal web connection.", url.protocol, "connection-security"
      ));
    }
    if (url.isIpHostname) {
      signals.push(signal(
        "ip-hostname", "url", "warning", 20, 1,
        "The website uses an IP address instead of a normal domain name.", url.hostname, "url-identity"
      ));
    }
    if (url.hasPunycode) {
      signals.push(signal(
        "punycode-domain", "url", "warning", 14, 1,
        "The domain contains an internationalised punycode label that can be difficult to recognise.",
        url.hostname, "url-identity"
      ));
    }
    if (url.hasCredentialsInUrl) {
      signals.push(signal(
        "url-credentials", "url", "critical", 34, 1,
        "The address contains credentials before the hostname, which can make the real domain easy to miss.",
        url.hostname, "url-obfuscation"
      ));
    }
    if (url.hasObfuscatedCharacters) {
      signals.push(signal(
        "obfuscated-url", "url", "warning", 14, 0.95,
        "The address contains several encoded or potentially misleading characters.",
        `${url.encodedCharacterCount} encoded characters`, "url-obfuscation"
      ));
    }
    if (url.excessiveSubdomains) {
      signals.push(signal(
        "excessive-subdomains", "url", "warning", 8, 0.9,
        "The address uses an unusually deep subdomain structure.", url.hostname, "url-identity"
      ));
    }
    if (url.suspiciousUrlLength) {
      signals.push(signal(
        "long-url", "url", "warning", 7, 0.85,
        "The address is unusually long.", undefined, "url-obfuscation"
      ));
    }
    if (url.unusualTld) {
      signals.push(signal(
        "unusual-tld", "url", "warning", 6, 0.65,
        "The domain ending is sometimes used for short-lived sites. This is only a weak indicator.",
        url.hostname, "url-identity"
      ));
    }
    if (url.suspiciousTermCount > 0) {
      signals.push(signal(
        "security-terms-in-url", "url", "warning", 6, 0.65,
        "The address uses account or verification wording that deserves a closer look.",
        url.hostname, "url-identity"
      ));
    }

    if (Number(evidence.mixedContentCount) > 0) {
      signals.push(signal(
        "mixed-content", "connection", "warning", 14, 0.95,
        "The secure page loads some resources or form targets over an insecure connection.",
        `${evidence.mixedContentCount} item(s)`, "connection-security"
      ));
    }
    if (Number(evidence.redirectCount) >= 3) {
      signals.push(signal(
        "multiple-redirects", "behaviour", "warning", 10, 0.8,
        "The page was reached after several redirects.",
        `${evidence.redirectCount} redirects`, "navigation-behaviour"
      ));
    }

    const sensitive = enabledSensitiveFields(evidence);
    const fieldTypes = new Set(sensitive.map((field) => field.classification));
    const category = context.pageCategory;

    if (fieldTypes.has("password")) {
      const expected = purposeAssessment.purpose === "login";
      signals.push(signal(
        "password-request", "page-behaviour", expected ? "neutral" : "warning", expected ? 0 : 18, 1,
        expected
          ? "A password field appears in a context that looks like a login page."
          : "The page requests a password outside a clearly identified login context.",
        undefined, "credential-request"
      ));
    }
    if (fieldTypes.has("otp")) {
      const expected = purposeAssessment.purpose === "login";
      signals.push(signal(
        "otp-request", "page-behaviour",
        expected ? "neutral" : "warning",
        expected ? 0 : 24,
        1,
        "The page contains a field for a one-time passcode.",
        undefined, "credential-request"
      ));
    }
    if (fieldTypes.has("payment") || fieldTypes.has("banking")) {
      const expected = purposeAssessment.purpose === "checkout" || category === "banking_login";
      signals.push(signal(
        "financial-information-request", "page-behaviour", expected ? "neutral" : "critical",
        expected ? 0 : 29, 1,
        expected
          ? "Financial fields appear in a checkout or banking context."
          : "The page requests financial information outside a normal checkout or banking context.",
        undefined, "financial-request"
      ));
    }
    if (fieldTypes.has("government_id") || fieldTypes.has("document_upload")) {
      const expected = purposeAssessment.purpose === "application";
      signals.push(signal(
        "identity-document-request", "page-behaviour", expected ? "neutral" : "warning",
        expected ? 0 : 22, 1,
        "The page can request an identity document or other personal document.",
        undefined, "identity-request"
      ));
    }

    if (purposeAssessment.unexpected.length) {
      const critical = purposeAssessment.unexpected.some((item) => item.severity === "critical");
      signals.push(signal(
        "unnecessary-sensitive-fields", "form-appropriateness", critical ? "critical" : "warning",
        critical ? 34 : 25, critical ? 0.98 : 0.92,
        `This ${purposeAssessment.purpose.replace(/_/g, " ")} form asks for ${fieldKindSummary(purposeAssessment.unexpected)}, which is not normally needed for this step.`,
        undefined, "form-appropriateness"
      ));
    }
    if (purposeAssessment.questionable.length) {
      signals.push(signal(
        "questionable-personal-data-request", "form-appropriateness", "warning", 24, 0.95,
        `The page asks for personal information before its stated ${purposeAssessment.purpose.replace(/_/g, " ")} purpose clearly requires it: ${fieldKindSummary(purposeAssessment.questionable)}.`,
        undefined, "form-appropriateness"
      ));
    }
    if (purposeAssessment.unknown.length) {
      signals.push(signal(
        "form-field-purpose-unknown", "form-appropriateness", "unknown", 0, 1,
        "One or more form fields could not be matched confidently to the page's apparent purpose."
      ));
    }

    if (
      governmentThemed &&
      context.hostname &&
      !purposeAssessment.officialGovernmentDomain &&
      !officialBrandDomain
    ) {
      signals.push(signal(
        "government-domain-mismatch", "identity", "warning", 20, 0.85,
        "The page uses government wording but its address does not match a recognised public-sector domain pattern.",
        context.hostname, "url-identity"
      ));
    }

    if (contentQuality.identityTypoCount > 0) {
      const importantContext = governmentThemed ||
        ["government_voucher", "prize_claim", "prize_entry"].includes(purposeAssessment.purpose);
      const examples = (contentQuality.typos || [])
        .slice(0, 3)
        .map((item) => `${item.found} → ${item.expected}`)
        .join(", ");
      signals.push(signal(
        "identity-spelling-errors", "content", "warning", importantContext ? 12 : 6, 0.9,
        importantContext
          ? "Important identity or claim wording contains known spelling errors."
          : "The page contains a known spelling error. This is a supporting clue, not proof of fraud.",
        examples || undefined, "content-quality"
      ));
    }

    if (evidence.requestsCrypto) {
      const governmentContext = category === "government" || Boolean(evidence.governmentBranding);
      signals.push(signal(
        "crypto-request", "page-behaviour", governmentContext ? "critical" : "warning",
        governmentContext ? 58 : 28, 0.95,
        governmentContext
          ? "A government-themed page asks for cryptocurrency, which is highly unusual."
          : "The page asks for cryptocurrency.",
        undefined, "payment-request"
      ));
    }
    if (evidence.urgencyLanguage) {
      signals.push(signal(
        "urgency-language", "content", "warning", 13, 0.8,
        "The page uses pressure or urgency language.", evidence.urgencyEvidence, "manipulation"
      ));
    }
    if (evidence.infectionClaim) {
      signals.push(signal(
        "infection-claim", "content", "critical", 34, 0.95,
        "The page claims that the device is infected or compromised.", undefined, "manipulation"
      ));
    }
    if (evidence.remoteAccessRequest) {
      signals.push(signal(
        "remote-access-request", "page-behaviour", "critical", 38, 0.95,
        "The page asks the user to install or start remote-access software.", undefined, "software-request"
      ));
    }
    if (evidence.softwareInstallRequest) {
      signals.push(signal(
        "software-install-request", "page-behaviour", "warning", 22, 0.9,
        "The page asks the user to install software.", undefined, "software-request"
      ));
    }
    if (Number(evidence.popupCount) >= 3) {
      signals.push(signal(
        "repeated-popups", "behaviour", "warning", 10, 0.75,
        "Several popup-style overlays are visible or were detected.",
        `${evidence.popupCount} popup-style items`, "attention-pressure"
      ));
    }
    if ((evidence.permissionsRequested || []).length) {
      signals.push(signal(
        "permission-request", "permissions", "warning", 10, 0.8,
        "The page appears to request browser permissions.",
        evidence.permissionsRequested.join(", "), "attention-pressure"
      ));
    }
    if (evidence.unexpectedDownload) {
      signals.push(signal(
        "unexpected-download", "page-behaviour", "warning", 18, 0.85,
        "The page prominently encourages an unexpected file download.", undefined, "software-request"
      ));
    }

    const brand = evidence.brandSimilarity;
    if (
      brand &&
      brand.suspectedBrand &&
      brand.isOfficialDomain === false &&
      Number(brand.similarityScore) >= 0.78 &&
      Number(brand.contextStrength) >= 0.65 &&
      category !== "article"
    ) {
      signals.push(signal(
        "brand-lookalike", "identity", "critical", 30, Math.min(0.95, Number(brand.similarityScore)),
        `The domain resembles ${brand.suspectedBrand}, but it is not one of the known official domains.`,
        url.hostname, "url-identity"
      ));
    }

    if (evidence.knownMaliciousMatch === true) {
      signals.push(signal(
        "known-malicious-match", "reputation", "critical", 75, 1,
        "A configured high-quality reputation source matched this domain.",
        url.hostname, "confirmed-reputation"
      ));
    } else {
      signals.push(signal(
        "domain-reputation-unknown", "reputation", "unknown", 0, 1,
        "No external domain-reputation result is available."
      ));
    }

    if (Number.isFinite(evidence.domainAgeDays)) {
      if (evidence.domainAgeDays < 30) {
        signals.push(signal(
          "young-domain", "domain", "warning", 18, 0.9,
          "A configured domain-data source reports that the domain was registered recently.",
          `${evidence.domainAgeDays} days`, "domain-recency"
        ));
      } else {
        signals.push(signal(
          "established-domain-age", "domain", "positive", 0, 0.9,
          "A configured domain-data source reports that the domain is not newly registered."
        ));
      }
    } else {
      signals.push(signal(
        "domain-age-unknown", "domain", "unknown", 0, 1,
        "Domain age is unavailable and was not estimated."
      ));
    }

    return signals;
  }

  function riskContribution(signalValue) {
    return Math.max(0, signalValue.weight) *
      Math.max(0, Math.min(1, signalValue.reliability)) *
      (STATUS_FACTOR[signalValue.status] || 0);
  }

  function combinationBonus(signals) {
    const allIds = new Set(signals.map((item) => item.id));
    const ids = new Set(signals.filter((item) => ["warning", "critical"].includes(item.status)).map((item) => item.id));
    let bonus = 0;
    if (ids.has("young-domain") && ids.has("brand-lookalike") && allIds.has("password-request")) bonus += 22;
    else if (ids.has("brand-lookalike") && allIds.has("password-request")) bonus += 14;
    if (ids.has("brand-lookalike") && allIds.has("otp-request")) bonus += 18;
    if (ids.has("multiple-redirects") && ids.has("financial-information-request")) bonus += 12;
    if (ids.has("urgency-language") && (ids.has("remote-access-request") || ids.has("software-install-request"))) bonus += 20;
    if (ids.has("crypto-request") && ids.has("urgency-language")) bonus += 14;
    if (ids.has("permission-request") && ids.has("repeated-popups")) bonus += 8;
    if (
      ids.has("government-domain-mismatch") &&
      ids.has("identity-spelling-errors") &&
      (ids.has("unnecessary-sensitive-fields") || ids.has("questionable-personal-data-request"))
    ) bonus += 18;
    else if (ids.has("government-domain-mismatch") && ids.has("identity-spelling-errors")) bonus += 10;
    if (
      allIds.has("page-purpose-government_voucher") &&
      ids.has("unnecessary-sensitive-fields") &&
      ids.has("urgency-language")
    ) bonus += 12;
    if (
      allIds.has("page-purpose-prize_claim") &&
      ids.has("unnecessary-sensitive-fields") &&
      ids.has("urgency-language")
    ) bonus += 12;
    if (ids.has("known-malicious-match")) bonus = Math.max(bonus, 35);
    return Math.min(35, bonus);
  }

  function calculateRiskScore(signals) {
    const groups = new Map();
    for (const item of signals || []) {
      const contribution = riskContribution(item);
      if (!contribution) continue;
      const key = item.overlapGroup || item.id;
      const group = groups.get(key) || [];
      group.push(contribution);
      groups.set(key, group);
    }

    let score = 0;
    for (const group of groups.values()) {
      group.sort((a, b) => b - a);
      score += group[0] + group.slice(1).reduce((sum, value) => sum + value * 0.25, 0);
    }
    score += combinationBonus(signals || []);
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  function calculateConfidenceScore(signals, rawEvidence) {
    const evidence = rawEvidence || {};
    const context = pageAnalysis.sanitizePageContext(evidence.pageContext || {});
    const purposeAssessment = evidence.formAppropriateness || assessFormAppropriateness(context, evidence);
    const contentQuality = evidence.contentQuality || pageAnalysis.detectContentQuality(context);
    const known = (signals || []).filter((item) => item.status !== "unknown");
    const reliableKnown = known.filter((item) => item.reliability >= 0.75);
    const unknown = (signals || []).filter((item) => item.status === "unknown");
    const density =
      (context.title ? 1 : 0) +
      Math.min(3, context.headings.length) +
      Math.min(3, context.links.length + context.buttons.length) +
      Math.min(2, context.visibleText.length);

    let score = 20;
    if (context.url) score += 8;
    if (context.hostname) score += 5;
    if (context.pageCategory !== "unknown") score += 7;
    score += Math.min(20, reliableKnown.length * 3);
    score += Math.min(15, density * 2);
    if ((evidence.sensitiveFields || []).length) score += 5;
    if (evidence.brandSimilarity) score += 5;
    if (purposeAssessment.purpose !== "unknown" && purposeAssessment.purposeConfidence >= 0.65) score += 6;
    if (purposeAssessment.fields.length) score += 8;
    if (contentQuality.checked) score += 4;
    if (purposeAssessment.officialGovernmentDomain) score += 3;
    score -= Math.min(12, unknown.length * 3);
    if (!context.title && !context.headings.length && !context.visibleText.length) score -= 12;
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  function riskLevelFromScore(riskScore, confidenceScore) {
    if (confidenceScore < 40 && riskScore < 30) return "Unknown";
    if (riskScore >= 65) return "High";
    if (riskScore >= 30) return "Medium";
    return "Low";
  }

  function summaryFor(level, signals) {
    const concerning = (signals || []).filter((item) => ["warning", "critical"].includes(item.status));
    if (level === "Unknown") return "There is not enough reliable evidence to assess this website confidently.";
    if (level === "Low") {
      return "No strong local warning indicators were detected, but this is not a guarantee that the website is safe.";
    }
    if (level === "Medium") {
      return `Some risk indicators were detected${concerning.length ? `, including ${concerning[0].description.toLowerCase()}` : ""}`;
    }
    return `Several high-risk indicators were detected${concerning.length ? `, including ${concerning[0].description.toLowerCase()}` : ""}`;
  }

  function recommendationFor(level) {
    if (level === "High") {
      return "Avoid entering sensitive information. Verify the organisation using its official app or an address you type yourself.";
    }
    if (level === "Medium") {
      return "Check the domain carefully and verify the site before entering sensitive information or downloading files.";
    }
    if (level === "Unknown") {
      return "Use caution and verify the website independently before sharing sensitive information.";
    }
    return "Continue to check the domain and page purpose before sharing sensitive information.";
  }

  function assessTrust(evidence) {
    const signals = collectTrustSignals(evidence);
    const riskScore = calculateRiskScore(signals);
    const confidenceScore = calculateConfidenceScore(signals, evidence);
    const riskLevel = riskLevelFromScore(riskScore, confidenceScore);
    const contributingSignals = signals
      .filter((item) => item.status !== "neutral")
      .sort((a, b) => riskContribution(b) - riskContribution(a));
    return {
      riskLevel,
      riskScore,
      confidenceScore,
      summary: summaryFor(riskLevel, signals),
      contributingSignals,
      recommendation: recommendationFor(riskLevel),
      assessedAt: new Date().toISOString(),
    };
  }

  return {
    assessFormAppropriateness,
    collectTrustSignals,
    calculateRiskScore,
    calculateConfidenceScore,
    riskLevelFromScore,
    assessTrust,
    combinationBonus,
  };
});
