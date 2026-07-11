import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const workHistory = [
  {
    dates: '2025—now',
    company: 'PANDAI',
    summary: 'Building the AI runtime and core learning flows for P&AI.',
  },
  {
    dates: '2025—now',
    company: 'XCENT.AI + NEWGEN',
    summary: 'Part-time product engineering across messaging, web, mobile, and AI.',
  },
  {
    dates: '2025',
    company: 'BLACK ACE MEDIA',
    summary: 'Shipped two client iOS applications.',
  },
  {
    dates: '2022—2025',
    company: 'PANDAI',
    summary: 'Moved from growth into AI engineering; grew organic traffic 9×.',
  },
] as const

export function HomePage() {
  return (
    <main>
      <header>
        <p className="eyebrow">THORIQ AKBAR · MOJOKERTO, INDONESIA</p>
        <h1>I’m Thoriq.</h1>
        <p className="intro">
          I build AI products end to end, from model behaviour and backend
          systems to the thing people actually use. Before engineering, I
          worked in growth.
        </p>
      </header>

      <section aria-labelledby="work-heading">
        <h2 id="work-heading">A short history of where I work</h2>
        <div className="work-list">
          {workHistory.map((work) => (
            <article className="work-row" key={`${work.dates}-${work.company}`}>
              <p className="dates">{work.dates}</p>
              <div>
                <h3>{work.company}</h3>
                <p>{work.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <p>
          Say hi at{' '}
          <a href="mailto:thoriqakbar00@gmail.com">
            thoriqakbar00@gmail.com
          </a>
          .
        </p>
        <nav aria-label="Elsewhere">
          <a href="https://github.com/thoriqakbar0">GitHub</a>
          <a href="https://www.linkedin.com/in/thoriqakbar0/">LinkedIn</a>
        </nav>
      </footer>
    </main>
  )
}
