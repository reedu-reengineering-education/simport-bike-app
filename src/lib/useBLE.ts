import {
  BleClient,
  BleDevice,
  RequestBleDeviceOptions,
} from "@capacitor-community/bluetooth-le";
import { useState } from "react";

export default function useBLEDevice(options: RequestBleDeviceOptions) {
  const [device, setDevice] = useState<BleDevice>();
  const [connected, setConnected] = useState(false);

  /**
   * Connect to a BLE device
   */
  const connect = async () => {
    await BleClient.initialize();
    const device = await BleClient.requestDevice(options);
    await BleClient.connect(device.deviceId);
    setConnected(true);
    setDevice(device);
  };

  /**
   * Disconnect from the current device
   */
  const disconnect = async () => {
    if (!device) return;

    await BleClient.disconnect(device.deviceId);
    setConnected(false);
  };

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
    if (!device) return;

    return await BleClient.startNotifications(
      device.deviceId,
      service,
      characteristic,
      callback,
    );
  };

  return {
    device,
    connect,
    disconnect,
    listen,
    isConnected: connected,
  };
}
