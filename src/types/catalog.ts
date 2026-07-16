/** Shared catalog types. Add fields carefully — keep data files as source of truth. */

export type Drivetrain = 'RWD' | 'FWD' | 'AWD' | '4WD'

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
  model: string
  generation: string
  /** Short label for lists, e.g. "135i N54". */
  label: string
  /** Model years you can configure. */
  years: number[]
  colours: Colour[]
  basePrice: number
  baseFigures: Figures
  description: string
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
  | 'suspension'
  | 'brakes'
  | 'wheels'
  | 'aero'
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
  figuresDelta: FiguresDelta
  /**
   * Empty = universal. Otherwise the car must share at least one tag,
   * or include the special `*` tag on the mod for all cars.
   */
  compatibleTags: string[]
  /** Mutually exclusive mod ids. */
  conflictsWith?: string[]
}

/** In-progress / completed build selections (wizard). */
export interface BuildSelection {
  make: string | null
  carId: string | null
  year: number | null
  colourId: string | null
  /** Spec group id → choice id. Missing group = use default/base choice. */
  specChoices: Record<string, string>
  modIds: string[]
}
