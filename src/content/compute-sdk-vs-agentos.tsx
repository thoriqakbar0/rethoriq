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
        Every coding agent runs on two clocks. The agent clock measures
        identity, sessions, permissions, and history across requests. The
        machine clock measures provisioning, execution, billing, and teardown
        for one workload. Treat them as one lifecycle and either expensive
        compute lives too long or agent state disappears too early.
      </p>

      <h2 id="boundary">Each product owns one clock</h2>

      <p>
        On the machine clock,{' '}
        <a href="https://docs.computesdk.com/getting-started/introduction">
          ComputeSDK
        </a>{' '}
        standardizes how an application creates or recovers a sandbox, runs
        commands, works with files, exposes a port, and destroys the resource.
        Providers such as E2B, Modal, and Daytona supply the actual machine,
        capabilities, isolation, and billing. ComputeSDK can route creation
        across them, but it does not give the work an agent identity or preserve
        a conversation around it.
      </p>

      <p>
        On the agent clock, the actor layer in{' '}
        <a href="https://agentos-sdk.dev/docs/architecture/">agentOS</a> keeps a
        named agent addressable after a request or browser tab ends. It owns
        sessions, streamed events, selected persistent state, permissions,
        scheduled work, and sleep/wake behavior. It also supplies a lightweight
        virtual computer inside the application host: JavaScript runs in V8
        isolates, command-line software runs as WebAssembly, and a virtual
        kernel mediates files, processes, terminals, networking, and host
        access.
      </p>

      {runtimeBoundaryExplorer}

      <h2 id="quickstarts">The quickstarts start different clocks</h2>

      <p>ComputeSDK starts the machine clock with a sandbox and a command:</p>

      <pre>
        <code>{`import { e2b } from "@computesdk/e2b";

const compute = e2b({ apiKey: process.env.E2B_API_KEY });
const sandbox = await compute.sandbox.create();
const result = await sandbox.runCommand('echo "Hello World!"');
await sandbox.destroy();`}</code>
      </pre>

      <p>
        The application selects a provider, creates a remote environment, runs
        one command, and destroys the billable resource. The{' '}
        <a href="https://docs.computesdk.com/getting-started/quick-start">
          production guidance
        </a>{' '}
        recommends <code>try/finally</code> because an abandoned sandbox keeps
        consuming resources. ComputeSDK returns command output and an exit code;
        it does not choose a model, run an agent loop, store a transcript,
        request approval, or resume a conversation. Those responsibilities stay
        with the application.
      </p>

      <p>
        agentOS starts the agent clock with a named actor and session
        (abridged):
      </p>

      <pre>
        <code>{`const vm = agentOS({ software: [pi] });
export const registry = setup({ use: { vm } });
registry.start();

const handle = client.vm.getOrCreate("my-agent");
await handle.openSession({ agent: "pi", env: { /* model key */ } });
await handle.prompt({
  content: [{ type: "text", text: "Write hello.js" }],
});
const file = await handle.readFile("/workspace/hello.js");`}</code>
      </pre>

      <p>
        The application addresses the actor as <code>my-agent</code>, opens a
        coding-agent session, sends a prompt, and reads the resulting file. The{' '}
        <a href="https://agentos-sdk.dev/docs/quickstart/">full quickstart</a>{' '}
        also streams session events. The actor survives independently of the
        browser client, so a later request can find the same agent, selected
        files, permissions, and completed history.
      </p>

      <p>
        Their overlap is command execution. Their difference is everything that
        must exist before the command can run and everything that must remain
        after it finishes.
      </p>

      <h2 id="trade-offs">Splitting the clocks changes what you own</h2>

      <p>
        ComputeSDK moves sandbox acquisition and control out of the application.
        agentOS moves agent continuity and its lightweight runtime out. The
        remaining responsibilities become clearer when the same questions are
        asked of both layers.
      </p>

      <div className="article-table-wrap">
        <p className="article-table-hint" aria-hidden="true">
          Scroll to compare →
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col">Question</th>
              <th scope="col">ComputeSDK</th>
              <th scope="col">agentOS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">What are you creating?</th>
              <td>A provider-backed sandbox, usually remote</td>
              <td>An actor-managed VM and session</td>
            </tr>
            <tr>
              <th scope="row">Where does code run?</th>
              <td>
                The selected provider&apos;s container, workspace, or microVM
              </td>
              <td>V8 and WebAssembly inside the agentOS host</td>
            </tr>
            <tr>
              <th scope="row">What survives?</th>
              <td>Provider-specific sandbox lifetime and snapshots</td>
              <td>In actor mode: files, sessions, and completed history</td>
            </tr>
            <tr>
              <th scope="row">Can it run native tools?</th>
              <td>Yes, when the selected provider offers full Linux</td>
              <td>
                Only software packaged for its V8 and WebAssembly environment
              </td>
            </tr>
            <tr>
              <th scope="row">What is portable?</th>
              <td>Shared sandbox operations across providers</td>
              <td>
                The runtime across managed, self-hosted, or embedded deployment
              </td>
            </tr>
            <tr>
              <th scope="row">Who owns agent state?</th>
              <td>Your application or another framework</td>
              <td>The agentOS actor layer</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>They are portable along different axes</h3>

      <p>
        ComputeSDK carries shared sandbox operations across compute providers;
        agentOS carries the same agent runtime across managed Rivet, self-hosted
        Rivet, or an embedded Node backend. Neither makes every dependency
        portable. A ComputeSDK workload that relies on one provider&apos;s GPU
        or snapshot semantics remains provider-specific, while agentOS can move
        between hosts because its guest exposes a deliberately smaller machine.
      </p>

      <h3>Durable does not mean frozen in place</h3>

      <p>
        Across sleep, agentOS preserves selected files, session configuration,
        completed history, and permission bookkeeping. It does not preserve live
        commands or agent processes. Waking an actor reconstructs a safe
        continuation over durable state; it does not resume an entire suspended
        computer.
      </p>

      <h3>A smaller runtime is not a faster full Linux sandbox</h3>

      <p>
        The published agentOS benchmarks measure that smaller environment. They{' '}
        <a href="https://agentos-sdk.dev/docs/benchmarks/">report</a> a 4.8 ms
        median VM start after a shared helper process is already running. A
        simple shell workload adds roughly 22 MB of memory; a coding-agent
        workload adds about 131 MB. The{' '}
        <a href="https://agentos-sdk.dev/docs/limitations/">limitations</a>{' '}
        exclude arbitrary downloaded binaries, <code>apt</code>, Docker, kernel
        modules, GPUs, and native toolchains that have not been built for its
        registry, so those figures do not compare like-for-like with a
        provider-backed full Linux sandbox.
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

      <h2 id="security">Each clock has its own trust boundary</h2>

      <p>
        On the machine clock, ComputeSDK standardizes control, not isolation.
        The selected provider remains responsible for tenant boundaries, network
        policy, images, credentials, regional controls, and cleanup. A common
        API cannot make E2B, Modal, Daytona, and other backends the same
        security product, so changing providers still requires a security
        review.
      </p>

      <p>
        On the agent clock, agentOS defines its own{' '}
        <a href="https://agentos-sdk.dev/docs/security-model/">threat model</a>.
        Its virtual kernel mediates files, processes, networking, pipes, and
        terminals; host access is denied until the application grants a route,
        mount, or typed binding. That makes the policy boundary explicit, but it
        also places the sidecar and every approved host binding inside the
        trusted system. The APIs remain preview, so the documented model still
        needs validation against the workloads you plan to run.
      </p>

      <p>
        Persistence expands that trusted system to storage. The{' '}
        <a href="https://agentos-sdk.dev/docs/persistence/">
          persistence documentation
        </a>{' '}
        says each actor VM&apos;s SQLite database is trusted plaintext. It may
        contain environment values, MCP credentials, prompts, messages, and
        permission payloads without encryption or redaction, so access to that
        database and its backups is access to the agent&apos;s secrets and
        history. Using both products does not merge these trust boundaries; the
        application must evaluate each one and the bridge between them.
      </p>

      <h2 id="decision">Choose by what must survive the request</h2>

      <div className="article-decisions">
        <section>
          <h3>Choose ComputeSDK</h3>
          <p>
            Choose it when the unit of work is a provider-backed sandbox and the
            application already owns the surrounding agent state. It fits work
            that needs native builds, preview URLs, browsers, GPUs, or another
            full Linux capability supplied by the selected provider.
          </p>
        </section>
        <section>
          <h3>Choose agentOS actor mode</h3>
          <p>
            Choose it when the unit of work is a named agent whose sessions,
            completed history, permissions, and selected files must outlive one
            request. Its lightweight V8 and WebAssembly environment must also be
            sufficient for the work.
          </p>
        </section>
        <section>
          <h3>Use both</h3>
          <p>
            Use both when the agent must persist but the machine does not.
            agentOS retains the agent&apos;s identity and sessions; its
            first-party bridge creates a ComputeSDK sandbox for full Linux work
            and removes it with the actor VM.
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
