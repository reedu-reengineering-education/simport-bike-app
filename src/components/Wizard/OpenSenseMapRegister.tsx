import i18n from '@/i18n'
import { register } from '@/lib/api/openSenseMapClient'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
    message: i18n.t('opensensemap.password-no-match'),
    path: ['passwordConfirm'],
  })

export default function OpenSenseMapRegister() {
  const swiper = useSwiper()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const { t } = useTranslation('translation', { keyPrefix: 'opensensemap' })

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
    } catch (_e) {
      toast({ variant: 'destructive', title: t('register-failed') })
    } finally {
      setLoading(false)
    }
  }

  return (
    <WizardSlide className="flex h-full flex-col content-center justify-center gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('name')}</FormLabel>
                <FormControl>
                  <Input type="text" placeholder={t('name')} {...field} />
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
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={t('email')} {...field} />
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
                <FormLabel>{t('password')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('password')}
                    {...field}
                  />
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
                <FormLabel>{t('password-repeat')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('password-repeat')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit">
            {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            {t('register-action')}
          </Button>
        </form>
      </Form>
    </WizardSlide>
  )
}
