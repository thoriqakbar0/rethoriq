import { Link, createFileRoute } from '@tanstack/react-router'
import { BackLink } from '#/components/back-link'
import { computeSdkVsAgentOsArticle } from '#/content/compute-sdk-vs-agentos.metadata'
import { markFallbackRouteTransition } from '#/lib/route-transition'

export const Route = createFileRoute('/blog/')({
  head: () => ({
    meta: [
      { title: 'Blog — Thoriq Akbar' },
      {
        name: 'description',
        content: 'Notes on AI agents, software, and product engineering.',
      },
    ],
  }),
  component: BlogIndexPage,
})

const posts = [
  {
    slug: 'compute-sdk-vs-agentos',
    title: computeSdkVsAgentOsArticle.title,
    description: computeSdkVsAgentOsArticle.description,
    publishedAt: computeSdkVsAgentOsArticle.publishedAt,
    displayDate: computeSdkVsAgentOsArticle.displayDate,
    status: 'Draft',
  },
] as const

function BlogIndexPage() {
  return (
    <main className="blog-index">
      <nav className="site-nav" aria-label="Blog navigation">
        <BackLink />
      </nav>

      <header className="blog-header">
        <h1>Writing</h1>
        <p>Notes on AI agents, software, and the details between.</p>
      </header>

      <section className="post-list" aria-label="Blog posts">
        <ol>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                onClick={() => markFallbackRouteTransition('forward')}
                to="/blog/compute-sdk-vs-agentos"
                viewTransition
              >
                <span className="post-list-heading">
                  <span className="post-list-title">{post.title}</span>
                  <ArrowRightIcon />
                </span>
                <span className="post-list-meta">
                  <time dateTime={post.publishedAt}>{post.displayDate}</time>
                  <span aria-label="Publication status">{post.status}</span>
                </span>
                <p>{post.description}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}

function ArrowRightIcon() {
  return (
    <svg className="post-list-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M5 12h14m-6 6 6-6m-6-6 6 6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
