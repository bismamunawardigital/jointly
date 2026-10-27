import Link from "next/link";
import { ArrowRight, Ban, Check, FileText, ShieldCheck, UserRound } from "lucide-react";
import { Logo } from "@/components/Shell";
import { ThemeButton } from "@/components/ThemeToggle";
import { AgentMark } from "@/components/ui";
import { HeroFrame } from "@/components/landing/HeroFrame";
import { MobileReplay } from "@/components/landing/MobileReplay";
import { Gloss } from "@/components/landing/Gloss";
import { DaysSwimlane } from "@/components/landing/DaysSwimlane";
import { MandateToggle } from "@/components/landing/LivePreview";
import { Moments } from "@/components/landing/Moments";
import { LangSwitch } from "@/components/landing/LangSwitch";
import { SectionNav } from "@/components/landing/SectionNav";
import { Tabs } from "@/components/landing/Tabs";
import { statsEn } from "@/content/stats";
import { CountUp } from "@/components/CountUp";
import { PORTFOLIO_URL } from "@/content/links";

const stats = statsEn;

const nav: [string, string][] = [
  ["problem", "Problem"],
  ["system", "Before"],
  ["why", "Why an agent"],
  ["case", "The case"],
  ["roles", "Who decides"],
  ["heard", "What I heard"],
  ["bank", "At a bank"],
  ["lessons", "Lessons"],
];

const wrongs = [
  "When a scan is blurry, the agent can't read it reliably, so it asks Sara.",
  "When a name is spelled 3 different ways, it would mismatch people, so it matches on the Emirates ID instead.",
  "When an old system times out, a change could be left half-done, so it retries and then reads back everything it wrote.",
];

const in30: [string, string][] = [
  ["Problem", "Setting up online banking for a business with joint signatories takes 4 to 5 days of manual work, and the PINs still go out by courier."],
  ["Who it's for", "It's for Sara, a checker in a bank's operations team who approves every new setup."],
  ["What I built", "I built an agent that prepares the setup, a set of rules that checks it, and one screen where Sara approves it."],
  ["Result", "In the demo case, the company went live in under 2 hours with 2 decisions from Sara."],
  ["My role", "I did the research, the service design and the product design, and I built the prototype with Devin."],
];

const tiles: { n: string; t: string; src: string; href: string }[] = [
  { n: "1 in 5", t: "More than 1 in every 5 dollars that banks earn comes from small and mid-sized businesses.", src: "McKinsey", href: "https://www.mckinsey.com/featured-insights/week-in-charts/the-digital-edge-in-small-business-banking" },
  { n: "41 days", t: "In a US and UK survey, it took a business 41 days on average to open a bank account.", src: "FinTech Global", href: "https://fintech.global/?p=33634" },
  { n: "87%", t: "87% of corporate treasurers say they have given up on a bank application at least once.", src: "Retail Banker International", href: "https://www.retailbankerinternational.com/news/87-percent-of-corporate-treasurers-abandon-banking-applications" },
];

const swim = {
  lanes: ["Customer", "Maker", "Checker", "Systems", "Courier"],
  today: "Today",
  jointly: "With Jointly",
  pains: ["4 rounds between maker and checker", "Instructions typed as free text in SVS", "PINs sent by courier"],
  todayNodes: ["Signs forms", "Reads Finacle|and SVS", "SVS free text", "Sets up|a stage", "Reviews|returns it", "PIN mailer|printed", "Courier|delivers", "First login|day 5"],
  jointlyNodes: ["Signs forms", "Agent prepares|4 systems", "Sara checks|1 thing", "Signs off", "Agent sets up|Admin", "SMS activation|first login"],
  empty: "No step needed",
  caption: "I simplified and redrew this for the case study, so it isn't the bank's internal map.",
};

const today: [string, string][] = [
  ["New onboarding apps", "New onboarding apps make the front end faster, but the back office still retypes everything."],
  ["Process bots", "Process bots work well with fixed fields, but they break as soon as they meet free text."],
  ["Core replacement", "Replacing the core system fixes the problem properly, but it takes years."],
  ["More staff", "Hiring more operations staff works until the volume grows again."],
  ["Jointly", "Jointly puts an agent on top of the systems banks already have, so it reads, the rules decide and a person approves."],
];

const why: [string, string][] = [
  ["The mandate is written as free text, and \"Khalifa signs alone up to 10,000\" sits in a scanned letter.", "The agent reads the letter and quotes the exact line it used."],
  ["Finacle only says \"any two\", while SVS holds the full detail.", "The rules use the newer, more detailed source and show why they chose it."],
  ["Digital Banking Admin has no API and it sometimes times out.", "The agent writes one step at a time, reads each change back and retries safely."],
];

const systems: { name: string; tag: "Read" | "Write" | "Check"; d: string }[] = [
  { name: "Finacle", tag: "Read", d: "Finacle holds the customer records and a short mandate code." },
  { name: "SVS", tag: "Read", d: "SVS stores the signed mandates and letters, which are often scanned." },
  { name: "EFR", tag: "Check", d: "EFR confirms whether each person's Emirates ID is still valid." },
  { name: "Digital Banking Admin", tag: "Write", d: "This is where users, roles, rules and workflows are set up, and I assumed it has no API." },
];

const adminRun: [string, string, "warn" | "plain" | "ok"][] = [
  ["10:45", "Admin timed out, and nothing was half-written", "warn"],
  ["10:45", "The agent retried", "plain"],
  ["10:46", "It read everything back, and it matched the approved plan", "ok"],
];

const moments = [
  "It matches people by their Emirates ID, because their names are spelled 3 different ways across systems.",
  "It spots that Rashid's ID has expired before any setup starts.",
  "It can't read a blurry 2023 letter, so it asks Sara instead of guessing.",
  "It releases the 2 people who are ready, while Rashid waits for his new ID.",
];

const lanes: { icon: React.ReactNode; title: string; items: string[]; never?: boolean }[] = [
  { icon: <AgentMark size={40} />, title: "The agent", items: ["It reads every record.", "It builds the plan.", "It sets everything up after Sara signs off."] },
  { icon: <ShieldCheck className="h-10 w-10 text-accent" />, title: "The rules", items: ["They decide who can sign, up to what amount, and who can go live."] },
  { icon: <UserRound className="h-10 w-10 text-ink" />, title: "Sara", items: ["She confirms unclear values, signs off the plan, and approves every release."] },
  { icon: <Ban className="h-10 w-10 text-bad" />, title: "Never allowed", items: ["The agent never approves its own work, never sends passwords and never matches people by name."], never: true },
];

const chip = "rounded-full border border-line bg-canvas px-2 py-0.5 text-xs";
const heard = [
  { q: "you start clicking Approve on autopilot and stop reading the diffs.", who: "Agent user, Hacker News", href: "https://news.ycombinator.com/item?id=48830674", d: "Exact copies fold away." },
  { q: "The bank showed them a confidence score. The regulator shut it down.", who: "Banking AI lead, LinkedIn", href: "https://www.linkedin.com/posts/johnforrester_a-regulator-asked-a-bank-to-explain-its-ai-activity-7438239662009114624-WaU0", d: "Rules, not scores." },
  { q: "didn't know when to escalate, and quietly routed around it.", who: "Ops leader, LinkedIn", href: "https://www.linkedin.com/posts/jeffreytking_our-first-agentic-rollout-failed-in-three-activity-7465363738846638080-lVjb", d: "One place says what needs you." },
];

const phases: { p: string; dur: string; goal: string; d: string; tag: string }[] = [
  { p: "Phase 0", dur: "4 weeks", goal: "Agree the rules", d: "We pick one case type and write the mandate rules together with Operations, Compliance and Ops Risk, using read-only access. This phase is done when Compliance signs off the rules.", tag: "Accountability" },
  { p: "Phase 1", dur: "8 weeks", goal: "Shadow mode", d: "The agent makes its plan while makers still do the work, and we compare the two. This phase is done when the agent's plan matches the maker's on most cases and every difference has a clear reason.", tag: "Model risk" },
  { p: "Phase 2", dur: "8 weeks", goal: "The agent prepares, people approve", d: "The agent becomes the maker for exact copies, and checkers still approve everything. One in every 20 clean approvals goes to a supervisor for a second look. This phase is done when there are no unapproved writes and corrections fall each week. 1 in 20 cleanly approved cases goes to a supervisor for a second look.", tag: "Audit" },
  { p: "Phase 3", dur: "Ongoing", goal: "Scale", d: "We pilot partial release with one customer group, then add mixed mandates and mandate changes.", tag: "Old systems at scale" },
];

const unknowns = [
  "Will a bank allow 2 of 3 signatories to go live before the third?",
  "Will the security team accept self-service activation?",
  "Can a system user act as the maker?",
  "Does showing what the agent didn't check make people trust it more?",
  "Do checkers accept the grey reading too quickly, and if so, should it be hidden on high-value letters?",
];

const gaveUp = [
  "Rejected: auto-proceed timers. Fine for drafts, never for writes to a bank system.",
  "I kept all 4 sign-offs because bank controls require them, but I turned them into a single click.",
  "I left out confidence scores, because regulators ask which rule fired and a score can't answer that.",
  "I designed for desktop only, because the operations team works on bank laptops.",
  "Partial release is still an assumption, so it's the first thing I would test with a bank.",
  "I show the agent's reading in grey to save Sara time. People tend to accept what they see first, so a supervisor re-checks a sample of the readings she accepts.",
  "I didn't add an auto-continue timer. Timers are fine for drafts, but for anything written to a bank's systems, Sara confirms every time.",
];

const learnt = [
  "I had to understand the current systems first, because I couldn't design the agent until I knew how a case moves between Finacle, SVS, EFR and Admin.",
  "Banks want agents, but they have to be able to audit every decision, so every decision in Jointly lands in a record an auditor can read.",
  "Old systems are slow and costly to call, so the agent reads each one once and reuses what it read.",
  "Most of the waiting happens between people, so Jointly removes hand-offs while keeping every check.",
];

const faq: [string, string][] = [
  ["Is this a working prototype?", "Yes, every click in the demo works on made-up data, including the audit record."],
  ["What did you do, and what did AI do?", "I did the research, the service design, the product design, the rules and all of the writing, and Devin wrote the code from my specs."],
  ["Would a bank allow this?", "Not as it is. I would start in shadow mode, and Compliance would sign off the rules before anything else."],
  ["Why banking?", "Banks combine old systems with strict oversight, which makes them the hardest place to get agents right. Government and healthcare face the same problems."],
];

const mapShowed = [
  "Most of the delay comes from the case waiting between hand-offs, not from the work itself.",
  "The same customer details get typed in again at almost every step of the process.",
  "Only one step really needs reading, which is the free-text mandate in SVS, and rules can handle everything else.",
];

const shipped: [string, string][] = [
  ["Before", "Before that, customers filled in paper forms, cases went through 4 review rounds, and PINs arrived by courier."],
  ["What I designed", "I designed a self-serve flow in the business app, where each signatory registers and then they approve each other's access."],
  ["What I learnt from it", "Self-serve moved a lot of the work onto the customer. Because signatories approve each other, one expired Emirates ID can stop everyone, and those cases end up as tickets for the operations team."],
  ["With Jointly", "The agent prepares everything from records the bank already has, and rules check who can go live. Each signatory only verifies their Emirates ID and sets a password, so if one ID has expired, the others still go live."],
];

const calls: [string, string][] = [
  ["Finacle", "1 read per person (3 reads)"],
  ["SVS", "2 documents, read once"],
  ["EFR", "1 check per person at the start, 1 again before release"],
  ["AI model", "Only the 2 SVS documents"],
  ["Digital Banking Admin", "5 write steps, then 1 read-back"],
];

const cost = [
  "The agent reads each system once per case and reuses what it has already read.",
  "It only re-checks things that can change, like whether an ID has expired.",
  "It uses the AI model for the 2 scanned documents only, and the rules handle everything else, which costs less and gives the same answer every time.",
  "Each old system has its own small connector with its own retry limit, so if Admin is slow, Finacle reads carry on, and a retry never writes the same change twice.",
];

const compare: [string, string, string][] = [
  ["Approvals", "People approve every step, and reported studies say they approve 93 to 97% of prompts.", "Rules pass the exact copies, so Sara only makes 2 decisions."],
  ["Uncertainty", "Most products show a confidence score.", "Jointly shows clear states: the value matches, it doesn't match, or the agent couldn't read it."],
  ["Evidence", "Most products link to a whole document.", "Jointly opens the exact part of the scan and shows the rule it was checked against."],
  ["Checking", "Often another model checks the agent's work.", "The agent prepares the work, and it can never approve it."],
  ["When old systems fail", "Most products retry and hope it worked.", "Jointly retries and then reads everything back to confirm it."],
  ["Partial progress", "Usually it's all or nothing.", "2 people go live, and everyone can see why the third one is waiting."],
];

const oversight: [string, string][] = [
  ["People must understand the agent's limits.", "A panel lists what the agent can and cannot do."],
  ["People must watch for automation bias.", "The scan sits zoomed next to the agent's reading, and a supervisor re-checks a sample of accepted readings."],
  ["People must read the output correctly.", "Every finding shows its rule and its source."],
  ["People must be able to override the agent.", "Sara can override any finding with a reason, and the override is logged."],
  ["People must be able to stop it.", "Sara can pause before any write, and nothing is left half-written."],
];

const compareSources = [
  "https://gigazine.net/gsc_news/en/20260810-claude-code-auto-mode/",
  "https://arxiv.org/abs/2502.08554",
  "https://ojs.aaai.org/index.php/AAAI/article/view/34550",
  "https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/",
  "https://linear.app/developers/aig",
];

const eyebrow = "text-xs font-medium uppercase tracking-wide text-muted";
const h2 = "font-display text-3xl tracking-tight md:text-4xl";
const primary = "inline-flex h-11 items-center gap-1.5 rounded-lg bg-accent px-5 text-sm font-medium text-onaccent transition-colors hover:bg-accent-hover";
const card = "rounded-card border border-line bg-surface";
const wrap = "mx-auto max-w-6xl px-6 py-12";
const Sara = () => (
  <>
    <a href="/demo/case/" data-track="cta" className={`${primary} max-[899px]:hidden`}>
      Check it as Sara (5 min) <ArrowRight className="h-4 w-4" />
    </a>
    <MobileReplay className={`${primary} min-[900px]:hidden`} />
  </>
);

export default function CaseStudy() {
  return (
    <div className="alt min-h-screen bg-canvas">
      <SectionNav items={nav} />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-5">
          <Logo />
          <a href={PORTFOLIO_URL} data-track="portfolio" className="hidden text-sm text-sub hover:text-ink sm:inline">← Bisma&apos;s portfolio</a>
        </div>
        <div className="flex items-center gap-2">
          <LangSwitch href="/ar/" lang="ar" label="العربية" className="inline-flex h-9 items-center rounded-lg border border-line px-3 font-arabic text-sm text-sub hover:text-ink" />
          <ThemeButton />
        </div>
      </header>

      <section id="hero" className="mx-auto grid max-w-6xl items-start gap-10 px-6 pb-14 pt-2 md:grid-cols-[1fr_1fr] md:pt-4">
        <div>
          <p className="text-[13px] text-muted">Case study · AI product design for banking · Bisma Munawar</p>
          <h1 className="mt-3 font-display text-[32px] leading-[1.08] tracking-tight md:text-[44px]">A company with 3 signatories usually waits 5 days to get online banking, and Jointly gets them live before lunch.</h1>
          <p className="mt-4 max-w-xl text-base text-sub md:text-lg">Jointly is an AI agent that works alongside a bank&apos;s operations team. It reads the bank&apos;s old systems and the customer&apos;s scanned documents, prepares the whole setup, and then hands it to a person to check, because the agent can&apos;t approve anything on its own.</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <Gloss term="Joint signatories" def="These are 2 or more people who have to approve a company's payments together." />
            <Gloss term="Operations team" def="This is the bank team that sets up a company's online banking by hand. Some banks call it Customer Fulfillment, or CF." />
            <Gloss term="Mixed mandate" def="Different rules for different people or amounts, for example one person alone up to 10,000, any two above that." />
            {["RCIF", "Finacle", "SVS", "EFR", "Mandate", "Maker-checker", "Digital Banking Admin"].map((t) => <Gloss key={t} term={t} />)}
          </p>
          <dl className="mt-6 grid grid-cols-3 gap-4 md:gap-6">
            {stats.map((s) => (
              <div key={s.k}>
                <dd className="tnum whitespace-nowrap font-display text-2xl md:text-3xl">{s.n === 114 ? "1h 54m" : <CountUp to={s.n} />}</dd>
                <dt className="mt-1 text-xs text-muted">{s.k}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs text-muted">These numbers come from a scripted demo case, not from a real bank.</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Sara />
            <a href="#problem" className="text-sm text-accent-ink hover:underline">Or read the case study in 3 minutes ↓</a>
          </div>
          <p className="mt-2 text-xs text-muted">3 min read · 5 min demo</p>
          <div className="mt-5 flex items-center gap-2 text-sub" aria-hidden>
            <FileText className="h-4 w-4" /><ArrowRight className="h-3 w-3 text-muted" /><ShieldCheck className="h-4 w-4" /><ArrowRight className="h-3 w-3 text-muted" /><UserRound className="h-4 w-4" />
          </div>
          <p className="mt-1.5 text-sm text-sub"><span className="light-step">The agent reads the records</span>, <span className="light-step [animation-delay:300ms]">the bank&apos;s rules check its work</span>, and <span className="light-step [animation-delay:600ms]">Sara approves what goes live</span>.</p>
        </div>
        <HeroFrame callouts={["The agent pulled every record from Finacle, SVS and EFR", "Amber means the agent had to read a document", "Sara decides that one value, then signs off"]} />
      </section>

      <section id="in30" aria-label="In 30 seconds" className="bg-panel border-y border-line">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">In 30 seconds</p>
          <dl className="mt-4 grid gap-5 md:grid-cols-5">
            {in30.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-semibold text-ink">{k}</dt>
                <dd className="mt-1 text-sm text-sub">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-xs text-muted">This is based on interviews with a bank&apos;s operations team, my service maps of 3 onboarding flows, and published research on how people oversee AI.</p>
        </div>
      </section>

      <section id="problem" className="bg-panel">
        <div className={wrap}>
          <p className={eyebrow}>01 · Problem</p>
          <h2 className={`mt-2 ${h2}`}>Business customers bring banks a lot of revenue, yet they wait the longest to get set up.</h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {tiles.map((t) => (
              <li key={t.n} className={`${card} p-5`}>
                <p className="tnum font-display text-3xl">{t.n}</p>
                <p className="mt-3 text-sm text-sub">{t.t}</p>
                <a href={t.href} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-accent-ink hover:underline">Source: {t.src}</a>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-sub">In my research, the slowest cases were existing customers with joint or mixed mandates on old accounts, and many of them still have no online approval workflow.</p>
          <p className="mt-2 text-xs text-muted">These are industry figures, not numbers from any one bank.</p>
          <h3 className="mt-14 font-display text-2xl tracking-tight">For most of those 5 days, the case is simply waiting for the next person to pick it up.</h3>
          <p className="mt-2 text-sub">I mapped every hand-off in the process, and this is a simplified version of it.</p>
          <div className="mt-8 grid max-w-xl gap-2 text-sm">
            <div className="flex items-center gap-3"><span className="w-24 text-muted">Today</span><span className="h-2 flex-1 rounded-full bg-warn" /><span className="tnum w-16 font-medium">5 days</span></div>
            <div className="flex items-center gap-3"><span className="w-24 text-muted">With Jointly</span><span className="flex-1"><span className="block h-2 w-[4%] min-w-2 rounded-full bg-ok" /></span><span className="tnum w-16 font-medium text-ok-ink">1h 54m</span></div>
          </div>
          <div className="mt-6">
            <DaysSwimlane t={swim} />
          </div>
        </div>
      </section>

      <section id="system">
        <div className={wrap}>
          <p className={eyebrow}>02 · Before</p>
          <h2 className={`mt-2 ${h2}`}>I learnt how the bank&apos;s systems work before I designed anything.</h2>
          <p className="mt-3 max-w-3xl text-sub">At a UAE bank, I mapped how one onboarding case moves between the customer, the operations team, 4 old systems and a courier. That map decided what the agent should do, and just as clearly, what it should never touch.</p>
          <p className="mt-8 text-sm font-semibold">What the map showed me</p>
          <ul className="mt-3 grid gap-4 md:grid-cols-3">
            {mapShowed.map((m, i) => (
              <li key={m} className={`${card} p-5 text-sm text-sub`}>
                <span className="tnum mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-semibold text-canvas">{i + 1}</span>
                {m}
              </li>
            ))}
          </ul>
          <p className="mt-12 text-sm font-semibold">What I shipped, and what I&apos;d do differently with an agent</p>
          <p className="mt-1 max-w-3xl text-sm text-sub">I designed the digital setup for joint signatories in a UAE bank&apos;s new business banking app, and here is how I would approach it with an agent.</p>
          <ol className="mt-4 grid gap-3 md:grid-cols-4">
            {shipped.map(([k, v], i) => (
              <li key={k} className={i === 3 ? "relative rounded-card border-2 border-brand bg-surface p-5" : `relative ${card} p-5`}>
                {i > 0 && <ArrowRight aria-hidden className="absolute -start-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 bg-canvas text-muted md:block rtl:-scale-x-100" />}
                <p className="text-sm font-semibold">{k}</p>
                <p className="mt-1.5 text-[13px] text-sub">{v}</p>
              </li>
            ))}
          </ol>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <p className="flex gap-3 text-sm text-sub"><UserRound aria-hidden className="h-5 w-5 shrink-0 text-ink" />Customers have much less to do, because they don&apos;t retype what the bank already knows and they don&apos;t wait on each other.</p>
            <p className="flex gap-3 text-sm text-sub"><ShieldCheck aria-hidden className="h-5 w-5 shrink-0 text-ink" />The operations team gets fewer tickets, because a stuck case is routed with its reason instead of arriving in the queue as a complaint.</p>
          </div>
          <p className="mt-3 text-xs text-muted">This is what I would change, and I haven&apos;t measured it yet.</p>
        </div>
      </section>

      <section id="why" className="band-dark">
        <div className={wrap}>
          <p className={eyebrow}>03 · Why an agent</p>
          <h2 className={`mt-2 ${h2}`}>Rules can&apos;t read a scanned letter, which is why this needs an agent.</h2>
          <p className="mt-8 text-xs font-medium uppercase tracking-wide text-muted">What banks try today</p>
          <ul className="mt-3 grid gap-3 md:grid-cols-5">
            {today.map(([k, v]) => (
              <li key={k} className={k === "Jointly" ? "rounded-card border-2 border-brand bg-surface p-4" : `${card} p-4`}>
                <p className="text-sm font-semibold">{k}</p>
                <p className="mt-1.5 text-[13px] text-sub">{v}</p>
              </li>
            ))}
          </ul>
          <ul className="mt-8 space-y-3">
            {why.map(([mess, fix]) => (
              <li key={mess} className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
                <p className={`${card} px-5 py-4 text-sm text-sub`}>{mess}</p>
                <ArrowRight aria-hidden className="mx-auto h-5 w-5 rotate-90 text-brand md:rotate-0" />
                <p className="rounded-card border border-ok/30 bg-ok-soft px-5 py-4 text-sm font-medium text-ok-ink">{fix}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-medium">So the model does the reading, and the rules make the decisions.</p>
          <div className="mt-10">
            <Tabs labels={["The 4 old systems", "Cost"]}>
              {[
                <div key="s">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {systems.map((x) => (
              <li key={x.name} className={`${card} p-5`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{x.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${x.tag === "Write" ? "bg-accent-soft text-accent-ink" : x.tag === "Check" ? "bg-ok-soft text-ok-ink" : "bg-panel text-sub"}`}>{x.tag}</span>
                </div>
                <p className="mt-2 text-sm text-sub">{x.d}</p>
              </li>
            ))}
          </ul>
          <ol className="mt-4 flex flex-col gap-2 md:flex-row md:items-center">
            {adminRun.map(([t, l, tone], i) => (
              <li key={l} className="flex items-center gap-2 text-sm">
                {i > 0 && <ArrowRight aria-hidden className="hidden h-4 w-4 text-muted md:block" />}
                <span className={`rounded-full px-3 py-1 ${tone === "warn" ? "bg-warn-soft text-warn-ink" : tone === "ok" ? "bg-ok-soft text-ok-ink" : "bg-panel text-sub"}`}>
                  <span className="tnum text-xs">{t}</span> {l}
                </span>
              </li>
            ))}
          </ol>
                </div>,
                <div key="c">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold">It&apos;s cheap to run and easy on the bank&apos;s old systems</p>
              <ul className="mt-3 space-y-2">
                {cost.map((c) => (
                  <li key={c} className="flex gap-2.5 text-sm text-sub"><Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-ok" />{c}</li>
                ))}
              </ul>
            </div>
            <table className={`${card} w-full self-start text-sm`}>
              <caption className="pb-2 text-start text-xs text-muted">Calls for the Creekside case</caption>
              <tbody className="divide-y divide-line">
                {calls.map(([k, v]) => (
                  <tr key={k}><th scope="row" className="px-4 py-2.5 text-start font-medium">{k}</th><td className="px-4 py-2.5 text-sub">{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">This is a scripted case, so these call counts are design targets rather than measurements.</p>
                </div>,
              ]}
            </Tabs>
          </div>
        </div>
      </section>

      <section id="case">
        <div className={wrap}>
          <p className={eyebrow}>04 · The case</p>
          <h2 className={`mt-2 ${h2}`}>The agent checked every record and only asked Sara about one value.</h2>
          <div className="mt-10">
            <Moments
              titles={moments}
              extras={[
                null,
                null,
                <div key="map">
                  <p className="mb-3 text-sm text-sub">The whole mandate is drawn as one picture, so Sara can check it at a glance.</p>
                  <MandateToggle before="Before Sara checks the letter" after="After" see="See it live" label="Open the signing map in the demo" />
                </div>,
                null,
              ]}
            />
          </div>
          <div className="mt-12"><Sara /></div>
        </div>
      </section>

      <section id="roles" className="bg-panel">
        <div className={wrap}>
          <p className={eyebrow}>05 · Who decides</p>
          <h2 className={`mt-2 ${h2}`}>Sara makes the decisions, and the agent can&apos;t approve anything.</h2>
          <p className="mt-3 text-lg font-medium">The agent is a maker that can never be its own checker.</p>
          <p className="mt-1 text-sub">If a case hits 3 rule exceptions, it goes to a senior checker.</p>
          <p className="mt-2 text-sub">The agent prepares the work, but it can never be the one who checks it.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {lanes.map((l) => (
              <div key={l.title} className={`${card} p-6`}>
                {l.icon}
                <p className="mt-4 font-semibold">{l.title}</p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {l.items.map((it) => (
                    <li key={it} className={l.never ? "text-bad-ink" : "text-sub"}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-sub">Simple mandates need one checker, while complex mandates or a signature mismatch go to a second checker as well.</p>
          <p className="mt-2 text-sm text-sub">
            Every case ends with a record that an auditor can read, showing which rule was used, which source it came from, who approved it and when.{" "}
            <Link href="/demo/case/?view=record" className="text-accent-ink underline underline-offset-2">See Creekside&apos;s record</Link>
          </p>
          <p className="mt-10 font-semibold">I compared Jointly&apos;s design with more than 40 agent products and studies.</p>
          <p className="mt-1 text-xs text-muted">This compares design choices, and since Jointly is a prototype, there&apos;s no performance data yet.</p>
          <div className="mt-4">
            <Tabs labels={["How it compares", "Oversight rules"]}>
              {[
                <div key="c" className="overflow-x-auto">
                  <table className={`${card} w-full min-w-[640px] text-sm`}>
                    <thead>
                      <tr className="border-b border-line text-start text-xs text-muted">
                        <th className="px-4 py-3 text-start font-medium"><span className="sr-only">Dimension</span></th>
                        <th className="px-4 py-3 text-start font-medium">What&apos;s common today</th>
                        <th className="px-4 py-3 text-start font-medium">What Jointly does</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {compare.map(([d, c, j]) => (
                        <tr key={d}>
                          <th scope="row" className="px-4 py-3 text-start font-semibold">{d}</th>
                          <td className="px-4 py-3 text-sub">{c}</td>
                          <td className="px-4 py-3 font-medium text-ok-ink">{j}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>,
                <div key="o">
                  <p className="font-semibold">It&apos;s built around the rules on human oversight of AI.</p>
                  <ul className="mt-4 space-y-3">
                    {oversight.map(([r, h]) => (
                      <li key={r} className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
                        <p className={`${card} px-4 py-3 text-sm text-sub`}>{r}</p>
                        <ArrowRight aria-hidden className="mx-auto h-4 w-4 rotate-90 text-brand md:rotate-0 rtl:md:-scale-x-100" />
                        <p className="rounded-card border border-ok/30 bg-ok-soft px-4 py-3 text-sm font-medium text-ok-ink">{h}</p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-muted">I mapped this to <a className="underline" href="https://artificialintelligenceact.eu/article/14/" target="_blank" rel="noreferrer">EU AI Act Article 14</a> and the <a className="underline" href="https://www.wam.ae/en/article/byvw3l2-cbuae-issues-guidance-note-protect-consumers-and" target="_blank" rel="noreferrer">UAE central bank&apos;s 2026 guidance</a> on human oversight. This is my reading of them, not legal advice.</p>
                </div>,
              ]}
            </Tabs>
          </div>
          <p className="mt-6 max-w-3xl text-sm text-sub">I could make these calls because I had mapped the service first, so I knew where a rule was enough, where Sara had to decide, and where only an agent could help.</p>
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer text-sub">Sources</summary>
            <ul className="mt-2 space-y-1">
              {compareSources.map((u) => (
                <li key={u}><a href={u} target="_blank" rel="noreferrer" className="break-all text-accent-ink hover:underline">{u.replace(/^https:\/\//, "")}</a></li>
              ))}
            </ul>
          </details>
        </div>
      </section>

      <section id="heard">
        <div className={wrap}>
          <p className={eyebrow}>06 · What I heard</p>
          <h2 className={`mt-2 ${h2}`}>Here&apos;s what the operations team told me, and what I changed because of it.</h2>
          <div className={`mt-10 max-w-2xl ${card} p-6`}>
            <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">Paraphrased</span>
            <p className="mt-3 font-display text-lg leading-snug">Setting up one joint-signatory business takes 4 to 5 days. Most of that time goes on reading customer documents and free-text instructions in SVS, and then setting it all up by hand.</p>
            <ArrowRight className="my-2 h-4 w-4 rotate-90 text-brand" />
            <p className="text-sm font-medium">So I made the agent do the reading, and Sara checks what it read.</p>
          </div>
          <p className="mt-10 text-xs font-medium uppercase tracking-wide text-muted">What teams already using agents are saying</p>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {heard.map((h) => (
              <li key={h.href} className={`flex flex-col ${card} p-6`}>
                <p className="font-display text-lg leading-snug">&ldquo;{h.q}&rdquo;</p>
                <a href={h.href} target="_blank" rel="noreferrer" className="mt-2 text-xs text-muted underline-offset-2 hover:underline">{h.who}</a>
                <ArrowRight className="my-2 h-4 w-4 rotate-90 text-brand" />
                <p className="text-sm font-medium">{h.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="bank" className="bg-panel">
        <div className={wrap}>
          <p className={eyebrow}>07 · At a bank</p>
          <h2 className={`mt-2 ${h2}`}>If I built this at a real bank, I would start in shadow mode.</h2>
          <p className="mt-2 max-w-3xl text-sub">Banks are careful with agents for good reasons, including audit, model risk, access to old systems and accountability, so each phase is designed to answer one of these concerns.</p>
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {phases.map((ph) => (
              <li key={ph.p} className={`${card} flex flex-col p-5`}>
                <p className="tnum text-xs text-muted">{ph.p} · {ph.dur}</p>
                <p className="mt-2 font-semibold">{ph.goal}</p>
                <p className="mt-2 flex-1 text-[13px] text-sub">{ph.d}</p>
                <span className={`mt-4 w-fit ${chip} text-sub`}>{ph.tag}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className={`${card} p-5`}>
              <p className="text-sm font-semibold">Who&apos;s in the room</p>
              <p className="mt-2 text-sm text-sub">I&apos;d work with Operations, Compliance, Ops Risk, Information Security, Core banking IT, Digital channels and Internal Audit.</p>
            </div>
            <div className={`${card} p-5`}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">What I&apos;d measure</p>
                <span className={`${chip} text-muted`}>Plan, not results</span>
              </div>
              <p className="mt-2 text-sm text-sub">I&apos;d track how often the agent&apos;s plan matches the maker&apos;s, how often Sara changes what the agent read, how many cases go straight through, how many are returned to the agent, the time from form to first login, and writes without approval, which must stay at zero.</p>
            </div>
          </div>
          <p className="mt-8 text-sm font-semibold">What I&apos;d test next</p>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {unknowns.map((u) => (
              <li key={u} className="flex gap-3 text-sm text-sub">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border-2 border-line" /> {u}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="lessons">
        <div className={wrap}>
          <p className={eyebrow}>08 · Lessons</p>
          <h2 className={`mt-2 ${h2}`}>What I gave up, and where the agent still gets things wrong</h2>
          <div className="mt-8">
            <Tabs labels={["What I gave up", "Where it gets it wrong", "What I learnt"]}>
              {[
                <ul key="g" className="grid gap-3 md:grid-cols-2">
                  {gaveUp.map((g) => (
                    <li key={g} className={`${card} p-5 text-sm text-sub`}>{g}</li>
                  ))}
                </ul>,
                <ul key="w" className="grid gap-3 md:grid-cols-3">
                  {wrongs.map((g) => (
                    <li key={g} className={`${card} p-5 text-sm text-sub`}>{g}</li>
                  ))}
                </ul>,
                <ul key="l" className="grid gap-3 md:grid-cols-2">
                  {learnt.map((l) => (
                    <li key={l} className={`${card} flex gap-2.5 p-5 text-sm text-sub`}><Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-ok" />{l}</li>
                  ))}
                </ul>,
              ]}
            </Tabs>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-sm text-sub">
            <span className={`${chip} text-muted`}>Illustrative</span>
            The same pattern would work for renewing a trade licence across government registries, for insurance pre-approvals built on referral letters, and for mandate changes on existing bank accounts.
          </div>
        </div>
      </section>

      <section id="about" className="bg-panel">
        <div className={wrap}>
          <h2 className={h2}>About me</h2>
          <p className="mt-4 max-w-3xl text-sub">I&apos;m Bisma, a product designer based in Abu Dhabi. I learnt service design at a UAE bank by mapping how business customers get onboarded across people and old systems, and I designed the digital setup for joint signatories in the bank&apos;s new business app. Jointly is how I would do it differently, with an agent doing the reading so that customers fill in less and the operations team gets fewer tickets.</p>
          <p className="mt-6 text-sm text-sub"><span className="font-semibold text-ink">Who did what: </span>I did the research, the service design and the product design, and Devin wrote the code from my specs.</p>
          <div className="mt-6 grid gap-2 md:grid-cols-2">
            {faq.map(([q, a]) => (
              <details key={q} className={`${card} px-5 py-3 text-sm`}>
                <summary className="cursor-pointer font-medium">{q}</summary>
                <p className="mt-2 text-sub">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="band-dark">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <p className={h2}>Try it for yourself</p>
            <p className="mt-3 text-sm text-sub">
              Designed by Bisma Munawar ·{" "}
              <a href="mailto:bismamunawardigital@gmail.com" className="underline-offset-2 hover:underline">Email</a>
            </p>
            <p className="mt-1 text-xs text-muted">All the people, accounts and bank systems in this case study are made up.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Sara />
            <a href={PORTFOLIO_URL} data-track="portfolio" className="text-sm text-accent-ink hover:underline">Back to Bisma&apos;s portfolio</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
