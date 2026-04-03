import { describe, expect, it } from 'vitest'
import { Route } from './routes/index'

describe('root page', () => {
  it('keeps a root route component', () => {
    expect(typeof Route.options.component).toBe('function')
  })
})
