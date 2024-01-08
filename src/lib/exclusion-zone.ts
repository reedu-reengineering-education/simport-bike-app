import { inside } from '@turf/turf'
import { useExclusionZoneStore } from './store/useExclusionZoneStore'

export function isInExclusionZone(point: GeoJSON.Feature<GeoJSON.Point>) {
  const ez = useExclusionZoneStore.getState().zones

  if (ez.features.length === 0) return false

  return ez.features.some(feature => {
    return inside(point, feature)
  })
}
