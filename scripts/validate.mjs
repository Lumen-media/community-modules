#!/usr/bin/env node
//
// Validates modules.json against schema.json + the extra catalog rules that
// JSON Schema alone can't express in a friendly way:
//   - id uniqueness across modules
//   - id is reverse-DNS (overlaps with schema pattern, kept as a clearer error)
//   - "approved" is the only allowed status in v1 entries (statuses like
//     removed/deprecated are reserved; they mean the module should NOT be a
//     live approved entry)
//   - icon/cover paths referenced in the catalog actually exist in-repo
//
// Usage: node scripts/validate.mjs [path-to-modules.json]
// Exit code 0 = valid, 1 = invalid.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const catalogPath = process.argv[2] || 'modules.json';

let errors = [];

function err(msg) {
  errors.push(msg);
}

// ---- 1. structural checks (schema subset) -------------------------------
let catalog;
try {
  catalog = JSON.parse(readFileSync(resolve(root, catalogPath), 'utf8'));
} catch (e) {
  console.error(`✗ could not read/parse ${catalogPath}: ${e.message}`);
  process.exit(1);
}

if (catalog.schemaVersion !== 1) {
  err(`schemaVersion must be 1 (got ${JSON.stringify(catalog.schemaVersion)})`);
}
if (typeof catalog.generatedAt !== 'string' || isNaN(Date.parse(catalog.generatedAt))) {
  err('generatedAt must be an ISO-8601 date string');
}
if (!Array.isArray(catalog.modules)) {
  err('modules must be an array');
  console.error(render(errors));
  process.exit(1);
}

// ---- 2. per-module checks ------------------------------------------------
const seen = new Set();

for (const [i, m] of catalog.modules.entries()) {
  const where = `modules[${i}] (${m?.id ?? '<missing id>'})`;

  // required fields (mirror schema.json "required")
  for (const f of ['id', 'name', 'tagline', 'description', 'tags', 'author', 'license', 'repo', 'status', 'approvedAt']) {
    if (m[f] === undefined) err(`${where}: missing required field "${f}"`);
  }
  if (m.author && (m.author.name === undefined || m.author.url === undefined)) {
    err(`${where}: author requires both name and url`);
  }
  if (m.tags !== undefined && !Array.isArray(m.tags)) {
    err(`${where}: tags must be an array`);
  }

  if (typeof m.id === 'string') {
    if (seen.has(m.id)) err(`${where}: duplicate id "${m.id}"`);
    seen.add(m.id);
    if (!/^[a-z0-9]+(\.[a-z0-9]+)+$/.test(m.id)) {
      err(`${where}: id must be reverse-DNS (e.g. com.example.my-module)`);
    }
  }

  if (typeof m.repo === 'string' && !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(m.repo)) {
    err(`${where}: repo must be of the form owner/repo`);
  }

  if (m.status !== undefined && m.status !== 'approved') {
    err(`${where}: status must be "approved" in v1 — "${m.status}" is reserved for future moderation`);
  }

  if (typeof m.approvedAt === 'string' && isNaN(Date.parse(m.approvedAt))) {
    err(`${where}: approvedAt must be an ISO-8601 date string`);
  }

  if (m.lumenVerified !== undefined && typeof m.lumenVerified !== 'boolean') {
    err(`${where}: lumenVerified must be a boolean`);
  }

  for (const field of ['icon', 'cover']) {
    if (typeof m[field] === 'string') {
      if (!existsSync(resolve(root, m[field]))) {
        err(`${where}: ${field} references "${m[field]}" but that file does not exist`);
      }
    } else if (m[field] !== undefined) {
      err(`${where}: ${field} must be a string path`);
    }
  }
}

// ---- 3. multiple exits (valid / invalid) ---------------------------------
function render(list) {
  return list.length ? list.join('\n') + '\n' : '';
}

if (errors.length) {
  console.error(`Validation failed for ${catalogPath} (${errors.length} error${errors.length > 1 ? 's' : ''}):`);
  console.error(render(errors));
  process.exit(1);
}

console.log(`✓ ${catalogPath} is valid`);