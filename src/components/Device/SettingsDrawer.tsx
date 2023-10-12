'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { Cog, Settings2Icon, SettingsIcon, UserCog2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
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
import { useSettingsStore } from '@/lib/store/useSettingsStore'
import { Button } from '../ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import useSenseBox from '@/lib/useSenseBox'
import { numbersToDataView } from '@capacitor-community/bluetooth-le'
import { registerPlugin } from '@capacitor/core'
import { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation'
import { Drawer } from 'vaul'
import { useEffect, useState } from 'react'

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  'BackgroundGeolocation',
)

const formSchema = z.object({
  uploadInterval: z.number().min(1).max(60),
  switchUseDeviceGPS: z.boolean(),
  switchLiveMode: z.boolean(),
})

export default function SettingsDrawer() {
  const uploadInterval = useSettingsStore(state => state.uploadInterval)
  const useDeviceGPS = useSettingsStore(state => state.useSenseBoxGPS)
  const { send } = useSenseBox()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uploadInterval: uploadInterval,
      switchUseDeviceGPS: useDeviceGPS,
      switchLiveMode: false,
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    send(
      '29BD0A85-51E4-4D3C-914E-126541EB2A5E',
      '60B1D5CE-3539-44D2-BB35-FF2DAABE17FF',
      numbersToDataView([
        values.uploadInterval,
        values.switchUseDeviceGPS ? 1 : 0,
      ]),
    )
    useSettingsStore.setState({
      uploadInterval: values.uploadInterval,
      useSenseBoxGPS: values.switchUseDeviceGPS,
    })
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
      <Drawer.Trigger onClick={() => setOpen(true)}>
        <Cog className="w-6" />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex max-h-[75%] flex-col rounded-t-lg bg-zinc-100 pb-safe ">
          <div className="flex-1 overflow-auto rounded-t-[10px] bg-white p-4">
            <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
            <div className="mx-auto max-w-md">
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
                          name="switchUseDeviceGPS"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Use senseBox GPS</FormLabel>
                              <FormDescription>
                                Das GPS vom Smartphone benutzen oder von der
                                senseBox:bike
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
    <div className="mt-auto border-t border-zinc-200 bg-zinc-100 p-4">
      <div className="mx-auto flex max-w-md justify-end gap-6">
        <a
          className="gap-0.25 flex items-center text-xs text-zinc-600"
          href="https://opensensemap.org"
          target="_blank"
        >
          openSenseMap
          <svg
            fill="none"
            height="16"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="16"
            aria-hidden="true"
            className="ml-1 h-3 w-3"
          >
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
            <path d="M15 3h6v6"></path>
            <path d="M10 14L21 3"></path>
          </svg>
        </a>
        <a
          className="gap-0.25 flex items-center text-xs text-zinc-600"
          href="https://reedu.de"
          target="_blank"
        >
          re:edu
          <svg
            fill="none"
            height="16"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="16"
            aria-hidden="true"
            className="ml-1 h-3 w-3"
          >
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
            <path d="M15 3h6v6"></path>
            <path d="M10 14L21 3"></path>
          </svg>
        </a>
      </div>
    </div>
  )
}
