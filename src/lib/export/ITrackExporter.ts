import { Track } from '../store/useTracksStore'

export abstract class ITrackExporter {
  filenamePrefix: string = ''
  async exportTrack(_trackId: Track['id']): Promise<void> {}
}
