import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import OpenSenseMapLogin from './OpenSenseMapLogin'
import OpenSenseMapRegister from './OpenSenseMapRegister'

export default function LoginOrRegister() {
  return (
    <Tabs defaultValue="login">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Registrieren</TabsTrigger>
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
