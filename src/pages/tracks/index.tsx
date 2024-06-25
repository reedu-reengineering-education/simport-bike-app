import { AnimateIn } from '@/components/animated/animate-in'
import TrackPreview from '@/components/track/track-preview'
import Spinner from '@/components/ui/Spinner'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useTracks } from '@/lib/db/hooks/useTracks'
import { Link } from '@tanstack/react-router'
import { AudioWaveform, HomeIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Navbar } from './navbar'

export default function TracksPage() {
  const { tracks, loading } = useTracks()

  const { t } = useTranslation('translation', { keyPrefix: 'tracks' })

  return (
    <div className="flex h-full w-full flex-col pt-safe">
      <header>
        <Navbar>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link to="/">
                    <HomeIcon className="h-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <AnimateIn>
                  <BreadcrumbPage className="flex items-center">
                    <AudioWaveform className="h-4 mr-2" />
                    {t('title')}
                  </BreadcrumbPage>
                </AnimateIn>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Navbar>
      </header>
      <div className="flex-1 overflow-scroll p-4 pb-safe grid gap-14">
        {loading && <Spinner />}
        {tracks.length === 0 && <p>{t('no-tracks')}</p>}
        {tracks.map(track => (
          <TrackPreview key={track.id} trackId={track.id} />
        ))}
      </div>
    </div>
  )
}
