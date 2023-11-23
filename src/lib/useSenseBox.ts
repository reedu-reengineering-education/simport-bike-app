import { registerPlugin } from '@capacitor/core'
import {
  BackgroundGeolocationPlugin,
  Location,
} from '@felixerdy/background-geolocation'
import { useEffect, useRef, useState } from 'react'

import { SenseBoxDataParser } from './SenseBoxDataParser'
import { usePermissionsStore } from './store/usePermissionsStore'
import {
  senseBoxDataRecord,
  useSenseBoxValuesStore,
} from './store/useSenseBoxValuesStore'
import { useSettingsStore } from './store/useSettingsStore'
import useBLEDevice from './useBLE'

const BLE_SENSEBOX_SERVICE = 'CF06A218-F68E-E0BE-AD04-8EBC1EB0BC84'
const BLE_TEMPERATURE_CHARACTERISTIC = '2CDF2174-35BE-FDC4-4CA2-6FD173F8B3A8'

const BLE_HUMIDITY_CHARACTERISTIC = '772DF7EC-8CDC-4EA9-86AF-410ABE0BA257'
const BLE_PM_CHARACTERISTIC = '7E14E070-84EA-489F-B45A-E1317364B979'
const BLE_ACCELERATION_CHARACTERISTIC = 'B944AF10-F495-4560-968F-2F0D18CAB522'
const BLE_GPS_CHARACTERISTIC = '8EDF8EBB-1246-4329-928D-EE0C91DB2389'
const BLE_DISTANCE_CHARACTERISTIC = 'B3491B60-C0F3-4306-A30D-49C91F37A62B'

const _BLE_CONFIG_SERVICE = '29BD0A85-51E4-4D3C-914E-126541EB2A5E'
const _BLE_CONFIG_CHARACTERISTIC = '60B1D5CE-3539-44D2-BB35-FF2DAABE17FF'

export const BackgroundGeolocation =
  registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation')

/**
 * Parses the data received from the SenseBox and returns an array of values.
 * @param data - The data received from the SenseBox as a DataView.
 * @returns An array of values parsed from the data.
 */
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
  const values = useSenseBoxValuesStore(state => state.values)
  const useSenseBoxGPS = useSettingsStore(state => state.useSenseBoxGPS)
  const useSenseBoxGPSRef = useRef<boolean>()
  useSenseBoxGPSRef.current = useSenseBoxGPS

  const dataParser = SenseBoxDataParser.getInstance(timestampInterval)

  const [watcherId, setWatcherId] = useState<string>()

  const [location, setLocation] = useState<Location>()
  const locationRef = useRef<Location>()
  locationRef.current = location

  const setShowGeolocationPermissionsDrawer = usePermissionsStore(
    state => state.setShowGeolocationPermissionsDrawer,
  )
  const geolocationPermissionGranted = usePermissionsStore(
    state => state.geolocationPermissionGranted,
  )
  useEffect(() => {
    if (useSenseBoxGPS) {
      if (watcherId)
        BackgroundGeolocation.removeWatcher({ id: watcherId }).then(() =>
          setWatcherId(undefined),
        )
      return
    }

    if (!isConnected) return

    if (!geolocationPermissionGranted) {
      setShowGeolocationPermissionsDrawer(true)
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
      if (!watcherId) return

      BackgroundGeolocation.removeWatcher({
        id: watcherId,
      })
    }
  }, [useSenseBoxGPS, isConnected, geolocationPermissionGranted])

  // listen to the BLE characteristics
  useEffect(() => {
    if (!isConnected) {
      if (!watcherId) return

      BackgroundGeolocation.removeWatcher({
        id: watcherId,
      })
    }

    listen(BLE_SENSEBOX_SERVICE, BLE_TEMPERATURE_CHARACTERISTIC, data => {
      const [temperature] = parsePackages(data)
      pushDataToProcess({ temperature })
    })
    listen(BLE_SENSEBOX_SERVICE, BLE_HUMIDITY_CHARACTERISTIC, data => {
      const [humidity] = parsePackages(data)
      pushDataToProcess({ humidity })
    })
    listen(BLE_SENSEBOX_SERVICE, BLE_PM_CHARACTERISTIC, data => {
      const [pm1, pm2_5, pm4, pm10] = parsePackages(data)
      pushDataToProcess({ pm1, pm2_5, pm4, pm10 })
    })
    listen(BLE_SENSEBOX_SERVICE, BLE_ACCELERATION_CHARACTERISTIC, data => {
      const [acceleration_x, acceleration_y, acceleration_z] =
        parsePackages(data)

      pushDataToProcess({
        acceleration_x,
        acceleration_y,
        acceleration_z,
      })
    })
    listen(BLE_SENSEBOX_SERVICE, BLE_GPS_CHARACTERISTIC, async data => {
      const [gps_lat, gps_lng, gps_spd] = parsePackages(data)

      // use smartphone GPS. no need to process the senseBox GPS data
      if (!useSenseBoxGPSRef.current) {
        pushDataToProcess({
          gps_lat,
          gps_lng,
          gps_spd,
        })
        return
      }

      try {
        const { location } = await BackgroundGeolocation.processLocation({
          location: {
            latitude: gps_lat,
            longitude: gps_lng,
            speed: gps_spd,
            accuracy: 0,
            simulated: false,
            altitude: null,
            bearing: null,
            altitudeAccuracy: null,
            time: new Date().getTime(),
          },
        })

        pushDataToProcess({
          gps_lat: location.latitude,
          gps_lng: location.longitude,
          gps_spd: location.speed ?? 0,
        } as senseBoxDataRecord)
      } catch (e) {
        console.error(e)
      }
    })
    listen(BLE_SENSEBOX_SERVICE, BLE_DISTANCE_CHARACTERISTIC, data => {
      const [distance_l] = parsePackages(data)
      pushDataToProcess({ distance_l })
    })
  }, [isConnected])

  const pushDataToProcess = (record: Omit<senseBoxDataRecord, 'timestamp'>) => {
    let data = record
    if (!useSenseBoxGPSRef.current) {
      data = {
        ...data,
        gps_lat: locationRef.current?.latitude,
        gps_lng: locationRef.current?.longitude,
        gps_spd: locationRef.current?.speed ?? 0,
      }
    }

    dataParser.pushData(data)
  }

  return {
    isConnected,
    connect,
    values,
    disconnect,
    send,
  }
}
