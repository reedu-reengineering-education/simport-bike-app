import { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation'
import { Capacitor, registerPlugin } from '@capacitor/core'
import { Geolocation } from '../db/entities'
import senseBoxBikeDataSource from '../db/sources/senseBoxBikeDataSource'
import { useRawBLEDataStore } from '../store/use-raw-data-store'
import { useTrackRecordStore } from '../store/useTrackRecordStore'

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  'BackgroundGeolocation',
)

class GeolocationService {
  private static instance: GeolocationService
  private watcherId: string | undefined

  private geolocationBuffer: Geolocation[] = []
  private intervalId: NodeJS.Timeout | undefined

  public static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService()
    }
    return GeolocationService.instance
  }

  private constructor() {
    console.log('GeolocationService instance created')
    this.watcherId = undefined
  }

  public async startTracking() {
    if (Capacitor.isPluginAvailable('BackgroundGeolocation')) {
      console.log('Starting geolocation watcher')
      console.log('Current watcherId', this.watcherId)
      if (this.watcherId) {
        // remove old watcher
        await this.stopTracking()
      }

      // save geolocations every 10 seconds
      this.intervalId = setInterval(() => {
        this.saveGeolocations()
      }, 10000)

      const watcherId = await BackgroundGeolocation.addWatcher(
        {
          backgroundMessage: 'senseBox:bike is tracking your location.',
          backgroundTitle: 'senseBox:bike',
          requestPermissions: true,
          stale: false,
        },
        async (location, error) => {
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
            if (!location) {
              return
            }

            useRawBLEDataStore.getState().addRawGeolocationData({
              type: 'Point',
              coordinates: [location.longitude, location.latitude],
            })

            const trackId = useTrackRecordStore.getState().currentTrackId

            if (!trackId) {
              // we are not recording a track, so we don't need to save the data
              return
            }

            const geolocation = new Geolocation()
            geolocation.timestamp = new Date(location?.time ?? Date.now())
            geolocation.latitude = location?.latitude
            geolocation.longitude = location?.longitude
            geolocation.speed = location?.speed ?? -1
            geolocation.trackId = trackId

            this.geolocationBuffer.push(geolocation)
          }
        },
      )
      console.log('registering watcher', watcherId)
      this.watcherId = watcherId
      return watcherId
    } else {
      console.error('BackgroundGeolocation plugin is not available')
    }
  }

  public async stopTracking() {
    if (Capacitor.isPluginAvailable('BackgroundGeolocation')) {
      if (!this.watcherId) {
        return
      }
      console.log('Stopping geolocation watcher', this.watcherId)
      await BackgroundGeolocation.removeWatcher({
        id: this.watcherId,
      })
      this.watcherId = undefined

      this.saveGeolocations()
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = undefined
      }
    } else {
      console.error('BackgroundGeolocation plugin is not available')
    }
  }

  private async saveGeolocations() {
    await senseBoxBikeDataSource.dataSource.transaction(async manager => {
      for (const geolocation of this.geolocationBuffer) {
        await manager.save(geolocation)
      }
    })
    this.geolocationBuffer = []
  }
}

export default GeolocationService.getInstance()
