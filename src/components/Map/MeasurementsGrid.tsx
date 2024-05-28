import { useRawBLEDataStore } from '@/lib/store/use-raw-data-store'
import { useAuthStore } from '@/lib/store/useAuthStore'
import useSenseBox from '@/lib/useSenseBox'
import { cn } from '@/lib/utils'
import { SparkAreaChart, SparkAreaChartProps } from '@tremor/react'
import { Loader2Icon } from 'lucide-react'
import { forwardRef, useEffect, useState } from 'react'
import colors from 'tailwindcss/colors'
import { sensorRegistry } from '../sensors'
import AnimatedNumber from '../ui/animated-number'
import { ScrollArea } from '../ui/scroll-area'

const MeasurementsGrid = forwardRef<HTMLDivElement>((_, ref) => {
  const { values: allValues, isConnected } = useSenseBox()
  const selectedBox = useAuthStore(state => state.selectedBox)

  const rawData = useRawBLEDataStore(state => state.rawBleSensorData)

  const values = allValues.filter((_, i) => i > allValues.length - 20)
  const _lastValue = values.at(-1)

  return (
    <div
      className="flex h-full w-full flex-col justify-around p-1 pb-safe-offset-8"
      ref={ref}
    >
      <ScrollArea
        className={cn(
          'relative flex h-full w-full flex-col',
          !selectedBox || values.length === 0 ? '' : 'divide-y',
        )}
      >
        <div className={cn('grid h-full w-full grid-cols-1 grid-rows-4 gap-1')}>
          {Object.keys(rawData).map(key => sensorRegistry[key])}
          {/* {(await getSubscribableSensors()).map((characteristic, i) => (
            <div key={i}>
              <p>{characteristic}</p>
            </div>
          ))} */}
          {/* <GridItem
            name="Geschwindigkeit"
            value={lastValue?.gps_spd}
            unit="km/h"
            chartProps={{
              data: values.map(v => ({ x: v.timestamp, y: v.gps_spd })),
              index: 'x',
              categories: ['y'],
            }}
          />
          <GridItem
            name="Temperatur"
            value={lastValue?.temperature}
            unit="°C"
            chartProps={{
              data: values.map(v => ({ x: v.timestamp, y: v.temperature })),
              index: 'x',
              categories: ['y'],
            }}
          />
          <GridItem
            name="Luftfeuchtigkeit"
            value={lastValue?.humidity}
            unit="%"
            chartProps={{
              data: values.map(v => ({ x: v.timestamp, y: v.humidity })),
              index: 'x',
              categories: ['y'],
            }}
          />
          <GridItem
            name="Feinstaub"
            value={[
              lastValue?.pm1,
              lastValue?.pm2_5,
              lastValue?.pm4,
              lastValue?.pm10,
            ]}
            labels={['PM1', 'PM2.5', 'PM4', 'PM10']}
            unit="µg/m³"
            chartProps={{
              data: values
                .filter(e => e.pm1)
                .map(v => ({
                  x: v.timestamp,
                  pm1: v.pm1,
                  pm2_5: v.pm2_5,
                  pm4: v.pm4,
                  pm10: v.pm10,
                })),
              index: 'x',
              categories: ['pm1', 'pm2_5', 'pm4', 'pm10'],
              colors: ['indigo', 'cyan', 'amber', 'emerald'],
            }}
          />  */}
        </div>
        {selectedBox && isConnected && values.length === 0 && (
          <div className="flex h-full w-full flex-col items-center justify-center bg-background/75 p-12 backdrop-blur">
            <p className="flex items-center text-center text-sm">
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Warten auf
              Messwerte
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
})

MeasurementsGrid.displayName = 'MeasurementsGrid'

export default MeasurementsGrid

export interface GridItemProps {
  name: string
  value: number | (number | undefined)[] | undefined
  labels?: string[]
  unit: string
  chartProps: SparkAreaChartProps
  decimals?: number
}

export function GridItem({
  name,
  value,
  labels,
  unit,
  chartProps,
  decimals = 2,
}: GridItemProps) {
  const [selectedValue, setSelectedValue] = useState<number>()
  const [labelIndex, setLabelIndex] = useState<number>()

  useEffect(() => {
    if (value !== undefined && !Array.isArray(value)) {
      setSelectedValue(value)
    }
  }, [value])

  useEffect(() => {
    if (labels && labels.length > 0 && labelIndex === undefined) {
      setLabelIndex(0)
    }
  }, [labels])

  useEffect(() => {
    if (
      labels &&
      labels.length > 0 &&
      labelIndex !== undefined &&
      Array.isArray(value)
    ) {
      setSelectedValue(value[labelIndex])
    }
  }, [labelIndex, value])

  return (
    <div
      className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-md bg-muted/40 px-4 py-3"
      onClick={() => {
        if (labelIndex !== undefined && labels && labels.length > 0) {
          setLabelIndex((labelIndex + 1) % labels!.length)
        }
      }}
    >
      {chartProps && chartProps.data.length > 2 && (
        <div className="pointer-events-none absolute -left-6 -right-6 top-0 h-full">
          <SparkAreaChart
            className="h-full w-full opacity-30"
            curveType="monotone"
            colors={['slate']}
            minValue={100}
            {...chartProps}
          />
        </div>
      )}
      <div className="z-10 flex gap-1">
        <p className="whitespace-nowrap text-sm">{name}</p>
        {labels && labels.length > 0 && labelIndex !== undefined && (
          <span
            className="h-fit rounded-full px-1 py-0.5 text-[8px] text-accent"
            style={{
              // @ts-ignore
              backgroundColor: colors[chartProps.colors![labelIndex]][500],
            }}
          >
            {labels[labelIndex!]}
          </span>
        )}
      </div>
      <div className="z-10 flex max-w-0 items-baseline gap-2 text-3xl">
        {selectedValue === undefined && (
          <div className="my-1.5 h-5 animate-pulse rounded-full bg-accent" />
        )}
        {selectedValue !== undefined ? (
          <AnimatedNumber decimals={decimals}>{selectedValue}</AnimatedNumber>
        ) : null}
        <p className="text-xs">{unit}</p>
      </div>
    </div>
  )
}
