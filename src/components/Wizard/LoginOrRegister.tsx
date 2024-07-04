import { useTranslation } from 'react-i18next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import OpenSenseMapLogin from './OpenSenseMapLogin'
import OpenSenseMapRegister from './OpenSenseMapRegister'

export default function LoginOrRegister() {
  const { t } = useTranslation('translation', { keyPrefix: 'opensensemap' })
  return (
    <Tabs defaultValue="login">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">{t('login')}</TabsTrigger>
        <TabsTrigger value="register">{t('register')}</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <OpenSenseMapLogin />
      </TabsContent>
      <TabsContent value="register">
        <OpenSenseMapRegister />
      </TabsContent>
    </Tabs>
  )
}
