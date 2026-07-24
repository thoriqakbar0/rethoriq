import { createFileRoute, redirect } from '@tanstack/react-router'

/**
 * Preserves the article's original public URL after its slug changed.
 */
export const Route = createFileRoute('/blog/compute-sdk-vs-agentos')({
  beforeLoad: () => {
    throw redirect({
      to: '/blog/enduring-agents-disappearing-machines',
      replace: true,
    })
  },
})
