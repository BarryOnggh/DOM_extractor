"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const frontend = path.resolve(__dirname, "../Frontend");

test("live side panel restores the original HDB and CPF suggestion chips", () => {
  const html = fs.readFileSync(path.join(frontend, "sidepanel.html"), "utf8");
  assert.match(html, /Apply for housing grant/);
  assert.match(html, /Check CPF balance/);
  assert.match(html, /data-goal="I want to apply for a housing grant"/);
  assert.match(html, /data-goal="I want to log in to check my CPF balance"/);
  assert.match(html, /id="suggestionRow"/);
});

test("DOM scanner does not collect input values", () => {
  const source = fs.readFileSync(path.join(frontend, "content.js"), "utf8");
  const scanner = source.slice(source.indexOf("function scanDOM"), source.indexOf("function visibleText"));
  assert.doesNotMatch(scanner, /\bentry\.value\b/);
  assert.doesNotMatch(scanner, /\bvalue:\s*el\.value\b/);
  assert.doesNotMatch(scanner, /options\s*\[\s*el\.selectedIndex\s*\]/);
  assert.match(scanner, /sensitive_kind/);
});

test("manifest adds no new permissions for trust analysis", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(frontend, "manifest.json"), "utf8"));
  assert.deepEqual(
    manifest.permissions,
    ["sidePanel", "activeTab", "scripting", "storage", "tabs", "offscreen", "microphone"]
  );
});

test("Security Mode persists, gates automatic scans, and page loads make no suggestion POST", () => {
  const html = fs.readFileSync(path.join(frontend, "sidepanel.html"), "utf8");
  const sidepanel = fs.readFileSync(path.join(frontend, "sidepanel.js"), "utf8");
  const content = fs.readFileSync(path.join(frontend, "content.js"), "utf8");

  assert.match(html, /id="securityModeToggle"[^>]*role="switch"/);
  assert.match(sidepanel, /securityModePreference/);

  assert.doesNotMatch(sidepanel, /fetch\(`\$\{API_URL\}\/api\/suggestions/);
  assert.match(sidepanel, /renderSuggestions\(ORIGINAL_SUGGESTIONS\)/);

  const schedule = content.slice(
    content.indexOf("function scheduleAnalysis"),
    content.indexOf("window.addEventListener(\"hashchange\"")
  );
  assert.match(schedule, /!securityPreferenceReady \|\| !securityModeEnabled/);
  assert.match(content, /securityModeEnabled\s*\?\s*analysePage/);
});
