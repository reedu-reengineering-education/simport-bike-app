import { useRawBLEDataStore } from '@/lib/store/use-raw-data-store'
import { cn } from '@/lib/utils'
import { SparkAreaChart, SparkAreaChartProps } from '@tremor/react'
import { forwardRef, useEffect, useState } from 'react'
import colors from 'tailwindcss/colors'
import { sensorRegistry } from '../sensors'
import AnimatedNumber from '../ui/animated-number'

const MeasurementsGrid = forwardRef<HTMLDivElement>((_, ref) => {
  const rawData = useRawBLEDataStore(state => state.rawBleSensorData)

  return (
    <div className="flex h-full w-full flex-col p-1 pb-safe-offset-8" ref={ref}>
      <div
        className={cn(
          'grid overflow-y-scroll w-full h-full grid-cols-2 grid-rows-4 gap-1',
        )}
      >
        {Object.keys(rawData).map(key => sensorRegistry[key])}
      </div>
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
