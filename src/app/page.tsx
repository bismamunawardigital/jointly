import Link from "next/link";
import { ArrowRight, Bot, Check, ShieldCheck, UserRound } from "lucide-react";
import { Logo } from "@/components/Shell";
import { AutonomyMap } from "@/components/AutonomyMap";
import { BeforeAfter } from "@/components/BeforeAfter";
import { SpecDrawing } from "@/components/SpecDrawing";
import { ThemeButton } from "@/components/ThemeToggle";

const findings = [
  { stat: "20 to 30", label: "joint-signatory forms a month, per team" },
  { stat: "4 rounds", label: "of maker-checker back and forth on a bad case" },
  {
    stat: "3 spellings",
    label: "of the same person across form, Finacle and SVS",
  },
  { stat: "Free text", label: "mandates in SVS that Finacle can't express" },
];

const patterns = [
  {
    title: "Match on IDs, never names",
    body: "Every system spells Mohammed differently. The agent only links people by EID and RCIF, so a similar name can never grant access.",
    tab: "evidence",
  },
  {
    title: "Every claim has a source",
    body: "Each line of the plan has a chip that opens the record it came from. If the agent can't cite it, it doesn't say it.",
    tab: "plan",
  },
  {
    title: "Show what wasn't searched",
    body: "The approval card says which documents the agent didn't read. Sara catches the miss from the screen, not from memory.",
    tab: "review",
  },
  {
    title: "Approval is tied to the content",
    body: "Sara returns one stage, not the whole case. If a stage didn't change, her approval stays. If it did, she sees a diff.",
    tab: "review",
  },
  {
    title: "Rules live in code, not the model",
    body: "Who can sign at what amount is a yes or no question. A rules engine answers it, and you can test it yourself in the simulator.",
    tab: "simulator",
  },
  {
    title: "Release what's safe, hold the rest",
    body: "Rashid's ID expired. The rules prove the other two can still sign together, so they go live today and he joins later.",
    tab: "release",
  },
];

export default function CaseStudy() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeButton />
          <Link
            href="/demo/"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-sm font-medium text-onaccent transition-colors hover:bg-accent-hover"
          >
            Open the demo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-16 pt-12">
        <p className="text-sm text-muted">
          Case study · Agentic AI product design · Bisma Munawar
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Joint signatories live in hours, not days.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-sub">
          Jointly is a workbench for bank operations teams. An agent does the
          slow, careful assembly across Finacle and SVS. A person still approves
          every stage. Rules, not the AI, decide who can sign.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
          {[
            { icon: Bot, label: "Agent proposes" },
            { icon: ShieldCheck, label: "Rules verify" },
            { icon: UserRound, label: "Human approves" },
            { icon: Bot, label: "Agent executes" },
            { icon: Check, label: "System verifies" },
          ].map(({ icon: Icon, label }, i, a) => (
            <span key={label} className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5">
                <Icon className="h-3.5 w-3.5 text-accent" /> {label}
              </span>
              {i < a.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-muted" />
              )}
            </span>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-panel/50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <BeforeAfter />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">What I heard</h2>
        <p className="mt-2 max-w-2xl text-sub">
          I mapped the single, joint and non-signatory flows and spoke with
          people who run them. The work isn&apos;t hard. It&apos;s slow, manual
          and easy to get slightly wrong.
        </p>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 md:grid-cols-4">
          {findings.map((f) => (
            <div key={f.stat} className="bg-surface p-5">
              <p className="text-2xl font-semibold">{f.stat}</p>
              <p className="mt-1 text-sm text-sub">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          Who decides what
        </h2>
        <p className="mt-2 max-w-2xl text-sub">
          The first thing I designed wasn&apos;t a screen. It was this map.
          Every action the agent could take had to land in one of four lanes
          before I drew anything.
        </p>
        <div className="mt-8">
          <AutonomyMap />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-line p-6">
            <p className="text-xs text-muted">The skeptic&apos;s question</p>
            <h3 className="mt-1 text-lg font-semibold">
              Why not just fix the data?
            </h3>
            <p className="mt-2 text-sm text-sub">
              Even a perfectly structured mandate still has to become users,
              roles, amount bands and approval workflows in Digital Banking
              Admin, and it still has to match Finacle. That translation is the
              job. The agent does it. CF checks it with every source in front of
              her.
            </p>
          </div>
          <div className="rounded-xl border border-line p-6">
            <p className="text-xs text-muted">Who starts it</p>
            <h3 className="mt-1 text-lg font-semibold">
              The customer asks, the agent builds, CF approves
            </h3>
            <p className="mt-2 text-sm text-sub">
              The signatories request access. The agent starts on its own,
              builds the setup and shows where every line came from. The agent
              is a system user that can make but never approve. Sara is the
              accountable person.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Agent design patterns
          </h2>
          <p className="mt-2 max-w-2xl text-sub">
            Six patterns I&apos;d bring to any agent that works inside old
            systems. Each one links to the moment in the demo where you can see
            it.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {patterns.map((d, i) => (
              <Link
                key={d.title}
                href={`/demo/case/?tab=${d.tab}`}
                className="group flex flex-col rounded-xl border border-line p-5 transition-colors hover:border-accent/40 hover:bg-panel/40"
              >
                <p className="tnum text-xs text-muted">0{i + 1}</p>
                <p className="mt-2 font-semibold">{d.title}</p>
                <p className="mt-1 flex-1 text-sm text-sub">{d.body}</p>
                <p className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent-ink">
                  See it in the demo{" "}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            The card Sara lives in
          </h2>
          <p className="mt-2 max-w-2xl text-sub">
            The checker spends most of her day on this one card, so I sweated
            it. Every space comes from one small scale, and the only colour is
            the status.
          </p>
          <div className="mt-8">
            <SpecDrawing />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-panel/50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            What I&apos;d test next
          </h2>
          <ul className="mt-6 grid gap-3 text-sm text-sub md:grid-cols-2">
            <li className="rounded-xl border border-dashed border-warn/50 bg-surface p-4">
              Do checkers trust a plan more when they can see what the agent
              didn&apos;t search?
            </li>
            <li className="rounded-xl border border-dashed border-warn/50 bg-surface p-4">
              Would the bank&apos;s policy allow going live with 2 of 3
              signatories?
            </li>
            <li className="rounded-xl border border-dashed border-warn/50 bg-surface p-4">
              Will security accept self-service activation instead of couriered
              PINs?
            </li>
            <li className="rounded-xl border border-dashed border-warn/50 bg-surface p-4">
              Can a system user be the maker, or does it need a named person?
            </li>
          </ul>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-6">
            <div>
              <p className="font-semibold">Try it yourself</p>
              <p className="text-sm text-sub">
                About 5 minutes. A short tour shows 4 of the patterns in action.
              </p>
            </div>
            <Link
              href="/demo/case/"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-sm font-medium text-onaccent hover:bg-accent-hover"
            >
              Start with Creekside General Trading{" "}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="mt-8 text-xs text-muted">
            Portfolio demo. All people, accounts and bank systems are synthetic.
            Not affiliated with any bank.
          </p>
        </div>
      </section>
    </div>
  );
}
