import { RawBLESensorData } from '@/lib/store/use-raw-data-store'
import useRawSensorValues from '@/lib/use-raw-sensor-values'
import { subSeconds } from 'date-fns'
import { GridItem, GridItemProps } from '../Map/MeasurementsGrid'

interface SensorViewProps extends Omit<GridItemProps, 'value'> {
  characteristic: string
  rawValueToValue: (_rawValue: RawBLESensorData) => GridItemProps['value']
  rawHistoryValuesToData: (
    _rawValues: RawBLESensorData[],
  ) => GridItemProps['chartProps']['data']
}

type ChangeFields<T, R> = Omit<T, keyof R> & R

export default function SensorView({
  characteristic,
  rawValueToValue,
  ...props
}: ChangeFields<
  SensorViewProps,
  {
    chartProps: Omit<GridItemProps['chartProps'], 'data'>
  }
>) {
  const { value, historyValues } = useRawSensorValues(characteristic)

  const timeframeTreshold = subSeconds(new Date(), 10)
  const timeframeValues = historyValues.filter(
    v => v.timestamp > timeframeTreshold,
  )

  if (!value) return null

  return (
    <GridItem
      {...props}
      value={rawValueToValue(value)}
      chartProps={{
        ...props.chartProps,
        data: props.rawHistoryValuesToData(timeframeValues),
      }}
    ></GridItem>
  )
}
