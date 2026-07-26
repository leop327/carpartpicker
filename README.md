# CarPartPicker

UK BMW build configurator — pick chassis, stack real mods, watch figures move (mods-only £ totals).

**Launch focus:** 1–4 Series · N54 / N55 / B58 / S55 / S58.

## Stack

- React + TypeScript + Vite
- React Router
- Local data catalog (+ optional DVLA / Gemini APIs)

## Develop

```bash
export PATH="$HOME/.local/node/bin:$PATH"
npm install
npm run dev
```

## Flow

1. Home — UK reg lookup or pick a BMW series
2. Series → chassis → model → year → colour
3. Factory options (unpicked = base)
4. Mods with live figures, MOT badges, and checkout links

Drafts persist in `localStorage` + `?b=`. Saved builds use `carpartpicker:saved:v2`.

## Add cars & mods

See **[CATALOG.md](CATALOG.md)**.

1. Copy `src/data/cars/_template.example.ts` → new car file → register in `src/data/cars/index.ts`
2. Append mods in `src/data/mods/` (e.g. `ukMarketSeed.ts`) with `compatibleTags` matching the car’s `modTags`
