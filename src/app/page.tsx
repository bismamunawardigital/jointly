import Link from "next/link";
import { ArrowRight, Ban, Check, FileText, Inbox, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Logo } from "@/components/Shell";
import { ThemeButton } from "@/components/ThemeToggle";
import { AgentMark } from "@/components/ui";
import { HeroStage } from "@/components/landing/HeroStage";
import { Gloss } from "@/components/landing/Gloss";
import { DaysSwimlane } from "@/components/landing/DaysSwimlane";
import { LiveGrid, MandateToggle } from "@/components/landing/LivePreview";
import { Moments } from "@/components/landing/Moments";
import { LangSwitch } from "@/components/landing/LangSwitch";
import { statsEn } from "@/content/stats";
import { PORTFOLIO_URL } from "@/content/portfolio";

const stats = statsEn;

const in30: [string, string][] = [
  ["Problem", "5 days of manual setup"],
  ["User", "A checker in the customer fulfilment operations team"],
  ["What I built", "An agent, rules and a review screen"],
  ["Outcome", "Under 2 hours (synthetic case, not measured)"],
  ["My role", "Research, design, prototype"],
];

const swim = {
  lanes: ["Customer", "Person who sets it up", "Person who checks it", "Systems", "Courier"],
  today: "Today",
  jointly: "With Jointly",
  pains: ["4 rounds of checking", "Free-text instructions in SVS", "PINs sent by post"],
  todayNodes: ["Signs forms", "Reads Finacle|and SVS", "SVS free text", "Sets up|a stage", "Reviews|returns it", "PIN mailer|printed", "Courier|delivers", "First login|day 5"],
  jointlyNodes: ["Signs forms", "Agent prepares|4 systems", "Sara checks|1 thing", "Signs off", "Agent sets up|Admin", "SMS activation|first login"],
  empty: "No step needed",
  caption: "Illustrative and simplified. Redrawn for this case study, not the bank's internal map.",
};


const learned = ["Check SVS letters", "Reuse existing logins", "Re-check EFR before granting access"];

const gaveUp: { d: string; why: string }[] = [
  { d: "Kept 4 sign-offs, as one action", why: "Bank controls require it. Fewer clicks, same record." },
  { d: "No confidence scores", why: "Regulators ask which rule fired, not how sure the model was." },
  { d: "Desktop only", why: "The customer fulfilment operations team works on bank laptops. Mobile would be a different product." },
  { d: "Access for 2 of 3 partners is a hypothesis", why: "No public evidence yet. First thing to test with a bank." },
];


const lanes: { icon: React.ReactNode; title: string; items: string[]; never?: boolean }[] = [
  { icon: <AgentMark size={40} className="text-person-agent" />, title: "Agent does", items: ["Reads every record", "Builds the plan", "Sets it up after approval"] },
  { icon: <ShieldCheck className="h-10 w-10 text-accent" />, title: "Rules decide", items: ["Who can sign", "Up to what amount", "Who can go live"] },
  { icon: <UserRound className="h-10 w-10 text-ink" />, title: "A person approves", items: ["Unclear values", "The plan sign-off", "Every access grant"] },
  { icon: <Ban className="h-10 w-10 text-bad" />, title: "Never allowed", items: ["Approve its own work", "Send passwords", "Match people by name"], never: true },
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
  ["The mandate is free text in a scanned letter.", "The agent reads it and quotes the line."],
  ["Finacle and SVS disagree.", "Rules pick the newer source."],
  ["Digital Banking Admin has no API.", "The agent writes, reads back and retries."],
];

const systems: { name: string; tag: "Read" | "Write" | "Check"; d: string }[] = [
  { name: "Finacle", tag: "Read", d: "Customer records" },
  { name: "SVS", tag: "Read", d: "Signed mandates and letters" },
  { name: "EFR", tag: "Check", d: "Emirates ID check" },
  { name: "Digital Banking Admin", tag: "Write", d: "Users, roles and rules" },
];

const adminRun: [string, string, "warn" | "plain" | "ok"][] = [
  ["10:45", "Timed out. Nothing half-written.", "warn"],
  ["10:45", "Retried.", "plain"],
  ["10:46", "Read back: 0 differences from the approved plan.", "ok"],
];

const impact: [string, string, string][] = [
  ["1 in 5", "More than 1 in 5 dollars that banks earn comes from small and mid-sized businesses.", "https://www.mckinsey.com/featured-insights/week-in-charts/the-digital-edge-in-small-business-banking"],
  ["41 days", "In a US and UK survey, a business took 41 days on average to open a bank account.", "https://fintech.global/?p=33634"],
  ["87%", "87% of corporate treasurers say they have given up on a bank application.", "https://www.retailbankerinternational.com/news/87-percent-of-corporate-treasurers-abandon-banking-applications"],
];

const fixes: [string, string][] = [
  ["New onboarding apps", "make the front end faster, but the back office still retypes everything."],
  ["Process bots", "work with fixed fields, but they break on free text."],
  ["Replacing the core system", "fixes it, but it takes years."],
  ["Hiring more staff", "works until the volume grows."],
  ["Jointly", "puts an agent on top of the systems banks already have."],
];

const costLines = [
  "The agent reads each system once per case and reuses what it read.",
  "It uses the AI model only for the scanned letters, and rules handle everything else, which costs less and gives the same answer every time.",
  "Each old system has its own small connector, so a slow admin screen never blocks the others, and a retry never writes twice.",
];

const compare: [string, string][] = [
  ["People approve every step, and studies report they approve 93 to 97% of prompts.", "Rules pass exact copies, so a person makes 2 decisions."],
  ["A confidence score.", "Clear states: matches, doesn't match, or couldn't read."],
  ["A link to a whole document.", "The exact part of the scan and the rule that checked it."],
  ["Retry and hope.", "Retry, then read everything back."],
];

const phases: [string, string, string][] = [
  ["4 weeks", "Agree the rules", "Write the mandate rules with Operations, Compliance and Ops Risk, using read-only access."],
  ["8 weeks", "Shadow mode", "The agent plans while people still do the work, and we compare the two."],
  ["8 weeks", "The agent prepares, people approve", "The agent sets up exact copies, and a supervisor re-checks 1 in 20 approvals."],
  ["Ongoing", "Scale", "Then mixed mandates and mandate changes."],
];

const learnt = [
  "I had to understand the current systems first, because I couldn't design the agent until I knew how a case moves between Finacle, SVS, EFR and Admin.",
  "Banks want agents, but they have to audit every decision, so every decision in Jointly lands in a record an auditor can read.",
  "Old systems are slow and costly to call, so the agent reads each one once and reuses what it read.",
  "Most of the waiting happens between people, so Jointly removes hand-offs while keeping every check.",
];

const measures = [
  "Shadow agreement with the maker",
  "How often Sara changes a reading",
  "Form to first login",
  "Unapproved writes, always 0",
];

const elsewhere: [string, string][] = [
  ["Government", "Renewing a trade licence across registries that don't share data."],
  ["Healthcare", "Insurance pre-approval from free-text referral letters."],
  ["Banking", "Mandate changes on existing accounts, using the same 4 systems."],
];

const unknowns = [
  "Does showing what it didn't search build trust?",
  "Will a bank let 2 of 3 go live?",
  "Will security accept self-service activation?",
  "Can a system user be the maker?",
];

const h2 = "font-display text-3xl tracking-tight md:text-4xl";
const primary = "inline-flex h-11 items-center gap-1.5 rounded-lg bg-accent px-5 text-sm font-medium text-onaccent transition-colors hover:bg-accent-hover";

function ServiceCol({ label, text, children }: { label: string; text: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-line bg-surface p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <div className="mt-5 flex h-24 items-center">{children}</div>
      <p className="mt-4 text-sm text-sub">{text}</p>
    </div>
  );
}

function Partner({ tone = "plain", badge, tag, tagClass }: { tone?: "plain" | "ok" | "muted"; badge?: React.ReactNode; tag?: string; tagClass?: string }) {
  const look = tone === "ok" ? "border-ok/40 bg-ok-soft text-ok-ink" : tone === "muted" ? "border-line bg-panel text-muted" : "border-line bg-surface text-ink";
  return (
    <span className="flex flex-col items-center gap-1.5">
      <span className={`relative flex h-11 w-11 items-center justify-center rounded-full border ${look}`}>
        <UserRound aria-hidden className="h-5 w-5" />
        {badge && <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-line bg-surface">{badge}</span>}
      </span>
      {tag && <span className={`whitespace-nowrap text-[11px] ${tagClass ?? ""}`}>{tag}</span>}
    </span>
  );
}

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

      <section id="hero" className="pb-12 pt-0">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[13px] text-muted">Case study · Agentic AI for bank operations · Bisma Munawar, Product Designer</p>
          <h1 className="mt-2 font-display leading-[1.05] tracking-tight" style={{ fontSize: "clamp(36px, 3.6vw, 52px)" }}>A company with 3 signatories usually waits 5 days to get online banking, and Jointly gets them live before lunch.</h1>
          <p className="mt-3 max-w-xl text-base text-sub md:text-lg">Jointly is an AI agent that prepares the setup from the bank&apos;s old systems, and a person approves every step.</p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <Gloss term="Joint signatories" def="2 or more people who must approve a company's payments together." />
            <Gloss term="Customer fulfilment operations team" def="The bank team that sets up their online banking by hand." />
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <dl className="grid grid-cols-3 gap-4 md:gap-8">
              {stats.map((s) => (
                <div key={s.k} className="max-w-[180px]">
                  <dd className="tnum whitespace-nowrap font-display text-2xl md:text-3xl">{s.v}</dd>
                  <dt className="mt-1 text-xs text-muted">{s.k}</dt>
                </div>
              ))}
            </dl>
            <div className="flex flex-col items-start gap-2 md:items-end">
              <Link href="/demo/case/" className={primary}>
                Open the demo (5 min) <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-[11px] text-muted">Synthetic case. Not measured in a real bank.</p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-3 max-w-[1248px] px-6">
          <HeroStage />
        </div>
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
          <ul aria-label="Why it matters" className="mt-6 grid gap-5 border-t border-line pt-6 md:grid-cols-3">
            {impact.map(([n, t, href]) => (
              <li key={n} className="flex gap-4">
                <span className="tnum shrink-0 text-2xl font-semibold text-ink">{n}</span>
                <p className="text-sm text-sub">
                  {t}{" "}
                  <a href={href} target="_blank" rel="noreferrer" className="text-xs text-muted underline underline-offset-2 hover:text-ink">Source</a>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Industry figures, not from any one bank.</p>
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

      <section id="service" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>I learnt how the systems work before I designed anything.</h2>
          <p className="mt-2 max-w-3xl text-sub">At a UAE bank, I mapped how a business onboarding case moves between the customer, the customer fulfilment operations team and the bank&apos;s old systems.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <ServiceCol label="Before" text="Customers filled in paper forms, the team went through 4 review rounds, and PINs arrived by courier.">
              <div className="relative h-20 w-32">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="absolute flex h-16 w-12 flex-col gap-1.5 rounded-md border border-line bg-surface p-2 shadow-sm" style={{ left: i * 12, top: i * 2, transform: `rotate(${(i - 1) * 6}deg)` }}>
                    <span className="h-1 w-full rounded bg-line" />
                    <span className="h-1 w-3/4 rounded bg-line" />
                    <span className="h-1 w-5/6 rounded bg-line" />
                  </span>
                ))}
                <Mail aria-hidden className="absolute bottom-0 right-0 h-10 w-10 text-warn" />
              </div>
            </ServiceCol>
            <ArrowRight aria-hidden className="mx-auto h-5 w-5 rotate-90 self-center text-muted md:rotate-0" />
            <ServiceCol label="What I designed at the bank" text="I designed the digital setup for joint signatories in the bank's new business app. Each partner registers, and then they approve each other's access.">
              <div className="flex items-start gap-3">
                <Partner badge={<Lock aria-hidden className="h-3 w-3 text-sub" />} />
                <Partner badge={<Lock aria-hidden className="h-3 w-3 text-sub" />} />
                <Partner badge={<Lock aria-hidden className="h-3 w-3 text-sub" />} tag="ID expired" tagClass="rounded-full bg-bad/10 px-1.5 text-bad-ink" />
              </div>
            </ServiceCol>
            <ArrowRight aria-hidden className="mx-auto h-5 w-5 rotate-90 self-center text-muted md:rotate-0" />
            <ServiceCol label="With Jointly" text="An agent prepares everything from records the bank already has. Each partner only verifies their Emirates ID and sets a password, so the others still go live.">
              <div className="flex items-start gap-3">
                <Partner tone="ok" badge={<Check aria-hidden className="h-3 w-3 text-ok-ink" strokeWidth={3} />} />
                <Partner tone="ok" badge={<Check aria-hidden className="h-3 w-3 text-ok-ink" strokeWidth={3} />} />
                <Partner tone="muted" tag="Waiting for ID" tagClass="text-muted" />
                <AgentMark size={28} className="ml-1 mt-2 text-person-agent" />
              </div>
            </ServiceCol>
          </div>
          <p className="mt-8 max-w-3xl font-medium">What I learnt is that self-serve moved the work onto the customer, and one expired Emirates ID could stop every partner.</p>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-sub">
            <span className="flex items-center gap-2"><FileText aria-hidden className="h-4 w-4 text-ok" /> Customers have less to fill in.</span>
            <span className="flex items-center gap-2"><Inbox aria-hidden className="h-4 w-4 text-ok" /> The operations team gets fewer tickets.</span>
          </div>
          <p className="mt-3 text-[11px] text-muted">This is what I would change, and it hasn&apos;t been measured yet.</p>
        </div>
      </section>

      <section id="why" className="border-t border-line">
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
          <p className="mt-12 text-sm font-semibold text-ink">How banks try to fix it</p>
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
            {fixes.map(([who, what], i) => {
              const ours = i === fixes.length - 1;
              return (
                <li key={who} className={`flex items-center gap-3 px-5 py-3 text-sm ${ours ? "bg-ok-soft text-ok-ink" : "text-sub"}`}>
                  {ours ? <Check aria-hidden className="h-4 w-4 shrink-0" /> : <Ban aria-hidden className="h-4 w-4 shrink-0 text-muted" />}
                  <span><span className="font-medium text-ink">{who}</span> {what}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="legacy" className="border-t border-line">
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
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {costLines.map((t) => (
              <li key={t} className="flex gap-2 text-sm text-sub">
                <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Design targets from a scripted case, not measurements.</p>
          <p className="mt-4 text-xs text-muted">Synthetic systems and data, modelled on common core-banking setups.</p>
        </div>
      </section>

      <section id="shadow" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>It watched before it acted</h2>
          <p className="mt-2 max-w-2xl text-sub">First the agent watches the customer fulfilment operations team&apos;s makers and compares its plan with theirs.</p>
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

      <section id="grid" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className={h2}>Every source in one grid</h2>
        <div className="mt-8">
          <LiveGrid />
        </div>
      </section>

      <section id="mandate" className="border-t border-line mx-auto max-w-6xl px-6 py-20">
        <h2 className={h2}>A free-text mandate becomes a picture.</h2>
        <p className="mt-2 text-sub">Sara can check it in seconds.</p>
        <div className="mt-8">
          <MandateToggle before="Before Sara checks the letter" after="After" see="See it live" label="Open the signing map in the demo" />
        </div>
      </section>

      <section id="moments" className="border-t border-line">
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
          <table className="mt-8 w-full overflow-hidden rounded-card border border-line text-left text-sm">
            <thead className="bg-panel text-xs text-muted">
              <tr>
                <th scope="col" className="px-5 py-2.5 font-medium">What&apos;s common today</th>
                <th scope="col" className="px-5 py-2.5 font-medium">What Jointly does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {compare.map(([a, b]) => (
                <tr key={a}>
                  <td className="px-5 py-3 text-sub">{a}</td>
                  <td className="px-5 py-3 font-medium text-ink"><Check aria-hidden className="me-2 inline h-4 w-4 text-ok" />{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted">A comparison of design choices with 40+ agent products and studies. Jointly is a prototype, so there&apos;s no performance data yet.</p>
          <p className="mt-8 text-sm text-sub">
            Every case ends with a decision record an examiner can read.{" "}
            <Link href="/demo/case/?view=record" className="text-accent-ink underline underline-offset-2">See Creekside&apos;s</Link>
          </p>
        </div>
      </section>

      <section id="heard" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>What I heard, what I changed</h2>
          <div className="mt-10 max-w-2xl rounded-card border border-line bg-surface p-6">
            <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">Paraphrased</span>
            <p className="mt-3 font-display text-lg leading-snug">Setting up one joint-signatory business takes 4 to 5 days.</p>
            <p className="mt-2 text-xs text-muted">Customer fulfilment operations team member, paraphrased from an interview</p>
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

      <section id="about" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>About me</h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <p className="text-sub">
              I&apos;m Bisma, a product designer based in Abu Dhabi. I learnt service design at a UAE bank by mapping how business customers get onboarded across people and old systems, and I designed the digital setup for joint signatories in the bank&apos;s new business app. Jointly is how I would do it differently, with an agent doing the reading so that customers fill in less and the operations team gets fewer tickets.
            </p>
            <div>
              <p className="text-sm font-semibold text-ink">What I learnt</p>
              <ol className="mt-3 space-y-3">
                {learnt.map((t, i) => (
                  <li key={t} className="flex gap-3 text-sm text-sub">
                    <span className="tnum shrink-0 font-semibold text-accent-ink">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <p className="mt-10 text-sm text-sub">
            <span className="font-medium text-ink">Who did what:</span> I did the research, the service design and the product design, and Devin wrote the code from my specs.
          </p>
        </div>
      </section>

      <section id="gaveup" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>What I gave up</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {gaveUp.map((g) => (
              <li key={g.d} className="rounded-card border border-line bg-surface p-6">
                <p className="font-medium">{g.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="measure" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>If I built this at a real bank, I would start in shadow mode.</h2>
          <p className="mt-4 max-w-2xl text-sub">Banks are careful with agents because of audit, model risk, access to old systems and accountability, so each phase answers one of these.</p>
          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {phases.map(([when, title, d], i) => (
              <li key={title} className="relative">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-semibold text-accent-ink">{i + 1}</span>
                  {i < phases.length - 1 && <span aria-hidden className="hidden h-px flex-1 bg-line-strong md:block" />}
                </div>
                <p className="mt-4 text-xs font-medium text-muted">{when}</p>
                <p className="mt-1 font-semibold">{title}</p>
                <p className="mt-2 text-sm text-sub">{d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-sm text-sub">
            <span className="text-muted">What I&apos;d measure, a plan and not results:</span> {measures.join(" · ")}
          </p>
        </div>
      </section>

      <section id="next" className="border-t border-line">
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
            {elsewhere.map(([k]) => (
              <li key={k} className="rounded-card border border-line bg-surface p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{k}</p>
                  <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">Illustrative</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sub">Same shape: read messy documents, let rules decide, a person approves, read back what was written.</p>
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
              {PORTFOLIO_URL && (
                <>
                  {" · "}
                  <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                    Back to Bisma&apos;s portfolio
                  </a>
                </>
              )}
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
