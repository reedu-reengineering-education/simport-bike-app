import { toast } from '@/components/ui/use-toast'
import { RequestBleDeviceOptions } from '@capacitor-community/bluetooth-le'
import { Haptics } from '@capacitor/haptics'
import { connectToDevice, disconnectFromDevice } from './ble'
import { useBLEStore } from './store/useBLEStore'
import { useSenseBoxValuesStore } from './store/useSenseBoxValuesStore'

export default function useBLEDevice(options: RequestBleDeviceOptions) {
  const device = useBLEStore(state => state.device)
  const setDevice = useBLEStore(state => state.setDevice)
  const connected = useBLEStore(state => state.connected)
  const setConnected = useBLEStore(state => state.setConnected)
  const reset = useSenseBoxValuesStore(state => state.reset)

  /**
   * Connect to a BLE device
   */
  const connect = async (name?: string) => {
    try {
      await connectToDevice(name, () => {
        toast({
          variant: 'default',
          title: 'Bluetooth Verbindung getrennt',
        })
        Haptics.vibrate()
        setConnected(false)
      })

      setConnected(true)
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

    await disconnectFromDevice()
    setDevice(undefined)
    setConnected(false)
  }

  // /**
  //  * Listen to a characteristic
  //  * @param service BLE Service UUID
  //  * @param characteristic BLE Characteristic UUID
  //  * @param callback Callback function to be called when a new value is received
  //  * @returns A promise that resolves when the listener is started
  //  */
  // const listen = async (
  //   service: string,
  //   characteristic: string,
  //   callback: (_value: DataView) => void,
  // ) => {
  //   if (!device) return

  //   return await BleClient.startNotifications(
  //     device.deviceId,
  //     service,
  //     characteristic,
  //     callback,
  //   )
  // }

  // const send = async (
  //   service: string,
  //   characteristic: string,
  //   value: DataView,
  // ) => {
  //   if (!device) return

  //   return await BleClient.write(
  //     device.deviceId,
  //     service,
  //     characteristic,
  //     value,
  //     {
  //       timeout: 10000,
  //     },
  //   )
  // }

  return {
    device,
    connect,
    disconnect,
    // listen,
    // send,
    isConnected: connected,
  }
}
