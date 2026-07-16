# CarPartPicker

Configure a car exactly as it is — brand, model, year, colour, factory options — then stack real aftermarket mods and watch figures update live.

## Stack

- React + TypeScript + Vite
- React Router
- Local data catalog (no backend yet)

## Develop

```bash
export PATH="$HOME/.local/node/bin:$PATH"
npm install
npm run dev
```

## Flow

1. Home — **Create new build** or open a **Saved build**
2. Brand → Model → Year → Colour
3. Factory options (unpicked = base)
4. Mods with live figures

Drafts persist in `localStorage` + `?b=`. Saved builds use `carpartpicker:saved:v2`.

## Add cars & mods

See **[CATALOG.md](CATALOG.md)**.

1. Copy `src/data/cars/_template.example.ts` → new car file → register in `src/data/cars/index.ts`
2. Append mods in `src/data/mods/index.ts` with `compatibleTags` matching the car’s `modTags`

Starter catalog: E82 135i N54/N55, F87 M2, F87 M2 Competition, M140i, M235i.
