import {
  BackgroundGeolocationPlugin,
  Location,
} from '@capacitor-community/background-geolocation'
import { registerPlugin } from '@capacitor/core'
import { SIMPORTBackgroundGeolocationPlugin } from '@felixerdy/background-geolocation'
import { useEffect, useState } from 'react'
import { useSettingsStore } from './useSettingsStore'

interface BackgroundGeolocationPluginType
  extends BackgroundGeolocationPlugin,
    SIMPORTBackgroundGeolocationPlugin {
  type: string
}

const CapBackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  'BackgroundGeolocation',
)
const SIMPORTBackgroundGeolocation =
  registerPlugin<SIMPORTBackgroundGeolocationPlugin>(
    'SIMPORTBackgroundGeolocation',
  )

const CapBackgroundGeolocationWithProcessLocation = {
  addWatcher: CapBackgroundGeolocation.addWatcher,
  removeWatcher: CapBackgroundGeolocation.removeWatcher,
  openSettings: CapBackgroundGeolocation.openSettings,
  processLocation: async ({ location }: { location: Location }) => {
    return { location }
  },
  type: 'capacitor',
}

const SIMPORTBackgroundGeolocationWithProcessLocation = {
  addWatcher: SIMPORTBackgroundGeolocation.addWatcher,
  removeWatcher: SIMPORTBackgroundGeolocation.removeWatcher,
  openSettings: SIMPORTBackgroundGeolocation.openSettings,
  processLocation: SIMPORTBackgroundGeolocation.processLocation,
  type: 'simport',
}

export default function useBackgroundGeolocationPlugin() {
  const useSIMPORTPlugin = useSettingsStore(state => state.useSIMPORTToolkit)

  const [plugin, setPlugin] = useState<BackgroundGeolocationPluginType>(
    useSIMPORTPlugin
      ? SIMPORTBackgroundGeolocationWithProcessLocation
      : CapBackgroundGeolocationWithProcessLocation,
  )

  useEffect(() => {
    setPlugin(
      useSIMPORTPlugin
        ? SIMPORTBackgroundGeolocationWithProcessLocation
        : CapBackgroundGeolocationWithProcessLocation,
    )
  }, [useSIMPORTPlugin])

  return { BackgroundGeolocationPlugin: plugin }
}
