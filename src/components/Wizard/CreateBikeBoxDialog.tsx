import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { InfoIcon, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
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

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(2).max(50),
  model: z.string().optional(),
})

import { createSenseBoxBike } from '@/lib/api/openSenseMapClient'
import { senseBoxBikeModel } from '@/lib/api/opensensemap-bike-model-factory'
import { useAuthStore } from '@/lib/store/useAuthStore'
import useOpenSenseMapAuth from '@/lib/useOpenSenseMapAuth'
import { Geolocation } from '@capacitor/geolocation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { toast } from '../ui/use-toast'

export default function CreateBikeBoxDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { refreshBoxes } = useOpenSenseMapAuth()
  const setSelectedBox = useAuthStore(state => state.setSelectedBox)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      model: 'default',
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
        title: 'Fehler',
        description: 'Fehler beim Erstellen der senseBox:bike',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'secondary'} className="w-fit">
          <Plus className="mr-2 w-5" /> Neue senseBox:bike hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Neue senseBox:bike</DialogTitle>
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
                    <FormLabel>Model</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="senseBox:bike Model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="atrai">Atrai</SelectItem>
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="senseBox:bike" {...field} />
                    </FormControl>
                    <FormDescription>
                      Der Name der neuen senseBox:bike wird auf der openSenseMap
                      angezeigt
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogDescription className="flex items-center">
                <InfoIcon className="mr-2 h-5 md:mr-4" />
                Die Position der senseBox:bike wird automatisch ermittelt
              </DialogDescription>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 w-5 animate-spin" />}
                Speichern
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
