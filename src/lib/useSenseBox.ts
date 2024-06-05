import { useEffect, useRef } from 'react'

import { KeepAwake } from '@capacitor-community/keep-awake'
import { PushNotifications } from '@capacitor/push-notifications'
import { usePermissionsStore } from './store/usePermissionsStore'
import { useSenseBoxValuesStore } from './store/useSenseBoxValuesStore'
import { useSettingsStore } from './store/useSettingsStore'
import useBLEDevice from './useBLE'

import { subscribeToAvailableSensors } from './ble'

import GeolocationService from './geolocation'

// const BLE_SENSEBOX_SERVICE = 'CF06A218-F68E-E0BE-AD04-8EBC1EB0BC84'
// const BLE_TEMPERATURE_CHARACTERISTIC = '2CDF2174-35BE-FDC4-4CA2-6FD173F8B3A8'

// const BLE_HUMIDITY_CHARACTERISTIC = '772DF7EC-8CDC-4EA9-86AF-410ABE0BA257'
// const BLE_PM_CHARACTERISTIC = '7E14E070-84EA-489F-B45A-E1317364B979'
// const BLE_ACCELERATION_CHARACTERISTIC = 'B944AF10-F495-4560-968F-2F0D18CAB522'
// const BLE_GPS_CHARACTERISTIC = '8EDF8EBB-1246-4329-928D-EE0C91DB2389'
// const BLE_DISTANCE_CHARACTERISTIC = 'B3491B60-C0F3-4306-A30D-49C91F37A62B'

// const _BLE_CONFIG_SERVICE = '29BD0A85-51E4-4D3C-914E-126541EB2A5E'
// const _BLE_CONFIG_CHARACTERISTIC = '60B1D5CE-3539-44D2-BB35-FF2DAABE17FF'

export default function useSenseBox() {
  const { isConnected, connect, disconnect } = useBLEDevice({
    namePrefix: 'senseBox',
  })
  const values = useSenseBoxValuesStore(state => state.values)
  const useSenseBoxGPS = useSettingsStore(state => state.useSenseBoxGPS)
  const useSenseBoxGPSRef = useRef<boolean>()
  useSenseBoxGPSRef.current = useSenseBoxGPS

  // const dataParser = SenseBoxDataParser.getInstance(timestampInterval)

  const setShowGeolocationPermissionsDrawer = usePermissionsStore(
    state => state.setShowGeolocationPermissionsDrawer,
  )
  const geolocationPermissionGranted = usePermissionsStore(
    state => state.geolocationPermissionGranted,
  )
  useEffect(() => {
    if (!isConnected) return

    PushNotifications.requestPermissions()

    if (!geolocationPermissionGranted) {
      setShowGeolocationPermissionsDrawer(true)
      return
    }
  }, [useSenseBoxGPS, isConnected, geolocationPermissionGranted])

  useEffect(() => {
    if (isConnected) {
      KeepAwake.keepAwake()
      console.log('🐠 Subscribing to sensors blub blub')
      // listen to the BLE characteristics
      subscribeToAvailableSensors()
      GeolocationService.startTracking()
    }

    if (!isConnected) {
      console.log('we are not connected, so we can stop geolocation')
      GeolocationService.stopTracking()
      KeepAwake.allowSleep()
    }
  }, [isConnected])

  return {
    isConnected,
    connect,
    values,
    disconnect,
  }
}
