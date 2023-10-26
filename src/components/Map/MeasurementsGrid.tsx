import useSenseBox from '@/lib/useSenseBox'
import { AreaChart } from '@tremor/react'
import AnimatedNumber from '../ui/animated-number'

export default function MeasurementsGrid() {
  const { values } = useSenseBox()

  const lastValue = values.at(-1)

  return (
    <div className="flex w-full flex-col divide-y">
      <div className="flex w-full justify-between divide-x">
        <GridItem
          name="Temperatur"
          value={lastValue?.temperature}
          unit="°C"
          sparklineData={values
            .filter(e => e.temperature)
            .map(v => ({ x: v.timestamp, y: v.temperature! }))
            .splice(-20)}
        />
        <GridItem
          name="Luftfeuchtigkeit"
          value={lastValue?.humidity}
          unit="%"
          sparklineData={values
            .filter(e => e.humidity)
            .map(v => ({ x: v.timestamp, y: v.humidity! }))
            .splice(-20)}
        />
      </div>
      <div className="flex w-full justify-between divide-x">
        <GridItem
          name="PM1"
          value={lastValue?.pm1}
          unit="µg/m³"
          sparklineData={values
            .filter(e => e.pm1)
            .map(v => ({ x: v.timestamp, y: v.pm1! }))
            .splice(-20)}
        />
        <GridItem
          name="PM2.5"
          value={lastValue?.pm2_5}
          unit="µg/m³"
          sparklineData={values
            .filter(e => e.pm2_5)
            .map(v => ({ x: v.timestamp, y: v.pm2_5! }))
            .splice(-20)}
        />
        <GridItem
          name="PM4"
          value={lastValue?.pm4}
          unit="µg/m³"
          sparklineData={values
            .filter(e => e.pm4)
            .map(v => ({ x: v.timestamp, y: v.pm4! }))
            .splice(-20)}
        />
        <GridItem
          name="PM10"
          value={lastValue?.pm10}
          unit="µg/m³"
          sparklineData={values
            .filter(e => e.pm10)
            .map(v => ({ x: v.timestamp, y: v.pm10! }))
            .splice(-20)}
        />
      </div>
      <div className="flex w-full justify-between divide-x">
        <GridItem
          name="Distanz Links"
          value={lastValue?.distance_l}
          unit="cm"
          sparklineData={values
            .filter(e => e.pm1)
            .map(v => ({ x: v.timestamp, y: v.pm1! }))
            .splice(-20)}
        />
        <GridItem
          name="Geschwindigkeit"
          value={lastValue?.gps_spd}
          unit="km/h"
          sparklineData={values
            .filter(e => e.pm1)
            .map(v => ({ x: v.timestamp, y: v.pm1! }))
            .splice(-20)}
        />
        <GridItem
          name="Beschleunigung"
          value={lastValue?.acceleration_x}
          unit="m/s²"
          sparklineData={values
            .filter(e => e.acceleration_x)
            .map(v => ({ x: v.timestamp, y: v.acceleration_x! }))
            .splice(-20)}
        />
      </div>
    </div>
  )
}

function GridItem({
  name,
  value,
  unit,
  sparklineData,
}: {
  name: string
  value: number | undefined
  unit: string
  sparklineData?: { x: Date; y: number }[]
}) {
  return (
    <div className="relative flex w-full flex-1 flex-col justify-between overflow-hidden p-2">
      {sparklineData && sparklineData.length > 2 && (
        <div className="absolute left-0 top-0 h-full w-full">
          <AreaChart
            className="h-full w-full opacity-50"
            data={sparklineData}
            index="x"
            categories={['y']}
            colors={['blue']}
            showXAxis={false}
            showYAxis={false}
            showLegend={false}
            showGridLines={false}
            curveType="natural"
            showTooltip={false}
          />
        </div>
      )}
      <p className="text-xs font-semibold">{name}</p>
      <p className="text-2xl">
        {value === undefined && (
          <div className="my-1.5 h-5 animate-pulse rounded-full bg-accent" />
        )}
        {value && <AnimatedNumber decimals={2}>{value}</AnimatedNumber>}
      </p>
      <p className="text-xs font-semibold">{unit}</p>
    </div>
  )
}
