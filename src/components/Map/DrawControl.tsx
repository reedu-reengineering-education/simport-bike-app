import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { useControl } from 'react-map-gl'

import type { ControlPosition } from 'react-map-gl'

import 'mapbox-gl/dist/mapbox-gl.css'
import { forwardRef, useImperativeHandle } from 'react'

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition

  onCreate?: (_evt: { features: object[] }) => void
  onUpdate?: (_evt: { features: object[]; action: string }) => void
  onDelete?: (_evt: { features: object[] }) => void

  instance?: MapboxDraw
}

const DrawControl = forwardRef<MapboxDraw, DrawControlProps>((props, ref) => {
  // @ts-ignore
  const drawRef = useControl<MapboxDraw>(
    // @ts-ignore
    () => new MapboxDraw(props),
    ({ map }) => {
      props.onCreate && map.on('draw.create', props.onCreate)
      props.onUpdate && map.on('draw.update', props.onUpdate)
      props.onDelete && map.on('draw.delete', props.onDelete)
    },
    ({ map }) => {
      props.onCreate && map.off('draw.create', props.onCreate)
      props.onUpdate && map.off('draw.update', props.onUpdate)
      props.onDelete && map.off('draw.delete', props.onDelete)
    },
    {
      position: props.position,
    },
  )

  useImperativeHandle(ref, () => drawRef, [drawRef]) // This way I exposed drawRef outside the component

  return null
})

DrawControl.displayName = 'DrawControl'

export default DrawControl
