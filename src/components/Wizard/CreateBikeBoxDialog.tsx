import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { createSenseBoxBike } from '@/lib/api/openSenseMapClient'
import { senseBoxBikeModel } from '@/lib/api/opensensemap-bike-model-factory'
import { useAuthStore } from '@/lib/store/useAuthStore'
import useOpenSenseMapAuth from '@/lib/useOpenSenseMapAuth'
import { Geolocation } from '@capacitor/geolocation'
import { zodResolver } from '@hookform/resolvers/zod'
import { InfoIcon, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as z from 'zod'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { toast } from '../ui/use-toast'

const formSchema = z.object({
  name: z.string().min(2).max(50),
  model: z.string(),
})

export default function CreateBikeBoxDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { refreshBoxes } = useOpenSenseMapAuth()
  const setSelectedBox = useAuthStore(state => state.setSelectedBox)

  const { t } = useTranslation('translation', {
    keyPrefix: 'opensensemap.create-sensebox-bike-dialog',
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: 'atrai',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const coordinates = await Geolocation.getCurrentPosition()

      const newBox = await createSenseBoxBike(
        values.name,
        coordinates.coords.latitude,
        coordinates.coords.longitude,
        values.model as senseBoxBikeModel,
      )
      await refreshBoxes()
      setSelectedBox(newBox)
      form.reset()
      setOpen(false)
    } catch (_error) {
      toast({
        title: t('failed-title'),
        description: t('failed-description'),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={'secondary'} className="w-fit">
          <Plus className="mr-2 w-5" /> {t('trigger')}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle className="mb-2">{t('title')}</DrawerTitle>
        </DrawerHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 text-left"
          >
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('model')}</FormLabel>
                  <Select
                    value={field.value}
                    name={field.name}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue onBlur={field.onBlur} ref={field.ref} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="default">{t('default')}</SelectItem>
                      <SelectItem value="atrai">{t('atrai')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="senseBox:bike" {...field} />
                  </FormControl>
                  <FormDescription>{t('description')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DrawerDescription className="flex items-center">
              <InfoIcon className="mr-2 h-5 md:mr-4" />
              {t('position-info')}
            </DrawerDescription>

            <DrawerFooter className="pb-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 w-5 animate-spin" />}
                {t('create')}
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
