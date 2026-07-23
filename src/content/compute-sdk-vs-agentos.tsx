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
      <p>
        A coding agent is not the machine doing its work. The agent may need to
        keep its identity, sessions, permissions, and history for months; the
        machine may need to exist for one browser task, build, or test run. The
        design problem is how to connect them without forcing them to share a
        lifetime.
      </p>

      <h2 id="boundary">The session and machine run on different clocks</h2>

      <p>
        The session owns continuity. It gives the agent an address, remembers
        completed turns, carries permissions, and decides what should survive
        sleep or a disconnected client. Its clock advances across requests, even
        when no code is running.
      </p>

      <p>
        The machine owns capability. It provides the browser, compiler, GPU,
        database, or full Linux environment needed for a particular job. Its
        clock starts when the workload needs those resources and should stop
        when the work ends, before idle infrastructure becomes permanent cost.
      </p>

      <p>
        <a href="https://agentos-sdk.dev/docs/architecture/">agentOS</a> and{' '}
        <a href="https://docs.computesdk.com/getting-started/introduction">
          ComputeSDK
        </a>{' '}
        make that split concrete. agentOS keeps the session addressable and
        supplies a lightweight agent environment. ComputeSDK creates and
        controls provider-backed machines. They overlap at commands and files,
        but the bridge between their lifecycles is the more useful design.
      </p>

      {runtimeBoundaryExplorer}

      <h2 id="quickstarts">Execution is a handoff between lifecycles</h2>

      <p>
        The session decides that a turn needs capabilities outside its local
        environment. It requests a machine, gives that machine the work, records
        the useful result, and releases the infrastructure. The machine can
        disappear without erasing who requested the work, what permissions were
        granted, or where the conversation should continue.
      </p>

      <p>
        The two quickstarts expose this seam from opposite directions.{' '}
        <a href="https://docs.computesdk.com/getting-started/quick-start">
          ComputeSDK begins
        </a>{' '}
        by creating a sandbox and ends by destroying it.{' '}
        <a href="https://agentos-sdk.dev/docs/quickstart/">agentOS begins</a> by
        naming an actor and opening a session. Both execute code; only the
        session is expected to outlive that execution.
      </p>

      <h2 id="trade-offs">The bridge needs an ownership contract</h2>

      <p>
        Connecting the lifecycles is easy to describe and easy to blur. The
        bridge stays legible only when every kind of state and authority has one
        owner.
      </p>

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
              <td>Agent address, sessions, permissions, completed history</td>
              <td>A sandbox ID for one execution environment</td>
            </tr>
            <tr>
              <th scope="row">Lifetime</th>
              <td>Across requests, clients, and sleep/wake cycles</td>
              <td>Until the workload finishes or the sandbox is destroyed</td>
            </tr>
            <tr>
              <th scope="row">Durable state</th>
              <td>Selected files, session configuration, completed history</td>
              <td>Provider-specific files, templates, or snapshots</td>
            </tr>
            <tr>
              <th scope="row">Live state</th>
              <td>No promise that commands or agent processes survive sleep</td>
              <td>Processes, ports, browsers, compilers, and native tools</td>
            </tr>
            <tr>
              <th scope="row">Trust boundary</th>
              <td>Agent runtime, persistent storage, and approved bindings</td>
              <td>
                Provider isolation, images, credentials, and network policy
              </td>
            </tr>
            <tr>
              <th scope="row">Portability</th>
              <td>
                The agent runtime across managed or self-hosted deployment
              </td>
              <td>Shared sandbox operations across compute providers</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Durable does not mean frozen in place</h3>

      <p>
        Across sleep, agentOS preserves selected files, session configuration,
        completed history, and permission bookkeeping. It does not preserve live
        commands or agent processes. Waking an actor reconstructs a safe
        continuation over durable state; it does not resume an entire suspended
        computer.
      </p>

      <h3>The agent can borrow a full machine</h3>

      <p>
        Using both means working with two different computers. The agentOS VM is
        the lightweight V8 and WebAssembly environment inside the application
        host. The ComputeSDK sandbox is the external full Linux machine. The
        second extends the first with capabilities it deliberately does not
        contain.
      </p>

      <p>
        The first-party{' '}
        <a href="https://agentos-sdk.dev/docs/sandbox/">
          sandbox-mounting extension
        </a>{' '}
        starts a ComputeSDK-backed sandbox, projects its filesystem into the
        actor VM, exposes its process controls to the agent, and destroys the
        sandbox with the VM. The agent keeps its identity and sessions while
        borrowing disposable hands for browsers, native compilation, GPUs, or
        other full Linux work.
      </p>

      <h2 id="security">The bridge connects capability, not trust</h2>

      <p>
        The session and machine remain separate security systems. On the session
        side, agentOS&apos;s{' '}
        <a href="https://agentos-sdk.dev/docs/security-model/">threat model</a>{' '}
        places the virtual kernel, sidecar, and approved host bindings inside
        the trusted system. On the machine side, the selected ComputeSDK
        provider remains responsible for tenant isolation, images, credentials,
        and network policy. The bridge gives one side access to the other; it
        does not collapse either trust boundary.
      </p>

      <p>
        Session persistence deserves particular care because continuity
        accumulates secrets. The{' '}
        <a href="https://agentos-sdk.dev/docs/persistence/">
          persistence documentation
        </a>{' '}
        says each actor VM&apos;s SQLite database is trusted plaintext. It may
        contain environment values, MCP credentials, prompts, messages, and
        permission payloads without encryption or redaction, so access to that
        database and its backups is access to the agent&apos;s secrets and
        history.
      </p>

      <h2 id="decision">Choose by what must survive the request</h2>

      <div className="article-decisions">
        <section>
          <h3>Disposable machine only</h3>
          <p>
            Use ComputeSDK alone when the application already owns any durable
            state and only needs a provider-backed environment for a bounded
            job.
          </p>
        </section>
        <section>
          <h3>Durable session only</h3>
          <p>
            Use agentOS alone when the named agent must outlive a request and
            its lightweight V8 and WebAssembly environment already supplies
            every capability the work needs.
          </p>
        </section>
        <section>
          <h3>Durable session, disposable machine</h3>
          <p>
            Bridge both when the agent must persist but full Linux should exist
            only for the task. agentOS keeps continuity; ComputeSDK supplies and
            releases the machine.
          </p>
        </section>
      </div>

      <p>
        ComputeSDK supplies somewhere for work to run. agentOS supplies someone
        who can keep working. Their integration matters because a durable
        someone should not require a permanent somewhere.
      </p>
    </>
  )
}
