# CarPartPicker

Configure a car exactly as it is — model, year, colour, factory options — then stack real aftermarket mods and watch figures update live.

## Stack

- React + TypeScript + Vite
- React Router
- Local data catalog (no backend yet)

## Develop

Node 20+ recommended. On this machine a local Node install may live at `~/.local/node/bin`.

```bash
export PATH="$HOME/.local/node/bin:$PATH"
npm install
npm run dev
```

## Extend without touching UI

| Add… | Do this |
|------|---------|
| A car | New file under `src/data/cars/`, then register it in `src/data/cars/index.ts` |
| A mod | Append (or later split) entries in `src/data/mods/index.ts` with `compatibleTags` |
| A mod category | Add to `modCategories` + use that `id` on mods |
| Catalog source | Swap implementations behind `src/data/catalog.ts` |

Cars match mods via `modTags` ∩ `compatibleTags` (or `'*'` for universal).

Unpicked factory option groups automatically use the choice marked `isDefault` (base spec).

## Scripts

- `npm run dev` — local app
- `npm run build` — production build
- `npm run preview` — preview production build
