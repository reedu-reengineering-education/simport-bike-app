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
import { Button } from './components/ui/button'
import { Toaster } from './components/ui/toaster'
import TrackDetailPage from './pages/tracks/detail/detail'

const rootRoute = createRootRoute({
  component: () => {
    return (
      <>
        <AuthChecker />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div
            className="flex h-full max-h-full w-full flex-col bg-background landscape:px-0"
            vaul-drawer-wrapper=""
          >
            <Outlet />
            <Toaster />
          </div>
        </ThemeProvider>
      </>
    )
  },
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MainPage,
})

const tracksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'tracks',
})

const tracksIndexRoute = createRoute({
  getParentRoute: () => tracksRoute,
  path: '/',
  component: TracksPage,
})

export const trackDetailRoute = createRoute({
  getParentRoute: () => tracksRoute,
  path: '$trackId',
  component: TrackDetailPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  tracksRoute.addChildren([tracksIndexRoute, trackDetailRoute]),
])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return (
    <RouterProvider
      router={router}
      defaultErrorComponent={e => (
        <div className="p-safe-offset-4 grid items-center gap-4">
          <h1 className="font-bold">Error</h1>
          <p className="text-red-500 font-mono bg-zinc-200 px-3 py-2 rounded-md">
            {e.error.message}
          </p>
          <Button onClick={e.reset}>Reset</Button>
          {e.info?.componentStack}
        </div>
      )}
    />
  )
}
