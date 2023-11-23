'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Track, useTracksStore } from '@/lib/store/useTracksStore'
import { DialogClose } from '@radix-ui/react-dialog'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'

export default function DeleteTrackDialog({ track }: { track: Track }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const removeTrack = useTracksStore(state => state.removeTrack)

  async function onSubmit() {
    try {
      removeTrack(track)
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Fehler beim Löschen des Tracks',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'destructive'} className="flex-1">
          Löschen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Track löschen</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2">
          <DialogClose asChild className="flex-1">
            <Button variant={'secondary'}>Abbrechen</Button>
          </DialogClose>
          <Button onClick={onSubmit} variant={'destructive'} className="flex-1">
            {loading ? <Loader2 className="mr-2 animate-spin" /> : null} Löschen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
