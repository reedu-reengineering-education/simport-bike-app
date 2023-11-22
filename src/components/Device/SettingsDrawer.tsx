'use client'

import { useSettingsStore } from '@/lib/store/useSettingsStore'
import { BackgroundGeolocation } from '@/lib/useSenseBox'
import { App } from '@capacitor/app'
import { PluginListenerHandle } from '@capacitor/core'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { Cog, ExternalLinkIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Drawer } from 'vaul'
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
import { Switch } from '../ui/switch'

const formSchema = z.object({
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

  // const { send } = useSenseBox()

  useEffect(() => {
    let listener: PluginListenerHandle | undefined

    App.addListener('backButton', () => {
      setOpen(false)
    }).then(l => (listener = l))

    return () => {
      if (listener) listener.remove()
    }
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      uploadInterval: values.uploadInterval,
      useSenseBoxGPS: !values.switchUseSmartphoneGPS,
    })
    setReducedMotion(values.switchReducedMotion)
    setOpen(false)
  }
  const [open, setOpen] = useState(false)

  // fix for disappearing map
  useEffect(() => {
    if (open) {
      document.body.style.height = '100%'
    }
  }, [open])

  return (
    <Drawer.Root open={open} onClose={() => setOpen(false)}>
      <Drawer.Trigger
        onClick={() => setOpen(true)}
        className="h-full focus:outline-none"
        asChild
      >
        <div className="h-full w-6">
          <Cog />
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-20 bg-black/60" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-30 mt-24 flex max-h-[75%] flex-col rounded-t-lg border-t bg-background focus:outline-none">
          <div className="mx-auto my-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
          <div className="flex-1 overflow-auto rounded-t-[10px] p-4">
            <div className="mx-auto max-w-md overflow-y-auto">
              <p className="mb-4 font-medium">Einstellungen</p>
              <Button onClick={() => BackgroundGeolocation.openSettings()}>
                Geolocation Settings
              </Button>
              <div className="flex flex-col justify-end gap-2 py-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8"
                  >
                    <div>
                      <div className="space-y-4">
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
          </div>
          <SettingsDrawerFooter />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

function SettingsDrawerFooter() {
  return (
    <div className="mt-auto border-t bg-muted p-4 pb-safe-or-4">
      <div className="mx-auto flex max-w-md justify-end gap-6">
        <a
          className="gap-0.25 flex items-center text-xs text-muted-foreground"
          href="https://opensensemap.org"
          target="_blank"
        >
          openSenseMap
          <ExternalLinkIcon className="ml-1 h-3 w-3" />
        </a>
        <a
          className="gap-0.25 flex items-center text-xs text-muted-foreground"
          href="https://reedu.de"
          target="_blank"
        >
          re:edu
          <ExternalLinkIcon className="ml-1 h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
