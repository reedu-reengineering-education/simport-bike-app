import TrackWrapper from '@/components/Tracks/track-wrapper'
import { Navbar } from './navbar'

export default function TracksPage() {
  return (
    <main className="flex h-full w-full flex-col pt-safe">
      <header>
        <Navbar />
      </header>
      <div className="flex-1 overflow-scroll p-4 pb-safe">
        <TrackWrapper />
      </div>
    </main>
  )
}
