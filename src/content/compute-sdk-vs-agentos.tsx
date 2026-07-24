import type { ReactNode } from 'react'

interface ComputeSdkVsAgentOsArticleBodyProps {
  readonly runtimeBoundaryExplorer: ReactNode
}

/**
 * Supplies the article's prose and editorial figures without page chrome.
 */
export function ComputeSdkVsAgentOsArticleBody({
  runtimeBoundaryExplorer,
}: ComputeSdkVsAgentOsArticleBodyProps) {
  return (
    <>
      <p>A coding agent is not the machine doing its work.</p>

      <p>
        The agent may need to remember for months. The machine may exist for one
        build. Good architecture lets them separate without losing the handoff
        between them.
      </p>

      <h2 id="boundary">Two clocks</h2>

      <p>
        The session owns continuity. It holds the agent&apos;s address,
        completed turns, permissions, and durable state. Its clock keeps running
        even when no code does.
      </p>

      <p>
        The machine owns capability. It supplies the browser, compiler, GPU, or
        full Linux environment. Its clock stops when the job ends.
      </p>

      <p>
        <a href="https://agentos-sdk.dev/docs/architecture/">agentOS</a> and{' '}
        <a href="https://docs.computesdk.com/getting-started/introduction">
          ComputeSDK
        </a>{' '}
        make the split concrete. agentOS sits on the session side. ComputeSDK
        sits on the machine side. They meet at commands and files.
      </p>

      {runtimeBoundaryExplorer}

      <h2 id="quickstarts">The handoff</h2>

      <p>
        A turn needs more than the session can provide. The session requests a
        machine, sends the work, keeps the result, then releases the machine.
      </p>

      <p>
        The machine disappears. The session still knows who asked, what was
        allowed, and where to continue.
      </p>

      <p>
        The quickstarts show both sides.{' '}
        <a href="https://docs.computesdk.com/getting-started/quick-start">
          ComputeSDK creates
        </a>{' '}
        and destroys a sandbox.{' '}
        <a href="https://agentos-sdk.dev/docs/quickstart/">agentOS names</a> an
        actor and opens a session.
      </p>

      <h2 id="trade-offs">Own the seam</h2>

      <p>Every kind of state and authority needs one owner.</p>

      <div className="article-table-wrap">
        <p className="article-table-hint" aria-hidden="true">
          Scroll to compare →
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col">Concern</th>
              <th scope="col">Session side</th>
              <th scope="col">Machine side</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Identity</th>
              <td>Agent address, history, and permissions</td>
              <td>Sandbox ID</td>
            </tr>
            <tr>
              <th scope="row">Lifetime</th>
              <td>Across requests and sleep</td>
              <td>One workload</td>
            </tr>
            <tr>
              <th scope="row">Durable state</th>
              <td>Selected files and completed turns</td>
              <td>Files or snapshots</td>
            </tr>
            <tr>
              <th scope="row">Live capability</th>
              <td>Lightweight agent runtime</td>
              <td>Browsers, ports, compilers, and GPUs</td>
            </tr>
            <tr>
              <th scope="row">Trust</th>
              <td>Runtime, storage, and bindings</td>
              <td>Isolation, images, and network</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Sleep is not pause</h3>

      <p>
        agentOS keeps selected files, session configuration, completed history,
        and permissions. It does not keep live commands or agent processes.
      </p>

      <p>
        Wake rebuilds the session from durable state. It does not resume a
        frozen computer.
      </p>

      <h3>Borrow the machine</h3>

      <p>
        agentOS runs a lightweight V8 and WebAssembly environment. ComputeSDK
        supplies the external full Linux machine.
      </p>

      <p>
        The first-party{' '}
        <a href="https://agentos-sdk.dev/docs/sandbox/">
          sandbox-mounting extension
        </a>{' '}
        mounts the sandbox filesystem, exposes its process controls, and
        destroys the sandbox with the VM.
      </p>

      <p>
        The agent keeps its continuity. The machine becomes disposable hands.
      </p>

      <h2 id="security">Trust stays split</h2>

      <p>
        The session trusts agentOS&apos;s{' '}
        <a href="https://agentos-sdk.dev/docs/security-model/">threat model</a>{' '}
        and approved host bindings. The machine trusts the selected
        provider&apos;s isolation, images, credentials, and network policy.
      </p>

      <p>
        The bridge connects them. It does not make either boundary disappear.
      </p>

      <p>
        Continuity also accumulates secrets. The{' '}
        <a href="https://agentos-sdk.dev/docs/persistence/">
          persistence documentation
        </a>{' '}
        says each actor VM&apos;s SQLite database is trusted plaintext. Database
        and backup access is secret access.
      </p>

      <h2 id="decision">Choose what survives</h2>

      <div className="article-decisions">
        <section>
          <h3>Disposable machine only</h3>
          <p>
            Use ComputeSDK when the app owns the durable state and needs a
            machine for one job.
          </p>
        </section>
        <section>
          <h3>Durable session only</h3>
          <p>
            Use agentOS when the agent must outlive the request and its
            lightweight runtime is enough.
          </p>
        </section>
        <section>
          <h3>Durable session, disposable machine</h3>
          <p>
            Use both when the agent must persist but full Linux should exist
            only for the task.
          </p>
        </section>
      </div>

      <p>
        ComputeSDK supplies somewhere for work to run. agentOS supplies someone
        who keeps working. A durable someone should not need a permanent
        somewhere.
      </p>
    </>
  )
}
