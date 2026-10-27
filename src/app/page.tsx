import Link from "next/link";
import { ArrowRight, Ban, Check, FileText, Printer, Search, ShieldCheck, Truck, Undo2, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/Shell";
import { ThemeButton } from "@/components/ThemeToggle";
import { AgentMark, Avatar } from "@/components/ui";
import { HeroFrame } from "@/components/landing/HeroFrame";
import { Gloss } from "@/components/landing/Gloss";
import { DaysSwimlane } from "@/components/landing/DaysSwimlane";
import { LiveGrid, MandateToggle } from "@/components/landing/LivePreview";
import { Moments } from "@/components/landing/Moments";
import { LangSwitch } from "@/components/landing/LangSwitch";
import { statsEn } from "@/content/stats";

const stats = statsEn;

const in30: [string, string][] = [
  ["Problem", "4 to 5 days of manual setup and courier PINs"],
  ["User", "Sara, a CF checker at a UAE bank"],
  ["What I built", "An agent that prepares, rules that check, a screen Sara approves on"],
  ["Outcome", "Under 2 hours, 2 setup decisions (synthetic case, not measured)"],
  ["My role", "Research, service design, product design, prototype built with Devin"],
];

const swim = {
  lanes: ["Customer", "CF maker", "CF checker", "Systems", "Courier"],
  today: "Today",
  jointly: "With Jointly",
  pains: ["4 maker-checker rounds", "Free-text instructions in SVS", "Courier PINs"],
  todayNodes: ["Signs forms", "Reads Finacle|and SVS", "SVS free text", "Sets up|a stage", "Reviews|returns it", "PIN mailer|printed", "Courier|delivers", "First login|day 5"],
  jointlyNodes: ["Signs forms", "Agent prepares|4 systems", "Sara checks|1 thing", "Signs off", "Agent sets up|Admin", "SMS activation|first login"],
  empty: "No step needed",
  caption: "Illustrative and simplified. Redrawn for this case study, not the bank's internal map.",
};

const inbox: { who: ("mohammed" | "khalifa" | "rashid")[]; line: string; time: string }[] = [
  { who: ["khalifa"], line: "Confirm a value on a blurry letter · Creekside", time: "2 min" },
  { who: ["mohammed", "khalifa"], line: "Approve a new payments maker · Saffron Bay", time: "1 min" },
  { who: ["rashid"], line: "Release Rashid, his ID is renewed · Creekside", time: "30 s" },
];

const learned = ["Check SVS letters", "Reuse existing logins", "Re-check EFR before release"];

const gaveUp: { d: string; why: string }[] = [
  { d: "Kept 4 sign-offs, as one action", why: "Bank controls require it. Fewer clicks, same record." },
  { d: "No confidence scores", why: "Regulators ask which rule fired, not how sure the model was." },
  { d: "Desktop only", why: "CF works on bank laptops. Mobile would be a different product." },
  { d: "Partial release is a hypothesis", why: "No public evidence yet. First thing to test with a bank." },
];

const days: { day: string; label: string; icons: LucideIcon[] }[] = [
  { day: "Day 1", label: "Forms arrive", icons: [FileText] },
  { day: "Day 2", label: "Maker reads Finacle and SVS", icons: [Search] },
  { day: "Day 3", label: "4 maker-checker rounds", icons: [Undo2, Undo2, Undo2, Undo2] },
  { day: "Day 4", label: "PIN mailers printed", icons: [Printer] },
  { day: "Day 5", label: "Courier delivers", icons: [Truck] },
];

const lanes: { icon: React.ReactNode; title: string; items: string[]; never?: boolean }[] = [
  { icon: <AgentMark size={40} />, title: "Agent does", items: ["Reads every record", "Builds the plan", "Sets it up after approval"] },
  { icon: <ShieldCheck className="h-10 w-10 text-accent" />, title: "Rules decide", items: ["Who can sign", "Up to what amount", "Who can go live"] },
  { icon: <UserRound className="h-10 w-10 text-ink" />, title: "Sara approves", items: ["Unclear values", "The plan sign-off", "Every release"] },
  { icon: <Ban className="h-10 w-10 text-bad" />, title: "Never allowed", items: ["Approve its own work", "Send passwords", "Match people by name"], never: true },
];

const chip = "rounded-full border border-line bg-canvas px-2 py-0.5 text-[11px]";
const principles: { title: string; why: string; mini: React.ReactNode }[] = [
  {
    title: "Match on IDs, never names",
    why: "Names are spelled 3 ways across systems. IDs aren't.",
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
    why: "Sara checks the source, not the agent's word.",
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
    why: "Sara's attention goes to the 1 value that needs it.",
    mini: (
      <div className="flex items-center gap-2">
        <span className="h-8 w-16 rounded bg-ink/15 blur-[2px]" />
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warn-soft text-xs font-semibold text-warn-ink">?</span>
      </div>
    ),
  },
  {
    title: "Approval stays with the content",
    why: "If the plan changes, the old approval doesn't carry over.",
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
    why: "The same input gives the same answer, and audit can replay it.",
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
    why: "2 people go live today, instead of 3 waiting on 1 ID.",
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

const why: [string, string][] = [
  ["The mandate is free text. 'Khalifa alone up to 10,000' lives in a scanned letter, not a field.", "The agent reads it and quotes the line."],
  ["The systems disagree. Finacle says 'any two'. SVS has the detail.", "Rules pick the newer, more specific source and show why."],
  ["There's no API to write to. Digital Banking Admin is a screen that times out.", "The agent writes step by step, reads it back and retries safely."],
];

const systems: { name: string; tag: "Read" | "Write" | "Check"; d: string }[] = [
  { name: "Finacle", tag: "Read", d: "Customer records and the short mandate code" },
  { name: "SVS", tag: "Read", d: "Signed mandates and letters, often scanned" },
  { name: "EFR", tag: "Check", d: "Is the Emirates ID valid today?" },
  { name: "Digital Banking Admin", tag: "Write", d: "Users, roles, rules, workflows. Assumed: no write API." },
];

const adminRun: [string, string, "warn" | "plain" | "ok"][] = [
  ["10:45", "Timed out. Nothing half-written.", "warn"],
  ["10:45", "Retried.", "plain"],
  ["10:46", "Read back: 0 differences from the approved plan.", "ok"],
];

const measures = [
  "Shadow agreement: how often the agent's plan matches the maker's",
  "Override rate: how often Sara changes what the agent read",
  "Form to first login, per case",
  "Unapproved writes: must stay at 0",
];

const elsewhere: [string, string][] = [
  ["Government", "Renewing a trade licence across registries that don't share data."],
  ["Healthcare", "Insurance pre-approval from free-text referral letters."],
  ["Banking", "Mandate changes on existing accounts, using the same 4 systems."],
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
    <div className="alt min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-2">
          <LangSwitch href="/ar/" lang="ar" label="العربية" className="inline-flex h-9 items-center rounded-lg border border-line px-3 font-arabic text-sm text-sub hover:text-ink" />
          <ThemeButton />
        </div>
      </header>

      <section id="hero" className="mx-auto grid max-w-6xl items-start gap-10 px-6 pb-12 pt-2 md:grid-cols-[1fr_1.05fr] md:pt-4">
        <div>
          <p className="text-[13px] text-muted">Case study · Agentic AI for bank operations · Bisma Munawar, Product Designer</p>
          <h1 className="mt-3 font-display text-[36px] leading-[1.05] tracking-tight md:text-[50px]">Sara sets up 3 signatories before lunch. The agent can&apos;t sign anything.</h1>
          <p className="mt-4 max-w-xl text-base text-sub md:text-lg">An AI agent does a bank&apos;s back-office setup across 4 legacy systems. A person still approves every decision that moves money.</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <Gloss term="Joint signatories" def="2 or more people who must approve a company's payments together." />
            <Gloss term="Customer Fulfillment (CF)" def="The bank team that sets up their online banking by hand." />
          </p>
          <dl className="mt-6 grid grid-cols-3 gap-4 md:gap-6">
            {stats.map((s) => (
              <div key={s.k}>
                <dd className="tnum whitespace-nowrap font-display text-2xl md:text-3xl">{s.v}</dd>
                <dt className="mt-1 text-xs text-muted">{s.k}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/demo/case/" className={primary}>
              Open the demo (5 min) <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-3 text-[11px] text-muted">Synthetic case. Not measured in a real bank.</p>
        </div>
        <HeroFrame callouts={["The agent pulled every record from Finacle, SVS and EFR", "Green = copied exactly. Amber = the agent had to read a document", "Sara only decides the amber one. Then she signs off."]} />
      </section>

      <section id="in30" aria-label="In 30 seconds" className="border-y border-line">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">In 30 seconds</p>
          <dl className="mt-4 grid gap-5 md:grid-cols-5">
            {in30.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-semibold text-ink">{k}</dt>
                <dd className="mt-1 text-sm text-sub">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="inbox" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-center gap-3">
          <h2 className={h2}>Where Sara starts her day</h2>
          <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">Concept</span>
        </div>
        <div className="mt-8 max-w-3xl">
          <div className="overflow-hidden rounded-card border border-line bg-surface shadow-lg">
            <div className="flex items-center gap-1.5 border-b border-line bg-panel/60 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" /><span className="h-2.5 w-2.5 rounded-full bg-line-strong" /><span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            </div>
            <ul className="divide-y divide-line">
              {inbox.map((d) => (
                <li key={d.line} className="flex items-center gap-4 px-5 py-4">
                  <span className="flex -space-x-2">{d.who.map((w) => <Avatar key={w} id={w} size={32} />)}</span>
                  <span className="min-w-0 flex-1 text-sm font-medium md:text-base">{d.line}</span>
                  <span className="tnum text-xs text-muted">{d.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-sub">A typical morning across several cases. The demo opens one of them.</p>
      </section>

      <section id="slow" className="bg-panel border-y border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>The work isn&apos;t hard. It&apos;s slow.</h2>
          <p className="mt-2 text-sub">4 systems, 4 handoffs, 1 courier.</p>
          <p className="mt-10 text-xs font-medium uppercase tracking-wide text-muted">Today</p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {days.map((d) => (
              <div key={d.day}>
                <p className="text-xs text-muted">{d.day}</p>
                <div className="mt-2 flex h-8 items-center gap-1">
                  {d.icons.map((I, i) => (
                    <I key={i} aria-hidden className="h-4 w-4 text-sub md:h-6 md:w-6" />
                  ))}
                </div>
                <p className="mt-1 text-[11px] leading-snug text-sub md:text-xs">{d.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
            <div className="crawl h-full rounded-full bg-warn max-md:[animation:none]" />
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


      <section id="days" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>Where the days go</h2>
          <p className="mt-2 text-sub">5 lanes, 4 return loops, 1 courier.</p>
          <div className="mt-8">
            <DaysSwimlane t={swim} />
          </div>
        </div>
      </section>

      <section id="why" className="band-dark">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>Why an agent, and not a better form</h2>
          <ul className="mt-8 space-y-3">
            {why.map(([mess, fix]) => (
              <li key={mess} className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
                <p className="rounded-card border border-line bg-surface px-5 py-4 text-sm text-sub">{mess}</p>
                <ArrowRight aria-hidden className="mx-auto h-5 w-5 rotate-90 text-accent md:rotate-0" />
                <p className="rounded-card border border-ok/30 bg-ok-soft px-5 py-4 text-sm font-medium text-ok-ink">{fix}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-sub">A rules-only bot breaks on the first free-text line. A model alone can&apos;t be trusted with money. So the model reads and the rules decide.</p>
        </div>
      </section>

      <section id="legacy" className="bg-panel border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>How it works with 4 legacy systems</h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {systems.map((x) => (
              <li key={x.name} className="rounded-card border border-line bg-surface p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{x.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${x.tag === "Write" ? "bg-accent-soft text-accent-ink" : x.tag === "Check" ? "bg-ok-soft text-ok-ink" : "bg-panel text-sub"}`}>{x.tag}</span>
                </div>
                <p className="mt-2 text-sm text-sub">{x.d}</p>
              </li>
            ))}
          </ul>
          <ol className="mt-4 flex flex-col gap-2 md:ms-auto md:w-fit md:flex-row md:items-center">
            {adminRun.map(([t, l, tone], i) => (
              <li key={l} className="flex items-center gap-2 text-sm">
                {i > 0 && <ArrowRight aria-hidden className="hidden h-4 w-4 text-muted md:block" />}
                <span className={`rounded-full px-3 py-1 ${tone === "warn" ? "bg-warn-soft text-warn-ink" : tone === "ok" ? "bg-ok-soft text-ok-ink" : "bg-panel text-sub"}`}>
                  <span className="tnum font-mono text-xs">{t}</span> {l}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-muted">Synthetic systems and data, modelled on common core-banking setups.</p>
        </div>
      </section>

      <section id="shadow" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>It watched before it acted</h2>
          <p className="mt-2 max-w-2xl text-sub">Before it acts, the agent runs in shadow mode. It watches CF makers and compares its plan with theirs.</p>
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
            <p className="rounded-card border border-line bg-surface px-5 py-4"><span className="tnum font-display text-3xl">12</span> <span className="text-sm text-sub">maker cases observed</span></p>
            <ArrowRight className="h-5 w-5 rotate-90 text-accent md:rotate-0" />
            <p className="rounded-card border border-line bg-surface px-5 py-4"><span className="tnum font-display text-3xl">3</span> <span className="text-sm text-sub">steps missing from the written procedure</span></p>
            <ArrowRight className="h-5 w-5 rotate-90 text-accent md:rotate-0" />
            <ul className="flex flex-wrap gap-2">
              {learned.map((l) => <li key={l} className="rounded-full bg-accent-soft px-3 py-1.5 text-sm text-accent-ink">{l}</li>)}
            </ul>
          </div>
          <p className="mt-4 text-xs text-muted">Illustrative. How the agent learns the unwritten work first.</p>
        </div>
      </section>

      <section id="grid" className="bg-panel mx-auto max-w-6xl px-6 py-20">
        <h2 className={h2}>Every source in one grid</h2>
        <div className="mt-8">
          <LiveGrid />
        </div>
        <p className="mt-4 text-sm text-sub">17 cells match bank records. Sara checks the 1 value the agent had to read.</p>
      </section>

      <section id="mandate" className="border-t border-line mx-auto max-w-6xl px-6 py-20">
        <h2 className={h2}>A free-text mandate becomes a picture.</h2>
        <p className="mt-2 text-sub">Sara can check it in seconds.</p>
        <div className="mt-8">
          <MandateToggle before="Before Sara checks the letter" after="After" see="See it live" label="Open the signing map in the demo" />
        </div>
      </section>

      <section id="moments" className="bg-panel border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>4 moments</h2>
          <div className="mt-10">
            <Moments />
          </div>
        </div>
      </section>

      <section id="roles" className="border-t border-line">
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
          <p className="mt-8 text-sm text-sub">
            Every case ends with a decision record an examiner can read: rule, quote, approver, time.{" "}
            <Link href="/demo/case/?view=record" className="text-accent-ink underline underline-offset-2">See Creekside&apos;s</Link>
          </p>
        </div>
      </section>

      <section id="heard" className="bg-panel border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>What I heard, what I changed</h2>
          <div className="mt-10 max-w-2xl rounded-card border border-line bg-surface p-6">
            <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">Paraphrased</span>
            <p className="mt-3 font-display text-lg leading-snug">Setting up one joint-signatory business takes 4 to 5 days. Most of it is reading customer documents and free-text instructions in SVS, then setting it up by hand.</p>
            <p className="mt-2 text-xs text-muted">CF team member, paraphrased from an interview</p>
            <ArrowRight className="my-4 h-4 w-4 rotate-90 text-accent" />
            <p className="text-sm font-medium">So the agent reads, and Sara only checks what it read.</p>
          </div>
          <p className="mt-10 text-xs font-medium uppercase tracking-wide text-muted">Signals from teams already using agents</p>
          <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      <section id="patterns" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>6 patterns I&apos;d reuse</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title} className="rounded-card border border-line bg-surface p-6">
                <div aria-hidden className="flex h-12 items-center">{p.mini}</div>
                <p className="mt-4 font-semibold">{p.title}</p>
                <p className="mt-1 text-sm text-sub">{p.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gaveup" className="bg-panel border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>What I gave up</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {gaveUp.map((g) => (
              <li key={g.d} className="rounded-card border border-line bg-surface p-6">
                <p className="font-medium">{g.d}</p>
                <p className="mt-1 text-sm text-sub">{g.why}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="measure" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>How I&apos;d know it works</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {measures.map((m) => (
              <li key={m} className="rounded-card border border-line bg-surface p-5">
                <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">Plan, not results</span>
                <p className="mt-3 text-sm font-medium">{m}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="next" className="bg-panel border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>What I&apos;d test next</h2>
          <ul className="mt-8 max-w-2xl space-y-3 rounded-card border border-line bg-surface p-6">
            {unknowns.map((u) => (
              <li key={u} className="flex gap-3 text-sm text-sub">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border-2 border-line" /> {u}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="elsewhere" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>Where I&apos;d use this pattern next</h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {elsewhere.map(([k, v]) => (
              <li key={k} className="rounded-card border border-line bg-surface p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{k}</p>
                  <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">Illustrative</span>
                </div>
                <p className="mt-2 text-sm text-sub">{v}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sub">Same shape: read messy documents, let rules decide, a person approves, read back what was written.</p>
        </div>
      </section>

      <footer className="band-dark">
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
            Open the demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
