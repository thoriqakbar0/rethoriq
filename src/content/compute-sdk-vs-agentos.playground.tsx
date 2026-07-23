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
    label: 'The session must survive',
    recommendation: 'agentOS',
    detail:
      'Keep identity, selected state, history, and permission bookkeeping on the session clock. The lightweight agent environment is enough.',
  },
  {
    id: 'machine',
    label: 'Only the machine matters',
    recommendation: 'ComputeSDK',
    detail:
      'The work is bounded and needs full Linux. Create the machine for the job, then release it when the work ends.',
  },
  {
    id: 'both',
    label: 'The session survives; machines come and go',
    recommendation: 'Use both',
    detail:
      'Keep continuity in agentOS, then attach a ComputeSDK sandbox only when the session needs full Linux capability.',
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
          <span>Select the lifecycle your product needs to preserve.</span>
        )}
      </output>
    </section>
  )
}
