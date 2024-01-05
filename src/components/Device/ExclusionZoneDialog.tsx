import Map from '@/components/Map/Map'
import { useExclusionZoneStore } from '@/lib/store/useExclusionZoneStore'
import { useEffect, useState } from 'react'
import DrawControl from '../Map/DrawControl'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

import { featureCollection } from '@turf/turf'

export default function ExclusionZoneDialog() {
  const zones = useExclusionZoneStore(state => state.zones)
  const overwriteZones = useExclusionZoneStore(state => state.overwriteZones)

  const [drawRef, setDrawRef] = useState<MapboxDraw | null>(null)
  useEffect(() => {
    if (drawRef) {
      drawRef.deleteAll()
      drawRef.add(zones)
    }
  }, [drawRef])

  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="secondary" className="w-full">
          Private Zonen verwalten
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Private Zonen</DialogTitle>
          <DialogDescription>
            Sie können private Zonen definieren, in denen keine Daten
            aufgezeichnet werden.
          </DialogDescription>
        </DialogHeader>
        <div className="h-96 w-full overflow-hidden rounded-md">
          <Map>
            <DrawControl
              position="top-left"
              displayControlsDefault={false}
              controls={{
                polygon: true,
                trash: true,
              }}
              defaultMode="draw_polygon"
              ref={ref => setDrawRef(ref)}
            />
          </Map>
        </div>
        <Button
          onClick={() => {
            const fc = drawRef?.getAll()
            if (!fc) return

            const polygons = featureCollection(
              fc.features.filter(f => f.geometry.type === 'Polygon'),
            ) as GeoJSON.FeatureCollection<GeoJSON.Polygon>
            overwriteZones(polygons)
            setOpen(false)
          }}
        >
          Speichern
        </Button>
      </DialogContent>
    </Dialog>
  )
}
