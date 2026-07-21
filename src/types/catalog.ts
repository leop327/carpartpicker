/** Shared catalog types. Add fields carefully — keep data files as source of truth. */

export type Drivetrain = 'RWD' | 'FWD' | 'AWD' | '4WD'
export type Market = 'uk'
export type FiguresSource = 'oem' | 'estimated' | 'tuner'

export interface Figures {
  hp: number
  torqueNm: number
  zeroToSixtySec: number
  weightKg: number
  drivetrain: Drivetrain
  engineSizeL: number
  engineCode: string
}

/** Numeric deltas applied by mods / optional factory packs. Negative 0–60 = quicker. */
export type FiguresDelta = Partial<
  Pick<Figures, 'hp' | 'torqueNm' | 'zeroToSixtySec' | 'weightKg'>
> & {
  drivetrain?: Drivetrain
  engineSizeL?: number
  engineCode?: string
}

export interface Colour {
  id: string
  name: string
  hex: string
  /** Optional real photo of this car in this colour, e.g. `/cars/paint/...jpg`. */
  image?: string
}

export interface SpecChoice {
  id: string
  name: string
  /** Factory option price in USD. 0 = included in base. */
  price: number
  description?: string
  figuresDelta?: FiguresDelta
  /** Used when the group is left unpicked (base / stock). */
  isDefault?: boolean
}

export interface SpecOptionGroup {
  id: string
  name: string
  description?: string
  /**
   * false = optional. If the user leaves it unpicked, the choice marked
   * `isDefault` (or the first choice) is applied automatically.
   */
  required: boolean
  choices: SpecChoice[]
}

export interface CarModel {
  id: string
  make: string
  /** Family for picker, e.g. "1 Series", "3 Series", "X3". */
  series: string
  model: string
  generation: string
  /** Short label for lists, e.g. "135i N54". */
  label: string
  /** Model years you can configure. */
  years: number[]
  colours: Colour[]
  basePrice: number
  /** Optional UK list price (approx). Falls back to basePrice as GBP. */
  euBasePrice?: number
  baseFigures: Figures
  /** Where baseFigures come from. */
  figuresSource: FiguresSource
  /** Optional per-year figure deltas on top of baseFigures. */
  yearFigures?: Partial<Record<number, FiguresDelta>>
  /** Applied for UK figures (EU DIN / 0–62 timing notes). */
  euFiguresDelta?: FiguresDelta
  description: string
  /** One-line flavour for model cards / preview. */
  tagline?: string
  /** Public path to a real photo, e.g. `/cars/bmw-m2-f87.jpg`. */
  image: string
  /** Tags used to match compatible mods. */
  modTags: string[]
  specOptions: SpecOptionGroup[]
}

export type ModCategoryId =
  | 'exhaust'
  | 'intake'
  | 'forced-induction'
  | 'ecu'
  | 'fueling'
  | 'suspension'
  | 'brakes'
  | 'wheels'
  | 'aero'
  | 'styling'
  | 'drivetrain'
  | 'interior'

export interface ModCategory {
  id: ModCategoryId
  name: string
  description: string
}

export interface Mod {
  id: string
  name: string
  brand: string
  category: ModCategoryId
  price: number
  description: string
  /** Short punchy claim shown on mod cards. */
  claim?: string
  figuresDelta: FiguresDelta
  figuresSource?: FiguresSource
  /**
   * Empty = universal. Otherwise the car must share at least one tag,
   * or include the special `*` tag on the mod for all cars.
   * If any engine-family tags are listed (n54, s55, b58…), the car must
   * share at least one of those engine tags (stops S55 parts on S58 cars).
   */
  compatibleTags: string[]
  /** Hide this mod if the car has any of these tags (e.g. diesel-only blocks). */
  incompatibleTags?: string[]
  /** Mutually exclusive mod ids. */
  conflictsWith?: string[]
  /**
   * Mods sharing a group are mutually exclusive
   * (e.g. all ECU tunes use `ecu-tune`).
   */
  conflictGroup?: string
  /**
   * Soft requirements — selecting this mod without these categories
   * shows a warning (does not block).
   */
  requiresCategories?: ModCategoryId[]
  /** Soft: at least one of these mod ids should also be selected. */
  requiresAnyOf?: string[]
  /** Product / retailer page opened from checkout. */
  productUrl?: string
}

export interface StagePreset {
  id: string
  name: string
  description: string
  compatibleTags: string[]
  modIds: string[]
}

/** In-progress / completed build selections (wizard). */
export interface BuildSelection {
  make: string | null
  /** e.g. "1 Series" — set before chassis / model. */
  series: string | null
  /** Chassis code, e.g. "E82", "F20/F21". */
  chassis: string | null
  carId: string | null
  year: number | null
  colourId: string | null
  /** Spec group id → choice id. Missing group = use default/base choice. */
  specChoices: Record<string, string>
  modIds: string[]
}
