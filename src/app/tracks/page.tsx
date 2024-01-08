import TrackWrapper from '@/components/Tracks/track-wrapper'
import { Navbar } from './navbar'

export default function TracksPage() {
  return (
    <main className="h-full w-full p-safe">
      <header>
        <Navbar />
      </header>
      <div className="h-full w-full overflow-scroll p-4 pb-safe-or-4">
        <TrackWrapper />
      </div>
    </main>
  )
}
