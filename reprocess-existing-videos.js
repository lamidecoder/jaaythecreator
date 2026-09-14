#!/usr/bin/env node
/**
 * reprocess-existing-videos.js
 *
 * Brings your existing video library up to the same standard as new
 * uploads: re-encodes every hero.mp4 already in public/media/work
 * with the resolution cap and improved compression, and generates a
 * poster.jpg for any that don't have one yet.
 *
 * Safe to run: each original file is renamed to hero.mp4.backup
 * before being replaced, and a video is only actually replaced if
 * the re-encoded version comes out smaller (otherwise the original
 * is kept as-is, since there'd be nothing to gain). Delete the
 * .backup files once you've confirmed everything looks right, or
 * just leave them, they won't affect the site either way.
 *
 * Run once from your project root:  node reprocess-existing-videos.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const MEDIA_WORK = path.join(__dirname, "public", "media", "work");

let ffmpegAvailable = false;
try {
  execSync("ffmpeg -version", { stdio: "ignore" });
  ffmpegAvailable = true;
} catch {
  console.log("ffmpeg isn't installed, so this can't reprocess anything. Install it first: winget install ffmpeg");
  process.exit(1);
}

if (!fs.existsSync(MEDIA_WORK)) {
  console.log("public/media/work doesn't exist, nothing to reprocess.");
  process.exit(0);
}

const folders = fs
  .readdirSync(MEDIA_WORK, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let reencoded = 0;
let alreadyEfficient = 0;
let postersAdded = 0;
let failed = 0;
let totalBefore = 0;
let totalAfter = 0;

for (const folder of folders) {
  const videoPath = path.join(MEDIA_WORK, folder, "hero.mp4");
  if (!fs.existsSync(videoPath)) continue;

  const posterPath = path.join(MEDIA_WORK, folder, "poster.jpg");
  const backupPath = path.join(MEDIA_WORK, folder, "hero.mp4.backup");
  const tempPath = path.join(MEDIA_WORK, folder, "hero.new.mp4");

  const before = fs.statSync(videoPath).size;

  try {
    execSync(
      `ffmpeg -y -i "${videoPath}" -c:v libx264 -preset fast -crf 26 -pix_fmt yuv420p -vf "scale='min(1920,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2" -c:a aac -b:a 128k -movflags +faststart "${tempPath}"`,
      { stdio: ["ignore", "ignore", "pipe"] },
    );

    const after = fs.statSync(tempPath).size;
    if (after < before && !fs.existsSync(backupPath)) {
      fs.renameSync(videoPath, backupPath);
      fs.renameSync(tempPath, videoPath);
      totalBefore += before;
      totalAfter += after;
      console.log(`${folder}: ${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024 / 1024).toFixed(1)}MB`);
      reencoded++;
    } else {
      fs.unlinkSync(tempPath);
      console.log(`${folder}: already efficient, left as-is (${(before / 1024 / 1024).toFixed(1)}MB)`);
      alreadyEfficient++;
    }

    if (!fs.existsSync(posterPath)) {
      execSync(`ffmpeg -y -ss 00:00:00.5 -i "${videoPath}" -frames:v 1 -q:v 3 "${posterPath}"`, {
        stdio: "ignore",
      });
      console.log(`  poster added`);
      postersAdded++;
    }
  } catch (err) {
    const detail = err.stderr ? err.stderr.toString().trim().split("\n").pop() : err.message.split("\n")[0];
    console.log(`${folder}: failed to reprocess, left completely untouched (${detail})`);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    failed++;
  }
}

console.log(
  `\nDone. ${reencoded} video(s) re-encoded smaller, ${alreadyEfficient} already efficient, ${postersAdded} poster(s) added, ${failed} failed.`,
);
if (totalBefore > 0) {
  const savedMB = (totalBefore - totalAfter) / 1024 / 1024;
  console.log(`Total saved: ${savedMB.toFixed(1)}MB across the re-encoded files.`);
}
if (reencoded > 0) {
  console.log(`Original files kept as hero.mp4.backup in each folder, delete those once you've checked everything looks right.`);
}
