import { ThemeProvider } from 'next-themes'
import AuthChecker from './pages/AuthChecker'
import MainPage from './pages/main'
import TracksPage from './pages/tracks'

import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <AuthChecker />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div
          className="flex h-full max-h-full w-full flex-col bg-background px-safe landscape:px-0"
          vaul-drawer-wrapper=""
        >
          <Outlet />
        </div>
      </ThemeProvider>
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MainPage,
})

const tracksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tracks',
  component: TracksPage,
})

const routeTree = rootRoute.addChildren([indexRoute, tracksRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return <RouterProvider router={router} />
}
