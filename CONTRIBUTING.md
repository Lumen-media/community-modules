# Contributing to Lumen Community Modules

Thanks for publishing a module. This repo is small and review is quick — here's everything you need for a smooth PR.

## Quick checklist

- [ ] `id` is reverse-DNS (`com.<you>.<module>`) and **exactly matches** the `manifest.json` `id` inside your `.lumenpack`.
- [ ] `repo` points to your repo (`owner/repo`) and the app can find a **latest release** with a `.lumenpack` attached.
- [ ] `schemaVersion: 1` and all required fields present (CI checks).
- [ ] Real `tagline` (one line) + `description` (markdown) — the store list and detail page show these.
- [ ] Icon/cover paths, if given, exist in-repo and match a module you own.
- [ ] (Optional) localized README variants at your repo root (`README.pt-BR.md`, etc.) following the Lumen naming convention.

## Review process

- Open a PR adding or updating your entry. CI runs `node scripts/validate.mjs` automatically.
- A maintainer reviews the entry (id uniqueness, metadata quality, asset ownership) and merges.
- Merging = the module is **approved** and appears in the store.
- Update a module in a new PR whenever you release a new version (bump `approvedAt`, adjust description/tags). `lumenVerified` is granted by Lumen only.

## Assets

- Icons/covers **may** live in this repo (`icons/<id>/`, `covers/<id>/`). By submitting them you confirm you own/have rights to the assets and that they may be published here.
- The repo's CC0 license covers the catalog *data*, not third-party assets — contributors keep their own copyright on icons/covers.

## Issues & removals

- Report catalog problems (bad entry, broken repo) in the Issues tab.
- To flag a module for removal, open an issue: maintainers will handle the moderation status.