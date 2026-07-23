import type { Colour } from '../../types/catalog'

/** Shared BMW factory colour swatches (approx hex for UI). */
export const C = {
  alpineWhite: { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
  mineralWhite: {
    id: 'mineral-white',
    name: 'Mineral White Metallic',
    hex: '#E8E6E0',
  },
  blackSapphire: {
    id: 'black-sapphire',
    name: 'Black Sapphire Metallic',
    hex: '#0B0B0C',
  },
  mineralGrey: {
    id: 'mineral-grey',
    name: 'Mineral Grey Metallic',
    hex: '#6B6E73',
  },
  longBeachBlue: {
    id: 'long-beach-blue',
    name: 'Long Beach Blue Metallic',
    hex: '#1A4F8C',
  },
  hockenheimSilver: {
    id: 'hockenheim-silver',
    name: 'Hockenheim Silver Metallic',
    hex: '#A8ADB4',
  },
  sunsetOrange: {
    id: 'sunset-orange',
    name: 'Sunset Orange Metallic',
    hex: '#C45A1A',
  },
  yasMarinaBlue: {
    id: 'yas-marina-blue',
    name: 'Yas Marina Blue Metallic',
    hex: '#1B4F72',
  },
  sakhirOrange: {
    id: 'sakhir-orange',
    name: 'Sakhir Orange Metallic',
    hex: '#C45A1A',
  },
  austinYellow: {
    id: 'austin-yellow',
    name: 'Austin Yellow Metallic',
    hex: '#D4A017',
  },
  silverstone: {
    id: 'silverstone',
    name: 'Silverstone Metallic',
    hex: '#A8ADB4',
  },
  saoPauloYellow: {
    id: 'sao-paulo-yellow',
    name: 'Sao Paulo Yellow',
    hex: '#E8C41A',
  },
  isleOfManGreen: {
    id: 'isle-of-man-green',
    name: 'Isle of Man Green Metallic',
    hex: '#1F4D3A',
  },
  brooklynGrey: {
    id: 'brooklyn-grey',
    name: 'Brooklyn Grey Metallic',
    hex: '#6B6E73',
  },
  skyscraperGrey: {
    id: 'skyscraper-grey',
    name: 'Skyscraper Grey Metallic',
    hex: '#8A9099',
  },
  torontoRed: {
    id: 'toronto-red',
    name: 'Toronto Red Metallic',
    hex: '#A81C23',
  },
  portimaoBlue: {
    id: 'portimao-blue',
    name: 'Portimao Blue Metallic',
    hex: '#1B4F8C',
  },
  fireRed: {
    id: 'fire-red',
    name: 'Fire Red Metallic',
    hex: '#B91C1C',
  },
  zaneGrey: { id: 'zane-grey', name: 'Zane Grey Metallic', hex: '#6B6E73' },
  melbourneRed: {
    id: 'melbourne-red',
    name: 'Melbourne Red Metallic',
    hex: '#A81C23',
  },
  estorilBlue: {
    id: 'estoril-blue',
    name: 'Estoril Blue Metallic',
    hex: '#1E4D8C',
  },
  valenciaOrange: {
    id: 'valencia-orange',
    name: 'Valencia Orange Metallic',
    hex: '#E85D04',
  },
  frozenBrilliantWhite: {
    id: 'frozen-brilliant-white',
    name: 'Frozen Brilliant White Metallic',
    hex: '#F0F0EC',
  },
  jetBlack: { id: 'jet-black', name: 'Jet Black', hex: '#0D0D0F' },
  spaceGrey: {
    id: 'space-grey',
    name: 'Space Grey Metallic',
    hex: '#5C6168',
  },
  montegoBlue: {
    id: 'montego-blue',
    name: 'Montego Blue Metallic',
    hex: '#1A3A5C',
  },
  carbonBlack: {
    id: 'carbon-black',
    name: 'Carbon Black Metallic',
    hex: '#1A1A1C',
  },
  glacierSilver: {
    id: 'glacier-silver',
    name: 'Glacier Silver Metallic',
    hex: '#C5C9CE',
  },
  imperialeBlue: {
    id: 'imperial-blue',
    name: 'Imperial Blue Metallic',
    hex: '#1A2F5A',
  },
} as const satisfies Record<string, Colour>

/** F87 M2 (N55) — BMW UK launch set (4 paints). */
export const coloursM2F87: Colour[] = [
  { ...C.longBeachBlue, image: '/cars/paint/bmw-m2-f87--long-beach-blue.jpg' },
  { ...C.alpineWhite, image: '/cars/paint/bmw-m2-f87--alpine-white.jpg' },
  { ...C.blackSapphire, image: '/cars/paint/bmw-m2-f87--black-sapphire.jpg' },
  { ...C.mineralGrey, image: '/cars/paint/bmw-m2-f87--mineral-grey.jpg' },
]

/** E82 135i N54 — curated studio paint set (4 colours). */
export const colours135iE82N54: Colour[] = [
  {
    ...C.montegoBlue,
    image: '/cars/paint/bmw-135i-e82-n54--montego-blue.jpg',
  },
  {
    ...C.alpineWhite,
    image: '/cars/paint/bmw-135i-e82-n54--alpine-white.jpg',
  },
  {
    ...C.spaceGrey,
    image: '/cars/paint/bmw-135i-e82-n54--space-grey.jpg',
  },
  {
    ...C.jetBlack,
    image: '/cars/paint/bmw-135i-e82-n54--jet-black.jpg',
  },
]

/** F87 M2 Competition — UK brochure. */
export const coloursM2CompetitionF87: Colour[] = [
  C.hockenheimSilver,
  C.alpineWhite,
  C.blackSapphire,
  C.longBeachBlue,
  C.sunsetOrange,
]

/** F80 M3 / F82 M4 standard catalogue (UK brochure). */
export const coloursF8xM: Colour[] = [
  C.yasMarinaBlue,
  C.sakhirOrange,
  C.austinYellow,
  C.alpineWhite,
  C.mineralWhite,
  C.blackSapphire,
  C.mineralGrey,
  C.silverstone,
]

/** G80/G82 Competition launch + common catalogue. */
export const coloursG8xCompetition: Colour[] = [
  C.saoPauloYellow,
  C.isleOfManGreen,
  C.brooklynGrey,
  C.skyscraperGrey,
  C.torontoRed,
  C.portimaoBlue,
  C.alpineWhite,
  C.blackSapphire,
]
