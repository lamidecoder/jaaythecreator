#!/usr/bin/env node
/**
 * fix-gitignore.js
 *
 * Adds media-inbox/ and lib/projects.new.ts to .gitignore, so your raw
 * uploaded files (already copied into public/media) and the temporary
 * snippet file never get committed to git. Safe to run more than once,
 * it checks what's already there first.
 *
 * Run once from your project root:  node fix-gitignore.js
 */

const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, ".gitignore");
const existing = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";

const linesToAdd = ["/media-inbox", "lib/projects.new.ts"];
const missing = linesToAdd.filter((line) => !existing.includes(line));

if (missing.length === 0) {
  console.log(".gitignore already has everything it needs, nothing to do.");
  process.exit(0);
}

const separator = existing.endsWith("\n") || existing === "" ? "" : "\n";
const addition =
  separator +
  "\n# media drop folder — files here get copied into public/media/work,\n" +
  "# no need to track the originals too\n" +
  missing.join("\n") +
  "\n";

fs.writeFileSync(target, existing + addition);
console.log("Updated .gitignore with: " + missing.join(", "));
