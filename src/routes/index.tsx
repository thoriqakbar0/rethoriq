import { createFileRoute } from '@tanstack/react-router'
import { OceanBanner } from '#/components/ocean-banner'

export const Route = createFileRoute('/')({ component: HomePage })

const workHistory = [
  {
    dates: '2025 / now',
    company: 'Pandai',
    summary: 'Building the AI runtime and core learning flows for P&AI.',
  },
  {
    dates: '2025 / now',
    company: 'Xcent.ai + Newgen',
    summary:
      'Part-time product engineering across messaging, web, mobile, and AI.',
  },
  {
    dates: '2025',
    company: 'Black Ace Media',
    summary: 'Shipped two client iOS applications.',
  },
  {
    dates: '2022—2025',
    company: 'Pandai',
    summary: 'Moved from growth into AI engineering; grew organic traffic 9×.',
  },
] as const

export function HomePage() {
  return (
    <>
      <OceanBanner />
      <main className="page">
        <header className="site-header">
          <h1 className="wordmark">thoriq</h1>
        </header>

        <section className="hero-intro" aria-label="Introduction">
          <p>I build AI products, from model behaviour to the interface.</p>
        </section>

        <article className="bio" id="about">
          <div className="bio-heading">
            <h2>Right now</h2>
            <time dateTime="2026-07-13">Updated Jul 13, 2026</time>
          </div>
          <div className="bio-copy">
            <p>
              At <a href="https://pandai.org">Pandai</a>, I’m building P&amp;AI,
              a learning agent for students across Malaysia and Brunei.
            </p>
            <p>
              I also work with <a href="https://xcent.ai">Xcent.ai</a> and{' '}
              <a href="https://newgenwebdevelopment.com">Newgen</a> on
              messaging, web, mobile, and AI products.
            </p>
          </div>
        </article>

        <section className="work" aria-labelledby="work-title">
          <header className="work-header">
            <h2 id="work-title">Work</h2>
          </header>
          <ul>
            {workHistory.map((work) => (
              <li key={`${work.dates}-${work.company}`}>
                <div className="work-row">
                  <time>{work.dates}</time>
                  <div>
                    <h3>{work.company}</h3>
                    <p>{work.summary}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <nav className="contact-links" aria-label="Contact links">
          <a href="https://github.com/thoriqakbar0">GitHub</a>
          <a href="mailto:its@thoriq.link">Email</a>
          <a href="https://x.com/isninkhamiss">X</a>
        </nav>

        <footer>
          <p>Thoriq Akbar · Mojokerto, Indonesia</p>
        </footer>
      </main>
    </>
  )
}
