import { register } from '@/lib/api/openSenseMapClient'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSwiper } from 'swiper/react'
import * as z from 'zod' // import * as z from "zod";
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { useToast } from '../ui/use-toast'
import WizardSlide from './WizardSlide'

const formSchema = z
  .object({
    name: z.string().min(3).max(40),
    email: z.string().email(),
    password: z.string(),
    passwordConfirm: z.string(),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  })

export default function OpenSenseMapRegister() {
  const swiper = useSwiper()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const email = useAuthStore(state => state.email)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
    },
  })

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      await register(values.name, values.email, values.password)
      swiper.slideNext()
    } catch (e) {
      toast({ variant: 'destructive', title: 'Registrierung fehlgeschlagen' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <WizardSlide className="flex h-full flex-col content-center justify-center gap-4">
      <p className="mb-4 font-medium">Neuer openSenseMap Account</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-Mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="E-Mail" {...field} />
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
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passwort wiederholen</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Passwort" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit">
            {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Registrieren
          </Button>
        </form>
      </Form>
    </WizardSlide>
  )
}
