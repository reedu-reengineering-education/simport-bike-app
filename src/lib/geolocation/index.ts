import { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation'
import { Capacitor, registerPlugin } from '@capacitor/core'
import { Geolocation, Track } from '../db/entities'
import senseBoxBikeDataSource from '../db/sources/senseBoxBikeDataSource'
import { useTrackRecordStore } from '../store/useTrackRecordStore'

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  'BackgroundGeolocation',
)

class GeolocationService {
  private static instance: GeolocationService
  private watcherId: string | undefined

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
      const watcherId = await BackgroundGeolocation.addWatcher(
        {
          backgroundMessage: 'Cancel to prevent battery drain.',
          backgroundTitle: 'Tracking You.',
          requestPermissions: true,
          stale: false,
        },
        async function callback(location, error) {
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

            const trackId = useTrackRecordStore.getState().currentTrackId

            if (!trackId) {
              // we are not recording a track, so we don't need to save the data
              return
            }

            const track = await senseBoxBikeDataSource.dataSource
              .getRepository(Track)
              .findOne({ where: { id: trackId } })

            if (!track) {
              throw new Error('Track not found')
            }

            const geolocation = new Geolocation()
            geolocation.timestamp = new Date(location?.time ?? Date.now())
            geolocation.latitude = location?.latitude
            geolocation.longitude = location?.longitude
            geolocation.speed = location?.speed ?? -1
            geolocation.track = track
            geolocation.save()
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
    } else {
      console.error('BackgroundGeolocation plugin is not available')
    }
  }
}

export default GeolocationService.getInstance()
