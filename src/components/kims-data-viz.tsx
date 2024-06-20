import HeartRateSensor from '@/lib/sensors/heart-rate'
import SoundSensor from '@/lib/sensors/sound'
import UltrasonicDistanceSensor from '@/lib/sensors/ultrasonic-distance'
import useRawSensorValues from '@/lib/use-raw-sensor-values'
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

export default function KimsDataViz() {
  const { value: distanceValue } = useRawSensorValues(
    UltrasonicDistanceSensor.BLE_CHARACTERISTIC,
  )
  const { value: heartBeatValue } = useRawSensorValues(
    HeartRateSensor.BLE_CHARACTERISTIC,
  )
  const { value: soundValue } = useRawSensorValues(
    SoundSensor.BLE_CHARACTERISTIC,
  )

  const ref = useRef<HTMLCanvasElement>(null)

  // TODO:
  // remove the number readouts
  // - use fake data?

  // - figure out process for packaging the app
  // - get new sensors working in the sensebox
  // - write new code for the new sensors in the app
  // - adjust visualization to work well with real data

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext('2d')

      if (!ctx) {
        return
      }

      ref.current.width = window.innerWidth
      ref.current.height = window.innerHeight

      const width = ref.current.width
      const height = ref.current.height

      console.log(width, height)

      // background gradient - uses heartbeat sensor as input
      if (heartBeatValue?.measurement[0]) {
        const heartbeatMin = 0 // Need to adjust the heartbeat min and max based on values coming from sensor
        const heartbeatMax = 8191
        const backgroundColorScale = d3
          .scaleSequential(d3.interpolateTurbo)
          .domain([heartbeatMin, heartbeatMax])
        const backgroundColor = backgroundColorScale(
          heartBeatValue?.measurement[0],
        )
        // const backgroundColor = backgroundColorScale(10)
        ctx.beginPath()
        ctx.rect(0, 0, width, height)
        ctx.fillStyle = backgroundColor
        ctx.fill()
      }

      // ring - uses microphone as input
      if (soundValue?.measurement[0]) {
        const ringColor = 'rgb(255, 0, 0)'
        const dbMin = 0 // Need to adjust the db min and max based on values coming from sensor
        const dbMax = 8191
        const ringSizeScale = d3
          .scaleLinear()
          .domain([dbMin, dbMax])
          .range([1, Math.min(width, height)])
        const ringWidth = ringSizeScale(soundValue?.measurement[0])
        // const ringWidth = ringSizeScale(5000)
        ctx.save()
        ctx.translate(width / 2, height / 2)
        ctx.beginPath()
        ctx.ellipse(0, 0, ringWidth / 2, ringWidth / 2, 0, 0, Math.PI * 2)
        ctx.strokeStyle = ringColor
        ctx.lineWidth = 5
        ctx.stroke()
        ctx.restore()
      }

      // diamond - uses distance as input
      if (distanceValue?.measurement[0]) {
        const rectColor = 'rgb(255, 0, 0)'
        const distanceMin = 0 // Need to adjust the distance min and max based on values coming from sensor
        const distanceMax = 400
        const diamondSizeScale = d3
          .scaleLinear()
          .domain([distanceMin, distanceMax])
          .range([1, Math.min(width, height)])
        const rectWidth = diamondSizeScale(distanceValue?.measurement[0])
        // const rectWidth = diamondSizeScale(900)
        ctx.save()
        ctx.translate(width / 2, height / 2)
        ctx.rotate(-Math.PI / 4)
        ctx.translate(-rectWidth / 2, -rectWidth / 2)
        ctx.beginPath()
        ctx.rect(0, 0, rectWidth, rectWidth)
        ctx.strokeStyle = rectColor
        ctx.lineWidth = 5
        ctx.stroke()
        ctx.restore()
      }

      // console.log("i got a canvas", canvas)
    }
  }, [distanceValue, soundValue, heartBeatValue])

  return (
    <canvas className="kims-component" ref={ref} style={{ opacity: 0.7 }} />
  )
}
