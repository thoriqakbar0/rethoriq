import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { HomePage, Route } from './routes/index'

describe('root page', () => {
  it('keeps a root route component', () => {
    expect(typeof Route.options.component).toBe('function')
  })

  it('exposes the rethoriq landing page', () => {
    const markup = renderToStaticMarkup(<HomePage />)

    expect(markup).toContain('Work surface')
  })
})
