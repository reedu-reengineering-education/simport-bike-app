import { Track } from '@/lib/db/entities'
import { useMeasurements } from '@/lib/db/hooks/useMeasurements'
import { MeasurementType } from '@/lib/db/hooks/useTrack'
import { useTranslation } from 'react-i18next'
import { AreaChart } from '../charts/area-chart'

export default function MeasurementCharts({
  trackId,
  measurementTypes,
  onSelect,
}: {
  trackId: Track['id']
  measurementTypes: MeasurementType[]
  onSelect?: (timestamp: Date) => void
}) {
  const { measurements, loading } = useMeasurements(trackId)

  const { t } = useTranslation('translation')

  return (
    <>
      {measurementTypes.map(({ type, attributes }) => (
        <div key={type} className="grid gap-2">
          <p className="font-semibold text-sm">{t(`phenomena.${type}`)}</p>
          <div className="rounded-md w-full h-48 bg-muted overflow-hidden pt-1">
            {loading && (
              <div
                className="w-full h-full animate-pulse bg-foreground/10"
                style={{
                  clipPath:
                    'polygon(66% 37%, 83% 50%, 100% 54%, 100% 100%, 0 100%, 0 44%, 30% 60%)',
                }}
              />
            )}
            {!loading && (
              <AreaChart
                data={measurements
                  .filter(e => e.type === type)
                  .map(e => {
                    if (!attributes) return { x: e.timestamp, y: e.value }
                    return {
                      x: e.timestamp,
                      [e.attribute!]: e.value,
                    }
                  })}
                categories={[...(attributes ?? 'y')]}
                index={'x'}
                showLegend={!!attributes}
                showTooltip={false}
                connectNulls={true}
                tooltipCallback={e => {
                  const x = e?.payload[0]?.payload?.x
                  if (!x || !onSelect) {
                    return
                  }

                  onSelect(new Date(x))
                }}
              />
            )}
          </div>
        </div>
      ))}
    </>
  )
}
