import { RawBLESensorData } from '@/lib/store/use-raw-data-store'
import useRawSensorValues from '@/lib/use-raw-sensor-values'
import { subSeconds } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { GridItem, GridItemProps } from '../Map/MeasurementsGrid'

interface SensorViewProps<T> extends Omit<GridItemProps, 'value'> {
  characteristic: string
  rawValueToValue: (_rawValue: RawBLESensorData<T>) => GridItemProps['value']
  rawHistoryValuesToData: (
    _rawValues: RawBLESensorData<T>[],
  ) => GridItemProps['chartProps']['data']
  customComponent?: (
    _value: RawBLESensorData<T> | undefined,
    _historyValues: RawBLESensorData<T>[],
  ) => React.ReactNode
}

type ChangeFields<T, R> = Omit<T, keyof R> & R

export default function SensorView({
  characteristic,
  rawValueToValue,
  ...props
}: ChangeFields<
  SensorViewProps<number[] | number[][]>,
  {
    chartProps: Omit<GridItemProps['chartProps'], 'data'>
  }
>) {
  const { value, historyValues } = useRawSensorValues(characteristic)

  const { t } = useTranslation('translation', { keyPrefix: 'phenomena' })
  const timeframeTreshold = subSeconds(new Date(), 20)
  const timeframeValues = historyValues.filter(
    v => v.timestamp > timeframeTreshold,
  )

  if (props.customComponent) {
    return (
      <div className="relative flex-1 overflow-hidden rounded-md bg-muted/40 px-4 py-3">
        {props.customComponent(value, timeframeValues)}
      </div>
    )
  }

  if (!value) return null

  return (
    <GridItem
      {...props}
      name={t(props.name)}
      value={rawValueToValue(value)}
      chartProps={{
        ...props.chartProps,
        data: props.rawHistoryValuesToData(timeframeValues),
      }}
    ></GridItem>
  )
}
