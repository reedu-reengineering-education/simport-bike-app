import {
  ChartBarIcon,
  CloudIcon,
  SignalIcon,
  SunIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import { SpaceIcon } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import RecordButton from './RecordButton'
import PreviewModal from '../Device/PreviewModal'
import { senseBoxDataRecord } from '@/lib/store/useSenseBoxValuesStore'

export default function MeasurementsOverview({
  data,
  isConnected,
}: {
  data: senseBoxDataRecord | undefined
  isConnected: boolean
}) {
  function DataRow(props: {
    icon: any
    property: (keyof Omit<senseBoxDataRecord, 'timestamp'>)[]
    unit?: string
  }) {
    const Icon = props.icon

    return (
      <div className="flex items-center gap-2 text-sm">
        <Icon className="mr-0.5 h-4 w-4" />
        {!data && (
          <div className="h-2 w-1/2 animate-pulse rounded-full bg-gray-200"></div>
        )}
        <div className="w-fit">
          {data &&
            props.property
              .map<React.ReactNode>(p => (
                <span key={p}>{data[p]?.toFixed(2) || '-'}</span>
              ))
              .reduce((prev, curr) => [prev, ' / ', curr])}
        </div>
        <span>{props.unit}</span>
      </div>
    )
  }
  return (
    <Card className="pointer-events-auto relative w-full">
      <div className="absolute -right-2 -top-2 z-10">
        <RecordButton recording={isConnected} />
      </div>
      <CardContent>
        <div className="flex flex-col gap-1.5 pt-4">
          <DataRow icon={SunIcon} property={['temperature']} unit="°C" />
          <DataRow icon={SignalIcon} property={['humidity']} unit="%" />
          <DataRow
            icon={CloudIcon}
            property={['pm1', 'pm2_5', 'pm4', 'pm10']}
            unit="µg/m³"
          />
          <DataRow
            icon={ChartBarIcon}
            property={['acceleration_x', 'acceleration_y', 'acceleration_z']}
            unit="m/s²"
          />
          <DataRow icon={TruckIcon} property={['gps_spd']} unit="km/h" />
          <DataRow icon={SpaceIcon} property={['distance_l']} unit="cm" />
        </div>
      </CardContent>
    </Card>
  )
}
