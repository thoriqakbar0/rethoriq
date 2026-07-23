export type RouteTransitionDirection = 'forward' | 'backward'

/**
 * Marks an internal navigation for browsers without the View Transitions API.
 */
export function markFallbackRouteTransition(
  direction: RouteTransitionDirection,
) {
  if (typeof document === 'undefined') {
    return
  }

  const viewTransitionDocument = document as Document & {
    startViewTransition?: unknown
  }

  if (
    typeof viewTransitionDocument.startViewTransition === 'function' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return
  }

  document.documentElement.dataset.routeTransition = direction
  window.setTimeout(() => {
    delete document.documentElement.dataset.routeTransition
  }, 400)
}
