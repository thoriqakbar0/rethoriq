import { ArrowRightIcon, RadioTowerIcon } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { Separator } from '#/components/ui/separator'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const evidencePillars = [
  {
    label: '01',
    title: 'Research',
    body: 'Track source material, arguments, and live market language in one place.',
  },
  {
    label: '02',
    title: 'Narrative',
    body: 'Shape the thesis, pressure-test the framing, and keep the message compact.',
  },
  {
    label: '03',
    title: 'Delivery',
    body: 'Move the same story through product, site, deck, and follow-up without drift.',
  },
]

const footerLinks = [
  ['Product', 'Narrative graph'],
  ['Method', 'Pressure tests'],
  ['Contact', 'Founding access'],
]

export function HomePage() {
  return (
    <main aria-label="rethoriq home" className="page-shell">
      <div className="mx-auto flex min-h-screen w-full max-w-[39rem] flex-col px-4 pb-12 pt-[13px] sm:px-6">
        <header className="sticky top-[13px] z-50 mb-[48px]">
          <div className="flex min-h-[51px] items-center justify-between rounded-full border border-border bg-background px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <RadioTowerIcon />
              </div>
              <div className="flex flex-col">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                  Rethoriq v3
                </span>
                <span className="text-sm font-medium text-foreground">
                  Narrative system
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-3 text-sm text-muted-foreground sm:flex">
              <a
                href="#proof"
                className="transition-colors hover:text-foreground"
              >
                Proof
              </a>
              <Separator orientation="vertical" className="h-4" />
              <a
                href="#system"
                className="transition-colors hover:text-foreground"
              >
                System
              </a>
              <Separator orientation="vertical" className="h-4" />
              <a
                href="#contact"
                className="transition-colors hover:text-foreground"
              >
                Contact
              </a>
            </div>

            <Button variant="outline" size="sm">
              Founding access
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </header>

        <section
          id="proof"
          aria-label="hero frame"
          className="mb-[29px] min-h-[260px] border-y border-border"
        >
          <div className="flex h-full min-h-[260px] items-end py-5">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="uppercase tracking-[0.22em]">Work surface</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Plain start. Copy later.</span>
            </div>
          </div>
        </section>

        <section
          id="system"
          aria-label="evidence pillars"
          className="flex flex-col gap-[34px]"
        >
          {evidencePillars.map((pillar) => (
            <article
              key={pillar.title}
              className="flex max-w-[16rem] flex-col gap-3 text-sm"
            >
              <span className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
                {pillar.label}
              </span>
              <h2 className="font-[family-name:var(--font-heading)] text-[1.75rem] leading-[1] tracking-[-0.03em] text-foreground">
                {pillar.title}
              </h2>
              <p className="leading-6 text-muted-foreground">{pillar.body}</p>
            </article>
          ))}
        </section>

        <footer id="contact" className="mt-[112px]">
          <Separator className="mb-5" />
          <div className="flex min-h-[69px] items-start justify-between gap-6">
            <div className="flex max-w-[15rem] flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                Rethoriq v3
              </span>
              <p className="text-sm leading-6 text-muted-foreground">
                Compact narrative infrastructure for high-stakes product
                stories.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 text-sm">
              {footerLinks.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </span>
                  <span className="text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
