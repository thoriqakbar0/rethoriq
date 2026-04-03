import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: EmptyPage,
})

function EmptyPage() {
  return <main aria-label="empty page" />
}
