import { Link } from '@tanstack/react-router'
import { markFallbackRouteTransition } from '#/lib/route-transition'

/**
 * Returns to the site index with the reverse route transition.
 */
export function BackLink() {
  return (
    <Link
      className="back-link"
      onClick={() => markFallbackRouteTransition('backward')}
      to="/"
      viewTransition
    >
      <svg className="back-link-icon" aria-hidden="true" viewBox="0 0 20 20">
        <path
          d="M11.75 4.75 6.5 10l5.25 5.25"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
        />
      </svg>
      <span>Back</span>
    </Link>
  )
}
