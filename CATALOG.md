# Adding cars & mods

Keep UI out of this process. Everything flows through [`src/data/catalog.ts`](src/data/catalog.ts).

## Add a car (fastest path)

1. Copy [`src/data/cars/_template.example.ts`](src/data/cars/_template.example.ts) to a real file, e.g. `bmw-m3-e46.ts`.
2. Fill in make/model/generation/`label`, years, colours (`name` + `hex`), factory figures, MSRP, `modTags`, and optional factory packs.
3. Export it from [`src/data/cars/index.ts`](src/data/cars/index.ts) and push into the `cars` array.
4. Drop a photo in `public/cars/` and set `image: '/cars/your-file.jpg'`. Prefer Wikimedia Commons (note license in `public/cars/CREDITS.md`).

```ts
import { bmwM3E46 } from './bmw-m3-e46'

export const cars: CarModel[] = [
  // …
  bmwM3E46,
]
```

Brand shows up automatically from `make`. Models under that brand appear on the next step.

### Figures checklist

| Field | Prefer |
|-------|--------|
| `hp` / `torqueNm` | OEM / press kit (same market) |
| `zeroToSixtySec` | OEM 0–60 if listed, else 0–62 ÷ ~1.02 as a rough note in a comment |
| `weightKg` | DIN unladen or US curb — stay consistent; note which in a file comment |
| `engineCode` | Exact family code (`N54B30`, `S55B30T0`, …) |
| `basePrice` | Launch MSRP when new (approx. OK, labelled in UI) |

## Add a mod

Append an object to the `mods` array in [`src/data/mods/index.ts`](src/data/mods/index.ts):

```ts
{
  id: 'vrsf-dp-n54',          // unique kebab-case
  name: '3" Race Downpipes',
  brand: 'VRSF',
  category: 'exhaust',        // must exist in modCategories
  price: 549,
  description: '…',
  figuresDelta: { hp: 20, torqueNm: 30, zeroToSixtySec: -0.1, weightKg: -2 },
  compatibleTags: ['n54'],    // match car.modTags, or ['*'] for all
  // conflictsWith: ['other-mod-id'],
}
```

Tagging rule: a mod appears for a car if any `compatibleTags` overlaps `car.modTags`, or the mod includes `'*'`.

Negative `zeroToSixtySec` / `weightKg` means quicker / lighter.

## Do not touch for catalog growth

- React pages (`HomePage`, `BuildsPage`)
- figure math (`src/lib/build.ts`) — unless you add a new figure field

When the catalog gets large, you can split mods into `src/data/mods/exhaust.ts` etc. and re-export from `mods/index.ts` — same pattern as cars.
