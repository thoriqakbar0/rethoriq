import type { ReactNode } from 'react'

interface ComputeSdkVsAgentOsArticleBodyProps {
  readonly runtimeBoundaryExplorer: ReactNode
}

const computeSdkRepository =
  'https://github.com/computesdk/computesdk/tree/314ef4e78c24c69da4b2a4be9371d9b960ed63e7'
const agentOsRepository =
  'https://github.com/rivet-dev/agentos/tree/1bf0d2fb209e3b1de8654e9350ae88f7f154805c'

/**
 * Supplies the article's prose and editorial figures without page chrome.
 */
export function ComputeSdkVsAgentOsArticleBody({
  runtimeBoundaryExplorer,
}: ComputeSdkVsAgentOsArticleBodyProps) {
  return (
    <>
      <aside className="article-summary" aria-labelledby="summary-heading">
        <p className="article-summary-label" id="summary-heading">
          Quick glance
        </p>
        <p className="article-summary-question">
          Is your unit of work the sandbox or the agent?
        </p>
        <ol>
          <li>
            <strong>Choose ComputeSDK</strong> when the unit of work is a
            disposable provider-backed sandbox.
          </li>
          <li>
            <strong>Choose agentOS actor mode</strong> when agent identity,
            selected state, and session history must survive the request.
          </li>
          <li>
            <strong>Use both</strong> when that durable agent also needs full
            Linux and the selected sandbox provider supplies it.
          </li>
        </ol>
      </aside>

      <p>
        Why does an agent need separate compute? Because the agent and the
        machine doing its work have different lifecycles. Looking only at the
        agent loop hides jobs that need a browser, native compiler, system
        package, or GPU.
      </p>

      <p>
        agentOS actor mode keeps the agent addressable: its identity, selected
        state, sessions, schedule, and permission bookkeeping. ComputeSDK
        provisions a provider-backed sandbox and returns its results; the
        selected provider determines its runtime and machine capabilities. One
        preserves the agent&apos;s continuity; the other supplies compute.
      </p>

      <h2 id="boundary">The split happens after the command</h2>

      <p>
        <a href="https://docs.computesdk.com/getting-started/introduction">
          ComputeSDK
        </a>{' '}
        abstracts sandbox providers. E2B, Modal, and Daytona expose different
        APIs; ComputeSDK puts the same TypeScript operations in front of them:
        create or recover a sandbox, run a command, work with files, expose a
        port, and destroy the resource. It can prioritize providers, distribute
        work round-robin, and fall through when sandbox creation fails.
        ComputeSDK tracks the sandbox lifecycle; your application still tracks
        the agent.
      </p>

      <p>
        The actor layer in{' '}
        <a href="https://agentos-sdk.dev/docs/architecture/">agentOS</a> keeps a
        named agent addressable after a request or browser tab ends. It adds
        streamed sessions, persistence, scheduled work, and sleep/wake behavior.
        Across sleep, the agent&apos;s identity and selected state survive; live
        processes do not. Underneath, agentOS runs a virtual computer inside the
        application host. Its virtual kernel controls files, processes, pipes,
        interactive terminal sessions, networking, and permissions. JavaScript
        runs in V8 isolates—V8 is Google&apos;s JavaScript engine, not “VM
        8”—while command-line software runs as WebAssembly.
      </p>

      {runtimeBoundaryExplorer}

      <p>
        agentOS actor mode retains the durable agent&apos;s selected state. Its
        first-party bridge attaches a ComputeSDK sandbox to the actor VM and
        destroys the sandbox with that VM. The application or agent can invoke
        the mounted Linux environment for work that needs capabilities beyond V8
        and WebAssembly.
      </p>

      <h2 id="quickstarts">The quickstarts expose the boundary</h2>

      <p>ComputeSDK starts with a sandbox and a command:</p>

      <pre>
        <code>{`import { e2b } from "@computesdk/e2b";

const compute = e2b({ apiKey: process.env.E2B_API_KEY });
const sandbox = await compute.sandbox.create();
const result = await sandbox.runCommand('echo "Hello World!"');
await sandbox.destroy();`}</code>
      </pre>

      <p>
        Your code selects a provider, provisions a remote environment, runs the
        command, and cleans up the billable resource. Command failures come back
        as exit codes; provider and network failures throw. The{' '}
        <a href="https://docs.computesdk.com/getting-started/quick-start">
          production guidance
        </a>{' '}
        recommends <code>try/finally</code> because an abandoned sandbox keeps
        consuming resources. The call returns a command or file result; it does
        not preserve an ongoing agent session or its state.
      </p>

      <p>
        ComputeSDK does not choose a model, run an agent loop, store a
        transcript, request human approval, schedule another turn, or resume a
        conversation. If you choose it expecting those features, they become
        application code you must design, store, secure, and operate.
      </p>

      <p>agentOS starts with a named actor and agent session (abridged):</p>

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
        The addressable actor survives independently of the browser client. You
        open a coding-agent session, stream its events, send a prompt, and read
        the file produced by the turn. The{' '}
        <a href="https://agentos-sdk.dev/docs/quickstart/">full quickstart</a>{' '}
        centers on an actor, a session, and an agent rather than a shell
        command. That difference matters when the next request must find the
        same agent, files, permissions, and history.
      </p>

      <h2 id="trade-offs">What each choice makes you own</h2>

      <p>
        For each row, ask what your application must store, retry, secure, and
        pay for.
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
            <tr>
              <th scope="row">How is it licensed?</th>
              <td>MIT</td>
              <td>Apache-2.0</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        ComputeSDK&apos;s portability ends at its shared interface. A workload
        that depends on one provider&apos;s GPU configuration or snapshot
        semantics is still provider-specific. agentOS can place its runtime in
        managed Rivet, self-hosted Rivet, or an embedded Node backend, but it
        deliberately exposes less of a machine.
      </p>

      <h3>Read the benchmark in scope</h3>

      <p>
        The published agentOS benchmarks measure its smaller runtime. They{' '}
        <a href="https://agentos-sdk.dev/docs/benchmarks/">report</a> a 4.8 ms
        median VM start after a shared helper process is already running. A
        simple shell workload adds roughly 22 MB of memory; a coding-agent
        workload adds about 131 MB. Those numbers are not a neutral comparison
        with a full Linux sandbox. The{' '}
        <a href="https://agentos-sdk.dev/docs/limitations/">limitations</a>{' '}
        exclude arbitrary downloaded binaries, <code>apt</code>, Docker, kernel
        modules, GPUs, and native toolchains that have not been built for its
        registry. Its figures are useful only for workloads that fit that
        smaller environment.
      </p>

      <h3>When the product needs both</h3>

      <p>
        The first-party integration covers products with both workload shapes.
        Its{' '}
        <a href="https://agentos-sdk.dev/docs/sandbox/">
          sandbox-mounting extension
        </a>{' '}
        makes an external sandbox available for browsers, native extensions,
        desktop automation, or heavy builds. The application or agent decides
        when to invoke it. The agentOS snapshot inspected for this article
        includes a ComputeSDK provider for that full-sandbox layer.
      </p>

      <h2 id="security">Security belongs to different components</h2>

      <p>
        With ComputeSDK, the selected provider supplies isolation. A common API
        does not make E2B, Modal, Daytona, and other backends the same security
        product. You still need to evaluate tenant isolation, credentials,
        network policy, images, regional controls, and cleanup for the provider
        you deploy. API portability does not move that responsibility into
        ComputeSDK.
      </p>

      <p>
        agentOS publishes a narrower{' '}
        <a href="https://agentos-sdk.dev/docs/security-model/">threat model</a>.
        Its virtual kernel mediates filesystem, process, network, DNS, pipes,
        and PTYs. Host access is denied by default, then granted through
        selected network routes, mounts, or typed bindings. The documentation
        also labels the APIs as preview. Its threat model describes the intended
        boundary; it does not prove a release safe for hostile code. A smaller
        virtual machine narrows what must be isolated, but it does not remove
        the need to validate the isolation you rely on.
      </p>

      <p>
        Actor persistence also decides where an agent&apos;s secrets accumulate.
        The{' '}
        <a href="https://agentos-sdk.dev/docs/persistence/">
          persistence documentation
        </a>{' '}
        says each VM&apos;s SQLite database is trusted plaintext storage. It may
        contain environment values, MCP credentials, prompts, messages, and
        permission payloads without encryption or redaction. Anyone who can read
        that database or its backups can read the agent&apos;s secrets and
        history.
      </p>

      <h2 id="decision">Choose the layer you actually need</h2>

      <div className="article-decisions">
        <section>
          <h3>Choose ComputeSDK</h3>
          <p>
            Your unit of work is a disposable provider-backed sandbox. Choose a
            compatible provider when the workload needs native builds, preview
            URLs, browsers, GPUs, or full Linux. If an agent submits the job,
            you still own its loop and durable state; ComputeSDK will not
            provide them.
          </p>
        </section>
        <section>
          <h3>Choose agentOS actor mode</h3>
          <p>
            Your unit of work is an agent with durable identity and state: named
            sessions, streamed transcripts, controlled credentials, approvals,
            or scheduled work. Choose it when those sessions matter and the
            workload fits inside its V8 and WebAssembly environment.
          </p>
        </section>
        <section>
          <h3>Use both</h3>
          <p>
            The same product needs a durable agent and full Linux capabilities.
            agentOS actor mode retains the agent&apos;s identity, selected
            state, sessions, history, and permission bookkeeping. Its
            first-party bridge attaches a ComputeSDK sandbox that the
            application or agent can invoke for full-Linux work.
          </p>
        </section>
      </div>

      <h2 id="sources">Sources and reproducibility</h2>

      <p>
        This comparison uses the{' '}
        <a href="https://docs.computesdk.com/getting-started/quick-start">
          ComputeSDK quickstart
        </a>
        {' and '}
        its <a href={computeSdkRepository}>repository snapshot</a>. For agentOS,
        it uses the{' '}
        <a href="https://agentos-sdk.dev/docs/quickstart/">quickstart</a>, the{' '}
        <a href="https://agentos-sdk.dev/docs/architecture/">
          architecture guide
        </a>
        , the{' '}
        <a href="https://agentos-sdk.dev/docs/security-model/">
          security model
        </a>
        , the{' '}
        <a href="https://agentos-sdk.dev/docs/limitations/">limitations</a>, and
        the <a href={agentOsRepository}>agentOS repository snapshot</a>. Both
        repositories were cloned with <code>--depth 1</code> on July 23, 2026.
        The latest published ComputeSDK package was 4.1.4; the latest agentOS
        release was{' '}
        <a href="https://github.com/rivet-dev/agentos/releases/tag/v0.2.11">
          v0.2.11
        </a>{' '}
        and its documentation described the APIs as preview. I did not use
        package credentials or paid sandbox accounts, so this is an architecture
        comparison rather than a latency benchmark.
      </p>
    </>
  )
}
