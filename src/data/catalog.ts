import { cars, getCarById, getCarsByMake, getMakes } from './cars'
import {
  applyModSelection,
  applyPreset,
  getModById,
  getModsForCar,
  getPresetsForCar,
  modCategories,
  mods,
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
  getModById,
  getModsForCar,
  getPresetsForCar,
  applyModSelection,
  applyPreset,
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
