import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/blog/')({
  component: BlogIndexPage,
})

const posts: ReadonlyArray<{
  slug: string
  title: string
  description: string
  publishedAt: string
  displayDate: string
}> = []

function BlogIndexPage() {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const visiblePosts = posts.filter((post) =>
    `${post.title} ${post.description}`.toLowerCase().includes(normalizedQuery),
  )

  return (
    <main className="blog-index">
      <nav className="site-nav" aria-label="Blog navigation">
        <Link to="/">Index</Link>
      </nav>

      <header className="blog-header">
        <h1>My blog</h1>
        <p>Notes on building AI products, software, and the details between.</p>
      </header>

      <search className="blog-search" id="search">
        <label htmlFor="post-search">Search writing</label>
        <input
          id="post-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Type to search…"
          autoComplete="off"
        />
      </search>

      <section className="post-list" aria-label="Blog posts">
        {visiblePosts.length > 0 ? (
          <ol>
            {visiblePosts.map((post) => (
              <li key={post.slug}>
                <Link to="/blog/$slug" params={{ slug: post.slug }}>
                  <span>{post.title}</span>
                  <time dateTime={post.publishedAt}>{post.displayDate}</time>
                  <p>{post.description}</p>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty-state">
            {normalizedQuery
              ? 'No writing matches that search.'
              : 'No posts yet.'}
          </p>
        )}
      </section>
    </main>
  )
}
