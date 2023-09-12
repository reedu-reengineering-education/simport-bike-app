import { useEffect, useState } from "react";
import useBLEDevice from "./useBLE";

const BLE_SENSEBOX_SERVICE = "CF06A218-F68E-E0BE-AD04-8EBC1EB0BC84";
const BLE_TEMPERATURE_CHARACTERISTIC = "2CDF2174-35BE-FDC4-4CA2-6FD173F8B3A8";

const BLE_HUMIDITY_CHARACTERISTIC = "772DF7EC-8CDC-4EA9-86AF-410ABE0BA257";
const BLE_PM_CHARACTERISTIC = "7E14E070-84EA-489F-B45A-E1317364B979";
const BLE_ACCELERATION_CHARACTERISTIC = "B944AF10-F495-4560-968F-2F0D18CAB522";
const BLE_GPS_CHARACTERISTIC = "8EDF8EBB-1246-4329-928D-EE0C91DB2389";
const BLE_DISTANCE_CHARACTERISTIC = "B3491B60-C0F3-4306-A30D-49C91F37A62B";

function parsePackages(data: DataView) {
  const packages = data.byteLength / 4;

  let valueRecords: number[] = [];
  for (let i = 0; i < packages; i++) {
    valueRecords.push(data.getFloat32(i * 4, true));
  }

  return valueRecords;
}

type DataRecord = {
  timestamp: Date;
  temperature?: number;
  humidity?: number;
  pm1?: number;
  pm2_5?: number;
  pm4?: number;
  pm10?: number;
  acceleration_x?: number;
  acceleration_y?: number;
  acceleration_z?: number;
  gps_lat?: number;
  gps_lng?: number;
  gps_spd?: number;
  distance_l?: number;
};

export default function useSenseBox(timestampInterval: number = 5000) {
  const { isConnected, connect, listen, disconnect } = useBLEDevice({
    namePrefix: "senseBox",
  });

  const [rawDataRecords, setRawDataRecords] = useState<DataRecord[]>([]); // holds the incoming data

  const [values, setValues] = useState<DataRecord[]>([]); // holds the merged data (grouped by received timestamp)

  // update the values when new data is received
  useEffect(() => {
    const dataList: DataRecord[] = [];

    // merge the data by timestamp
    const buckets = rawDataRecords.reduce((acc, record) => {
      const { timestamp, ...data } = record;

      // check if there is already a record with the same timestamp
      const existingTimestamp = acc.find(
        (e) =>
          Math.abs(new Date(e.timestamp).getTime() - timestamp.getTime()) <
          timestampInterval
      ); // 5 seconds

      // add new record or update existing one
      if (!existingTimestamp) {
        acc.push({ timestamp, ...data });
      } else {
        const existingIndex = acc.indexOf(existingTimestamp);
        acc[existingIndex] = {
          ...existingTimestamp,
          ...data,
        };
      }

      return acc;
    }, dataList);

    setValues(buckets);
  }, [rawDataRecords, timestampInterval]);

  // listen to the BLE characteristics
  useEffect(() => {
    if (!isConnected) return;

    listen(BLE_SENSEBOX_SERVICE, BLE_TEMPERATURE_CHARACTERISTIC, (data) => {
      const [temperature] = parsePackages(data);
      appendToRawDataRecords({ temperature });
    });
    listen(BLE_SENSEBOX_SERVICE, BLE_HUMIDITY_CHARACTERISTIC, (data) => {
      const [humidity] = parsePackages(data);
      appendToRawDataRecords({ humidity });
    });
    listen(BLE_SENSEBOX_SERVICE, BLE_PM_CHARACTERISTIC, (data) => {
      const [pm1, pm2_5, pm4, pm10] = parsePackages(data);
      appendToRawDataRecords({ pm1, pm2_5, pm4, pm10 });
    });
    listen(BLE_SENSEBOX_SERVICE, BLE_ACCELERATION_CHARACTERISTIC, (data) => {
      const [acceleration_x, acceleration_y, acceleration_z] =
        parsePackages(data);

      appendToRawDataRecords({
        acceleration_x,
        acceleration_y,
        acceleration_z,
      });
    });
    listen(BLE_SENSEBOX_SERVICE, BLE_GPS_CHARACTERISTIC, (data) => {
      const [gps_lat, gps_lng, gps_spd] = parsePackages(data);
      appendToRawDataRecords({ gps_lat, gps_lng, gps_spd });
    });
    listen(BLE_SENSEBOX_SERVICE, BLE_DISTANCE_CHARACTERISTIC, (data) => {
      const [distance_l] = parsePackages(data);
      appendToRawDataRecords({ distance_l });
    });
  }, [isConnected, listen]);

  const resetValues = () => {
    setValues([]);
    setRawDataRecords([]);
  };

  const appendToRawDataRecords = (record: Omit<DataRecord, "timestamp">) =>
    setRawDataRecords((records) => [
      ...records,
      { timestamp: new Date(), ...record },
    ]);

  return {
    isConnected,
    connect,
    values,
    disconnect,
    resetValues,
  };
}
