# Record Library

A personal record collection: browse a grid of sleeves or a shelf of spines, keep the
technical detail on each pressing, and log every listening session.

- **Vite + React + TypeScript**, Tailwind 4, a few heavily customised shadcn/Radix primitives
- **Dexie (IndexedDB)** as the client database — no server, no accounts
- Seeded on first run with ten audiophile pressings and a set of listening notes

```bash
npm install
npm run dev
```

## Structure

| Path | |
| --- | --- |
| `src/lib/db.ts` | Dexie schema, CRUD, sorting, live-query hooks |
| `src/lib/seed.ts` | The ten seed records and their sessions |
| `src/lib/art.ts` | Generated sleeve artwork and spine treatments |
| `src/routes/Library.tsx` | Grid and list views, sorting |
| `src/routes/AlbumDetail.tsx` | Metadata, inline editing, sessions |
| `src/components/ui/` | Button, input, field, dialog, select |

Covers are generated from each record's palette and art style rather than stored as
images. Sleeve colours also drive the spines in list view.

To reset the library, delete the `record-library` IndexedDB database in devtools; it
reseeds on next load.
