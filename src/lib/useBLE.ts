import { toast } from '@/components/ui/use-toast'
import { RequestBleDeviceOptions } from '@capacitor-community/bluetooth-le'
import { Haptics } from '@capacitor/haptics'
import {
  connectToDevice,
  disconnectFromDevice,
  unsubscribeFromAvailableSensors,
} from './ble'
import { useBLEStore } from './store/useBLEStore'
import { useSenseBoxValuesStore } from './store/useSenseBoxValuesStore'

export default function useBLEDevice(_options: RequestBleDeviceOptions) {
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

    unsubscribeFromAvailableSensors()
    await disconnectFromDevice()
    setDevice(undefined)
    setConnected(false)
  }

  return {
    device,
    connect,
    disconnect,
    isConnected: connected,
  }
}
