# Record Library

A personal record collection: browse a grid of sleeves or a shelf of spines, keep the
technical detail on each pressing, and log every listening session.

- **Vite + React + TypeScript**, Tailwind 4, a few heavily customised shadcn/Radix primitives
- **Dexie (IndexedDB)** as the client database — no server, no accounts
- Seeded with all 200 entries from Pitchfork's 2021 readers' poll, with local cover art

```bash
npm install
npm run dev
```

## Structure

| Path | |
| --- | --- |
| `src/lib/db.ts` | Dexie schema, CRUD, sorting, live-query hooks |
| `src/data/pitchfork-200.json` | Ranked collection, album metadata, and per-album source URLs |
| `public/covers/` | 200 optimized WebP album covers |
| `scripts/import-pitchfork.mjs` | Repeatable source import and artwork download |
| `src/lib/seed.ts` | Imported albums and 188 fictional sample listening sessions |
| `src/lib/seed-migration.ts` | Preserve user changes while replacing untouched demos |
| `src/lib/legacy-seed.ts` | Old sample data, retained only to recognize untouched demos |
| `src/lib/art.ts` | Generated sleeve artwork and spine treatments |
| `src/routes/Library.tsx` | Grid and list views, sorting |
| `src/routes/AlbumDetail.tsx` | Metadata, inline editing, sessions |
| `src/components/ui/` | Button, input, field, dialog, select |
| `src/theme.css` | Shared Tailwind typography, hex colors, radii, and effects |

## Theme

Edit `src/theme.css` for visual tokens; `src/index.css` contains base styles and interactions.
Every text role pairs `--text-{role}` with an explicit `--font-{role}`, with pixel sizes,
line heights, and letter spacing. Use both utilities; keep color separate:

```tsx
<p className="font-body text-body text-ink-muted">Record details</p>
<h1 className="font-heading text-heading text-ink-strong">Collection</h1>
```

- Inter: `body`, `body-relaxed`, `small`, `caption`, `metadata`, `label`, `glyph`.
- Jura: `heading`, `dialog`. Newsreader: `record`, `record-sm`, `display`,
  `display-md`, `display-sm`, `empty`.
- Album detail titles use fixed pixel steps: `display-sm` → `sm:display-md` →
  `lg:display` (apply both font and text utilities at each breakpoint).
- Use `uppercase` with `label`; use `font-medium` for button emphasis.
- Radii: `rounded-xs` indicators, `rounded-sm` spines/inline editors,
  `rounded-md` covers/controls, `rounded-lg` popovers, `rounded-xl` dialogs,
  `rounded-pill` ratings/swatches.
- UI colors are hex (eight-digit hex for transparent tokens); Tailwind opacity
  modifiers such as `bg-ink/6` derive from them. Album palettes in `src/lib/art.ts`
  and the record data are content colors, not UI tokens.

Avoid ad-hoc text sizes, tracking, or radii. Register any new text role in
`src/lib/utils.ts` so class merging distinguishes it from a text color.
`tests/theme.test.ts` checks the token format and migration boundaries.

## Collection sources

The collection follows [Pitchfork's 25th-anniversary readers' list](https://pitchfork.com/features/lists-and-guides/peoples-list-25th-anniversary/),
published in 2021. Rank, vote count, artist, title, release year, and genre come from
the list's embedded dataset. Release years follow that list's regional release
conventions. Labels come from the linked album reviews; some reviews cover reissues,
so these labels do not identify a particular original vinyl pressing.

Missing review links and retired or low-resolution image URLs are supplemented
with manually matched Apple Music releases. Each entry records its metadata and
artwork sources. Janelle Monáe's name is repaired from the source's broken encoding.
The paired Bright Eyes (#140) and Deerhunter (#192) entries remain paired, matching
the source's 200 ranks. Their covers represent the first album in each pair.

Covers are bundled locally as WebP files, up to 600px, with a minimum of 400px.
The app does not call external metadata or image services at runtime. Cover colors
drive the shelf spines; generated sleeves remain the fallback for manually added
records or failed image loads. Artwork remains the property of its respective
rights holders; source attribution does not grant an artwork license.

Personal ratings, condition, catalog numbers, pressing,
mastering, speed, weight, format, and pressing country are deliberately unseeded:
the poll does not establish which physical edition the user owns.

The app includes 188 fictional listening sessions spread across 100 albums:
50 albums have one listen, 25 have two, 15 have three, seven have four, and three
have five. Dates span recent months, with varied locations, systems, and notes.
These are sample app data, not information from Pitchfork or actual user history.

Existing libraries receive the collection once. Only unchanged old demo records
and their unchanged demo sessions are replaced; edited demos, user records, and
user sessions survive. After import, deleting or editing albums is persistent,
including an intentionally empty collection.

A separate one-time migration adds the sample sessions to existing collections,
preserving existing sessions and skipping deleted albums. Subsequent reloads do
not restore deleted sample sessions or overwrite edits.

```bash
npm run import:albums  # Refresh metadata and local covers; caches source responses in .context/
npm test              # Data, artwork integrity, migration, and sorting checks
npm run build
npm run lint
```

The importer reuses `.context/pitchfork-import/` on subsequent runs. Remove that
cache to retrieve fresh source responses. Updating the bundled JSON does not
overwrite an already imported user's collection.

To reset the library, delete the `record-library` IndexedDB database in devtools; it
reseeds on next load.
