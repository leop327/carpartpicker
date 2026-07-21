# Paint photos

Drop real car-in-colour photos here, then register them in
`src/data/cars/paintImages.ts`.

## Naming

```
{car-id}--{colour-id}.jpg
```

Examples:

- `bmw-135i-e82-n54--alpine-white.jpg`
- `bmw-m3-f80--black-sapphire.jpg`
- `bmw-m2-f87--melbourne-red.jpg`

Then in `paintImages.ts`:

```ts
'bmw-135i-e82-n54:alpine-white':
  '/cars/paint/bmw-135i-e82-n54--alpine-white.jpg',
```

JPG or WebP, landscape ~1600px wide is plenty.
