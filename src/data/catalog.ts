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
  getKitById,
  getModById,
  getModsForCar,
  getModSupportGaps,
  getPresetsForCar,
  getStagesForTuner,
  getTunersForCar,
  kitAsPreset,
  modCategories,
  mods,
  resolveKitImage,
  resolveProductImage,
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
  getTunersForCar,
  getStagesForTuner,
  getKitById,
  kitAsPreset,
  getModSupportGaps,
  applyModSelection,
  applyPreset,
  resolveProductUrl,
  resolveProductImage,
  resolveKitImage,
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
