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
    title: "Show what the agent isn't sure about",
    body: "When a scan is blurry, the card shows the image next to what the agent read. Sara checks the value herself, not from memory.",
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

const heard = [
  { quote: "you start clicking Approve on autopilot and stop reading the diffs.", who: "Agent user, Hacker News", href: "https://news.ycombinator.com/item?id=48830674", change: "only asks Sara to look at lines the agent read itself. Exact copies fold away." },
  { quote: "A regulator asked a bank to explain its AI agent's last 100 decisions. The bank showed them a confidence score. The regulator shut it down.", who: "Banking AI lead, LinkedIn", href: "https://www.linkedin.com/posts/johnforrester_a-regulator-asked-a-bank-to-explain-its-ai-activity-7438239662009114624-WaU0", change: "keeps a decision record: rule, quote, approver, time. No confidence scores." },
  { quote: "The humans around it didn't trust it, didn't know when to escalate, and quietly routed around it.", who: "Ops leader, LinkedIn", href: "https://www.linkedin.com/posts/jeffreytking_our-first-agentic-rollout-failed-in-three-activity-7465363738846638080-lVjb", change: "has Pause and a named maker handover, and pings Sara only when it needs her." },
];

const grounded = [
  { source: "Vasconcelos et al., CSCW 2023", href: "https://doi.org/10.1145/3579605", finding: "People over-trust AI less when checking is easier than trusting.", where: "the clause quote sits next to every line in review" },
  { source: "Steyvers and Kumar, 2024", href: "https://journals.sagepub.com/doi/full/10.1177/17456916231181102", finding: "Showing how sure the AI is helps people rely on it the right amount.", where: "Exact match vs Agent read this tags" },
  { source: "Buçinca et al., CSCW 2021", href: "https://doi.org/10.1145/3449287", finding: "A small forced check cuts rubber-stamping.", where: "Approve only works after Sara compares the highlighted words" },
  { source: "Amershi et al., CHI 2019", href: "https://doi.org/10.1145/3290605.3300233", finding: "Support quick correction, and let the AI learn from it.", where: "return one stage, then make the fix stick" },
  { source: "EU AI Act, Article 14", href: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-14", finding: "Humans must be able to stop the system.", where: "Pause agent and Hand to a maker" },
  { source: "Feng, McDonald and Zhang, 2025", href: "https://arxiv.org/html/2506.12469v1", finding: "Autonomy is a design choice, set by the user's role.", where: "the autonomy map: Sara is the approver" },
];

export default function CaseStudy() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-2">
          <Link href="/ar/" lang="ar" className="inline-flex h-9 items-center rounded-lg border border-line px-3 font-arabic text-sm text-sub hover:text-ink">
            العربية
          </Link>
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
          Case study · Designing an AI agent people can check · Bisma Munawar
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          A 4 day bank chore, done before lunch. And a person still signs off.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-sub">
          Setting up online banking for a business with 3 signatories takes a
          bank about 4 to 5 days of back and forth. In Jointly, an agent does
          the copying and cross-checking across 4 old systems, Sara checks the
          parts it had to interpret, and fixed rules decide who can sign. The
          agent never approves its own work.
        </p>
        <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
          {[
            { k: "Bank-side work", v: "1h 34m", n: "was 4 to 5 days" },
            { k: "Clicks to approve", v: "4 stages", n: "only 1 needed a close look" },
            { k: "Things the agent approved", v: "0", n: "by design" },
          ].map((x) => (
            <div key={x.k} className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{x.k}</dt>
              <dd className="tnum mt-0.5 text-xl font-semibold">{x.v}</dd>
              <dd className="text-[11px] text-muted">{x.n}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-[11px] text-muted">Demo numbers from a scripted, synthetic case. Not measured in a real bank.</p>
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
        <h2 className="text-2xl font-semibold tracking-tight">The problem isn&apos;t hard. It&apos;s slow.</h2>
        <p className="mt-2 max-w-2xl text-sub">
          I mapped the single, joint and non-signatory flows and spoke with the
          people who run them. Nobody is confused. They&apos;re copying the
          same names between 4 systems, waiting on each other, and one missed
          letter can change who is allowed to sign.
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
          Before any screen: who decides what
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
            6 patterns I&apos;d reuse on any agent
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
            The one card Sara uses all day
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
          <h2 className="text-2xl font-semibold tracking-tight">What people using agents told me</h2>
          <p className="mt-2 max-w-2xl text-sub">I read ops, compliance and agent-user threads before redesigning. Three quotes changed the product.</p>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {heard.map((h) => (
              <li key={h.href} className="flex flex-col rounded-xl border border-line bg-surface p-4">
                <p className="flex-1 text-sm">&ldquo;{h.quote}&rdquo;</p>
                <a href={h.href} target="_blank" rel="noreferrer" className="mt-3 text-xs text-accent-ink underline-offset-2 hover:underline">
                  {h.who}
                </a>
                <p className="mt-2 border-t border-line pt-2 text-xs text-sub">So Jointly: {h.change}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Grounded in research</h2>
          <p className="mt-2 max-w-2xl text-sub">Where a decision came from a paper or a rule, here it is, so you can check me.</p>
          <ul className="mt-8 grid gap-3 text-sm md:grid-cols-2">
            {grounded.map((g) => (
              <li key={g.href} className="rounded-xl border border-line bg-surface p-4">
                <a href={g.href} target="_blank" rel="noreferrer" className="font-medium text-accent-ink underline-offset-2 hover:underline">
                  {g.source}
                </a>
                <p className="mt-1 text-sub">{g.finding}</p>
                <p className="mt-2 text-xs text-muted">In Jointly: {g.where}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-panel/50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            What I don&apos;t know yet
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
