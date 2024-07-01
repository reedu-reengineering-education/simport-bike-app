import { useSettingsStore } from '@/lib/store/useSettingsStore'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Cog,
  EarthIcon,
  ExternalLinkIcon,
  MoonIcon,
  SunIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '../ui/button'

import { useUIStore } from '@/lib/store/useUIStore'
import { Browser } from '@capacitor/browser'
import { LanguageIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '../ui/form'
import { Switch } from '../ui/switch'
import ExclusionZoneDialog from './ExclusionZoneDialog'

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
    useSettingsStore.setState({
      uploadInterval: values.uploadInterval,
      useSenseBoxGPS: !values.switchUseSmartphoneGPS,
    })
    setReducedMotion(values.switchReducedMotion)
    setOpen(false)
  }
  const [open, setOpen] = useState(false)

  const { theme, setTheme } = useTheme()

  const { t, i18n } = useTranslation('translation', { keyPrefix: 'settings' })

  const { setShowWizardDrawer } = useUIStore()

  return (
    <Drawer
      open={open}
      shouldScaleBackground
      onOpenChange={open => setOpen(open)}
    >
      <DrawerTrigger asChild>
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          <Cog className="h-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm max-h-[60vh] overflow-scroll mt-4">
          <div className="flex flex-col justify-end gap-6 p-4">
            <DrawerTitle>{t('app-settings-title')}</DrawerTitle>
            <div className="grid gap-4 grid-cols-2">
              <Button
                variant="secondary"
                className="justify-start"
                onClick={() => {
                  setOpen(false)
                  setShowWizardDrawer(true)
                }}
              >
                <EarthIcon className="h-4 mr-2" /> openSenseMap
              </Button>
              <ExclusionZoneDialog />
              <Button
                variant="secondary"
                className="justify-start"
                onClick={async () =>
                  await Browser.open({
                    url: 'https://sensebox.de/sensebox-bike-privacy-policy/',
                    presentationStyle: 'popover',
                  })
                }
              >
                <LockClosedIcon className="mr-2 h-4" /> {t('privacy')}
              </Button>
              {theme === 'light' ? (
                <Button
                  variant="secondary"
                  className="justify-start"
                  onClick={() => setTheme('dark')}
                >
                  <MoonIcon className="mr-2 h-4" /> {t('dark')}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setTheme('light')}
                  className="justify-start"
                >
                  <SunIcon className="mr-2 h-4" /> {t('light')}
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={'secondary'} className="justify-start">
                    <LanguageIcon className="h-4 mr-2" />
                    {t('language')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => i18n.changeLanguage('de')}>
                    🇩🇪 German
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => i18n.changeLanguage('en')}>
                    🇬🇧 English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => i18n.changeLanguage('pt')}>
                    🇵🇹 Portugese
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <DrawerTitle>{t('record-settings-title')}</DrawerTitle>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
              >
                <div className="space-y-4">
                  {/* <FormField
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
                  /> */}
                  <FormField
                    name="switchUseSmartphoneGPS"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('smartphone-gps')}</FormLabel>
                        <FormDescription>
                          {t('smartphone-gps-desc')}
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
                        <FormLabel>{t('reduced-motion')}</FormLabel>
                        <FormDescription>
                          {t('reduced-motion-desc')}
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
                <Button type="submit">{t('save')}</Button>
              </form>
            </Form>
          </div>
        </div>
        <DrawerFooter>
          <div className="mt-auto border-t bg-muted p-4 pb-safe-or-4">
            <div className="mx-auto flex max-w-md justify-end gap-6">
              <a
                className="gap-0.25 flex items-center text-xs text-muted-foreground"
                href="https://opensensemap.org"
                target="_blank"
                rel="noreferrer"
              >
                openSenseMap
                <ExternalLinkIcon className="ml-1 h-3 w-3" />
              </a>
              <a
                className="gap-0.25 flex items-center text-xs text-muted-foreground"
                href="https://reedu.de"
                target="_blank"
                rel="noreferrer"
              >
                re:edu
                <ExternalLinkIcon className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
