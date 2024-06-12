import { useEffect, useState } from 'react'
import { DataSource, Repository } from 'typeorm'
import { Geolocation, Measurement, Track } from '../entities'
import senseBoxBikeDataSource from '../sources/senseBoxBikeDataSource'

let trackRepository: Repository<Track>
let geolocationRepository: Repository<Geolocation>
let measurementRepository: Repository<Measurement>
let connection: DataSource

const initializeConnection = async () => {
  if (!connection) connection = senseBoxBikeDataSource.dataSource
  trackRepository = connection.getRepository(Track)
  geolocationRepository = connection.getRepository(Geolocation)
  measurementRepository = connection.getRepository(Measurement)
}

export const useTrack = (id?: string) => {
  const [track, setTrack] = useState<Track>()
  const [measurementTypes, setMeasurementTypes] = useState<string[]>([])
  const [trajectory, setTrajectory] = useState<Geolocation[]>([])
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchTrack = async () => {
      await initializeConnection()

      const track = await trackRepository.findOne({
        where: { id },
        relations: ['geolocations'],
        relationLoadStrategy: 'query',
      })
      if (!track) throw new Error('Track not found')

      const measurementTypes = await measurementRepository.find({
        where: { track: { id } },
        select: {
          type: true,
        },
      })
      const distinctMeasurementTypes = Array.from(
        new Set(measurementTypes.map(({ type }) => type)),
      )
      setMeasurementTypes(distinctMeasurementTypes)
      setTrack(track)

      const trajectory = await geolocationRepository.find({
        where: { track: { id } },
        order: { timestamp: 'ASC' },
      })
      setTrajectory(trajectory)

      const measurements = await measurementRepository.find({
        where: { track: { id } },
        order: { timestamp: 'ASC' },
      })
      setMeasurements(measurements)

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

  return {
    track,
    measurementTypes,
    trajectory,
    measurements,
    deleteTrack,
    endTrack,
    saving,
    loading,
  }
}
