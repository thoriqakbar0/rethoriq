import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const workHistory = [
  {
    dates: '2025 / now',
    company: 'PANDAI',
    summary: 'Building the AI runtime and core learning flows for P&AI.',
  },
  {
    dates: '2025 / now',
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
      <article className="bio">
        <h1>Thoriq Akbar</h1>
        <time dateTime="2026-07-11">Updated Jul 11, 2026</time>
        <p>I’m an AI product engineer based in Mojokerto, Indonesia.</p>
        <p>
          I build products end to end, from model behaviour and backend
          infrastructure to the interface people actually use. At{' '}
          <a href="https://pandai.org">Pandai</a>, I work on P&amp;AI, a
          proactive learning agent for students across Malaysia and Brunei.
        </p>
        <p>
          I also work with <a href="https://xcent.ai">Xcent.ai</a> and Newgen
          across messaging, web, mobile, and AI products. Before engineering, I
          worked in growth and grew organic traffic 9×.
        </p>
        <p>
          I care about useful AI, clear systems, and products that feel properly
          finished.
        </p>
        <p>
          You can find me on{' '}
          <a href="https://github.com/thoriqakbar0">GitHub</a>,{' '}
          <a href="https://www.linkedin.com/in/thoriqakbar0/">LinkedIn</a>, or
          reach me via{' '}
          <a href="mailto:thoriqakbar00@gmail.com">email</a>.
        </p>
      </article>

      <section className="work" aria-labelledby="work-heading">
        <h2 id="work-heading">Work</h2>
        <ul>
          {workHistory.map((work) => (
            <li key={`${work.dates}-${work.company}`}>
              <div className="work-row">
                <div>
                  <h3>{work.company}</h3>
                  <p>{work.summary}</p>
                </div>
                <time>{work.dates}</time>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer>
        <p>AI product engineer in Mojokerto, Indonesia.</p>
      </footer>
    </main>
  )
}
