"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const suggestions = require("../Frontend/lib/suggestions.js");

function ecommerceContext() {
  return {
    url: "https://shop.example/products/laptops",
    title: "Laptop Computers",
    pageCategory: "ecommerce",
    headings: ["Laptop Computers", "Filter by Brand"],
    navigation: [{ text: "Products", targetType: "navigation", id: "products" }],
    buttons: [{ text: "Compare", targetType: "button", id: "compare" }],
    links: [
      { text: "Shopping Cart", targetType: "link", id: "cart" },
      { text: "Delivery Information", targetType: "link", id: "delivery" },
      { text: "Returns", targetType: "link", id: "returns" },
    ],
    forms: [{ type: "search", labels: ["Search products"], fields: [] }],
  };
}

test("context-aware suggestions are page relevant, real-targeted, and not HDB-specific", () => {
  const result = suggestions.localSuggestions(ecommerceContext());
  assert.equal(result.length >= 3 && result.length <= 5, true);
  assert.equal(result.some((item) => /cart/i.test(item.label)), true);
  assert.equal(result.some((item) => /housing|hdb|cpf/i.test(item.label)), false);
  assert.equal(
    result.filter((item) => !["explanation", "section"].includes(item.targetType))
      .every((item) => item.targetText),
    true
  );
});

test("HDB pages retain useful support without globally hardcoded suggestions", () => {
  const result = suggestions.localSuggestions({
    url: "https://www.hdb.gov.sg/residential/buying-a-flat",
    title: "Buying a Flat",
    pageCategory: "government",
    links: [
      { text: "Flat eligibility", targetType: "link" },
      { text: "Resale Flats", targetType: "link" },
      { text: "Contact Us", targetType: "link" },
    ],
  });
  assert.equal(result.some((item) => /eligibility/i.test(item.label)), true);
  assert.equal(result.some((item) => /resale/i.test(item.label)), true);
});

test("suggestion validation removes duplicates and sensitive actions", () => {
  const context = ecommerceContext();
  const result = suggestions.validateSuggestions([
    {
      id: "one", label: "View the shopping cart", intent: "View the shopping cart",
      targetType: "link", targetText: "Shopping Cart", confidence: 0.9,
    },
    {
      id: "two", label: "View the shopping cart", intent: "Duplicate",
      targetType: "link", targetText: "Shopping Cart", confidence: 0.9,
    },
    {
      id: "three", label: "Enter your credit card", intent: "Submit credit card details",
      targetType: "form", targetText: "Checkout", confidence: 0.9,
    },
  ], context);
  assert.equal(result.length, 1);
});

test("unmatched executable suggestions are downgraded to chatbot explanations", () => {
  const [result] = suggestions.validateSuggestions([{
    id: "invented",
    label: "Open rewards",
    intent: "Open rewards",
    targetType: "link",
    targetText: "Rewards that are not present",
    confidence: 0.95,
  }], ecommerceContext());
  assert.equal(result.targetType, "explanation");
  assert.equal(result.confidence < 0.7, true);
});

test("low-information pages use neutral fallback suggestions", () => {
  const result = suggestions.localSuggestions({ url: "https://empty.example/" });
  assert.equal(result.length >= 2, true);
  assert.equal(result.some((item) => item.label === "Explain this page"), true);
  assert.equal(result.some((item) => /hdb|housing|cpf/i.test(item.label)), false);
});

test("suggestion cache expires and separates keys", () => {
  let now = 1000;
  const cache = new suggestions.SuggestionCache({ ttlMs: 100, now: () => now });
  cache.set("route-a:fingerprint-a", ["a"]);
  assert.deepEqual(cache.get("route-a:fingerprint-a"), ["a"]);
  assert.equal(cache.get("route-b:fingerprint-a"), null);
  now = 1200;
  assert.equal(cache.get("route-a:fingerprint-a"), null);
});
