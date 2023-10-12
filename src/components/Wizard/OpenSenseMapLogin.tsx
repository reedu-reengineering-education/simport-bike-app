'use client'
import { useSwiper } from 'swiper/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useState } from 'react'
import useOpenSenseMapAuth from '@/lib/useOpenSenseMapAuth'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod' // import * as z from "zod";
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { useToast } from '../ui/use-toast'
import Spinner from '../ui/Spinner'
import { useAuthStore } from '@/lib/store/useAuthStore'
import WizardSlide from './WizardSlide'
import { Loader2Icon } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export default function OpenSenseMapLogin() {
  const swiper = useSwiper()
  const [loading, setLoading] = useState(false)
  const { login } = useOpenSenseMapAuth()
  const { toast } = useToast()

  const email = useAuthStore(state => state.email)
  const password = useAuthStore(state => state.password)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      password,
    },
  })

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    const success = await login(values.email, values.password)
    setLoading(false)
    if (success) {
      swiper.slideNext()
    } else {
      toast({ variant: 'destructive', title: 'Login fehlgeschlagen' })
    }
  }

  return (
    <WizardSlide className="flex h-full flex-col content-center justify-center gap-4">
      <p className="mb-4 font-medium">
        Bitte loggen Sie sich mit Ihrem openSenseMap-Account ein
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passwort</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Passwort" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit">
            {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Anmelden
          </Button>
        </form>
      </Form>
    </WizardSlide>
  )
}
