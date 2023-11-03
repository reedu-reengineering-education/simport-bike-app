'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  name: z.string().min(2).max(50),
})

import { createSenseBoxBike } from '@/lib/api/openSenseMapClient'
import { toast } from '../ui/use-toast'
import useOpenSenseMapAuth from '@/lib/useOpenSenseMapAuth'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { Geolocation } from '@capacitor/geolocation'

export default function CreateBikeBoxDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { refreshBoxes } = useOpenSenseMapAuth()
  const setSelectedBox = useAuthStore(state => state.setSelectedBox)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
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
      )
      await refreshBoxes()
      setSelectedBox(newBox)
      form.reset()
      setOpen(false)
    } catch (error) {
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
      <DialogContent className="px-2">
        <DialogHeader>
          <DialogTitle className="mb-2">Neue senseBox:bike</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
