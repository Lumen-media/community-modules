# Lumen Community Modules

The catalog (index) for the **Lumen store** — the app reads this file to render its marketplace. It is a single `modules.json` plus the assets needed to render a rich listing. **No module binaries live here** — every entry points to the author's own GitHub repo, from where the Lumen app downloads the `.lumenpack` from that repo's latest release.

Licensed **CC0-1.0** (data catalog). Third-party assets (icons/covers) keep their contributors' own licenses.

## How it works

- `modules.json` — the catalog (single source of truth).
- `schema.json` — JSON Schema for `modules.json` (used by CI + the Lumen app to reject catalogs it doesn't understand).
- `icons/<id>/` — icon assets referenced by the catalog (optional).
- `covers/<id>/` — optional hero/cover images for detail pages.
- CI validates every PR against the schema before merge.

The catalog is **metadata only**; module permissions, descriptions and READMEs come from the author's repo, not here.

## Adding or updating a module

1. **Pack & build** your module (`@lumen/module-build`), yielding a `.lumenpack`.
2. **Publish a GitHub Release** on *your own* repo: tag `v<semver>`, attach `<id>-<version>.lumenpack`.
3. **Open a pull request** in the [community-modules](https://github.com/Lumen-media/community-modules) repo adding (or updating) your entry in `modules.json`:

```jsonc
{
  "id": "com.example.raffle",                    // must match the module's manifest.json id (reverse-DNS, unique)
  "name": "Raffle",
  "tagline": "Quick draws during live events.",  // one line, shown in the catalog row
  "description": "Longer markdown description shown on the detail page.",
  "tags": ["utility", "engagement"],
  "author": { "name": "Gabriel Santos", "url": "https://github.com/gabrielSantos1101" },
  "license": "MIT",                               // SPDX identifier
  "repo": "gabrielSantos1101/lumen-raffle",       // where the app resolves releases from
  "icon": "icons/com.example.raffle/icon.svg",    // optional
  "cover": "covers/com.example.raffle/cover.png",  // optional
  "status": "approved",
  "approvedAt": "2026-01-10T00:00:00Z"            // ISO-8601
}
```

> `lumenVerified: true` is an optional field **granted by the Lumen team** during review — it renders a "Verified by Lumen" badge. Do not include it on your own; it is added/kept only with Lumen's approval.

4. **Run the validation locally** (optional, CI does it too):

```bash
node scripts/validate.mjs modules.json
```

5. A maintainer reviews and merges. Merging **is** approval.

## Localized README (optional)

The detail page renders the README from your repo root. To offer it in more languages, add one file per language at the **root of your module repo** (a convention defined by Lumen, not a GitHub feature):

```
README.md            ← canonical (English or your language)
README.pt-BR.md      ← optional
README.ja.md         ← optional
```

The Lumen app serves the variant matching its active locale and falls back to `README.md` when the language has no file. No selector or links needed.

## Notes

- **Rate limits:** the app caches release metadata (TTL 1h) and only hits the API when needed. Screenshots are best placed inside your README rather than as catalog fields.
- **Review bar:** entries are accepted by PR review. Registering a module is a statement that the module runs reasonably and that you own its assets.
- **Removals:** to flag a module for removal use a comment on the issue tracker; `removed`/`deprecated` statuses are reserved for future moderation.

## License

The catalog data in this repository is CC0-1.0 (public domain). See [LICENSE](./LICENSE).