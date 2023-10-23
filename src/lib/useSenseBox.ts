import { useEffect, useRef, useState } from 'react'
import {
  BackgroundGeolocationPlugin,
  Location,
} from '@capacitor-community/background-geolocation'
import { registerPlugin } from '@capacitor/core'

import useBLEDevice from './useBLE'
import {
  senseBoxDataRecord,
  useSenseBoxValuesStore,
} from './store/useSenseBoxValuesStore'
import { useSettingsStore } from './store/useSettingsStore'
import { uploadData } from './api/openSenseMapClient'
import { useAuthStore } from './store/useAuthStore'
import match from './senseBoxSensorIdMatcher'

const BLE_SENSEBOX_SERVICE = 'CF06A218-F68E-E0BE-AD04-8EBC1EB0BC84'
const BLE_TEMPERATURE_CHARACTERISTIC = '2CDF2174-35BE-FDC4-4CA2-6FD173F8B3A8'

const BLE_HUMIDITY_CHARACTERISTIC = '772DF7EC-8CDC-4EA9-86AF-410ABE0BA257'
const BLE_PM_CHARACTERISTIC = '7E14E070-84EA-489F-B45A-E1317364B979'
const BLE_ACCELERATION_CHARACTERISTIC = 'B944AF10-F495-4560-968F-2F0D18CAB522'
const BLE_GPS_CHARACTERISTIC = '8EDF8EBB-1246-4329-928D-EE0C91DB2389'
const BLE_DISTANCE_CHARACTERISTIC = 'B3491B60-C0F3-4306-A30D-49C91F37A62B'

const BLE_CONFIG_SERVICE = '29BD0A85-51E4-4D3C-914E-126541EB2A5E'
const BLE_CONFIG_CHARACTERISTIC = '60B1D5CE-3539-44D2-BB35-FF2DAABE17FF'

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  'BackgroundGeolocation',
)

function parsePackages(data: DataView) {
  const packages = data.byteLength / 4

  let valueRecords: number[] = []
  for (let i = 0; i < packages; i++) {
    valueRecords.push(data.getFloat32(i * 4, true))
  }

  return valueRecords
}

export default function useSenseBox(timestampInterval: number = 500) {
  const { isConnected, connect, listen, send, disconnect } = useBLEDevice({
    namePrefix: 'senseBox',
  })
  const { values, setValues } = useSenseBoxValuesStore()
  const { selectedBox } = useAuthStore()
  const { useSenseBoxGPS } = useSettingsStore()
  const useSenseBoxGPSRef = useRef<boolean>()
  useSenseBoxGPSRef.current = useSenseBoxGPS

  const [rawDataRecords, setRawDataRecords] = useState<senseBoxDataRecord[]>([]) // holds the incoming data

  const [watcherId, setWatcherId] = useState<string>()

  const [location, setLocation] = useState<Location>()
  const locationRef = useRef<Location>()
  locationRef.current = location

  const [lastUploadTimestamp, setLastUploadTimestamp] = useState(
    new Date('1970-01-01'),
  )

  useEffect(() => {
    if (useSenseBoxGPS) {
      if (watcherId)
        BackgroundGeolocation.removeWatcher({ id: watcherId }).then(() =>
          setWatcherId(undefined),
        )
      return
    }

    BackgroundGeolocation.addWatcher(
      {
        backgroundMessage: 'Cancel to prevent battery drain.',
        backgroundTitle: 'Tracking You.',
        requestPermissions: true,
        stale: false,
      },
      function callback(location, error) {
        if (error) {
          if (error.code === 'NOT_AUTHORIZED') {
            if (
              window.confirm(
                'This app needs your location, ' +
                  'but does not have permission.\n\n' +
                  'Open settings now?',
              )
            ) {
              BackgroundGeolocation.openSettings()
            }
          }
          console.error(error)
        } else {
          setLocation(location)
        }
      },
    ).then(watcherId => {
      setWatcherId(watcherId)
    })

    return () => {
      console.log('in unmount')
      if (!watcherId) return

      console.log('removing watcher', watcherId)
      BackgroundGeolocation.removeWatcher({
        id: watcherId,
      })
    }
  }, [useSenseBoxGPS])

  // update the values when new data is received
  useEffect(() => {
    const dataList: senseBoxDataRecord[] = []

    // merge the data by timestamp
    const buckets = rawDataRecords.reduce((acc, record) => {
      const { timestamp, ...data } = record

      // check if there is already a record with similar timestamp
      const existingTimestamp = acc.find(
        e =>
          Math.abs(new Date(e.timestamp).getTime() - timestamp.getTime()) <
          timestampInterval,
      ) // 5 seconds

      // add new record or update existing one
      if (!existingTimestamp) {
        acc.push({ timestamp, ...data })
      } else {
        const existingIndex = acc.indexOf(existingTimestamp)
        acc[existingIndex] = {
          ...existingTimestamp,
          ...data,
        }
      }

      return acc
    }, dataList)

    setValues(buckets)
  }, [rawDataRecords, timestampInterval])

  // listen to the BLE characteristics
  useEffect(() => {
    if (!isConnected) return

    listen(BLE_SENSEBOX_SERVICE, BLE_TEMPERATURE_CHARACTERISTIC, data => {
      const [temperature] = parsePackages(data)
      appendToRawDataRecords({ temperature })
    })
    listen(BLE_SENSEBOX_SERVICE, BLE_HUMIDITY_CHARACTERISTIC, data => {
      const [humidity] = parsePackages(data)
      appendToRawDataRecords({ humidity })
    })
    listen(BLE_SENSEBOX_SERVICE, BLE_PM_CHARACTERISTIC, data => {
      const [pm1, pm2_5, pm4, pm10] = parsePackages(data)
      appendToRawDataRecords({ pm1, pm2_5, pm4, pm10 })
    })
    listen(BLE_SENSEBOX_SERVICE, BLE_ACCELERATION_CHARACTERISTIC, data => {
      const [acceleration_x, acceleration_y, acceleration_z] =
        parsePackages(data)

      appendToRawDataRecords({
        acceleration_x,
        acceleration_y,
        acceleration_z,
      })
    })
    listen(BLE_SENSEBOX_SERVICE, BLE_GPS_CHARACTERISTIC, data => {
      const [gps_lat, gps_lng, gps_spd] = parsePackages(data)
      appendToRawDataRecords({ gps_lat, gps_lng, gps_spd })
    })
    listen(BLE_SENSEBOX_SERVICE, BLE_DISTANCE_CHARACTERISTIC, data => {
      const [distance_l] = parsePackages(data)
      appendToRawDataRecords({ distance_l })
    })
  }, [isConnected])

  useEffect(() => {
    const latestValue = values.at(-1)
    const formattedLocation: Location = {
      latitude: latestValue?.gps_lat ?? 0,
      longitude: latestValue?.gps_lng ?? 0,
      speed: latestValue?.gps_spd ?? 0,
      time: latestValue?.timestamp.getTime() ?? null,
      accuracy: 0,
      altitude: 0,
      bearing: 0,
      simulated: false,
      altitudeAccuracy: 0,
    }
    // BackgroundGeolocation.processLocation({ location: formattedLocation }).then(
    //   location => {},
    // )
  }, [values])

  const resetValues = () => {
    setValues([])
    setRawDataRecords([])
  }

  const appendToRawDataRecords = (
    record: Omit<senseBoxDataRecord, 'timestamp'>,
  ) => {
    let data = record
    if (!useSenseBoxGPSRef.current) {
      data = {
        ...data,
        gps_lat: locationRef.current?.latitude,
        gps_lng: locationRef.current?.longitude,
        gps_spd: locationRef.current?.speed ?? 0,
      }
    }

    setRawDataRecords(records => [
      ...records,
      { timestamp: new Date(), ...data },
    ])
  }

  const uploadValues = async () => {
    if (!selectedBox) {
      throw new Error('No box selected.')
    }

    const data = values
      .slice(-2500)
      .flatMap(record => match(selectedBox, record))
      .map(record => ({
        ...record,
        value: record.value.toFixed(2),
      }))

    const latestTimestamp = Math.max(
      ...data.map(e => new Date(e.createdAt).getTime()),
    )
    setLastUploadTimestamp(new Date(latestTimestamp))

    uploadData(selectedBox, data)
  }

  return {
    isConnected,
    connect,
    values,
    disconnect,
    resetValues,
    send,
    uploadData: uploadValues,
  }
}
