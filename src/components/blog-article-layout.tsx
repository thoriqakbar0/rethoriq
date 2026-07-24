import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { BackLink } from '#/components/back-link'
import { markFallbackRouteTransition } from '#/lib/route-transition'

interface BlogArticleLayoutProps {
  readonly title: string
  readonly deck: string
  readonly publishedAt: string
  readonly displayDate: string
  readonly author: string
  readonly children: ReactNode
}

/**
 * Renders the shared blog chrome around article-owned prose and figures.
 */
export function BlogArticleLayout({
  title,
  deck,
  publishedAt,
  displayDate,
  author,
  children,
}: BlogArticleLayoutProps) {
  return (
    <main className="blog-post">
      <nav className="editorial-nav" aria-label="Blog navigation">
        <div className="editorial-nav-back">
          <BackLink />
        </div>
        <div className="editorial-nav-end">
          <span className="editorial-nav-brand">thoriq</span>
        </div>
      </nav>

      <article>
        <header className="article-header">
          <div className="article-header-content">
            <h1>{title}</h1>
            <p className="article-deck">{deck}</p>
            <div className="article-byline">
              <time dateTime={publishedAt}>{displayDate}</time>
              <span>{author}</span>
            </div>
          </div>
        </header>

        <div className="article-shell">
          <div className="article-body">{children}</div>
        </div>
      </article>

      <footer className="article-footer">
        <Link
          className="article-footer-link"
          onClick={() => markFallbackRouteTransition('backward')}
          to="/blog"
          viewTransition
        >
          More writing
        </Link>
        <p>Thoriq Akbar · Mojokerto, Indonesia</p>
      </footer>
    </main>
  )
}
