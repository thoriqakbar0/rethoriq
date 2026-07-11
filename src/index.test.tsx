import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { HomePage, Route } from './routes/index'

describe('root page', () => {
  it('keeps a root route component', () => {
    expect(typeof Route.options.component).toBe('function')
  })

  it('introduces Thoriq and his work history', () => {
    const markup = renderToStaticMarkup(<HomePage />)

    expect(markup).toContain('Thoriq Akbar')
    expect(markup).toContain('PANDAI')
    expect(markup).toContain('BLACK ACE')
    expect(markup).toContain('mailto:thoriqakbar00@gmail.com')
  })
})
