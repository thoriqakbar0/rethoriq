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
        I came across agentOS and ComputeSDK while looking at the same question:
        where should a coding agent run? They look like competitors because both
        execute code inside isolated environments.
      </p>

      <p>
        The counterintuitive part is that agentOS can use ComputeSDK as its
        external sandbox. The relationship makes sense once you separate the
        agent&apos;s durable state from the machines that run its code.
      </p>

      <h2 id="boundary">They look like competitors</h2>

      <p>
        <a href="https://agentos-sdk.dev/docs/architecture/">agentOS</a> and{' '}
        <a href="https://docs.computesdk.com/getting-started/introduction">
          ComputeSDK
        </a>{' '}
        both run code, but they operate at different layers. agentOS includes an
        isolated Linux VM with its own filesystem, process table, network
        policy, and V8 and WebAssembly executor.
      </p>

      <p>
        That VM implements a focused Linux surface rather than a full
        distribution. Its{' '}
        <a href="https://agentos-sdk.dev/docs/limitations/">
          documented limitations
        </a>{' '}
        include installing arbitrary binaries or using package managers such as{' '}
        <code>apt</code>, Docker and eBPF, file watching, and direct GPU or
        hardware access.
      </p>

      <p>
        When a workload needs a browser, native compilation, or another full
        Linux capability, agentOS can{' '}
        <a href="https://agentos-sdk.dev/docs/sandbox/">
          mount an external sandbox
        </a>{' '}
        on demand. ComputeSDK is one of the supported adapters for that sandbox.
        In that setup, agentOS manages the actor and session while ComputeSDK
        gives it one API for asking the selected provider to provision the
        heavier environment.
      </p>

      <p>
        ComputeSDK standardizes the sandbox interface; it does not own the
        application lifecycle. The application must{' '}
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
        The quickstarts make the boundary concrete.{' '}
        <a href="https://docs.computesdk.com/getting-started/quick-start">
          ComputeSDK calls <code>compute.sandbox.create()</code>
        </a>{' '}
        and later <code>sandbox.destroy()</code>.{' '}
        <a href="https://agentos-sdk.dev/docs/quickstart/">
          agentOS calls <code>getOrCreate(&quot;my-agent&quot;)</code>
        </a>{' '}
        and opens a durable session. The first API centers a sandbox resource;
        the second centers an actor that can use one.
      </p>

      {runtimeBoundaryExplorer}

      <h2 id="quickstarts">A turn can need both</h2>

      <p>
        Imagine an agent that needs to inspect a website, change some code, and
        run a native build. The conversation belongs to the agent session, but
        the browser and toolchain belong to a machine created for that work.
      </p>

      <p>
        agentOS wakes the named actor and reconstructs the session from
        persisted state. When the turn needs capabilities outside its focused
        VM, the configured sandbox extension starts an external environment
        through ComputeSDK and the selected provider.
      </p>

      <p>
        The external sandbox runs the browser, commands, and build, and its
        filesystem is mounted inside the agentOS VM. Before teardown, the agent
        must copy any results it wants to keep into durable agentOS storage. The
        sandbox can then disappear while the actor&apos;s identity,
        configuration, and completed history remain available.
      </p>

      <h2 id="trade-offs">Name both compute layers</h2>

      <p>
        agentOS owns persisted actor state and the session that can be
        reconstructed from it. The external sandbox owns provider-hosted compute
        for as long as the workload needs it.
      </p>

      <div className="article-table-wrap">
        <p className="article-table-hint" aria-hidden="true">
          Scroll to compare →
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col">Concern</th>
              <th scope="col">agentOS actor and VM</th>
              <th scope="col">External sandbox</th>
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
              <td>The VM may sleep; persisted actor state survives</td>
              <td>Until the application destroys it or its timeout expires</td>
            </tr>
            <tr>
              <th scope="row">State</th>
              <td>
                Durable files, session configuration, and completed history
              </td>
              <td>Mounted files, live processes, ports, and working state</td>
            </tr>
            <tr>
              <th scope="row">Capability</th>
              <td>
                Focused Linux surface with V8, WebAssembly, and registered tools
              </td>
              <td>
                Full Linux; browsers, compilers, and GPUs when the provider
                supports them
              </td>
            </tr>
            <tr>
              <th scope="row">Trust</th>
              <td>Runtime, durable storage, and host bindings</td>
              <td>Provider isolation, images, credentials, and network</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Sleep does not freeze the agent</h3>

      <p>
        agentOS preserves selected files, session configuration, completed
        history, and permission bookkeeping across sleep. It does not preserve
        live commands or agent processes. Waking an actor reconstructs a safe
        continuation from durable state; it does not resume a frozen computer.
      </p>

      <h3>The external sandbox adds capabilities</h3>

      <p>
        Both layers run code, which is where the architecture can become
        confusing. The agentOS VM is the focused environment inside the
        application host. The selected provider runs the external full Linux
        sandbox. ComputeSDK is the interface between them, not the machine
        itself.
      </p>

      <p>
        The first-party{' '}
        <a href="https://agentos-sdk.dev/docs/sandbox/">
          sandbox-mounting extension
        </a>{' '}
        starts an external sandbox through the configured provider, projects its
        filesystem into the actor VM, exposes remote process controls, and
        destroys the sandbox with the VM. Durable actor files, session metadata,
        and completed history remain available when agentOS reconstructs the
        session later.
      </p>

      <h2 id="security">The bridge needs its own policy</h2>

      <p>
        agentOS describes its security model as beta and still undergoing
        review. Within that model, its{' '}
        <a href="https://agentos-sdk.dev/docs/security-model/">threat model</a>{' '}
        places its virtual kernel, sidecar, and approved host bindings inside
        the trusted system. The selected sandbox provider remains responsible
        for the external environment&apos;s isolation, images, credentials, and
        network policy.
      </p>

      <p>
        The integration needs an explicit policy for which actor may create a
        sandbox, which credentials enter it, what network it can reach, and
        which files may return. Each system can enforce its own boundary, but
        the application owns what crosses between them.
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

      <h2 id="decision">Choose by what needs to survive</h2>

      <p>
        For one bounded job, ComputeSDK and a sandbox provider can be the whole
        architecture. For identity, files, and completed history across
        requests, use agentOS. When the same agent also needs a browser, native
        toolchain, GPU, or another provider-specific capability, configure an
        external sandbox and copy durable outputs back before disposing of it.
      </p>

      <p>The agent can outlive every machine it uses.</p>
    </>
  )
}
