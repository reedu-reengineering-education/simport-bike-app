import { useEffect, useState } from 'react'
import { DataSource, Repository } from 'typeorm'
import { Measurement, Track } from '../entities'
import senseBoxBikeDataSource from '../sources/senseBoxBikeDataSource'

let trackRepository: Repository<Track>
let measurementRepository: Repository<Measurement>
let connection: DataSource

const initializeConnection = async () => {
  if (!connection) connection = senseBoxBikeDataSource.dataSource
  trackRepository = connection.getRepository(Track)
  measurementRepository = connection.getRepository(Measurement)
}

type MeasurementType = {
  type: string
  attributes?: string[]
}

export const useTrack = (id?: string) => {
  const [track, setTrack] = useState<Track>()
  const [measurementTypes, setMeasurementTypes] = useState<MeasurementType[]>(
    [],
  )
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
          attribute: true,
        },
      })

      const distinctMeasurementTypes: MeasurementType[] = []
      measurementTypes.forEach(({ type, attribute }) => {
        const existingType = distinctMeasurementTypes.find(
          ({ type: existingType }) => existingType === type,
        )
        if (existingType) {
          if (attribute && !existingType.attributes?.includes(attribute)) {
            existingType.attributes?.push(attribute)
          }
        } else {
          distinctMeasurementTypes.push({
            type,
            attributes: attribute ? [attribute] : undefined,
          })
        }
      })

      setMeasurementTypes(distinctMeasurementTypes)
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

  return {
    track,
    measurementTypes,
    deleteTrack,
    endTrack,
    saving,
    loading,
  }
}
