import Link from "next/link";
import { ArrowRight, Ban, Check, FileText, Printer, Search, ShieldCheck, Truck, Undo2, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/Shell";
import { ThemeButton } from "@/components/ThemeToggle";
import { AgentMark, Avatar } from "@/components/ui";
import { HeroScene } from "@/components/landing/HeroScene";
import { Moments } from "@/components/landing/Moments";

const stats = [
  { v: "1h 54m", k: "was 4–5 days" },
  { v: "0", k: "approvals by the agent" },
  { v: "2 of 4", k: "stages re-checked, not all" },
];

const days: { day: string; icons: { I: LucideIcon; label: string }[] }[] = [
  { day: "Day 1", icons: [{ I: FileText, label: "Paper form" }] },
  { day: "Day 2", icons: [{ I: Search, label: "Checking records" }] },
  { day: "Day 3", icons: [{ I: Undo2, label: "Returned" }, { I: Undo2, label: "Returned" }, { I: Undo2, label: "Returned" }] },
  { day: "Day 4", icons: [{ I: Printer, label: "Printing PINs" }] },
  { day: "Day 5", icons: [{ I: Truck, label: "Courier" }] },
];

const lanes: { icon: React.ReactNode; title: string; items: string[]; never?: boolean }[] = [
  { icon: <AgentMark size={40} />, title: "Agent does", items: ["Reads every record", "Builds the plan", "Sets it up after approval"] },
  { icon: <ShieldCheck className="h-10 w-10 text-accent" />, title: "Rules decide", items: ["Who can sign", "Up to what amount", "Who can go live"] },
  { icon: <UserRound className="h-10 w-10 text-ink" />, title: "Sara approves", items: ["Each stage", "Unclear values", "Every release"] },
  { icon: <Ban className="h-10 w-10 text-bad" />, title: "Never allowed", items: ["Approve its own work", "Send passwords", "Match people by name"], never: true },
];

const chip = "rounded-full border border-line bg-canvas px-2 py-0.5 text-[11px]";
const principles: { title: string; mini: React.ReactNode }[] = [
  {
    title: "Match on IDs, never names",
    mini: (
      <div className="flex items-center gap-2">
        <span className={`${chip} text-muted line-through`}>Mohd</span>
        <ArrowRight className="h-3 w-3 text-muted" />
        <span className={`${chip} font-medium`}>EID 3391</span>
      </div>
    ),
  },
  {
    title: "Every claim has a source",
    mini: (
      <div className="flex items-center gap-2">
        <span className="h-2 w-24 rounded bg-ink/20" />
        <span className="flex h-8 w-6 items-center justify-center rounded border border-line bg-canvas">
          <FileText className="h-3 w-3 text-muted" />
        </span>
      </div>
    ),
  },
  {
    title: "Show what it isn't sure about",
    mini: (
      <div className="flex items-center gap-2">
        <span className="h-8 w-16 rounded bg-ink/15 blur-[2px]" />
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warn-soft text-xs font-semibold text-warn-ink">?</span>
      </div>
    ),
  },
  {
    title: "Approval stays with the content",
    mini: (
      <div className="flex gap-1.5">
        {[1, 2].map((n) => (
          <span key={n} className="flex h-6 w-6 items-center justify-center rounded-full bg-ok text-onaccent">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        ))}
        {[3, 4].map((n) => (
          <span key={n} className="h-6 w-6 rounded-full border-2 border-accent" />
        ))}
      </div>
    ),
  },
  {
    title: "Rules live in code",
    mini: (
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-accent" />
        <span className={`${chip} text-ok-ink`}>yes</span>
        <span className={`${chip} text-bad-ink`}>no</span>
      </div>
    ),
  },
  {
    title: "Release what's safe",
    mini: (
      <div className="flex items-center gap-3">
        <span className="flex">
          <Avatar id="mohammed" size={28} />
          <span className="-ml-2">
            <Avatar id="khalifa" size={28} />
          </span>
        </span>
        <Avatar id="rashid" size={28} held />
      </div>
    ),
  },
];

const heard = [
  { q: "you start clicking Approve on autopilot and stop reading the diffs.", who: "Agent user, Hacker News", href: "https://news.ycombinator.com/item?id=48830674", d: "Exact copies fold away." },
  { q: "The bank showed them a confidence score. The regulator shut it down.", who: "Banking AI lead, LinkedIn", href: "https://www.linkedin.com/posts/johnforrester_a-regulator-asked-a-bank-to-explain-its-ai-activity-7438239662009114624-WaU0", d: "Rules, not scores." },
  { q: "didn't know when to escalate, and quietly routed around it.", who: "Ops leader, LinkedIn", href: "https://www.linkedin.com/posts/jeffreytking_our-first-agentic-rollout-failed-in-three-activity-7465363738846638080-lVjb", d: "One place says what needs you." },
];

const sources = [
  { s: "Vasconcelos et al., CSCW 2023", href: "https://doi.org/10.1145/3579605", f: "Easier checking cuts over-trust." },
  { s: "Steyvers and Kumar, 2024", href: "https://journals.sagepub.com/doi/full/10.1177/17456916231181102", f: "Showing certainty helps people rely on AI the right amount." },
  { s: "Buçinca et al., CSCW 2021", href: "https://doi.org/10.1145/3449287", f: "A small forced check cuts rubber-stamping." },
  { s: "Amershi et al., CHI 2019", href: "https://doi.org/10.1145/3290605.3300233", f: "Support quick correction." },
  { s: "EU AI Act, Article 14", href: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-14", f: "Humans must be able to stop the system." },
  { s: "Feng, McDonald and Zhang, 2025", href: "https://arxiv.org/html/2506.12469v1", f: "Autonomy is a design choice." },
];

const unknowns = [
  "Does showing what the agent didn't search build trust?",
  "Will a bank allow 2 of 3 signatories to go live?",
  "Will security accept self-service activation?",
  "Can a system user be the maker?",
];

const h2 = "font-display text-3xl tracking-tight md:text-4xl";
const primary = "inline-flex h-11 items-center gap-1.5 rounded-lg bg-accent px-5 text-sm font-medium text-onaccent transition-colors hover:bg-accent-hover";

export default function CaseStudy() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-2">
          <Link href="/ar/" lang="ar" className="inline-flex h-9 items-center rounded-lg border border-line px-3 font-arabic text-sm text-sub hover:text-ink">
            العربية
          </Link>
          <ThemeButton />
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-20 pt-4 md:grid-cols-2 md:pt-8">
        <div>
          <h1 className="font-display text-[40px] leading-[1.05] tracking-tight md:text-[64px]">4 days to under 2 hours. A person still signs.</h1>
          <p className="mt-5 max-w-xl text-lg text-sub">An AI agent that onboards joint-signatory businesses across legacy banking systems, and knows when to stop and ask.</p>
          <dl className="mt-8 grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.k}>
                <dd className="tnum whitespace-nowrap font-display text-2xl md:text-4xl">{s.v}</dd>
                <dt className="mt-1 text-xs text-muted">{s.k}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/demo/case/" className={primary}>
              Try the demo (5 min) <ArrowRight className="h-4 w-4" />
            </Link>
            <span aria-disabled className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-lg px-4 text-sm text-muted">
              Watch 2-min walkthrough <span className="rounded-full bg-panel px-2 py-0.5 text-[11px]">soon</span>
            </span>
          </div>
          <p className="mt-3 text-[11px] text-muted">Demo numbers from a synthetic case.</p>
        </div>
        <HeroScene />
      </section>

      <section className="border-y border-line bg-panel/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>The work isn&apos;t hard. It&apos;s slow.</h2>
          <p className="mt-2 text-sub">4 systems, 4 handoffs, 1 courier.</p>
          <p className="mt-10 text-xs font-medium uppercase tracking-wide text-muted">Today</p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {days.map((d) => (
              <div key={d.day}>
                <p className="text-xs text-muted">{d.day}</p>
                <div className="mt-2 flex h-8 items-center gap-1">
                  {d.icons.map(({ I, label }, i) => (
                    <I key={i} aria-label={label} className="h-5 w-5 text-sub md:h-6 md:w-6" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
            <div className="crawl h-full rounded-full bg-warn" />
          </div>
          <p className="mt-8 text-xs font-medium uppercase tracking-wide text-muted">With Jointly</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 w-[8%] min-w-8 overflow-hidden rounded-full bg-line">
              <div className="crawl-fast h-full rounded-full bg-ok" />
            </div>
            <span className="text-sm font-medium text-ok-ink">1h 54m</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className={h2}>A free-text mandate becomes a picture.</h2>
        <figure className="mt-8">
          <Link href="/demo/case/?tab=map" className="block overflow-hidden rounded-card border border-line bg-surface shadow-sm">
            <div className="flex gap-1.5 border-b border-line px-4 py-2.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2.5 w-2.5 rounded-full bg-line" />
              ))}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/landing/signing-map.png" alt="Signing map: Mohammed, Khalifa and Rashid with approval pairs by amount" className="w-full" />
          </Link>
          <figcaption className="mt-3 text-sub">Sara can check it in seconds.</figcaption>
        </figure>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>4 moments</h2>
          <div className="mt-10">
            <Moments />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-panel/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>Who decides what</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {lanes.map((l) => (
              <div key={l.title} className="rounded-card border border-line bg-surface p-6">
                {l.icon}
                <p className="mt-4 font-semibold">{l.title}</p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {l.items.map((it) => (
                    <li key={it} className={l.never ? "text-bad-ink line-through decoration-bad" : "text-sub"}>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>6 patterns I&apos;d reuse</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title} className="rounded-card border border-line bg-surface p-6">
                <div aria-hidden className="flex h-12 items-center">{p.mini}</div>
                <p className="mt-4 font-semibold">{p.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-panel/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>What I heard, what I changed</h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {heard.map((h) => (
              <li key={h.href} className="flex flex-col rounded-card border border-line bg-surface p-6">
                <p className="font-display text-lg leading-snug">&ldquo;{h.q}&rdquo;</p>
                <a href={h.href} target="_blank" rel="noreferrer" className="mt-2 text-xs text-muted underline-offset-2 hover:underline">
                  {h.who}
                </a>
                <ArrowRight className="my-4 h-4 w-4 rotate-90 text-accent" />
                <p className="text-sm font-medium">{h.d}</p>
              </li>
            ))}
          </ul>
          <details className="mt-6 text-sm">
            <summary className="cursor-pointer text-sub">Sources</summary>
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="text-accent-ink underline-offset-2 hover:underline">
                    {s.s}
                  </a>
                  <span className="text-muted"> · {s.f}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>What I&apos;d test next</h2>
          <ul className="mt-8 max-w-2xl space-y-3 rounded-card border border-line bg-surface p-6">
            {unknowns.map((u) => (
              <li key={u} className="flex gap-3 text-sm text-sub">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border-2 border-line" /> {u}
              </li>
            ))}
          </ul>
          <details className="mt-6 max-w-2xl text-sm">
            <summary className="cursor-pointer text-sub">Why not just fix the data?</summary>
            <p className="mt-2 text-muted">Clean data still has to become users, roles and workflows. That translation is the job.</p>
          </details>
        </div>
      </section>

      <footer className="border-t border-line bg-panel/50">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <p className={h2}>See it for yourself</p>
            <p className="mt-3 text-sm text-sub">
              Designed by Bisma Munawar ·{" "}
              <a href="mailto:bismamunawardigital@gmail.com" className="underline-offset-2 hover:underline">
                Email
              </a>
            </p>
            <p className="mt-1 text-xs text-muted">All people, accounts and bank systems are synthetic.</p>
          </div>
          <Link href="/demo/case/" className={primary}>
            Try the demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
