import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le'
import { characteristicRegistry } from '../sensors'
import { BLE_SENSEBOX_SERVICE } from '../sensors/base-sensor'
import { useRawBLEDataStore } from '../store/use-raw-data-store'
import { useBLEStore } from '../store/useBLEStore'

export const connectToDevice = async (
  name?: string,
  onDisconnect?: (_deviceId: string) => void,
) => {
  await BleClient.initialize({
    androidNeverForLocation: true,
  })
  let device: BleDevice
  if (name) {
    device = await new Promise(async (resolve, reject) => {
      try {
        const timeout = setTimeout(async () => {
          await BleClient.stopLEScan()
          reject('Timeout')
        }, 10000)
        await BleClient.requestLEScan(
          {
            name,
          },
          result => {
            clearTimeout(timeout)
            resolve(result.device)
          },
        )
      } catch (e) {
        reject(e)
      }
    })
  } else {
    device = await BleClient.requestDevice({
      // services: [BLE_SENSEBOX_SERVICE.toLowerCase()],
      namePrefix: 'senseBox',
      optionalServices: [BLE_SENSEBOX_SERVICE.toLowerCase()],
    })
  }
  if (!device) {
    throw new Error('No device found')
  }

  await BleClient.connect(device.deviceId, (deviceId: string) => {
    if (onDisconnect) {
      onDisconnect(deviceId)
    }
    useBLEStore.getState().setDevice(undefined)
  })
  useBLEStore.getState().setDevice(device)
}

export const disconnectFromDevice = async () => {
  const deviceId = useBLEStore.getState().device?.deviceId
  if (!deviceId) {
    throw new Error('No device connected')
  }
  await BleClient.disconnect(deviceId)
  useRawBLEDataStore.getState().reset()
}

export const subscribeToAvailableSensors = async () => {
  const deviceId = useBLEStore.getState().device?.deviceId
  if (!deviceId) {
    throw new Error('No device connected')
  }
  const services = await BleClient.getServices(deviceId)
  console.log('🦈 Services', services)
  const senseBoxService = services.find(
    service => service.uuid === BLE_SENSEBOX_SERVICE.toLowerCase(),
  )
  if (!senseBoxService) {
    throw new Error('No senseBox service found')
  }
  for (const characteristic of senseBoxService.characteristics) {
    const upperCaseUUID = characteristic.uuid.toUpperCase()
    if (characteristicRegistry[upperCaseUUID]) {
      const sensor = new characteristicRegistry[upperCaseUUID]()
      sensor.subscribe()
    }
  }
}

export const getSubscribableSensors = async () => {
  const deviceId = useBLEStore.getState().device?.deviceId
  if (!deviceId) {
    throw new Error('No device connected')
  }
  const services = await BleClient.getServices(deviceId)
  const availableCharacteristics = []
  for (const service of services) {
    console.log('🦈 Service', service)
    for (const characteristic of service.characteristics) {
      if (characteristicRegistry[characteristic.uuid]) {
        availableCharacteristics.push(characteristic.uuid)
      }
    }
  }
  return availableCharacteristics
}
