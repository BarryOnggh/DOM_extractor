(function (root, factory) {
  const dependency = typeof module === "object" && module.exports
    ? require("./page-analysis.js")
    : root.GovAssistPageAnalysis;
  const api = factory(dependency);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GovAssistActionRisk = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (pageAnalysis) {
  "use strict";

  const ACTION_SEVERITY = {
    password: 24,
    email: 20,
    phone: 20,
    personal_name: 20,
    postal_address: 24,
    date_of_birth: 30,
    username: 20,
    payment: 35,
    banking: 35,
    government_id: 34,
    document_upload: 24,
    otp: 38,
    notification: 12,
    location: 14,
    camera: 20,
    microphone: 20,
    software_install: 36,
    extension_install: 38,
    cryptocurrency: 45,
    remote_access: 48,
    download: 16,
  };

  const ACTION_NAMES = {
    password: "Enter a password",
    email: "Enter an email address",
    phone: "Enter a phone number",
    personal_name: "Enter a personal name",
    postal_address: "Enter a postal address",
    date_of_birth: "Enter a date of birth",
    username: "Enter a username",
    payment: "Submit payment-card details",
    banking: "Submit banking details",
    government_id: "Provide government identity information",
    document_upload: "Upload a personal document",
    otp: "Submit a one-time passcode",
    notification: "Grant notification permission",
    location: "Grant location access",
    camera: "Grant camera access",
    microphone: "Grant microphone access",
    software_install: "Install software",
    extension_install: "Install a browser extension",
    cryptocurrency: "Send cryptocurrency",
    remote_access: "Start remote access",
    download: "Download a file",
  };

  function detectSensitiveAction(metadata) {
    const data = metadata || {};
    const sensitiveClassification = data.classification || pageAnalysis.classifySensitiveField(data);
    const dataKind = pageAnalysis.classifyFieldPurpose(data);
    const classification = sensitiveClassification !== "none" ? sensitiveClassification : dataKind;
    if (ACTION_SEVERITY[classification] !== undefined) {
      return {
        action: ACTION_NAMES[classification],
        requestedInformation: [classification],
        classification,
        sensitive: true,
      };
    }

    const text = pageAnalysis.compactText(
      [data.label, data.text, data.href, data.ariaLabel].join(" "), 300
    ).toLowerCase();
    const patterns = [
      ["remote_access", /\b(remote access|anydesk|teamviewer|remote desktop)\b/],
      ["extension_install", /\b(install|add).{0,20}\b(browser extension|chrome extension)\b/],
      ["software_install", /\b(download and install|install (?:the )?(?:app|software|package))\b/],
      ["cryptocurrency", /\b(send|pay|transfer).{0,25}\b(bitcoin|crypto|usdt|ethereum)\b/],
      ["notification", /\b(allow|enable).{0,15}\bnotifications?\b/],
      ["camera", /\b(allow|enable).{0,15}\bcamera\b/],
      ["microphone", /\b(allow|enable).{0,15}\bmicrophone\b/],
      ["location", /\b(allow|enable|share).{0,15}\blocation\b/],
      ["download", /\bdownload\b/],
    ];
    const match = patterns.find(([, pattern]) => pattern.test(text));
    if (!match) return null;
    return {
      action: ACTION_NAMES[match[0]],
      requestedInformation: [match[0]],
      classification: match[0],
      sensitive: true,
    };
  }

  function contextMismatch(classification, context) {
    const category = (context && context.pageCategory) || "unknown";
    const purpose = (context && context.pagePurpose) ||
      pageAnalysis.classifyPagePurpose(context || {}).purpose;
    if (classification === "payment") return purpose !== "checkout";
    if (classification === "banking") return !["banking", "banking_login"].includes(category);
    if (classification === "password" || classification === "otp") {
      return purpose !== "login";
    }
    if (classification === "government_id" || classification === "document_upload") {
      return purpose !== "application" && category !== "banking_login";
    }
    if (["personal_name", "email", "phone"].includes(classification)) {
      return !["contact", "newsletter", "login", "checkout", "application", "prize_entry", "prize_claim"].includes(purpose);
    }
    if (classification === "postal_address") {
      return !["checkout", "application"].includes(purpose);
    }
    if (classification === "date_of_birth") return purpose !== "application";
    if (classification === "username") return !["login", "application"].includes(purpose);
    if (classification === "cryptocurrency") return category === "government";
    return false;
  }

  function evaluateActionRisk(input) {
    const data = input || {};
    const website = data.websiteRisk || {};
    const requested = Array.from(new Set(data.requestedInformation || []))
      .filter((item) => ACTION_SEVERITY[item] !== undefined);
    const maxSeverity = requested.reduce((max, item) => Math.max(max, ACTION_SEVERITY[item]), 0);
    const classification = data.classification || requested[0] || "unknown";
    const mismatch = contextMismatch(classification, data.context || {});
    const websiteRiskScore = Number.isFinite(website.riskScore) ? website.riskScore : 0;

    let score = maxSeverity;
    if (maxSeverity > 0) score += websiteRiskScore * 0.48;
    else score += websiteRiskScore * 0.12;
    if (mismatch) score += 25;
    if (website.riskLevel === "High" && maxSeverity >= 20) score += 12;
    if (data.context && data.context.brandConflict && maxSeverity >= 20) score += 14;
    score = Math.max(0, Math.min(100, Math.round(score)));

    let actionRisk = "Low";
    if (!requested.length || !Number.isFinite(maxSeverity)) actionRisk = "Unknown";
    else if (score >= 65) actionRisk = "High";
    else if (score >= 30) actionRisk = "Medium";

    const websiteConfidence = Number.isFinite(website.confidenceScore) ? website.confidenceScore : 25;
    let confidenceScore = Math.round(
      websiteConfidence * 0.6 +
      (requested.length ? 25 : 0) +
      (data.context && data.context.pageCategory && data.context.pageCategory !== "unknown" ? 10 : 0)
    );
    confidenceScore = Math.max(0, Math.min(100, confidenceScore));

    const actionName = pageAnalysis.compactText(data.action, 120) || ACTION_NAMES[classification] || "This action";
    const reasons = [];
    if (maxSeverity >= 30) reasons.push(`${actionName} involves highly sensitive information or access`);
    else if (maxSeverity > 0) reasons.push(`${actionName} involves a sensitive action`);
    if (mismatch) reasons.push("the request does not match the apparent purpose of this page");
    if (website.riskLevel === "High") reasons.push("the current website assessment has high-risk indicators");
    else if (website.riskLevel === "Medium") reasons.push("the current website assessment has some risk indicators");
    if (data.context && data.context.brandConflict) reasons.push("the website identity conflicts with the organisation it appears to represent");

    let recommendation = "Check the page and domain before continuing.";
    if (actionRisk === "High") {
      recommendation = "Do not continue until you verify the website through the organisation's official app or a web address you type yourself.";
    } else if (actionRisk === "Medium") {
      recommendation = "Pause and verify that this information is expected on this page before continuing.";
    }

    const triggeredSignals = [
      ...requested.map((item) => `action:${item}`),
      ...(mismatch ? ["context:mismatch"] : []),
      ...(website.riskLevel ? [`website:${String(website.riskLevel).toLowerCase()}`] : []),
      ...(data.context && data.context.brandConflict ? ["identity:conflict"] : []),
    ];

    return {
      actionRisk,
      riskScore: score,
      confidenceScore,
      reason: reasons.length
        ? `${reasons.join("; ")}.`
        : "There is not enough evidence to assess this action.",
      recommendation,
      triggeredSignals,
      shouldWarn: actionRisk === "High" && maxSeverity >= 20,
    };
  }

  return {
    detectSensitiveAction,
    evaluateActionRisk,
    contextMismatch,
  };
});
