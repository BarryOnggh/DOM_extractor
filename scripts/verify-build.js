"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const frontend = path.join(root, "Frontend");
const manifestPath = path.join(frontend, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const referencedFiles = [
  manifest.background && manifest.background.service_worker,
  manifest.side_panel && manifest.side_panel.default_path,
  ...(manifest.content_scripts || []).flatMap((entry) => entry.js || []),
].filter(Boolean);

for (const relative of referencedFiles) {
  const absolute = path.join(frontend, relative);
  if (!fs.existsSync(absolute)) throw new Error(`Manifest references missing file: ${relative}`);
}

const scripts = [
  "background.js",
  "content.js",
  "sidepanel.js",
  "offscreen.js",
  "mic_permission.js",
  "lib/page-analysis.js",
  "lib/suggestions.js",
  "lib/trust.js",
  "lib/action-risk.js",
];

for (const relative of scripts) {
  const source = fs.readFileSync(path.join(frontend, relative), "utf8");
  new vm.Script(source, { filename: relative });
}

const html = fs.readFileSync(path.join(frontend, "sidepanel.html"), "utf8");
for (const relative of ["sidepanel.css", "lib/page-analysis.js", "lib/suggestions.js", "sidepanel.js"]) {
  if (!html.includes(relative)) throw new Error(`Side panel is missing required asset: ${relative}`);
}
if (!/Apply for housing grant/.test(html) || !/Check CPF balance/.test(html)) {
  throw new Error("The original HDB/CPF suggestion chips are missing.");
}

const content = fs.readFileSync(path.join(frontend, "content.js"), "utf8");
const scanSource = content.slice(content.indexOf("function scanDOM"), content.indexOf("function visibleText"));
if (/\bentry\.value\b/.test(scanSource)) {
  throw new Error("The DOM scanner must not collect form values.");
}

console.log(`GovAssist verification passed (${process.argv[2] || "check"}).`);
