import { cars, getCarById } from './cars'
import { getModById, getModsForCar, modCategories, mods } from './mods'

/**
 * Single entry point for catalog reads.
 * Pages/components should import from here — not from individual files —
 * so future data backends (API, CMS) only swap this module.
 */
export const catalog = {
  cars,
  mods,
  modCategories,
  getCarById,
  getModById,
  getModsForCar,
}

export type { CarModel, Mod, ModCategory, Figures, BuildSelection } from '../types/catalog'
