import { toast } from '@/components/ui/use-toast'
import {
  BleClient,
  RequestBleDeviceOptions,
} from '@capacitor-community/bluetooth-le'
import { Haptics } from '@capacitor/haptics'
import { useBLEStore } from './store/useBLEStore'
import { useSenseBoxValuesStore } from './store/useSenseBoxValuesStore'

export default function useBLEDevice(options: RequestBleDeviceOptions) {
  const { device, setDevice, connected, setConnected } = useBLEStore()
  const { reset } = useSenseBoxValuesStore()

  /**
   * Connect to a BLE device
   */
  const connect = async () => {
    try {
      await BleClient.initialize()
      const device = await BleClient.requestDevice(options)
      await BleClient.connect(device.deviceId, () => {
        toast({
          variant: 'default',
          title: 'Bluetooth Verbindung getrennt',
        })
        Haptics.vibrate()
        setDevice(undefined)
        setConnected(false)
      })
      setConnected(true)
      setDevice(device)
      reset()
      return device
    } catch (e: any) {
      toast({
        variant: 'default',
        title: 'Bluetooth Verbindung fehlgeschlagen',
        description: e?.message,
      })
    }
  }

  /**
   * Disconnect from the current device
   */
  const disconnect = async () => {
    if (!device) return

    await BleClient.disconnect(device.deviceId)
    setDevice(undefined)
    setConnected(false)
  }

  /**
   * Listen to a characteristic
   * @param service BLE Service UUID
   * @param characteristic BLE Characteristic UUID
   * @param callback Callback function to be called when a new value is received
   * @returns A promise that resolves when the listener is started
   */
  const listen = async (
    service: string,
    characteristic: string,
    callback: (value: DataView) => void,
  ) => {
    if (!device) return

    return await BleClient.startNotifications(
      device.deviceId,
      service,
      characteristic,
      callback,
    )
  }

  const send = async (
    service: string,
    characteristic: string,
    value: DataView,
  ) => {
    if (!device) return

    return await BleClient.write(
      device.deviceId,
      service,
      characteristic,
      value,
      {
        timeout: 10000,
      },
    )
  }

  return {
    device,
    connect,
    disconnect,
    listen,
    send,
    isConnected: connected,
  }
}
