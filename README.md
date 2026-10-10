# Backrooms x SCP Foundation — local Chinese knowledge base

A local, offline knowledge base that collects the settings of two internet-folklore universes — **The Backrooms** and the **SCP Foundation** — into structured Chinese documents, plus a playable story line built on top of them. Every entry is written from research on the real community wikis (Wikidot current version, the older Fandom version, and the Chinese branches), with version differences noted entry by entry. Terms keep their original English names with a Chinese translation alongside.

**Note: the knowledge-base prose and all in-game text are in Chinese.** This README and the source comments are the only English here.

## Playable game — 《后室·无尽回廊》 (Backrooms: The Endless Halls)

A single-file, offline text survival game / interactive fiction built on the knowledge base above.

- **To play**: open [`游戏/后室-无尽回廊.html`](游戏/后室-无尽回廊.html) in a browser by double-clicking it. No dependencies, fully offline, nothing to install.
- The screen itself corrupts as a hidden sanity value drops: scan lines, chromatic aberration, a sickly yellow tint and a vignette intensify across four tiers (`calm`, `unease`, `dread`, `broken`, defined in `游戏/src/style.css`).
- Almond water comes in four variants (grey / green / red / blue) with different effects; entity avoidance is per-level and **applying the wrong rule is fatal**.
- 10 levels and 10 endings; number keys 1-9 select choices; a CRT terminal skin; an optional fluorescent hum via WebAudio.
- Three openings: warehouse night shift / school corridor / hotel elevator (hard).
- Save system: autosave each step, manual save, export/import a save string, and a toggle to disable CRT flicker. Death clears the save.

Source and docs are in `游戏/`:

```
游戏/
  src/engine.js        pure logic (state machine, effects, RNG, sanity, saves), no DOM, unit-testable
  src/ui.js  style.css  src/index.template.html   browser layer
  src/data/            items entities orgs endings starts boot + levels/*.js
  src/engine.test.mjs  engine unit tests (node --test)
  src/lint.mjs         static check (goto targets, ending reachability, valid items, dead nodes)
  src/test.mjs         1500 random walks
  src/build.mjs        inline build -> single HTML
  build.ps1            PowerShell fallback build (no Node required)
```

Verified state of the game:

- `node src/lint.mjs` — 10 levels, 0 errors, 0 warnings.
- `node src/test.mjs` — 1500 random walks, 0 crashes, 0 dead ends, 0 walks hitting the step cap.
- `node --test src/engine.test.mjs` — 12 tests pass.

Rebuild after editing content:

```bash
node src/lint.mjs && node src/test.mjs && node src/build.mjs
```

`游戏/build.ps1` is a fallback builder that concatenates the same sources; note it contains hard-coded absolute paths from the author's machine and must be edited before use.

## Knowledge base

Two universes, same origin but independent: both began as community writing on 4chan's /x/ board, and The Backrooms borrowed the SCP collaborative-wiki model and the "liminal space" motif (notably SCP-3008, the infinite IKEA), but there is no official crossover canon — "the Foundation contains the Backrooms" is fan work. See `后室/00-起源与发展史.md` and `后室/00-渊源-与SCP的关系.md`.

Research method: the Wikidot current version is treated as the most authoritative baseline, cross-checked against the older Fandom version, Miraheze and the Chinese community. Conflicting numbering is labelled "version difference"; anything not found on a mainstream wiki is stated as such rather than invented.

### Directory structure

```
后室/                                  The Backrooms
  00-起源与发展史.md                    origin and spread of The Backrooms
  00-渊源-与SCP的关系.md                shared roots with, and divergence from, SCP
  STORYLINE.md                         main story line (306 lines)
  探险叙事-无尽回廊.md                   first-person playable novella (515 lines)
  层级/                                 Levels — 63 detail files + 00-层级总表.md index
  实体/                                 Entities — 16 files
  组织/                                 Groups/factions — 8 files + overview + a provenance note
  物品/                                 Items/resources — 4 files + overview

SCP基金会/                             SCP Foundation
  00-世界观与机制.md                    containment classes, facilities, MTF, O5, amnestics
  GoI-关注组织.md                       groups of interest
  Canon-世界线.md                       the "no single canon" principle and famous canons
  条目/                                 SCP entries — 16 detail files + 00-条目总表.md index
```

Every level and SCP entry uses the same section layout: overview / description and environment / survival difficulty (or containment procedures) / entities / entrances and exits / survival guide / trivia and version differences / sources. Each category's `00-*` file is its index and is the recommended entry point.

### Navigation

- Indexes: [level index](后室/层级/00-层级总表.md), [group overview](后室/组织/00-组织总览.md), [item overview](后室/物品/00-物品总览.md), [SCP entry index](SCP基金会/条目/00-条目总表.md).
- Setting and mechanics: [Backrooms origin](后室/00-起源与发展史.md), [Backrooms and SCP](后室/00-渊源-与SCP的关系.md), [SCP world and mechanics](SCP基金会/00-世界观与机制.md), [SCP canons](SCP基金会/Canon-世界线.md).
- Levels: 63 entries from Level 0 (the yellow rooms) through the core 0-9 band, the 10-49 bands, famous high numbers (94, 100, 188, 600), and special/negative/hidden levels (`Level !`, `Level Fun`, `Level ∞`, `The End`, `Level 3999`).
- The Backrooms entities (16), groups (8) and items (4); SCP entries (16) covering SCP-001 through SCP-5000, and the groups of interest.

### Reading order

1. Start with the two origin documents to see where each universe came from and how they split; pair them with the SCP world/mechanics document for containment classes and the Veil.
2. Enter Level 0, then follow exits to Level 1 and Level 2, using the level index for the full picture.
3. Look up entities and groups as they appear.
4. Read `STORYLINE.md` for the main plot, then the exploration novella for the immersive version.

The SCP side can be read independently starting from the entry index.

## Licensing

Mixed licensing — see [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md):

- **Code — MIT.** The engine and all source code of the game (`游戏/src/`, the built `游戏/后室-无尽回廊.html`, and the build/lint scripts) are original work under the MIT License.
- **Setting and knowledge-base content — CC BY-SA (derivative).** All entries under `后室/` and `SCP基金会/`, and the narrative text embedded in the game, are derivative of community wikis and licensed under Creative Commons Attribution-ShareAlike.

Original sources, as credited in `NOTICE.md`:

- The Backrooms Wiki (Wikidot) — https://backrooms-wiki.wikidot.com/ (CC BY-SA 3.0)
- The Backrooms (Fandom) — https://backrooms.fandom.com/ (CC BY-SA)
- 后室中文 Wiki / Backrooms Chinese branch — CC BY-SA
- SCP Foundation Wiki — https://scp-wiki.wikidot.com/ (CC BY-SA 3.0)
- SCP 基金会中文分部 — https://scp-wiki-cn.wikidot.com/ (CC BY-SA 3.0)

Attribution: copyright belongs to the original authors and communities of each wiki. The "Sources" section at the end of each knowledge-base file lists the specific pages it drew on, as the required attribution. This repository is a non-profit Chinese compilation and derivative work, and under CC BY-SA's ShareAlike term that derivative content is offered under CC BY-SA as well. "SCP Foundation", "The Backrooms" and their entities, levels and groups belong to their respective communities and rights holders; this project is unaffiliated fan work.

## Disclaimer

The Backrooms and most SCP entries are community collaborative fiction released under CC BY-SA; this is a non-profit Chinese compilation and derivative work, not an official canon. Same-numbered settings often conflict between the Wikidot current version, the older Fandom version, the Chinese branch and the Kane Pixels universe — version differences are noted where possible, but the source you choose to trust wins. Where no mainstream wiki has an entry, it is stated as unverifiable rather than invented. All content is fiction, unrelated to real people, places or organisations; the dangerous scenarios and survival guides are fictional settings and should not be imitated.

*Last updated in the original: 2026-06-13, against the wikis as of June 2026.*
