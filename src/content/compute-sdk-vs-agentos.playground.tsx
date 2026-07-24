import { useState } from 'react'

type RuntimeNeed = 'agent' | 'machine' | 'both'

interface RuntimeOption {
  readonly id: RuntimeNeed
  readonly label: string
  readonly recommendation: 'agentOS' | 'ComputeSDK' | 'Use both'
  readonly detail: string
}

const runtimeOptions: ReadonlyArray<RuntimeOption> = [
  {
    id: 'agent',
    label: 'Keep the session',
    recommendation: 'agentOS',
    detail:
      'Keep identity, history, and permissions. The lightweight runtime is enough.',
  },
  {
    id: 'machine',
    label: 'Run one job',
    recommendation: 'ComputeSDK',
    detail: 'Create a full Linux machine for the work, then release it.',
  },
  {
    id: 'both',
    label: 'Keep the session; replace machines',
    recommendation: 'Use both',
    detail:
      'Keep continuity in agentOS. Attach a ComputeSDK sandbox when full Linux is needed.',
  },
]

/**
 * Combines the runtime-boundary illustration and workload recommendation in one
 * interactive decision.
 */
export function RuntimeBoundaryExplorer() {
  const [need, setNeed] = useState<RuntimeNeed | null>(null)
  const selected = runtimeOptions.find((option) => option.id === need)

  return (
    <section
      className="runtime-explorer"
      aria-labelledby="runtime-explorer-title"
    >
      <header className="runtime-explorer-header">
        <p>Boundary</p>
        <h2 id="runtime-explorer-title">What must survive?</h2>
      </header>

      <fieldset className="runtime-explorer-options">
        <legend className="sr-only">Choose the workload requirement</legend>
        {runtimeOptions.map((option) => (
          <label key={option.id}>
            <input
              checked={need === option.id}
              name="runtime-need"
              onChange={() => setNeed(option.id)}
              type="radio"
              value={option.id}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      {need ? (
        <div
          className="runtime-explorer-line"
          data-single={need !== 'both'}
          aria-hidden="true"
        >
          {need !== 'machine' ? (
            <div>
              <span>Durable session</span>
              <strong>agentOS</strong>
            </div>
          ) : null}
          {need === 'both' ? (
            <div className="runtime-explorer-connector">
              <span>attaches</span>
              <b>→</b>
            </div>
          ) : null}
          {need !== 'agent' ? (
            <div>
              <span>Disposable machine</span>
              <strong>ComputeSDK</strong>
            </div>
          ) : null}
        </div>
      ) : null}

      <output className="runtime-explorer-result" aria-live="polite">
        {selected ? (
          <>
            <strong>{selected.recommendation}</strong>
            <span>{selected.detail}</span>
          </>
        ) : (
          <span>Choose what needs to last.</span>
        )}
      </output>
    </section>
  )
}
