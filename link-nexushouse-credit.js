#!/usr/bin/env node
/**
 * link-nexushouse-credit.js
 *
 * Turns the "Built by NexusHouseUK" line in the footer into a link to
 * https://www.nexushousehq.com/ (opens in a new tab, like the other
 * external links in the footer).
 *
 * Safe to run more than once — if the link is already there, it just says so.
 *
 * Run from the project root:
 *   node link-nexushouse-credit.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const FOOTER_PATH = path.join(ROOT, "components", "footer.tsx");
const NEXUSHOUSE_URL = "https://www.nexushousehq.com/";

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

if (!fs.existsSync(FOOTER_PATH)) {
  fail(
    "Couldn't find components/footer.tsx in this folder.\n" +
      "  Move this script into the jaaythecreator project root (next to package.json) and run it again.",
  );
}

let src = fs.readFileSync(FOOTER_PATH, "utf8");

if (src.includes(NEXUSHOUSE_URL)) {
  console.log("• The NexusHouseUK credit is already linked to nexushousehq.com — nothing to change.");
  process.exit(0);
}

const anchor =
  '            © {new Date().getFullYear()} {site.name}. All rights reserved.\n' +
  '            <span className="mx-2 text-paper/20">·</span>\n' +
  '            Built by NexusHouseUK';

if (!src.includes(anchor)) {
  fail(
    "components/footer.tsx doesn't look like what I expected (couldn't find the " +
      "'Built by NexusHouseUK' credit line).\n" +
      "  The file may have changed since — paste me its current contents and I'll adjust the script.",
  );
}

const replacement =
  '            © {new Date().getFullYear()} {site.name}. All rights reserved.\n' +
  '            <span className="mx-2 text-paper/20">·</span>\n' +
  '            Built by{" "}\n' +
  '            <a\n' +
  `              href="${NEXUSHOUSE_URL}"\n` +
  '              target="_blank"\n' +
  '              rel="noreferrer"\n' +
  '              className="transition-colors hover:text-paper/70"\n' +
  '            >\n' +
  '              NexusHouseUK\n' +
  '            </a>';

src = src.replace(anchor, replacement);
fs.writeFileSync(FOOTER_PATH, src);

console.log("✓ Linked \"Built by NexusHouseUK\" to https://www.nexushousehq.com/ in the footer.");
console.log("\nDone — no install needed for this one, just commit and push as usual.");
