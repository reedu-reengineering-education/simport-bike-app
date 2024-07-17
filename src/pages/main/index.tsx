import DeviceMapWrapper from '@/components/Device/DeviceMapWrapper'
import GeolocationPermissionDrawer from '@/components/Device/GeolocationPermissionDrawer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Track } from '@/lib/db/entities'
import senseBoxBikeDataSource from '@/lib/db/sources/senseBoxBikeDataSource'
import { Link } from '@tanstack/react-router'
import { AudioWaveform } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function MainPage() {
  const { t } = useTranslation('translation')

  const [trackCount, setTrackCount] = useState(0)

  useEffect(() => {
    senseBoxBikeDataSource.dataSource
      .getRepository(Track)
      .count()
      .then(setTrackCount)
  }, [])

  return (
    <div className="relative h-full w-full">
      <main className="h-full w-full overflow-auto landscape:pl-safe">
        <DeviceMapWrapper />
        <GeolocationPermissionDrawer />
      </main>
      <div className="absolute top-0 w-screen backdrop-blur pt-safe" />
      <div className="absolute top-0 right-0 mr-safe-offset-4 mt-safe-offset-2">
        <Link to="/tracks" className="w-fit mx-auto">
          <Button size={'sm'} variant={'secondary'}>
            <AudioWaveform className="h-4 mr-2" />
            {t('tracks.title')}
            {trackCount > 0 && <Badge className="ml-2">{trackCount}</Badge>}
          </Button>
        </Link>
      </div>
    </div>
  )
}
