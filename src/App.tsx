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
import TrackDetailPage from './pages/tracks/detail/detail'

const rootRoute = createRootRoute({
  component: () => {
    return (
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
  return <RouterProvider router={router} />
}
