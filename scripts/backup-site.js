/**
 * File: scripts/backup-site.js
 * Version: v1.0
 * Updated: 2026-04-19 [Europe/Istanbul]
 * Status: READY FOR CINENTO-SITE
 */

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const backupRoot = "C:\\CINENTO_BACKUPS\\cinento_site";

const INCLUDE_PATHS = [
  "app",
  "components",
  "lib",
  "public",
  "styles",
  "messages",
  "content",
  "app/data",
  "app/api",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.js",
  "next.config.mjs",
  "postcss.config.js",
  "tailwind.config.js",
  ".env",
  ".env.local",
  "middleware.ts",
  "proxy.ts"
];

const EXCLUDE_NAMES = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "coverage",
  "__pycache__",
  "backups"
]);

function timestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function existsSafe(targetPath) {
  try {
    return fs.existsSync(targetPath);
  } catch {
    return false;
  }
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    ensureDir(dest);
    const items = fs.readdirSync(src);

    for (const item of items) {
      if (EXCLUDE_NAMES.has(item)) continue;

      const srcItem = path.join(src, item);
      const destItem = path.join(dest, item);
      copyRecursive(srcItem, destItem);
    }
    return;
  }

  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function cleanupOldBackups(maxKeep = 7) {
  if (!fs.existsSync(backupRoot)) return;

  const entries = fs.readdirSync(backupRoot)
    .map((name) => ({
      name,
      fullPath: path.join(backupRoot, name),
      stat: fs.statSync(path.join(backupRoot, name))
    }))
    .filter((x) => x.stat.isDirectory())
    .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);

  const oldOnes = entries.slice(maxKeep);

  for (const item of oldOnes) {
    fs.rmSync(item.fullPath, { recursive: true, force: true });
    console.log(`Deleted old backup: ${item.name}`);
  }
}

function runBackup() {
  ensureDir(backupRoot);

  const backupFolderName = `backup_${timestamp()}`;
  const backupFolder = path.join(backupRoot, backupFolderName);
  ensureDir(backupFolder);

  console.log(`Creating backup: ${backupFolderName}`);

  for (const relativePath of INCLUDE_PATHS) {
    const src = path.join(projectRoot, relativePath);

    if (!existsSafe(src)) {
      continue;
    }

    const dest = path.join(backupFolder, relativePath);
    copyRecursive(src, dest);
    console.log(`Copied: ${relativePath}`);
  }

  cleanupOldBackups(7);

  console.log("Backup completed successfully.");
  console.log(`Saved in: ${backupFolder}`);
}

try {
  runBackup();
} catch (error) {
  console.error("Backup failed:");
  console.error(error);
  process.exit(1);
}