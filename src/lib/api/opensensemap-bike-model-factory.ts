export type senseBoxBikeModel = 'default' | 'atrai'

export const senseBoxBikeModelFactory = (
  name: string,
  longitude: number,
  latitude: number,
  grouptag?: string,
  model: senseBoxBikeModel = 'default',
) => {
  const baseProperties = {
    name: name,
    exposure: 'mobile',
    location: [longitude, latitude],
    grouptag: [grouptag ?? 'bike'],
  }
  return {
    ...baseProperties,
    sensors: sensors[model],
  }
}

const sensors: Record<senseBoxBikeModel, any[]> = {
  default: [
    {
      id: 0,
      icon: 'osem-thermometer',
      title: 'Temperatur',
      unit: '°C',
      sensorType: 'HDC1080',
    },
    {
      id: 1,
      icon: 'osem-humidity',
      title: 'rel. Luftfeuchte',
      unit: '%',
      sensorType: 'HDC1080',
    },
    {
      id: 2,
      icon: 'osem-cloud',
      title: 'PM1',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 3,
      icon: 'osem-cloud',
      title: 'PM25',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 4,
      icon: 'osem-cloud',
      title: 'PM4',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 5,
      icon: 'osem-cloud',
      title: 'PM10',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 6,
      icon: 'osem-signal',
      title: 'Distanz Links',
      unit: 'cm',
      sensorType: 'HC-SR04',
    },
    {
      id: 7,
      icon: 'osem-shock',
      title: 'Beschleunigung X',
      unit: 'm/s²',
      sensorType: 'MPU-6050',
    },
    {
      id: 8,
      icon: 'osem-shock',
      title: 'Beschleunigung Y',
      unit: 'm/s²',
      sensorType: 'MPU-6050',
    },
    {
      id: 9,
      icon: 'osem-shock',
      title: 'Beschleunigung Z',
      unit: 'm/s²',
      sensorType: 'MPU-6050',
    },
    {
      id: 10,
      icon: 'osem-dashboard',
      title: 'Geschwindigkeit',
      unit: 'km/h',
      sensorType: 'GPS',
    },
  ],
  atrai: [
    {
      id: 0,
      icon: 'osem-thermometer',
      title: 'Temperatur',
      unit: '°C',
      sensorType: 'HDC1080',
    },
    {
      id: 1,
      icon: 'osem-humidity',
      title: 'rel. Luftfeuchte',
      unit: '%',
      sensorType: 'HDC1080',
    },
    {
      id: 2,
      icon: 'osem-cloud',
      title: 'PM1',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 3,
      icon: 'osem-cloud',
      title: 'PM2.5',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 4,
      icon: 'osem-cloud',
      title: 'PM4',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 5,
      icon: 'osem-cloud',
      title: 'PM10',
      unit: 'µg/m³',
      sensorType: 'SPS30',
    },
    {
      id: 6,
      icon: 'osem-shock',
      title: 'Überholvorgang',
      unit: '%',
      sensorType: 'VL53L8CX',
    },
    {
      id: 7,
      icon: 'osem-shock',
      title: 'Beschleunigung X',
      unit: 'm/s²',
      sensorType: 'MPU-6050',
    },
    {
      id: 8,
      icon: 'osem-shock',
      title: 'Beschleunigung Y',
      unit: 'm/s²',
      sensorType: 'MPU-6050',
    },
    {
      id: 9,
      icon: 'osem-shock',
      title: 'Beschleunigung Z',
      unit: 'm/s²',
      sensorType: 'MPU-6050',
    },
    {
      id: 10,
      icon: 'osem-dashboard',
      title: 'Geschwindigkeit',
      unit: 'km/h',
      sensorType: 'GPS',
    },
  ],
}
