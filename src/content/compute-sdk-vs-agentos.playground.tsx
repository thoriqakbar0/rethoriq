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
    label: 'A durable agent',
    recommendation: 'agentOS',
    detail:
      'The session—not each command—must survive. Use agentOS actor mode to retain identity, selected state, history, and permission bookkeeping.',
  },
  {
    id: 'machine',
    label: 'A full Linux machine',
    recommendation: 'ComputeSDK',
    detail:
      'The job needs full Linux. Use ComputeSDK with a provider that supports native binaries, system packages, browsers, or GPUs.',
  },
  {
    id: 'both',
    label: 'A durable agent and a full Linux machine',
    recommendation: 'Use both',
    detail:
      'agentOS actor mode retains the durable agent state. Its bridge attaches a ComputeSDK sandbox from a provider compatible with the required full-Linux work.',
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
        <h2 id="runtime-explorer-title">What do you need?</h2>
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
              <span>Durable agent</span>
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
              <span>Full Linux machine</span>
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
          <span>Select the capability your product needs.</span>
        )}
      </output>
    </section>
  )
}
