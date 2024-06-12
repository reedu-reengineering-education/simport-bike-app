import { useEffect, useState } from 'react'
import { DataSource, Repository } from 'typeorm'
import { Measurement } from '../entities'
import senseBoxBikeDataSource from '../sources/senseBoxBikeDataSource'

let measurementRepository: Repository<Measurement>
let connection: DataSource

const initializeConnection = async () => {
  if (!connection) connection = senseBoxBikeDataSource.dataSource
  measurementRepository = connection.getRepository(Measurement)
}

export const useMeasurements = (id?: string) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchMeasurements = async () => {
      await initializeConnection()

      const measurementsQuery = await measurementRepository.find({
        where: { track: { id } },
      })
      if (!measurementsQuery) throw new Error('Track not found')

      setMeasurements(measurementsQuery)

      setLoading(false)
    }

    fetchMeasurements()
  }, [id])

  return {
    measurements,
    loading,
  }
}
