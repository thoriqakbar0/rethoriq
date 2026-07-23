# Research note: ComputeSDK vs agentOS

_Verified 2026-07-23 (Asia/Jakarta). Primary sources only: official repositories, documentation, npm metadata, and source code._

## Identification and reproducibility

“Compute SDK” almost certainly means [ComputeSDK](https://www.computesdk.com/) from [`computesdk/computesdk`](https://github.com/computesdk/computesdk). It is the only exact-name public SDK whose stated job—one interface over remote code-execution sandboxes—makes a direct comparison with agentOS useful. The lower-confidence lexical matches do different jobs: Prisma Compute SDK manages Prisma deployments, Fastly Compute SDKs target Fastly edge applications, and Globus Compute SDK submits distributed/HPC work.

I interpreted “soft clone” as **shallow clone** and inspected:

| Project    | Shallow clone                                                      | Inspected `main`                                                                                                                                   | Published package/release                                                                                                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ComputeSDK | `git clone --depth 1 https://github.com/computesdk/computesdk.git` | [`314ef4e78c24c69da4b2a4be9371d9b960ed63e7`](https://github.com/computesdk/computesdk/commit/314ef4e78c24c69da4b2a4be9371d9b960ed63e7), 2026-07-22 | [`computesdk@4.1.4`](https://github.com/computesdk/computesdk/releases/tag/computesdk%404.1.4), release commit [`8b34f2e0c311d7cf5659e980f08368677d9444c2`](https://github.com/computesdk/computesdk/commit/8b34f2e0c311d7cf5659e980f08368677d9444c2), MIT |
| agentOS    | `git clone --depth 1 https://github.com/rivet-dev/agentos.git`     | [`1bf0d2fb209e3b1de8654e9350ae88f7f154805c`](https://github.com/rivet-dev/agentos/commit/1bf0d2fb209e3b1de8654e9350ae88f7f154805c), 2026-07-23     | [`@rivet-dev/agentos@0.2.11`](https://github.com/rivet-dev/agentos/releases/tag/v0.2.11), release commit [`61c2e830d64f23181a3081beff28b09a1bc0e991`](https://github.com/rivet-dev/agentos/commit/61c2e830d64f23181a3081beff28b09a1bc0e991), Apache-2.0    |

ComputeSDK `main` is two days ahead of its package release. agentOS `main` is about 43 minutes ahead of its release. The agentOS repository deliberately keeps package manifests at `0.0.1`; its publish workflow rewrites versions transiently, so npm and the `v0.2.11` release are the version authority rather than the committed manifest. Sources: [ComputeSDK manifest](https://github.com/computesdk/computesdk/blob/314ef4e78c24c69da4b2a4be9371d9b960ed63e7/packages/computesdk/package.json), [agentOS publishing rules](https://github.com/rivet-dev/agentos/blob/1bf0d2fb209e3b1de8654e9350ae88f7f154805c/AGENTS.md), [npm package metadata for ComputeSDK](https://www.npmjs.com/package/computesdk), and [npm package metadata for agentOS](https://www.npmjs.com/package/@rivet-dev/agentos).

## The short version

These products sit at different layers:

> **ComputeSDK is a portability layer for acquiring and controlling sandboxes. agentOS is an agent runtime and virtual operating system that includes isolation, sessions, permissions, tools, persistence, and orchestration.**

ComputeSDK answers: “How can my application create an E2B, Modal, Daytona, Vercel, or other sandbox without rewriting the lifecycle and filesystem calls for every vendor?”

agentOS answers: “How can my application host a coding agent as a durable, permissioned actor with a Linux-like guest environment, direct host bindings, streamed ACP sessions, and sleep/wake persistence?”

They overlap at command execution and filesystems, but they are not substitutes. ComputeSDK deliberately delegates the runtime and security boundary to a provider. agentOS owns the runtime and policy boundary. agentOS’s own [sandbox comparison](https://agentos-sdk.dev/docs/versus-sandbox/) recommends combining its lightweight VM with a full sandbox when a job needs browsers, desktop automation, native compilation, databases, or other full-Linux facilities.

## Side-by-side

| Axis                | ComputeSDK                                                                                                               | agentOS                                                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primary abstraction | Provider-neutral `compute.sandbox` and optional `compute.snapshot`                                                       | A VM/actor containing an agent runtime, virtual kernel, filesystem, processes, network policy, sessions, and host bindings                                             |
| Runtime/languages   | TypeScript SDK on Node 18+; actual guest runtime comes from the selected provider                                        | TypeScript API on Node 22+ with a Rust sidecar; guest JavaScript in V8 isolates plus a POSIX-like WASM userspace, packaged tools, Node, Python, and ACP agent adapters |
| Location            | Usually a remote vendor sandbox; also has local providers such as `@computesdk/just-bash` and Docker/Kubernetes adapters | Runs in the application’s infrastructure, normally as many VM tenants in one shared sidecar process                                                                    |
| Isolation owner     | Provider-specific; the common interface does not define or enforce a security model                                      | agentOS kernel/sidecar mediates guest filesystem, process, network, DNS, pipes, PTYs, permissions, and limits                                                          |
| Agent loop          | None in the core abstraction                                                                                             | First-class ACP sessions for Pi, Claude Code, Codex, OpenCode, and custom ACP agents                                                                                   |
| Tools               | Shell commands, filesystem operations, port URL, and provider-native escape hatch; tools/MCP are application concerns    | Host functions become typed CLI bindings; MCP is supported; registry software is mounted into the VM and described to the agent                                        |
| State               | Sandbox lifetime and optional provider snapshot/template support; provider behavior varies                               | Actor mode persists filesystem, session catalog/configuration, completed history, and permission bookkeeping in SQLite across sleep/wake                               |
| Orchestration       | Provider selection, priority/round-robin routing, create-time fallback, and provider affinity                            | Actors, multiplayer connections, prompt serialization, cron, queues/workflows, agent-to-agent bindings, session restore, sleep/wake                                    |
| Observability       | `stdout`, `stderr`, exit code, duration, optional stream callbacks; separate optional events package                     | Sequenced session events, durable history, agent stderr/exit events, VM lifecycle events, and structured sidecar logs                                                  |
| Deployment          | The library stays in the caller; each selected provider supplies and bills the compute                                   | Rivet Cloud, self-hosted Rivet, or embedded `@rivet-dev/agentos-core` in a Node backend                                                                                |
| License             | MIT                                                                                                                      | Apache-2.0                                                                                                                                                             |
| Declared stability  | Docs call it “production-ready”; package is 4.1.4                                                                        | Docs explicitly say preview and API subject to change; package is 0.2.11                                                                                               |

Sources: [ComputeSDK introduction](https://docs.computesdk.com/getting-started/introduction), [ComputeSDK public sandbox interface](https://github.com/computesdk/computesdk/blob/314ef4e78c24c69da4b2a4be9371d9b960ed63e7/packages/computesdk/src/types/universal-sandbox.ts), [agentOS architecture](https://agentos-sdk.dev/docs/architecture/), [agentOS core package](https://agentos-sdk.dev/docs/core/), and [agentOS quickstart](https://agentos-sdk.dev/docs/quickstart/).

## What the two quickstarts actually do

### ComputeSDK: provision, execute, destroy

The current ComputeSDK quickstart:

1. Installs a provider package such as `@computesdk/e2b`.
2. Gives that provider its API key.
3. Calls the provider factory, which returns the shared `compute.sandbox` shape.
4. Creates a remote sandbox.
5. runs `echo "Hello World!"`.
6. Reads `stdout`.
7. Destroys the sandbox.

The full result shape is `stdout`, `stderr`, `exitCode`, and `durationMs`. Files survive for the sandbox lifetime and disappear on destroy unless the provider offers persistence or snapshots. Cleanup is a caller obligation; the docs recommend `try/finally` because an undestroyed sandbox keeps consuming resources until timeout. Sources: [ComputeSDK quickstart](https://docs.computesdk.com/getting-started/quick-start) and its [source at the inspected commit](https://github.com/computesdk/computesdk/blob/314ef4e78c24c69da4b2a4be9371d9b960ed63e7/docs/getting-started/quick-start.md).

This quickstart demonstrates **remote execution plumbing**, not an agent. There is no model, prompt, transcript, tool negotiation, approval loop, or durable conversation.

### agentOS: start an agent server, connect, prompt, stream, read its output

The agentOS quickstart:

1. Installs `@rivet-dev/agentos` and the Pi coding-agent package.
2. Defines a server-side VM actor with `agentOS({ software: [pi] })`, registers it with RivetKit, and starts the registry.
3. Creates a client that connects to the server and gets or creates the durable actor key `"my-agent"`.
4. Subscribes to `sessionEvent`.
5. Opens a Pi session with an Anthropic key.
6. Sends a natural-language prompt asking Pi to write `/workspace/hello.js`.
7. Reads back the file the agent created.

Sources: [quickstart documentation](https://agentos-sdk.dev/docs/quickstart/), [server source](https://github.com/rivet-dev/agentos/blob/1bf0d2fb209e3b1de8654e9350ae88f7f154805c/examples/quickstart-app/server.ts), and [client source](https://github.com/rivet-dev/agentos/blob/1bf0d2fb209e3b1de8654e9350ae88f7f154805c/examples/quickstart-app/client.ts).

The quickstart therefore crosses much more surface area. It demonstrates the isolation layer, an actual coding-agent adapter, client/server addressing, a durable session, streamed protocol events, prompt execution, and filesystem access. It also requires two processes and a model-provider credential, so it is heavier conceptually even though the guest VM itself is designed to start cheaply.

## Architecture and execution model

### ComputeSDK is an adapter monorepo

The core package defines a small required sandbox contract:

- `sandboxId` and `provider`
- `runCommand(command, options)`
- `getInfo()`
- `getUrl({ port })`
- `destroy()`
- `filesystem.readFile`, `writeFile`, `readdir`, `mkdir`, `exists`, and `remove`

Provider packages implement that contract through `@computesdk/provider`. Optional snapshot and template managers sit beside it. A provider can expose its native SDK object through `getInstance()`, which is useful when the common denominator is too small. Sources: [universal interface](https://github.com/computesdk/computesdk/blob/314ef4e78c24c69da4b2a4be9371d9b960ed63e7/packages/computesdk/src/types/universal-sandbox.ts) and [provider contract](https://github.com/computesdk/computesdk/blob/314ef4e78c24c69da4b2a4be9371d9b960ed63e7/packages/provider/src/types/provider.ts).

The `computesdk` package can register one provider or several. For new sandboxes, it can try providers in priority order or rotate round-robin, then fall back on creation failure. It keeps an **in-memory** sandbox-ID-to-provider map so later calls prefer the owning provider. A fresh process with only a stored sandbox ID does not have that affinity and probes configured providers. Failover is therefore orchestration of provider selection, not job checkpointing or replay. Sources: [compute reference](https://docs.computesdk.com/reference/compute) and [routing implementation](https://github.com/computesdk/computesdk/blob/314ef4e78c24c69da4b2a4be9371d9b960ed63e7/packages/computesdk/src/compute.ts).

The portability boundary is intentionally leaky:

- Provider creation options include an index signature for provider-specific fields.
- Resource units are not normalized (`memory`, `memoryMiB`, `memMiB`, and `memoryMb` coexist).
- Some providers ignore unsupported fields.
- Filesystem, list, URL, snapshot, image, pause/resume, GPU, and persistence behavior varies.
- The native-instance escape hatch is part of the provider contract.

That is a reasonable design for broad provider coverage, but “switch providers without code changes” is reliable only for the narrow shared contract and equivalent provider capabilities.

### agentOS is a hosted virtual kernel plus an actor layer

agentOS has three logical roles: a trusted client, a trusted server/sidecar, and an untrusted guest VM. The sidecar owns a per-VM virtual filesystem, process and socket tables, DNS, pipes/PTYs, permissions, and resource policy. Guest JavaScript runs in V8; shell and packaged Unix tools run through a custom POSIX-like WASM environment. Multiple VMs are tenants in one shared sidecar process, so a new VM adds an isolate and kernel state rather than booting another full Linux machine. Sources: [architecture overview](https://agentos-sdk.dev/docs/architecture/), [core sidecar model](https://agentos-sdk.dev/docs/core/), and [repository architecture rules](https://github.com/rivet-dev/agentos/blob/1bf0d2fb209e3b1de8654e9350ae88f7f154805c/AGENTS.md).

“VM” here should not be read as “a rented Firecracker machine.” It is agentOS’s virtualized Linux-like environment inside the host process. That is why startup and density can be better, but it is also why the product’s own docs direct browser automation, heavy native compilation, full dev servers, databases, GUI applications, and VNC to a full sandbox. The [sandbox extension](https://agentos-sdk.dev/docs/sandbox/) can mount such a sandbox’s filesystem and expose its process controls back to the agentOS guest.

### The first-party ComputeSDK bridge

agentOS has a documented, first-party ComputeSDK route. The exact layering is:

```text
agentOS
  -> @rivet-dev/agentos-sandbox
    -> sandbox-agent
      -> sandbox-agent/computesdk
        -> computesdk
          -> the configured ComputeSDK provider
```

The packages divide the work as follows:

1. The application configures ComputeSDK with the desired provider, then passes `computesdk()` from `@rivet-dev/agentos-sandbox/computesdk` as the agentOS `sandbox.provider`. This subpath is a published export, not an example-only adapter. Sources: [agentOS sandbox package exports](https://github.com/rivet-dev/agentos/blob/1bf0d2fb209e3b1de8654e9350ae88f7f154805c/packages/agentos-sandbox/package.json) and [sandbox provider documentation](https://agentos-sdk.dev/docs/sandbox/).
2. The thin agentOS adapter delegates to `computesdk()` from `sandbox-agent/computesdk`, then wraps the returned Sandbox Agent backend with `sandboxAgentProvider()`. Source: [agentOS ComputeSDK adapter](https://github.com/rivet-dev/agentos/blob/1bf0d2fb209e3b1de8654e9350ae88f7f154805c/packages/agentos-sandbox/src/computesdk.ts).
3. On each agentOS VM start, `sandboxAgentProvider()` calls `SandboxAgent.start()` with that backend. The Sandbox Agent ComputeSDK backend calls `compute.sandbox.create()`, installs and starts the Sandbox Agent server inside the new sandbox, and uses `sandbox.getUrl()` to connect to it. Sources: [agentOS Sandbox Agent wrapper](https://github.com/rivet-dev/agentos/blob/1bf0d2fb209e3b1de8654e9350ae88f7f154805c/packages/agentos-sandbox/src/provider.ts) and [Sandbox Agent ComputeSDK provider](https://github.com/rivet-dev/sandbox-agent/blob/bbc195cc3fb5a1dd9cb05d8437442768c511e17e/sdks/typescript/src/providers/computesdk.ts).
4. agentOS Core projects the Sandbox Agent filesystem into the lightweight VM, by default at `/mnt/sandbox`, and turns its process methods into the `agentos-sandbox` CLI bindings. Disposal flows back down the chain to `destroySandbox()`, which destroys the underlying ComputeSDK sandbox. Source: [agentOS sandbox expansion and lifecycle](https://github.com/rivet-dev/agentos/blob/1bf0d2fb209e3b1de8654e9350ae88f7f154805c/packages/core/src/sandbox.ts).

This means ComputeSDK is both a product to compare with agentOS and one of the full-sandbox backends agentOS can use. The layers retain distinct jobs: ComputeSDK selects and controls external compute; Sandbox Agent presents a uniform remote agent/filesystem/process service; `@rivet-dev/agentos-sandbox` turns that service into an agentOS mount, bindings, and per-VM lifecycle.

On top of the kernel, agentOS speaks the [Agent Client Protocol](https://agentclientprotocol.com/) to coding-agent adapters. The actor package adds durable identity, client connections, event broadcast, persistence, sleep/wake, multiplayer, previews, cron, queues, and workflows. The core package is the lower-level alternative when an application wants direct VM control and will own persistence and orchestration itself. Source: [Core versus Actor comparison](https://agentos-sdk.dev/docs/core/).

## State and durability

ComputeSDK’s core state model is the provider sandbox lifecycle. The common API can create, reconnect by ID, list, destroy, and—if a provider implements it—create/list/delete snapshots. Templates, images, filesystem persistence, pause/resume, and snapshot semantics are provider-specific. The SDK itself does not define a transcript, session store, durable job, retry log, or actor identity. Sources: [Compute API reference](https://docs.computesdk.com/reference/compute) and [sandbox reference](https://docs.computesdk.com/reference/compute.sandbox).

The agentOS actor makes selected state durable in actor SQLite:

- `/home/agentos` filesystem
- session catalog and configuration
- completed ACP history
- preview tokens
- prompt and permission bookkeeping

It does **not** preserve live adapter processes, running commands, shells, subscriptions, in-progress deltas, cron definitions, or in-memory mounts across sleep. On wake it boots a fresh VM over the same SQLite state and restores an agent adapter lazily when prompted. It refuses to automatically replay an interrupted prompt because a tool side effect may already have happened. Sources: [persistence and sleep](https://agentos-sdk.dev/docs/persistence/) and [agent-session architecture](https://agentos-sdk.dev/docs/architecture/agent-sessions/).

One operational caveat deserves article-level prominence: the per-VM database is trusted plaintext storage. The docs say session environment values, MCP credentials, prompts, messages, and tool/permission payloads may be stored without encryption or redaction. Database and backup access are therefore part of the security boundary. Source: [agentOS persistence](https://agentos-sdk.dev/docs/persistence/).

## Tools and host integration

ComputeSDK does not define agent tools. Its primitives are command execution, files, URLs, lifecycle, and the underlying provider object. An application can install an agent framework or MCP client inside the sandbox, but then it owns the prompt loop, credentials, tool protocol, approvals, and transcript. ComputeSDK’s separate [`@computesdk/events`](https://github.com/computesdk/computesdk/tree/314ef4e78c24c69da4b2a4be9371d9b960ed63e7/packages/events) package can store and subscribe to sandbox events, but it is not automatically wired into the core sandbox contract.

agentOS’s distinctive integration primitive is a **binding**. A host JavaScript function with a Zod schema is exposed inside the guest as a CLI command such as `agentos-weather forecast --city Paris`. The guest gets the input/output contract while credentials remain in the host function. Bindings can also bridge agents or expose a full sandbox. MCP servers remain available for third-party integrations. Sources: [bindings](https://agentos-sdk.dev/docs/bindings/), [agent-to-agent](https://agentos-sdk.dev/docs/agent-to-agent/), and [sandbox integration](https://agentos-sdk.dev/docs/sandbox/).

This is powerful and dangerous in exactly the obvious way: bindings execute with the host’s authority. agentOS can prevent the guest from invoking an unapproved binding, but a badly designed approved binding can still expose destructive host capability. The binding’s input validation and authorization are application responsibilities.

## Security model

ComputeSDK’s common interface does not specify filesystem/network/process permissions, syscall mediation, tenancy, image provenance, or credential isolation. Its security promise is inherited from each provider. Even the word “sandbox” covers different implementations: remote VMs, containers, serverless environments, Docker/Kubernetes, and the local in-memory `just-bash` provider. Provider documentation and threat models must be reviewed individually. Source: [provider catalog](https://github.com/computesdk/computesdk/blob/314ef4e78c24c69da4b2a4be9371d9b960ed63e7/README.md).

agentOS documents a concrete trust boundary: client configuration is trusted; the sidecar/kernel is the trusted enforcement point; guest code is untrusted. Guest syscalls are mediated through six permission scopes—filesystem, network, child process, process, environment, and binding—with network denied until enabled. Resource limits are enforced by the kernel. Sources: [security model](https://agentos-sdk.dev/docs/security-model/), [permissions](https://agentos-sdk.dev/docs/permissions/), and [resource limits](https://agentos-sdk.dev/docs/resource-limits/).

The stronger, more explicit policy model does not eliminate host hardening. agentOS itself recommends running internet-facing untrusted workloads in an already hardened host environment such as Lambda or Cloud Run. It is an in-process isolation system under active preview, so deployment should treat a sidecar/runtime vulnerability as a host-level risk.

## Observability and failure behavior

ComputeSDK’s core returns command output, error output, exit status, and duration, with optional `onStdout` and `onStderr` callbacks where providers support streaming. API/network failures throw; a command’s nonzero exit code is a result the caller must check. Multi-provider creation failures aggregate one error per attempted provider. Deeper metrics and logs belong to the provider or to separate application infrastructure. Sources: [quickstart error handling](https://docs.computesdk.com/getting-started/quick-start) and [public types](https://github.com/computesdk/computesdk/blob/314ef4e78c24c69da4b2a4be9371d9b960ed63e7/packages/computesdk/src/types/universal-sandbox.ts).

agentOS offers two distinct streams:

- Agent/session data: sequenced `sessionEvent` traffic, durable completed history, live ephemeral deltas, `onAgentStderr`, and `onAgentExit`.
- Runtime data: structured sidecar logfmt for request handling, networking, timing, and lifecycle, plus actor VM boot/shutdown events.

If an adapter exits unexpectedly, agentOS logs it, fails the active turn, and does not respawn it or replay uncertain work. A later explicit prompt restores the durable session. This is a more opinionated and safer failure semantic than generic “retry the operation.” Sources: [debugging](https://agentos-sdk.dev/docs/debugging/) and [session architecture](https://agentos-sdk.dev/docs/architecture/agent-sessions/).

## Deployment, cost, and portability

ComputeSDK’s deployment story is provider choice. The application installs the SDK and credentials, then the chosen provider hosts and bills the sandbox. Multi-provider mode adds routing and create-time fallback. Switching is easiest when the workload stays within commands and basic files, and hardest when it depends on GPU selection, images, snapshots, ports, persistence, or the native provider API.

agentOS’s deployment story is host placement. The actor can run on managed Rivet Cloud or self-hosted Rivet targets; Core can embed directly in a Node backend. Its marginal VM cost can be lower because many guests share one sidecar process, but the application now operates the host and accepts the sidecar as part of its trusted computing base. Sources: [deployment](https://agentos-sdk.dev/docs/deployment/) and [cost evaluation methodology](https://agentos-sdk.dev/docs/cost-evaluation/).

Avoid repeating either project’s benchmark or “production ready” wording as neutral fact. agentOS publishes a benchmark methodology and headline startup/cost claims, but workload, hardware, utilization, warmup, provider minimums, and isolation boundary differ. ComputeSDK’s actual cost and cold start are provider properties, not SDK properties.

## Maturity snapshot

Live GitHub metadata on 2026-07-23:

| Repository                                                          |    Created | Stars | Forks | Open issues + PRs | Latest published release       |
| ------------------------------------------------------------------- | ---------: | ----: | ----: | ----------------: | ------------------------------ |
| [`computesdk/computesdk`](https://github.com/computesdk/computesdk) | 2025-07-08 |   244 |    80 |                27 | `computesdk@4.1.4`, 2026-07-20 |
| [`rivet-dev/agentos`](https://github.com/rivet-dev/agentos)         | 2024-02-07 | 4,053 |   201 |                85 | `v0.2.11`, 2026-07-23          |

Sources: official GitHub API objects for [ComputeSDK](https://api.github.com/repos/computesdk/computesdk) and [agentOS](https://api.github.com/repos/rivet-dev/agentos). GitHub’s `open_issues_count` includes pull requests. Repository creation date and stars are weak proxies for product maturity; agentOS explicitly marks itself preview despite the larger community, while ComputeSDK uses a 4.x package version despite the newer repository.

The repositories also test different risks. ComputeSDK’s core unit tests use mocks, while cloud-provider integration tests require provider credentials. agentOS has broad core/runtime/session tests and native build machinery, but its public docs still warn that APIs can change. Neither fact alone proves production safety for a particular workload.

## Practical decision

Choose **ComputeSDK** when the primary requirement is full remote compute—native binaries, package installation, browsers, GPU, dev servers, or strong provider-managed machine isolation—and you want to delay or reduce vendor lock-in. Bring your own agent loop, tools, state, permissions, and observability.

Choose **agentOS** when the primary requirement is a dense, application-integrated coding-agent runtime—durable sessions, direct typed host tools, granular guest permissions, event streaming, multiplayer, and actor orchestration—and the workload fits its V8/WASM/packaged software environment.

Use **both layers** when the agent should live cheaply near application logic but occasionally needs a full machine. This is a documented first-party pairing: `@rivet-dev/agentos-sandbox/computesdk` wraps `sandbox-agent/computesdk`, which provisions the external sandbox through ComputeSDK, mounts its filesystem into agentOS, exposes its process controls as bindings, and destroys it with the VM. The integration is built in; the application still has to install and configure the selected ComputeSDK provider and accept that provider’s capabilities, pricing, and security model.

The cleanest article thesis is:

> ComputeSDK makes many sandboxes look alike. agentOS tries to make a sandbox unnecessary for the common case by moving a virtual agent machine into your backend. The former standardizes infrastructure; the latter supplies an opinionated agent operating environment. Their overlap is `runCommand()`. Their real difference is everything that happens before and after the command.

## Primary source index

### ComputeSDK

- Homepage and docs: https://www.computesdk.com/ and https://docs.computesdk.com/
- Repository: https://github.com/computesdk/computesdk
- Quickstart: https://docs.computesdk.com/getting-started/quick-start
- Compute routing API: https://docs.computesdk.com/reference/compute
- Universal sandbox source: https://github.com/computesdk/computesdk/blob/314ef4e78c24c69da4b2a4be9371d9b960ed63e7/packages/computesdk/src/types/universal-sandbox.ts
- Provider source: https://github.com/computesdk/computesdk/tree/314ef4e78c24c69da4b2a4be9371d9b960ed63e7/packages/provider
- Release: https://github.com/computesdk/computesdk/releases/tag/computesdk%404.1.4

### agentOS

- Homepage and docs: https://agentos-sdk.dev/ and https://agentos-sdk.dev/docs/
- Repository: https://github.com/rivet-dev/agentos
- Quickstart: https://agentos-sdk.dev/docs/quickstart/
- Architecture: https://agentos-sdk.dev/docs/architecture/
- agentOS versus sandbox: https://agentos-sdk.dev/docs/versus-sandbox/
- Sandbox integration: https://agentos-sdk.dev/docs/sandbox/
- ComputeSDK bridge: https://github.com/rivet-dev/agentos/blob/1bf0d2fb209e3b1de8654e9350ae88f7f154805c/packages/agentos-sandbox/src/computesdk.ts
- Sandbox Agent ComputeSDK backend: https://github.com/rivet-dev/sandbox-agent/blob/bbc195cc3fb5a1dd9cb05d8437442768c511e17e/sdks/typescript/src/providers/computesdk.ts
- Core versus actor: https://agentos-sdk.dev/docs/core/
- Persistence: https://agentos-sdk.dev/docs/persistence/
- Security: https://agentos-sdk.dev/docs/security-model/
- Debugging: https://agentos-sdk.dev/docs/debugging/
- Release: https://github.com/rivet-dev/agentos/releases/tag/v0.2.11
