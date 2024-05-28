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

export const useTrack = (id?: string) => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [track, setTrack] = useState<Track>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      await initializeConnection()
      const tracks = await trackRepository.find({
        relations: {
          measurements: true,
          geolocations: true,
        },
      })
      setTracks(tracks)
      setLoading(false)
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchTrack = async () => {
      await initializeConnection()
      const track = await trackRepository.findOne({
        where: { id },
        relations: {
          measurements: true,
          geolocations: true,
        },
      })
      if (!track) throw new Error('Track not found')
      setTrack(track)
      setLoading(false)
    }

    fetchTrack()
  }, [id])

  const createTrack = async () => {
    setSaving(true)
    await initializeConnection()
    const track = new Track()
    track.start = new Date()
    await trackRepository.save(track)
    setSaving(false)
    return track.id
  }

  const endTrack = async (id: string) => {
    setSaving(true)
    await initializeConnection()
    const track = await trackRepository.findOne({ where: { id } })
    if (!track) throw new Error('Track not found')
    track.end = new Date()
    await trackRepository.save(track)
    setSaving(false)
  }

  return { tracks, track, createTrack, endTrack, saving, loading }
}
