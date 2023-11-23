'use client'

import { App } from '@capacitor/app'
import { PluginListenerHandle } from '@capacitor/core'
import { DialogProps } from '@radix-ui/react-dialog'
import { ExternalLinkIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Drawer } from 'vaul'

interface SliderDrawerProps extends DialogProps {
  trigger?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode | React.ReactNode[]
  onClose?: () => void
}

export default function SliderDrawer({
  trigger,
  children,
  footer,
  ...props
}: SliderDrawerProps) {
  useEffect(() => {
    let listener: PluginListenerHandle | undefined

    App.addListener('backButton', () => {
      setOpen(false)
    }).then(l => (listener = l))

    return () => {
      if (listener) listener.remove()
    }
  }, [])

  const [open, setOpen] = useState(props.open)

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  // fix for disappearing map
  useEffect(() => {
    if (open) {
      document.body.style.height = '100%'
    }
  }, [open])

  return (
    <Drawer.Root
      onOpenChange={setOpen}
      onClose={() => setOpen(false)}
      {...props}
      open={open}
    >
      {trigger && (
        <Drawer.Trigger
          onClick={() => setOpen(true)}
          className="h-full focus:outline-none"
          asChild
        >
          {trigger}
        </Drawer.Trigger>
      )}
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 z-20 bg-black/60"
          onClick={() => setOpen(false)}
        />
        <Drawer.Content
          className={`fixed bottom-0 left-0 right-0 z-30 mt-24 flex max-h-[85%] flex-col rounded-t-lg border-t bg-background focus:outline-none`}
        >
          <div className="mx-auto my-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
          <div className="flex-1 overflow-y-scroll rounded-t-md p-4">
            {children}
          </div>
          {footer && footer}
          {footer === undefined && <SettingsDrawerFooter />}
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
