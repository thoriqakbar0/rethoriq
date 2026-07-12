import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

type ProfileKey = 'thoriq' | 'dmmulroy' | 'jxnl'

const profiles = {
  thoriq: {
    label: 'Your current system',
    owner: 'Thoriq',
    thesis: 'One editor, explicit tools, evidence before confidence.',
    description:
      'Your setup is already a serious working environment: Pi extensions and skills, strong repo-local instructions, focused verification, and a preference for tools that stay out of the way until called.',
    accent: '#5de4c7',
    traits: ['Pi-first', 'repo-aware', 'verification-heavy', 'warm + direct'],
    keep: [
      'Your Nvim theme, navigation, LSP, and existing muscle memory',
      'Pi as the main agent runtime, including your extensions and skill toggle',
      'Local AGENTS.md rules as the durable source of project behavior',
      'Small, risk-matched checks instead of ritual full builds',
    ],
    borrow: 'This is the stable base. The other profiles should be optional lenses, not replacements.',
  },
  dmmulroy: {
    label: 'Systems workshop',
    owner: 'Dmmulroy',
    thesis: 'Build the agent environment as an owned, programmable system.',
    description:
      'The interesting part is outside Nvim. His editor config is clean and conventional; the distinctive layer is a deeply customized Pi workspace with extensions, MCP, secret cloaking, skill management, and synced engineering skills.',
    accent: '#89ddff',
    traits: ['Pi platform', 'custom extensions', 'MCP', 'skill curation'],
    keep: [
      'The idea of treating Pi configuration as a real codebase',
      'A UI for enabling and disabling skills instead of loading everything',
      'Secret cloaking at the tool boundary',
      'External engineering skills installed from a controlled lockfile',
    ],
    borrow: 'Borrow the infrastructure patterns. His Nvim config has no meaningful embedded AI workflow to transplant.',
  },
  jxnl: {
    label: 'Operator playbook',
    owner: 'Jxnl',
    thesis: 'Turn recurring judgment into named, reusable agent workflows.',
    description:
      'His Nvim setup is effectively unrelated to the AI system. The useful material is a portable library of Codex and Claude prompts, opinionated global instructions, and narrow skills for review, shipping, persistence, and self-improvement.',
    accent: '#f087bd',
    traits: ['Codex-first', 'workflow skills', 'prompt library', 'high autonomy'],
    keep: [
      'Audit skills for AI-generated code, frontend work, and writing',
      'GitHub workflows for comments and CI investigation',
      'The self-improvement loop that mines repeated corrections',
      'The rule that skills stay narrow and move detail into references',
    ],
    borrow: 'Skip personal voice skills and one-click shipping defaults. They encode Jason’s identity and risk tolerance, not yours.',
  },
} as const

const comparison = [
  ['AI lives in', 'Pi + repo instructions', 'Pi platform', 'Codex skills/prompts'],
  ['Nvim role', 'Daily editor shell', 'Conventional editor', 'Legacy/basic editor'],
  ['Best idea', 'Evidence and locality', 'Programmable runtime', 'Reusable judgment'],
  ['Main risk', 'Too many active layers', 'Owning too much tooling', 'Importing another person’s defaults'],
] as const

export function HomePage() {
  const [active, setActive] = useState<ProfileKey>('thoriq')
  const profile = profiles[active]

  return (
    <main>
      <header className="hero">
        <p className="eyebrow">AI WORKBENCH / 01</p>
        <h1>Three dotfiles.<br />One setup that still feels like yours.</h1>
        <p className="lede">
          A field guide for testing Dmmulroy and Jxnl’s agent ideas without
          replacing the Nvim environment you already know.
        </p>
      </header>

      <nav className="profile-tabs" aria-label="AI setup profiles">
        {(Object.keys(profiles) as ProfileKey[]).map((key, index) => (
          <button
            key={key}
            className={active === key ? 'active' : ''}
            onClick={() => setActive(key)}
            style={{ '--profile-accent': profiles[key].accent } as React.CSSProperties}
          >
            <span>0{index + 1}</span>
            {profiles[key].owner}
          </button>
        ))}
      </nav>

      <section className="profile" style={{ '--accent': profile.accent } as React.CSSProperties}>
        <div className="profile-heading">
          <p>{profile.label}</p>
          <h2>{profile.thesis}</h2>
        </div>
        <div className="profile-body">
          <p className="profile-description">{profile.description}</p>
          <ul className="traits">
            {profile.traits.map((trait) => <li key={trait}>{trait}</li>)}
          </ul>
          <div className="keep-list">
            <p>What belongs in your experiment</p>
            <ol>
              {profile.keep.map((item) => <li key={item}>{item}</li>)}
            </ol>
          </div>
          <aside>{profile.borrow}</aside>
        </div>
      </section>

      <section className="matrix" aria-labelledby="matrix-title">
        <div className="section-number">02</div>
        <div>
          <h2 id="matrix-title">What each setup is actually about</h2>
          <div className="matrix-table">
            <div className="matrix-row matrix-head">
              <span></span><span>You</span><span>Dmmulroy</span><span>Jxnl</span>
            </div>
            {comparison.map(([label, yours, dmm, jxnl]) => (
              <div className="matrix-row" key={label}>
                <strong>{label}</strong><span>{yours}</span><span>{dmm}</span><span>{jxnl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="recommendation" aria-labelledby="recommendation-title">
        <div className="section-number">03</div>
        <div>
          <p className="eyebrow">RECOMMENDED SHAPE</p>
          <h2 id="recommendation-title">Keep the cockpit. Switch the copilot.</h2>
          <p>
            Your Nvim remains one configuration. An environment variable selects
            an AI profile that changes the launched agent, prompt pack, and skill
            directories—nothing else.
          </p>
          <div className="terminal" aria-label="Suggested commands">
            <div><span>$</span> nvim <em># your current Pi system</em></div>
            <div><span>$</span> nvim-dmm <em># Pi infrastructure experiment</em></div>
            <div><span>$</span> nvim-jxnl <em># Codex workflow experiment</em></div>
          </div>
          <div className="verdict-grid">
            <div><span>70%</span><p>Your current system</p></div>
            <div><span>20%</span><p>Dmmulroy’s runtime patterns</p></div>
            <div><span>10%</span><p>Jxnl’s portable skills</p></div>
          </div>
        </div>
      </section>

      <footer>
        <p>Prepared for Thoriq / July 2026</p>
        <p>Personal voice skills intentionally excluded.</p>
      </footer>
    </main>
  )
}
