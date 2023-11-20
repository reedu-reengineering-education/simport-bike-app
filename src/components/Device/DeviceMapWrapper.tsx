import MeasurementsGrid from '../Map/MeasurementsGrid'
import TrajectoryMap from './TrajectoryMap'

export default function DeviceMapWrapper() {
  return (
    <div className="flex h-full w-full portrait:flex-col">
      <div className="portrait:border-b landscape:border-r-2">
        <MeasurementsGrid />
      </div>
      <div className="relative h-full w-full">
        <TrajectoryMap />
      </div>
    </div>
  )
}
