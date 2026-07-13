import { Link, createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/$slug')({
  loader: () => {
    throw notFound()
  },
  component: BlogPostPage,
})

function BlogPostPage() {
  return (
    <main className="blog-post">
      <nav className="site-nav" aria-label="Blog navigation">
        <Link to="/blog">Blog index</Link>
      </nav>
    </main>
  )
}
