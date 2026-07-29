"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const trust = require("../Frontend/lib/trust.js");
const actionRisk = require("../Frontend/lib/action-risk.js");

function evidence(overrides) {
  return {
    pageContext: {
      url: "https://information.example/about",
      title: "Public Information",
      pageCategory: "informational",
      headings: ["About this service"],
      visibleText: ["This established informational page explains a public service."],
      links: [{ text: "Contact Us", targetType: "link" }],
      forms: [],
    },
    sensitiveFields: [],
    mixedContentCount: 0,
    redirectCount: 0,
    popupCount: 0,
    permissionsRequested: [],
    ...overrides,
  };
}

test("established informational website has low local risk without a safety guarantee", () => {
  const result = trust.assessTrust(evidence());
  assert.equal(result.riskLevel, "Low");
  assert.equal(result.riskScore, 0);
  assert.match(result.summary, /not a guarantee/i);
  assert.equal(result.confidenceScore >= 40, true);
});

test("normal ecommerce checkout does not treat expected payment fields as suspicious", () => {
  const result = trust.assessTrust(evidence({
    pageContext: {
      url: "https://shop.example/checkout",
      title: "Checkout",
      pageCategory: "ecommerce_checkout",
      headings: ["Order summary", "Billing address"],
      forms: [],
    },
    sensitiveFields: [{ classification: "payment", disabled: false }],
  }));
  assert.equal(result.riskLevel, "Low");
  assert.equal(result.contributingSignals.some((item) => item.id === "financial-information-request" && item.status === "critical"), false);
});

test("new lookalike domain requesting a password triggers combination scoring", () => {
  const input = evidence({
    pageContext: {
      url: "https://paypa1-example.xyz/login",
      title: "PayPal Login",
      pageCategory: "login",
      headings: ["Log in to PayPal"],
      forms: [],
    },
    sensitiveFields: [{ classification: "password", disabled: false }],
    domainAgeDays: 12,
    brandSimilarity: {
      suspectedBrand: "PayPal",
      similarityScore: 0.91,
      contextStrength: 0.9,
      isOfficialDomain: false,
    },
  });
  const signals = trust.collectTrustSignals(input);
  const result = trust.assessTrust(input);
  assert.equal(trust.combinationBonus(signals) >= 14, true);
  assert.equal(result.riskLevel, "High");
  assert.equal(result.riskScore >= 65, true);
});

test("blog requesting payment is risky and its action warning is high", () => {
  const website = trust.assessTrust(evidence({
    pageContext: {
      url: "https://blog.example/article",
      title: "Travel tips article",
      pageCategory: "article",
      headings: ["Travel tips"],
      forms: [],
    },
    sensitiveFields: [{ classification: "payment", disabled: false }],
  }));
  assert.equal(website.riskLevel === "Medium" || website.riskLevel === "High", true);
  const action = actionRisk.evaluateActionRisk({
    websiteRisk: website,
    action: "Submit credit card",
    requestedInformation: ["payment"],
    classification: "payment",
    context: { pageCategory: "article" },
  });
  assert.equal(action.actionRisk, "High");
  assert.equal(action.shouldWarn, true);
});

test("government-themed page requesting cryptocurrency is high risk", () => {
  const result = trust.assessTrust(evidence({
    pageContext: {
      url: "https://benefit.example/claim",
      title: "Government benefit claim",
      pageCategory: "government",
      headings: ["Claim your benefit"],
      forms: [],
    },
    requestsCrypto: true,
    governmentBranding: true,
  }));
  assert.equal(result.riskLevel, "High");
});

test("misspelled government voucher page requesting personal data is high risk with strong confidence", () => {
  const pageContext = {
    url: "https://voucher-redemption.example/claim",
    title: "Governement Voucher Redemtion",
    pageCategory: "government",
    headings: ["Claim your public voucher"],
    visibleText: ["Enter the details below to redeem your government benefit."],
    buttons: [{ text: "Redeem voucher", targetType: "button" }],
    forms: [{
      type: "form",
      labels: ["Full name", "Email address", "Mobile number"],
      fields: [
        { type: "text", label: "Full name", classification: "none", dataKind: "personal_name", disabled: false },
        { type: "email", label: "Email address", classification: "email", dataKind: "email", disabled: false },
        { type: "tel", label: "Mobile number", classification: "none", dataKind: "phone", disabled: false },
      ],
    }],
  };
  const result = trust.assessTrust(evidence({
    pageContext,
    sensitiveFields: pageContext.forms[0].fields,
    governmentBranding: true,
  }));
  assert.equal(result.riskLevel, "High");
  assert.equal(result.riskScore >= 65, true);
  assert.equal(result.confidenceScore >= 70, true);
  assert.equal(result.contributingSignals.some((item) => item.id === "questionable-personal-data-request"), true);
  assert.equal(result.contributingSignals.some((item) => item.id === "identity-spelling-errors"), true);
  assert.equal(result.contributingSignals.some((item) => item.id === "government-domain-mismatch"), true);
});

test("spelling error alone remains a supporting clue instead of proof of fraud", () => {
  const result = trust.assessTrust(evidence({
    pageContext: {
      url: "https://community.example/news",
      title: "Community eligiblity update",
      pageCategory: "informational",
      headings: ["Programme update"],
      visibleText: ["Read the latest information about the community programme."],
      forms: [],
    },
  }));
  assert.equal(result.riskLevel, "Low");
  assert.equal(result.contributingSignals.some((item) => item.id === "identity-spelling-errors"), true);
});

test("official government application can reasonably request identity documents", () => {
  const fields = [
    { type: "text", label: "NRIC", classification: "government_id", dataKind: "government_id", disabled: false },
    { type: "file", label: "Supporting document", classification: "document_upload", dataKind: "document_upload", disabled: false },
  ];
  const result = trust.assessTrust(evidence({
    pageContext: {
      url: "https://service.gov.sg/application",
      title: "Government permit application",
      pageCategory: "government",
      headings: ["Apply for a permit"],
      forms: [{ type: "form", labels: ["NRIC", "Supporting document"], fields }],
    },
    sensitiveFields: fields,
    governmentBranding: true,
  }));
  assert.equal(result.riskLevel, "Low");
  assert.equal(result.contributingSignals.some((item) => item.id === "unnecessary-sensitive-fields"), false);
  assert.equal(result.contributingSignals.some((item) => item.id === "government-domain-mismatch"), false);
});

test("normal lucky-draw entry details differ from dangerous prize-claim fields", () => {
  const entryFields = [
    { type: "text", label: "Full name", classification: "none", dataKind: "personal_name", disabled: false },
    { type: "email", label: "Email", classification: "email", dataKind: "email", disabled: false },
    { type: "tel", label: "Phone", classification: "none", dataKind: "phone", disabled: false },
  ];
  const entry = trust.assessTrust(evidence({
    pageContext: {
      url: "https://community.example/lucky-draw",
      title: "Community lucky draw",
      pageCategory: "informational",
      headings: ["Enter the lucky draw"],
      forms: [{ type: "form", labels: ["Full name", "Email", "Phone"], fields: entryFields }],
    },
    sensitiveFields: entryFields,
  }));
  assert.equal(entry.riskLevel, "Low");
  assert.equal(entry.contributingSignals.some((item) => item.id === "questionable-personal-data-request"), false);

  const claimFields = [
    { type: "text", label: "Full name", classification: "none", dataKind: "personal_name", disabled: false },
    { type: "text", label: "Bank account number", classification: "banking", dataKind: "banking", disabled: false },
  ];
  const claim = trust.assessTrust(evidence({
    pageContext: {
      url: "https://winner.example/claim",
      title: "You won our lucky draw",
      pageCategory: "informational",
      headings: ["Claim your prize now"],
      forms: [{ type: "form", labels: ["Full name", "Bank account number"], fields: claimFields }],
    },
    sensitiveFields: claimFields,
  }));
  assert.equal(claim.riskLevel, "High");
  assert.equal(claim.contributingSignals.some((item) => item.id === "unnecessary-sensitive-fields"), true);
});

test("personal-data actions are checked against purpose before warning", () => {
  const detected = actionRisk.detectSensitiveAction({ type: "text", label: "Full name" });
  assert.equal(detected.classification, "personal_name");

  const suspicious = actionRisk.evaluateActionRisk({
    websiteRisk: { riskLevel: "High", riskScore: 72, confidenceScore: 84 },
    action: detected.action,
    requestedInformation: detected.requestedInformation,
    classification: detected.classification,
    context: { pageCategory: "government", pagePurpose: "government_voucher" },
  });
  assert.equal(suspicious.actionRisk, "High");
  assert.equal(suspicious.shouldWarn, true);
  assert.equal(suspicious.triggeredSignals.includes("context:mismatch"), true);

  const normalEntry = actionRisk.evaluateActionRisk({
    websiteRisk: { riskLevel: "Low", riskScore: 0, confidenceScore: 80 },
    action: detected.action,
    requestedInformation: detected.requestedInformation,
    classification: detected.classification,
    context: { pageCategory: "informational", pagePurpose: "prize_entry" },
  });
  assert.equal(normalEntry.actionRisk, "Low");
  assert.equal(normalEntry.shouldWarn, false);
});

test("banking login on the official domain treats a password field as expected", () => {
  const result = trust.assessTrust(evidence({
    pageContext: {
      url: "https://internet-banking.dbs.com.sg/login",
      title: "DBS Internet Banking Login",
      pageCategory: "banking_login",
      headings: ["Log in"],
      forms: [],
    },
    sensitiveFields: [{ classification: "password", disabled: false }],
    brandSimilarity: {
      suspectedBrand: "DBS",
      similarityScore: 1,
      contextStrength: 0.9,
      isOfficialDomain: true,
    },
  }));
  assert.equal(result.riskLevel, "Low");
  assert.equal(result.contributingSignals.some((item) => item.id === "brand-lookalike"), false);
});

test("immediate notification request is visible as a warning signal", () => {
  const result = trust.assessTrust(evidence({ permissionsRequested: ["notifications"] }));
  assert.equal(result.contributingSignals.some((item) => item.id === "permission-request"), true);
});

test("insufficient information is Unknown and missing data lowers confidence", () => {
  const sparse = trust.assessTrust(evidence({
    pageContext: { url: "https://empty.example/", pageCategory: "unknown", forms: [] },
  }));
  const rich = trust.assessTrust(evidence());
  assert.equal(sparse.riskLevel, "Unknown");
  assert.equal(sparse.confidenceScore < rich.confidenceScore, true);
});

test("a known brand mentioned in an article is not treated as impersonation", () => {
  const result = trust.assessTrust(evidence({
    pageContext: {
      url: "https://news.example/payments",
      title: "An article about PayPal",
      pageCategory: "article",
      headings: ["How PayPal changed online payments"],
      forms: [],
    },
    brandSimilarity: {
      suspectedBrand: "PayPal",
      similarityScore: 0.95,
      contextStrength: 0.8,
      isOfficialDomain: false,
    },
  }));
  assert.equal(result.contributingSignals.some((item) => item.id === "brand-lookalike"), false);
});

test("medium-risk site with a non-sensitive search action does not warn", () => {
  const detected = actionRisk.detectSensitiveAction({ type: "search", label: "Search this site" });
  assert.equal(detected, null);
  const result = actionRisk.evaluateActionRisk({
    websiteRisk: { riskLevel: "Medium", riskScore: 45, confidenceScore: 70 },
    action: "Search",
    requestedInformation: [],
    context: { pageCategory: "search" },
  });
  assert.equal(result.shouldWarn, false);
});

test("high-risk website and credential action are evaluated separately", () => {
  const result = actionRisk.evaluateActionRisk({
    websiteRisk: { riskLevel: "High", riskScore: 82, confidenceScore: 87 },
    action: "Enter a password",
    requestedInformation: ["password"],
    classification: "password",
    context: { pageCategory: "login", brandConflict: true },
  });
  assert.equal(result.actionRisk, "High");
  assert.equal(result.confidenceScore >= 70, true);
  assert.equal(result.shouldWarn, true);
  assert.equal(result.triggeredSignals.includes("website:high"), true);
});

test("overlapping URL warnings are not fully double counted", () => {
  const signals = [
    {
      id: "url-credentials", category: "url", status: "critical",
      weight: 34, reliability: 1, overlapGroup: "url-obfuscation",
    },
    {
      id: "obfuscated-url", category: "url", status: "warning",
      weight: 14, reliability: 1, overlapGroup: "url-obfuscation",
    },
  ];
  const score = trust.calculateRiskScore(signals);
  assert.equal(score < Math.round(34 * 1.2 + 14), true);
  assert.equal(score > 34, true);
});
