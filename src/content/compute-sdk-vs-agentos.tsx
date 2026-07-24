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
        A coding agent creates a useful contradiction: the agent should endure,
        while the machine doing its work should be easy to discard.
      </p>

      <p>
        Today, we&apos;re going to look at two projects that tackle this problem
        from different sides: agentOS keeps the agent available across requests,
        while ComputeSDK supplies a full machine when the work needs one.
      </p>

      <h2 id="boundary">They overlap on purpose</h2>

      <p>
        <a href="https://agentos-sdk.dev/docs/architecture/">agentOS</a> and{' '}
        <a href="https://docs.computesdk.com/getting-started/introduction">
          ComputeSDK
        </a>{' '}
        both run code, but that does not make them clean alternatives. agentOS
        already provides a lightweight virtual machine for coding, scripts, API
        calls, and orchestration.
      </p>

      <p>
        That VM is deliberately narrower than a general-purpose Linux machine.
        Its{' '}
        <a href="https://agentos-sdk.dev/docs/limitations/">
          documented limitations
        </a>{' '}
        include arbitrary binaries and package managers such as <code>apt</code>
        {', '}Docker and eBPF, file watching, and direct GPU or hardware access.
      </p>

      <p>
        When a workload needs a browser, native compilation, or another full
        Linux capability, agentOS can{' '}
        <a href="https://agentos-sdk.dev/docs/sandbox/">
          mount an external sandbox
        </a>{' '}
        on demand. ComputeSDK is one of the supported providers for that
        sandbox. In that setup, agentOS owns the agent environment and
        ComputeSDK supplies the heavier machine underneath it.
      </p>

      <p>
        ComputeSDK brings the inverse trade-off. The application must{' '}
        <a href="https://docs.computesdk.com/getting-started/installation">
          install a provider adapter and supply its credentials
        </a>
        {', '}handle API and network failures, and{' '}
        <a href="https://docs.computesdk.com/getting-started/quick-start">
          destroy the sandbox
        </a>{' '}
        before it becomes an idle cost. Its files only last for the sandbox
        lifetime unless the application copies them somewhere durable.
      </p>

      <p>
        Their quickstarts still reveal the different centers of gravity.{' '}
        <a href="https://docs.computesdk.com/getting-started/quick-start">
          ComputeSDK creates
        </a>{' '}
        and destroys a sandbox.{' '}
        <a href="https://agentos-sdk.dev/docs/quickstart/">agentOS names</a> an
        actor and opens a session. One begins with the machine; the other begins
        with the agent that may decide to use it.
      </p>

      {runtimeBoundaryExplorer}

      <h2 id="quickstarts">One turn, two lifecycles</h2>

      <p>
        Imagine an agent that needs to inspect a website, change some code, and
        run a native build. The conversation belongs to the agent session, but
        the browser and toolchain belong to a machine created for that work.
      </p>

      <p>
        agentOS wakes the named actor and restores the state needed to continue.
        When its lightweight V8 and WebAssembly environment cannot do the work,
        the session attaches a ComputeSDK sandbox with full Linux capabilities.
      </p>

      <p>
        The sandbox runs the browser, commands, and build. Useful files and
        results flow back into the session. The sandbox can then disappear
        without erasing who requested the work, what was allowed, or where the
        next turn should begin.
      </p>

      <p>
        That is the bridge: capability crosses into the session, but the
        machine&apos;s lifetime does not.
      </p>

      <h2 id="trade-offs">Keep ownership clear</h2>

      <p>
        The integration stays understandable when each concern belongs to one
        side. The session owns continuity. The machine owns temporary
        capability.
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
              <td>Named actor, sessions, history, and permissions</td>
              <td>Sandbox ID for one environment</td>
            </tr>
            <tr>
              <th scope="row">Lifetime</th>
              <td>Across requests, clients, and sleep</td>
              <td>Until the workload finishes</td>
            </tr>
            <tr>
              <th scope="row">State</th>
              <td>Selected files and completed history</td>
              <td>Live processes, ports, and working files</td>
            </tr>
            <tr>
              <th scope="row">Capability</th>
              <td>Lightweight V8 and WebAssembly runtime</td>
              <td>Full Linux, browsers, compilers, and GPUs</td>
            </tr>
            <tr>
              <th scope="row">Trust</th>
              <td>Runtime, durable storage, and host bindings</td>
              <td>Provider isolation, images, credentials, and network</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Sleep rebuilds the agent</h3>

      <p>
        agentOS preserves selected files, session configuration, completed
        history, and permission bookkeeping across sleep. It does not preserve
        live commands or agent processes. Waking an actor reconstructs a safe
        continuation from durable state; it does not resume a frozen computer.
      </p>

      <h3>The machine extends the agent</h3>

      <p>
        Both layers describe a computer, which is where the architecture can
        become confusing. The agentOS VM is the lightweight environment inside
        the application host. The ComputeSDK sandbox is the external full Linux
        machine. The second gives the first capabilities it deliberately does
        not contain.
      </p>

      <p>
        The first-party{' '}
        <a href="https://agentos-sdk.dev/docs/sandbox/">
          sandbox-mounting extension
        </a>{' '}
        starts a ComputeSDK-backed sandbox, projects its filesystem into the
        actor VM, exposes remote process controls, and destroys the sandbox with
        the VM. The agent keeps its identity and sessions while the machine
        remains replaceable.
      </p>

      <h2 id="security">Two systems, two trust boundaries</h2>

      <p>
        The bridge connects the systems without merging their security models.
        On the session side, agentOS&apos;s{' '}
        <a href="https://agentos-sdk.dev/docs/security-model/">threat model</a>{' '}
        places its virtual kernel, sidecar, and approved host bindings inside
        the trusted system. On the machine side, the selected ComputeSDK
        provider remains responsible for isolation, images, credentials, and
        network policy.
      </p>

      <p>
        The seam needs its own policy: which session may create a sandbox, which
        credentials enter it, what network it can reach, and which files may
        return. Connecting two boundaries creates a path between them; it does
        not make either boundary disappear.
      </p>

      <p>
        Continuity also accumulates sensitive state. The{' '}
        <a href="https://agentos-sdk.dev/docs/persistence/">
          persistence documentation
        </a>{' '}
        says each actor VM&apos;s SQLite database is trusted plaintext and may
        contain credentials, prompts, messages, and permission payloads.
        Database and backup access should therefore be treated as access to the
        agent&apos;s secrets and history.
      </p>

      <h2 id="decision">Choose by lifetime</h2>

      <div className="article-decisions">
        <section>
          <h3>A bounded job</h3>
          <p>
            Use ComputeSDK when the application already owns the durable state
            and only needs an isolated machine for the work.
          </p>
        </section>
        <section>
          <h3>An agent across requests</h3>
          <p>
            Use agentOS when the agent needs identity and history across
            requests, and its lightweight runtime is enough.
          </p>
        </section>
        <section>
          <h3>An agent with machines on demand</h3>
          <p>
            Use both when the agent must continue across turns but particular
            turns need a browser, native tools, a GPU, or full Linux.
          </p>
        </section>
      </div>

      <p>
        The durable part is the agent&apos;s identity and history. The
        disposable part is the compute. Once those lifetimes are separated,
        ComputeSDK and agentOS stop looking like competitors and start fitting
        together.
      </p>
    </>
  )
}
