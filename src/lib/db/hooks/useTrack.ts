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
  const [track, setTrack] = useState<Track>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchTrack = async () => {
      await initializeConnection()
      const track = await trackRepository.findOne({
        where: { id },
        // relations: {
        //   measurements: true,
        //   geolocations: true,
        // },
      })
      if (!track) throw new Error('Track not found')
      setTrack(track)
      setLoading(false)
    }

    fetchTrack()
  }, [id])

  const deleteTrack = async (id: string) => {
    setSaving(true)
    await initializeConnection()
    const track = await trackRepository.findOne({ where: { id } })
    if (!track) throw new Error('Track not found')
    await trackRepository.remove(track)
    setSaving(false)
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

  return { track, deleteTrack, endTrack, saving, loading }
}
