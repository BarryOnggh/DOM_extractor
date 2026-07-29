"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const page = require("../Frontend/lib/page-analysis.js");

test("URL signal extraction detects suspicious address patterns", () => {
  const ip = page.extractUrlSignals("http://192.0.2.8/verify/account");
  assert.equal(ip.https, false);
  assert.equal(ip.isIpHostname, true);
  assert.equal(ip.suspiciousTermCount > 0, true);

  const encoded = page.extractUrlSignals("https://a.b.c.d.e.example.xyz/%76%65%72%69%66%79");
  assert.equal(encoded.excessiveSubdomains, true);
  assert.equal(encoded.hasObfuscatedCharacters, true);
  assert.equal(encoded.unusualTld, true);

  assert.equal(page.extractUrlSignals("https://xn--pple-43d.example/login").hasPunycode, true);
});

test("sanitised URLs remove queries, fragments with tokens, email addresses, and identifiers", () => {
  const safe = page.sanitizeUrl(
    "https://example.com/account?token=secret&email=person@example.com#session=abc"
  );
  assert.equal(safe, "https://example.com/account");
  assert.equal(page.sanitizeUrl("https://example.com/#/courses"), "https://example.com/#/courses");
  assert.equal(
    page.redactSensitiveText("Email person@example.com, OTP: 123456, NRIC S1234567A"),
    "Email [email], OTP [redacted], NRIC [identifier]"
  );
});

test("sensitive field classification uses metadata and never needs values", () => {
  assert.equal(page.classifySensitiveField({ type: "password", value: "secret" }), "password");
  assert.equal(page.classifySensitiveField({ autocomplete: "one-time-code" }), "otp");
  assert.equal(page.classifySensitiveField({ label: "CVV", type: "text" }), "payment");
  assert.equal(page.classifySensitiveField({ type: "file", label: "Upload passport" }), "government_id");
  assert.equal(page.classifySensitiveField({ type: "search", label: "Search courses" }), "none");
});

test("field-purpose classification identifies personal information without reading values", () => {
  assert.equal(page.classifyFieldPurpose({ autocomplete: "name" }), "personal_name");
  assert.equal(page.classifyFieldPurpose({ type: "tel", label: "Mobile number" }), "phone");
  assert.equal(page.classifyFieldPurpose({ autocomplete: "street-address" }), "postal_address");
  assert.equal(page.classifyFieldPurpose({ label: "Date of birth" }), "date_of_birth");
  assert.equal(page.classifyFieldPurpose({ label: "Voucher code" }), "claim_code");
  assert.equal(page.classifyFieldPurpose({ type: "search", label: "Search courses" }), "search_query");
});

test("page context sanitisation drops all field values", () => {
  const context = page.sanitizePageContext({
    url: "https://example.com/login?session=secret",
    title: "Login",
    visibleText: ["Signed in as person@example.com with account 1234 5678 9012"],
    forms: [{
      type: "form",
      fields: [{
        type: "password",
        label: "Password",
        value: "DO-NOT-COLLECT",
      }],
    }],
  });
  const serialised = JSON.stringify(context);
  assert.equal(serialised.includes("DO-NOT-COLLECT"), false);
  assert.equal(serialised.includes("session=secret"), false);
  assert.equal(serialised.includes("person@example.com"), false);
  assert.equal(serialised.includes("1234 5678 9012"), false);
  assert.equal(context.forms[0].fields[0].classification, "password");
  assert.equal(context.forms[0].fields[0].dataKind, "password");
});

test("page purpose and quality checks recognise government voucher and prize contexts", () => {
  const voucher = {
    url: "https://voucher-help.example/redeem",
    hostname: "voucher-help.example",
    title: "Governement voucher redemtion",
    headings: ["Claim your public benefit"],
    pageCategory: "government",
  };
  assert.equal(page.classifyPagePurpose(voucher).purpose, "government_voucher");
  assert.equal(page.detectContentQuality(voucher).identityTypoCount, 2);
  assert.equal(page.isRecognizedGovernmentHostname("service.gov.sg"), true);
  assert.equal(page.isRecognizedGovernmentHostname("agency.gov"), true);
  assert.equal(page.isRecognizedGovernmentHostname("gov-voucher.example"), false);
  assert.equal(page.classifyPagePurpose({
    title: "You won our lucky draw",
    headings: ["Claim your prize"],
  }).purpose, "prize_claim");
});

test("page-category classification covers major sites and Southeast Asian text", () => {
  assert.equal(page.classifyPage({
    title: "Checkout",
    headings: ["Order summary", "Billing address"],
  }), "ecommerce_checkout");
  assert.equal(page.classifyPage({
    title: "University Admissions",
    headings: ["Courses", "Academic Calendar"],
  }), "university");
  assert.equal(page.classifyPage({
    title: "大学课程",
    headings: ["学生服务"],
  }), "university");
  assert.equal(page.classifyPage({
    title: "Online Banking Login",
    forms: [{ fields: [{ type: "password", label: "Password" }] }],
  }), "banking_login");
  assert.equal(page.classifyPage({
    title: "Latest article about PayPal",
    visibleText: ["This news article discusses payment providers."],
  }), "article");
});

test("cache keys invalidate on SPA route and meaningful content changes", () => {
  const base = {
    url: "https://university.example/#/courses",
    title: "Courses",
    headings: ["Undergraduate courses"],
  };
  assert.notEqual(
    page.createCacheKey(base),
    page.createCacheKey({ ...base, url: "https://university.example/#/admissions" })
  );
  assert.notEqual(
    page.createCacheKey(base),
    page.createCacheKey({ ...base, headings: ["Postgraduate courses"] })
  );
});
