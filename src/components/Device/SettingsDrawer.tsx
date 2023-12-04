'use client'

import useBackgroundGeolocationPlugin from '@/lib/store/useBackgroundGeolocationPlugin'
import { useSettingsStore } from '@/lib/store/useSettingsStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { Cog } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '../ui/form'
import { Slider } from '../ui/slider'
import SliderDrawer from '../ui/slider-drawer'
import { Switch } from '../ui/switch'

const formSchema = z.object({
  switchUseSIMPORTToolkit: z.boolean(),
  uploadInterval: z.number().min(1).max(60),
  switchUseSmartphoneGPS: z.boolean(),
  switchLiveMode: z.boolean(),
  switchReducedMotion: z.boolean(),
})

export default function SettingsDrawer() {
  const uploadInterval = useSettingsStore(state => state.uploadInterval)
  const useDeviceGPS = useSettingsStore(state => state.useSenseBoxGPS)
  const reducedMotion = useSettingsStore(state => state.reducedMotion)
  const setReducedMotion = useSettingsStore(state => state.setReducedMotion)
  const useSIMPORTToolkit = useSettingsStore(state => state.useSIMPORTToolkit)

  const { BackgroundGeolocationPlugin } = useBackgroundGeolocationPlugin()

  // const { send } = useSenseBox()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      switchUseSIMPORTToolkit: useSIMPORTToolkit,
      uploadInterval: uploadInterval,
      switchUseSmartphoneGPS: !useDeviceGPS,
      switchLiveMode: false,
      switchReducedMotion: reducedMotion,
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // send(
    //   '29BD0A85-51E4-4D3C-914E-126541EB2A5E',
    //   '60B1D5CE-3539-44D2-BB35-FF2DAABE17FF',
    //   numbersToDataView([
    //     values.uploadInterval,
    //     values.switchUseDeviceGPS ? 1 : 0,
    //   ]),
    // )
    useSettingsStore.setState({
      useSIMPORTToolkit: values.switchUseSIMPORTToolkit,
      uploadInterval: values.uploadInterval,
      useSenseBoxGPS: !values.switchUseSmartphoneGPS,
    })
    setReducedMotion(values.switchReducedMotion)
    setOpen(false)
  }
  const [open, setOpen] = useState(false)

  return (
    <SliderDrawer
      open={open}
      trigger={
        <div className="h-full w-6">
          <Cog />
        </div>
      }
    >
      <div className="mx-auto max-w-md overflow-y-auto">
        <p className="mb-4 font-medium">Einstellungen</p>

        <div className="flex flex-col justify-end gap-2 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div>
                <div className="space-y-4">
                  <FormField
                    name="switchUseSIMPORTToolkit"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SIMPORT Toolkit</FormLabel>
                        <FormDescription>
                          Das SIMPORT Toolkit verwenden um die Positionsdaten zu
                          verschleiern
                        </FormDescription>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch().switchUseSIMPORTToolkit && (
                    <Button
                      onClick={() => BackgroundGeolocationPlugin.openSettings()}
                    >
                      Geolocation Settings
                    </Button>
                  )}
                  <FormField
                    name="uploadInterval"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Interval</FormLabel>
                        <FormDescription>
                          Upload Interval (in Sekunden) bestimmen
                        </FormDescription>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Slider
                              className="py-2"
                              onValueChange={e => field.onChange(e[0])}
                              defaultValue={[field.value]}
                              min={10}
                              max={60}
                              step={10}
                            />
                            <span className="whitespace-nowrap text-xs">
                              {form.watch('uploadInterval')} s
                            </span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="switchUseSmartphoneGPS"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Smartphone GPS</FormLabel>
                        <FormDescription>
                          Anstelle des senseBox GPS Moduls das GPS des
                          Smartphones verwenden
                        </FormDescription>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="switchReducedMotion"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reduced Motion</FormLabel>
                        <FormDescription>
                          Enable this setting to reduce animations
                        </FormDescription>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogClose className="float-right">
                <Button type="submit">Speichern</Button>
              </DialogClose>
            </form>
          </Form>
        </div>
      </div>
    </SliderDrawer>
  )
}
