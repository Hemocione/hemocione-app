#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const repoRoot = resolve(process.argv[2] ?? process.cwd());
const assetRoot = join(repoRoot, "public", "illustrations", "avatarItems");
const expectedViewBoxes = new Map([
  ["corpo", "0 0 712 670"],
  ["acessorios", "0 0 1200 1200"],
]);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : path.endsWith(".svg") ? [path] : [];
  });
}

if (!statSync(assetRoot, { throwIfNoEntry: false })) {
  console.error(`Asset directory not found: ${assetRoot}`);
  process.exit(1);
}

const files = walk(assetRoot).sort();
const errors = [];
const warnings = [];
const legacyFolders = new Set(["body", "head", "face"]);

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const rel = relative(assetRoot, file);
  const [folder] = rel.split("/");
  const viewBox = source.match(/\bviewBox\s*=\s*["']([^"']+)["']/i)?.[1];

  if (!viewBox) errors.push(`${rel}: missing viewBox`);
  if (!source.includes("<svg")) errors.push(`${rel}: missing svg root`);
  if (/<image\b/i.test(source)) errors.push(`${rel}: nested image references are not allowed`);
  if (legacyFolders.has(folder)) warnings.push(`${rel}: retired legacy folder; use canonical slot folders`);

  const expected = expectedViewBoxes.get(folder);
  if (expected && viewBox !== expected) {
    errors.push(`${rel}: expected viewBox ${expected}, got ${viewBox ?? "missing"}`);
  }
}

const canonicalCount = files.filter((file) => !legacyFolders.has(relative(assetRoot, file).split("/")[0])).length;
console.log(`Checked ${files.length} SVG assets (${canonicalCount} canonical).`);

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);

if (errors.length) process.exit(1);
console.log("Avatar asset validation passed.");
