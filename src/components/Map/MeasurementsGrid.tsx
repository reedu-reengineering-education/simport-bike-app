import { useAuthStore } from '@/lib/store/useAuthStore'
import { useUIStore } from '@/lib/store/useUIStore'
import useSenseBox from '@/lib/useSenseBox'
import useUploadToOpenSenseMap from '@/lib/useUploadToOpenSenseMap'
import { cn } from '@/lib/utils'
import { SparkAreaChart, SparkAreaChartProps } from '@tremor/react'
import {
  Bluetooth,
  BluetoothOff,
  Circle,
  Loader2Icon,
  Square,
  UploadCloud,
  UserCog2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import colors from 'tailwindcss/colors'
import ConnectWithCamera from '../Device/ConnectWithCamera'
import AnimatedNumber from '../ui/animated-number'
import { Button } from '../ui/button'

export default function MeasurementsGrid({
  layoutFull,
}: {
  layoutFull?: boolean
}) {
  const { values: allValues, connect, isConnected, disconnect } = useSenseBox()
  const { selectedBox } = useAuthStore()
  const { isRecording, start, stop, isLoading } = useUploadToOpenSenseMap()
  const { setShowWizardDrawer } = useUIStore()

  const values = allValues.filter((_, i) => i > allValues.length - 20)
  const lastValue = values.at(-1)

  return (
    <div className="flex w-full flex-col justify-around p-1 landscape:pb-safe">
      <div className="flex w-full justify-between gap-2 p-2 pb-safe-or-4">
        {!isConnected ? (
          <div className="flex w-full rounded-md bg-primary/25">
            <Button size={'sm'} className="w-full" onClick={() => connect()}>
              <Bluetooth className="mr-2 h-4" />
              Verbinden
            </Button>
            <ConnectWithCamera />
          </div>
        ) : (
          <Button size={'sm'} className="w-full" onClick={() => disconnect()}>
            <BluetoothOff className="mr-2 h-4" />
            Trennen
          </Button>
        )}
        {!selectedBox ? (
          <Button
            size={'sm'}
            className="w-full"
            variant={'secondary'}
            onClick={() => setShowWizardDrawer(true)}
          >
            <UserCog2 className="mr-2 h-5" />
            Setup
          </Button>
        ) : isConnected ? (
          !isRecording ? (
            <Button
              size={'sm'}
              className="w-full"
              onClick={() => start()}
              variant={'secondary'}
            >
              <Circle className="mr-2 h-5 fill-red-500 text-red-500" />
              Aufzeichnen
            </Button>
          ) : (
            <>
              <Button
                size={'sm'}
                className="w-full"
                onClick={() => stop()}
                variant={'secondary'}
              >
                {isLoading && (
                  <UploadCloud className="mr-2 h-5 animate-pulse opacity-50" />
                )}
                {!isLoading && (
                  <Square className="mr-2 h-5 fill-red-500 text-red-500" />
                )}
                Stop
              </Button>
            </>
          )
        ) : (
          <></>
        )}
      </div>
      <div
        className={cn(
          'relative flex w-full flex-col',
          !selectedBox || values.length === 0 ? '' : 'divide-y',
        )}
      >
        <div
          className={cn(
            'grid w-full gap-1',
            layoutFull ? 'grid-cols-1' : 'grid-cols-2',
          )}
        >
          <GridItem
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
          />
          <GridItem
            name="Distanz Links"
            value={lastValue?.distance_l}
            unit="cm"
            chartProps={{
              data: values.map(v => ({ x: v.timestamp, y: v.distance_l })),
              index: 'x',
              categories: ['y'],
            }}
            decimals={0}
          />

          <GridItem
            name="Beschleunigung"
            value={[
              lastValue?.acceleration_x,
              lastValue?.acceleration_y,
              lastValue?.acceleration_z,
            ]}
            unit="m/s²"
            labels={['X', 'Y', 'Z']}
            chartProps={{
              data: values.map(v => ({
                x: v.timestamp,
                acceleration_x: v.acceleration_x,
                acceleration_y: v.acceleration_y,
                acceleration_z: v.acceleration_z,
              })),
              index: 'x',
              categories: [
                'acceleration_x',
                'acceleration_y',
                'acceleration_z',
              ],
              colors: ['indigo', 'cyan', 'amber'],
            }}
          />
        </div>
        {selectedBox && isConnected && values.length === 0 && (
          <div className="flex h-full w-full flex-col items-center justify-center bg-background/75 p-12 backdrop-blur">
            <p className="flex items-center text-center text-sm">
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Warten auf
              Messwerte
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function GridItem({
  name,
  value,
  labels,
  unit,
  chartProps,
  decimals = 2,
}: {
  name: string
  value: number | (number | undefined)[] | undefined
  labels?: string[]
  unit: string
  chartProps: SparkAreaChartProps
  decimals?: number
}) {
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
