import { useEffect, useState } from 'react'
import { DataSource, Repository } from 'typeorm'
import { Track } from '../entities'
import senseBoxBikeDataSource from '../sources/senseBoxBikeDataSource'

let trackRepository: Repository<Track>
let connection: DataSource

const initializeConnection = async () => {
  if (!connection) connection = senseBoxBikeDataSource.dataSource
  trackRepository = connection.getRepository(Track)
}

export const useTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      await initializeConnection()
      const tracks = await trackRepository.find({
        // relations: {
        //   measurements: true,
        //   geolocations: true,
        // },
      })
      setTracks(tracks)
      setLoading(false)
    }

    fetchUsers()
  }, [])

  const createTrack = async () => {
    setSaving(true)
    await initializeConnection()
    const track = new Track()
    track.start = new Date()
    await trackRepository.save(track)
    setSaving(false)
    return track.id
  }

  return { tracks, createTrack, saving, loading }
}
