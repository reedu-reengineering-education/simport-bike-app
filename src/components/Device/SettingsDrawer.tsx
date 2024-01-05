'use client'

import { useSettingsStore } from '@/lib/store/useSettingsStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Cog } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '../ui/button'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer'
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

  return (
    <Drawer
      open={open}
      shouldScaleBackground
      onOpenChange={open => setOpen(open)}
    >
      <DrawerTrigger>
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          <Cog className="h-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Einstellungen</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col justify-end gap-2 p-4">
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
                <DrawerClose className="float-right">
                  <Button type="submit">Speichern</Button>
                </DrawerClose>
              </form>
            </Form>
          </div>
        </div>
      </DrawerContent>
      {/* <div className="mx-auto max-w-md overflow-y-auto">
        <p className="mb-4 font-medium">Einstellungen</p>

      </div> */}
    </Drawer>
  )
}
