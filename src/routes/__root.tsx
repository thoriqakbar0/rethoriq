import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Agentation } from 'agentation'
import { OceanBanner } from '#/components/ocean-banner'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Thoriq Akbar — AI Product Engineer',
      },
      {
        name: 'description',
        content:
          'Thoriq Akbar is an AI product engineer working across model behaviour, backend systems, and user experience.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <OceanBanner />
        {children}
        {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
        <Scripts />
      </body>
    </html>
  )
}
