import Link from "next/link";
import { ArrowRight, Ban, Check, FileText, Inbox, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Logo } from "@/components/Shell";
import { ThemeButton } from "@/components/ThemeToggle";
import { AgentMark } from "@/components/ui";
import { HeroStage } from "@/components/landing/HeroStage";
import { Gloss } from "@/components/landing/Gloss";
import { DaysSwimlane } from "@/components/landing/DaysSwimlane";
import { LiveGrid, MandateToggle } from "@/components/landing/LivePreview";
import { Identity, Live, momentLabels } from "@/components/landing/Moments";
import { LangSwitch } from "@/components/landing/LangSwitch";
import { statsEn } from "@/content/stats";

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



const gaveUp: { d: string; why: string }[] = [
  { d: "Kept 4 sign-offs, as one action", why: "Bank controls require it. Fewer clicks, same record." },
  { d: "No confidence scores", why: "Regulators ask which rule fired, not how sure the model was." },
  { d: "Desktop only", why: "The customer fulfilment operations team works on bank laptops. Mobile would be a different product." },
  { d: "Partial release is a hypothesis", why: "No public evidence yet. First thing to test with a bank." },
];


const lanes: { icon: React.ReactNode; title: string; items: string[]; never?: boolean }[] = [
  { icon: <AgentMark size={40} className="text-person-agent" />, title: "Agent does", items: ["Reads every record", "Builds the plan", "Sets it up after approval"] },
  { icon: <ShieldCheck className="h-10 w-10 text-accent" />, title: "Rules decide", items: ["Who can sign", "Up to what amount", "Who can go live"] },
  { icon: <UserRound className="h-10 w-10 text-ink" />, title: "A person approves", items: ["Unclear values", "The plan sign-off", "Every release"] },
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
      <p className="text-[13px] font-medium uppercase tracking-wide text-sub">{label}</p>
      <div className="mt-5 flex h-24 items-center">{children}</div>
      <p className="mt-4 text-base text-sub">{text}</p>
    </div>
  );
}

function Partner({ tone = "plain", badge, tag, tagClass }: { tone?: "plain" | "ok" | "muted"; badge?: React.ReactNode; tag?: string; tagClass?: string }) {
  const look = tone === "ok" ? "border-ok/40 bg-ok-soft text-ok-ink" : tone === "muted" ? "border-line bg-panel text-sub" : "border-line bg-surface text-ink";
  return (
    <span className="flex flex-col items-center gap-1.5">
      <span className={`relative flex h-11 w-11 items-center justify-center rounded-full border ${look}`}>
        <UserRound aria-hidden className="h-5 w-5" />
        {badge && <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-surface shadow-sm">{badge}</span>}
      </span>
      {tag && <span className={`whitespace-nowrap text-[13px] ${tagClass ?? ""}`}>{tag}</span>}
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
          <p className="text-[13px] font-medium uppercase tracking-wide text-sub">In 30 seconds</p>
          <dl className="mt-4 grid gap-5 md:grid-cols-5">
            {in30.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[13px] font-semibold text-ink">{k}</dt>
                <dd className="mt-1 text-base text-sub">{v}</dd>
              </div>
            ))}
          </dl>
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
            <ArrowRight aria-hidden className="mx-auto h-5 w-5 rotate-90 self-center text-sub md:rotate-0" />
            <ServiceCol label="What I designed at the bank" text="I designed the digital setup for joint signatories in the bank's new business app. Each partner registers, and then they approve each other's access.">
              <div className="flex items-start gap-3">
                <Partner badge={<Lock aria-hidden className="h-3 w-3 text-sub" />} />
                <Partner badge={<Lock aria-hidden className="h-3 w-3 text-sub" />} />
                <Partner badge={<Lock aria-hidden className="h-3 w-3 text-sub" />} tag="ID expired" tagClass="rounded-full bg-bad/10 px-1.5 text-bad-ink" />
              </div>
            </ServiceCol>
            <ArrowRight aria-hidden className="mx-auto h-5 w-5 rotate-90 self-center text-sub md:rotate-0" />
            <ServiceCol label="With Jointly" text="An agent prepares everything from records the bank already has. Each partner only verifies their Emirates ID and sets a password, so the others still go live.">
              <div className="flex items-start gap-3">
                <Partner tone="ok" badge={<Check aria-hidden className="h-3 w-3 text-ok-ink" strokeWidth={3} />} />
                <Partner tone="ok" badge={<Check aria-hidden className="h-3 w-3 text-ok-ink" strokeWidth={3} />} />
                <Partner tone="muted" tag="Waiting for ID" tagClass="text-sub" />
                <AgentMark size={28} className="ml-1 mt-2 text-person-agent" />
              </div>
            </ServiceCol>
          </div>
          <p className="mt-8 max-w-3xl font-medium">What I learnt is that self-serve moved the work onto the customer, and one expired Emirates ID could stop every partner.</p>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-base text-sub">
            <span className="flex items-center gap-2"><FileText aria-hidden className="h-4 w-4 text-ok" /> Customers have less to fill in.</span>
            <span className="flex items-center gap-2"><Inbox aria-hidden className="h-4 w-4 text-ok" /> The operations team gets fewer tickets.</span>
          </div>
          <p className="mt-3 text-[13px] text-sub">This is what I would change, and it hasn&apos;t been measured yet.</p>
        </div>
      </section>

      <section id="why" className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <h2 className={h2}>Why an agent, and not a better form</h2>
            <ul className="mt-8 space-y-6">
              {why.map(([mess, fix]) => (
                <li key={mess}>
                  <p className="text-base text-sub">{mess}</p>
                  <p className="mt-1 flex items-center gap-2 text-base font-medium text-ok-ink"><ArrowRight aria-hidden className="h-4 w-4 shrink-0" />{fix}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card border border-line bg-surface p-6">
            <p className="text-[13px] font-medium uppercase tracking-wide text-sub">How it works with 4 legacy systems</p>
            <ul className="mt-3 divide-y divide-line">
              {systems.map((x) => (
                <li key={x.name} className="flex items-baseline justify-between gap-4 py-3">
                  <span><span className="font-semibold">{x.name}</span> <span className="text-base text-sub">{x.d}</span></span>
                  <span className="text-[13px] text-sub">{x.tag}</span>
                </li>
              ))}
            </ul>
            <ol className="mt-5 flex flex-wrap items-center gap-2">
              {adminRun.map(([t, l, tone], i) => (
                <li key={l} className="flex items-center gap-2 text-[13px]">
                  {i > 0 && <ArrowRight aria-hidden className="h-3.5 w-3.5 text-sub" />}
                  <span className={`rounded-full px-3 py-1 ${tone === "warn" ? "bg-warn-soft text-warn-ink" : tone === "ok" ? "bg-ok-soft text-ok-ink" : "bg-panel text-sub"}`}>
                    <span className="tnum font-mono">{t}</span> {l}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[13px] text-sub">Synthetic systems and data, modelled on common core-banking setups.</p>
          </div>
        </div>
      </section>

      <section id="case" className="border-t border-line bg-panel/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>The case</h2>
          <ol className="mt-12 space-y-20">
            {[
              { title: "Matches people by ID, never by name", visual: <div className="flex justify-center rounded-card bg-surface p-10 shadow-sm"><Identity v={momentLabels} /></div> },
              { title: "Catches the expired ID before any work starts", visual: <LiveGrid />, wide: true },
              { title: "Reads a blurry 2023 letter, and asks Sara to confirm", visual: <MandateToggle before="Before Sara checks the letter" after="After" label="Open the signing map in the demo" />, wide: true },
              { title: "Releases what's safe, holds the rest", visual: <div className="flex justify-center rounded-card bg-surface p-10 shadow-sm"><Live v={momentLabels} /></div> },
            ].map((m, i) => (
              <li key={m.title} className={`grid items-center gap-8 ${"wide" in m ? "" : "md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"}`}>
                <div className={i === 3 ? "md:order-2" : ""}>
                  <p className="tnum text-[13px] text-accent-ink">0{i + 1}</p>
                  <p className="mt-2 font-display text-2xl leading-snug md:text-3xl">{m.title}</p>
                  <Link href={`/demo/case/?moment=${i + 1}`} className="mt-3 inline-flex items-center gap-1 text-base font-medium text-accent-ink hover:underline">
                    See it live <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="min-w-0">{m.visual}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="roles" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>Who decides what</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            {lanes.map((l) => (
              <div key={l.title}>
                {l.icon}
                <p className="mt-4 text-lg font-semibold">{l.title}</p>
                <ul className="mt-3 space-y-2 text-base">
                  {l.items.map((it) => (
                    <li key={it} className={l.never ? "text-bad-ink line-through decoration-bad" : "text-sub"}>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-10 text-base text-sub">
            Every case ends with a decision record an examiner can read.{" "}
            <Link href="/demo/case/?view=record" className="text-accent-ink underline underline-offset-2">See Creekside&apos;s</Link>
          </p>
        </div>
      </section>

      <section id="heard" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>What I heard, what I changed</h2>
          <blockquote className="mt-10 max-w-2xl border-l-2 border-accent pl-6">
            <p className="font-display text-2xl leading-snug">Setting up one joint-signatory business takes 4 to 5 days.</p>
            <p className="mt-2 text-[13px] text-sub">Customer fulfilment operations team member, paraphrased from an interview</p>
            <p className="mt-4 text-base font-medium">So the agent reads, and Sara only checks what it read.</p>
          </blockquote>
          <p className="mt-14 text-[13px] font-medium uppercase tracking-wide text-sub">Signals from teams already using agents</p>
          <ul className="mt-2 divide-y divide-line">
            {heard.map((h) => (
              <li key={h.href} className="grid gap-2 py-5 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-10">
                <div>
                  <p className="font-display text-lg leading-snug">&ldquo;{h.q}&rdquo;</p>
                  <a href={h.href} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[13px] text-sub underline-offset-2 hover:underline">
                    {h.who}
                  </a>
                </div>
                <p className="flex items-start gap-2 text-base font-medium"><ArrowRight aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent" />{h.d}</p>
              </li>
            ))}
          </ul>
          <details className="mt-6 text-base">
            <summary className="cursor-pointer text-sub">Sources</summary>
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="text-accent-ink underline-offset-2 hover:underline">
                    {s.s}
                  </a>
                  <span className="text-sub"> · {s.f}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </section>

      <section id="gaveup" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>What I gave up</h2>
          <ul className="mt-8 grid max-w-4xl gap-x-12 gap-y-4 md:grid-cols-2">
            {gaveUp.map((g) => (
              <li key={g.d} className="flex gap-3 text-lg">
                <span aria-hidden className="mt-3.5 h-px w-4 shrink-0 bg-ink" />
                {g.d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="next" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>What&apos;s next</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <div>
              <p className="text-lg font-semibold">How I&apos;d know it works</p>
              <p className="mt-1 text-[13px] text-sub">Plan, not results</p>
              <ul className="mt-4 space-y-2 text-base text-sub">{measures.map((m) => <li key={m}>{m}</li>)}</ul>
            </div>
            <div>
              <p className="text-lg font-semibold">What I&apos;d test next</p>
              <ul className="mt-4 space-y-2 text-base text-sub">{unknowns.map((u) => <li key={u}>{u}</li>)}</ul>
            </div>
            <div>
              <p className="text-lg font-semibold">Where I&apos;d use this pattern next</p>
              <p className="mt-1 text-[13px] text-sub">Illustrative</p>
              <ul className="mt-4 space-y-2 text-base text-sub">{elsewhere.map(([k]) => <li key={k}>{k}</li>)}</ul>
              <p className="mt-4 text-base text-sub">Same shape: read messy documents, let rules decide, a person approves, read back what was written.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-panel/50">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <p className={h2}>See it for yourself</p>
            <p className="mt-3 text-base text-sub">
              Designed by Bisma Munawar ·{" "}
              <a href="mailto:bismamunawardigital@gmail.com" className="underline-offset-2 hover:underline">
                Email
              </a>
            </p>
            <p className="mt-1 text-[13px] text-sub">All people, accounts and bank systems are synthetic.</p>
          </div>
          <Link href="/demo/case/" className={primary}>
            Open the demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
