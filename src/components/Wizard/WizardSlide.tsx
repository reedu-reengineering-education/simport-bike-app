import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export default function WizardSlide(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('p-4', props.className)} />
}
