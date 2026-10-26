import Link from "next/link";
import { ArrowRight, Bot, Check, ShieldCheck, UserRound } from "lucide-react";
import { Logo } from "@/components/Shell";

const before = [
  { day: "Day 1", text: "Forms arrive. Maker reads Finacle and SVS by hand" },
  { day: "Day 2", text: "Checker finds a mismatch. Case goes back" },
  { day: "Day 3", text: "Second round. Then a third" },
  { day: "Day 4", text: "Setup done in Admin. PINs printed" },
  { day: "Day 5", text: "Courier delivers. First login, maybe" },
];
const after = [
  { time: "09:12", text: "Forms arrive. Agent gathers evidence" },
  { time: "09:31", text: "Plan with sources sent to Sara" },
  { time: "10:07", text: "Sara returns 1 stage. Agent fixes only that" },
  { time: "10:46", text: "Set up and read back. 0 differences" },
  { time: "13:22", text: "Mohammed and Bilal live. Omar joins later" },
];

const findings = [
  { stat: "20 to 30", label: "joint-signatory forms a month, per team" },
  { stat: "4 rounds", label: "of maker-checker back and forth on a bad case" },
  { stat: "3 spellings", label: "of the same person across form, Finacle and SVS" },
  { stat: "Free text", label: "mandates in SVS that Finacle can't express" },
];

const decisions = [
  { title: "Match on IDs, never names", body: "Names differ in every system. EID and RCIF don't." },
  { title: "SVS wins over Finacle", body: "Finacle only says \u201cany two\u201d. The real rules live in the SVS mandate, so every rule cites a clause." },
  { title: "Show what wasn't searched", body: "When the agent misses a letter, the checker can see why. Honest misses build more trust than hidden ones." },
  { title: "Return one stage, keep the rest", body: "Approvals are tied to the exact content. If a stage didn't change, the approval stays." },
  { title: "Release when quorum allows", body: "If the ready people can still sign together, they go live. Nobody waits for one expired ID." },
  { title: "Reuse, don't recreate", body: "Mohammed already banks with us. His login gets linked, not duplicated." },
];

export default function CaseStudy() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Logo />
        <Link href="/demo/" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-ink">
          Open the demo <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-16 pt-12">
        <p className="text-sm text-muted">Case study · Agentic AI product design · Bisma Munawar</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">Joint signatories live in hours, not days.</h1>
        <p className="mt-5 max-w-2xl text-lg text-sub">
          Jointly is a workbench for bank operations teams. An agent does the slow, careful assembly across Finacle and SVS. A person still approves every stage. Rules, not the AI, decide who can sign.
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
              {i < a.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted" />}
            </span>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-panel/50">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold">Before</p>
            <p className="text-xs text-muted">4 to 5 days, mostly waiting</p>
            <ol className="mt-5 space-y-3">
              {before.map((b) => (
                <li key={b.day} className="flex gap-4 text-sm">
                  <span className="w-12 shrink-0 text-muted">{b.day}</span>
                  <span className="text-sub">{b.text}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="text-sm font-semibold">After</p>
            <p className="text-xs text-muted">Same controls, same day. Illustrative target</p>
            <ol className="mt-5 space-y-3">
              {after.map((b) => (
                <li key={b.time} className="flex gap-4 text-sm">
                  <span className="tnum w-12 shrink-0 font-medium text-accent-ink">{b.time}</span>
                  <span>{b.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">What I heard</h2>
        <p className="mt-2 max-w-2xl text-sub">I mapped the single, joint and non-signatory flows and spoke with people who run them. The work isn&apos;t hard. It&apos;s slow, manual and easy to get slightly wrong.</p>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 md:grid-cols-4">
          {findings.map((f) => (
            <div key={f.stat} className="bg-white p-5">
              <p className="text-2xl font-semibold">{f.stat}</p>
              <p className="mt-1 text-sm text-sub">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="text-2xl font-semibold tracking-tight">Where the agent helps, and where it doesn&apos;t</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-line p-5">
            <p className="text-sm font-semibold">The agent does</p>
            <ul className="mt-3 space-y-2 text-sm text-sub">
              <li>Reads forms, Finacle, SVS and KYC in one pass</li>
              <li>Spots conflicts and expired IDs early</li>
              <li>Drafts the plan with a source on every line</li>
              <li>Sets it up and reads it back to prove it matches</li>
              <li>Drafts the messages customers actually need</li>
            </ul>
          </div>
          <div className="rounded-xl border border-line p-5">
            <p className="text-sm font-semibold">The agent never</p>
            <ul className="mt-3 space-y-2 text-sm text-sub">
              <li>Waives KYC</li>
              <li>Matches people on a similar name</li>
              <li>Approves its own work</li>
              <li>Releases access the mandate can&apos;t support</li>
              <li>Sees, makes or sends a password</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Decisions that shaped it</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {decisions.map((d, i) => (
              <div key={d.title} className="rounded-xl border border-line p-5">
                <p className="tnum text-xs text-muted">0{i + 1}</p>
                <p className="mt-2 font-semibold">{d.title}</p>
                <p className="mt-1 text-sm text-sub">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-panel/50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Open questions for a real bank</h2>
          <ul className="mt-6 grid gap-3 text-sm text-sub md:grid-cols-3">
            <li className="rounded-xl border border-dashed border-warn/50 bg-white p-4">Is partial release allowed under the bank&apos;s policy?</li>
            <li className="rounded-xl border border-dashed border-warn/50 bg-white p-4">Will security approve digital activation instead of couriered PINs?</li>
            <li className="rounded-xl border border-dashed border-warn/50 bg-white p-4">Can a system user act as maker, or is a named human required?</li>
          </ul>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-white p-6">
            <div>
              <p className="font-semibold">Try it yourself</p>
              <p className="text-sm text-sub">About 5 minutes. A short tour points out the 4 key moments.</p>
            </div>
            <Link href="/demo/case/" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-sm font-medium text-white hover:bg-accent-ink">
              Start with Al Noor Trading <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="mt-8 text-xs text-muted">Portfolio demo. All people, accounts and bank systems are synthetic. Not affiliated with any bank.</p>
        </div>
      </section>
    </div>
  );
}
