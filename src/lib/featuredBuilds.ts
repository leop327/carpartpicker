import { listCommunityBuilds, type CommunityBuild } from './community'
import { catalog } from '../data/catalog'

/** Curated + community builds for the home featured strip. */
export function getFeaturedBuilds(limit = 6): CommunityBuild[] {
  const builds = listCommunityBuilds().filter((b) => {
    const car = catalog.getCarById(b.snapshot.carId)
    return Boolean(car)
  })
  return builds.slice(0, limit)
}
