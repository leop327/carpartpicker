import {
  cars,
  chassisMeta,
  getCarById,
  getCarsByMake,
  getCarsBySeries,
  getCarsBySeriesAndChassis,
  getChassisBySeries,
  getMakes,
  getSeriesList,
  seriesMeta,
} from './cars'
import {
  applyModSelection,
  applyPreset,
  getModById,
  getModsForCar,
  getModSupportGaps,
  getPresetsForCar,
  modCategories,
  mods,
  resolveProductUrl,
  stagePresets,
} from './mods'

/**
 * Single entry point for catalog reads.
 * Pages/components should import from here — not from individual files —
 * so future data backends (API, CMS) only swap this module.
 */
export const catalog = {
  cars,
  mods,
  modCategories,
  stagePresets,
  getCarById,
  getCarsByMake,
  getMakes,
  getSeriesList,
  getCarsBySeries,
  getChassisBySeries,
  getCarsBySeriesAndChassis,
  seriesMeta,
  chassisMeta,
  getModById,
  getModsForCar,
  getPresetsForCar,
  getModSupportGaps,
  applyModSelection,
  applyPreset,
  resolveProductUrl,
}

export type {
  CarModel,
  Mod,
  ModCategory,
  Figures,
  BuildSelection,
  StagePreset,
  Market,
} from '../types/catalog'
