import Link from "next/link";
import { AlertTriangle, ArrowLeft, Ban, Check, FileText, Printer, Search, ShieldCheck, Truck, Undo2, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/Shell";
import { ThemeButton } from "@/components/ThemeToggle";
import { AgentMark, Avatar } from "@/components/ui";
import { HeroScene } from "@/components/landing/HeroScene";
import { Moments } from "@/components/landing/Moments";
import { LangSwitch } from "@/components/landing/LangSwitch";
import { statsAr } from "@/content/stats";

const B = ({ children }: { children: React.ReactNode }) => <bdi>{children}</bdi>;

const inbox: { who: ("mohammed" | "khalifa" | "rashid")[]; line: React.ReactNode; time: string }[] = [
  { who: ["khalifa"], line: <>تأكيد قيمة في خطاب غير واضح · <B>Creekside</B></>, time: "2 د" },
  { who: ["mohammed", "khalifa"], line: <>اعتماد مُدخِل مدفوعات جديد · <B>Saffron Bay</B></>, time: "1 د" },
  { who: ["rashid"], line: <>تفعيل راشد بعد تجديد هويته · <B>Creekside</B></>, time: "30 ث" },
];

const days: { day: string; icons: { I: LucideIcon; label: string }[] }[] = [
  { day: "اليوم 1", icons: [{ I: FileText, label: "نموذج ورقي" }] },
  { day: "اليوم 2", icons: [{ I: Search, label: "مراجعة السجلات" }] },
  { day: "اليوم 3", icons: [{ I: Undo2, label: "إرجاع" }, { I: Undo2, label: "إرجاع" }, { I: Undo2, label: "إرجاع" }] },
  { day: "اليوم 4", icons: [{ I: Printer, label: "طباعة الأرقام السرية" }] },
  { day: "اليوم 5", icons: [{ I: Truck, label: "مندوب التوصيل" }] },
];

const learned: React.ReactNode[] = [<>مراجعة خطابات <B>SVS</B></>, "إعادة استخدام حسابات الدخول الحالية", <>إعادة فحص <B>EFR</B> قبل التفعيل</>];

const lanes: { icon: React.ReactNode; title: string; items: string[]; never?: boolean }[] = [
  { icon: <AgentMark size={40} />, title: "الوكيل يقوم بـ", items: ["قراءة كل السجلات", "بناء الخطة", "التنفيذ بعد الاعتماد"] },
  { icon: <ShieldCheck className="h-10 w-10 text-accent" />, title: "القواعد تحدد", items: ["من يوقّع", "حتى أي مبلغ", "من يُفعَّل"] },
  { icon: <UserRound className="h-10 w-10 text-ink" />, title: "سارة تعتمد", items: ["القيم غير الواضحة", "اعتماد الخطة", "كل تفعيل"] },
  { icon: <Ban className="h-10 w-10 text-bad" />, title: "ممنوع دائمًا", items: ["اعتماد عمله بنفسه", "إرسال كلمات المرور", "مطابقة الأشخاص بالاسم"], never: true },
];

const patterns: { I: LucideIcon; title: string }[] = [
  { I: Search, title: "طابِق بالمعرّف، لا بالاسم" },
  { I: FileText, title: "لكل ادعاء مصدر" },
  { I: AlertTriangle, title: "أظهِر ما لست متأكدًا منه" },
  { I: Check, title: "الاعتماد يبقى مع المحتوى" },
  { I: ShieldCheck, title: "القواعد مكتوبة في الكود" },
  { I: UserRound, title: "فعّل الآمن، وأوقف الباقي" },
];

const gaveUp: { d: React.ReactNode; why: string }[] = [
  { d: <>أبقيت <B>4</B> اعتمادات، كإجراء واحد</>, why: "ضوابط البنك تتطلب ذلك. نقرات أقل، والسجل نفسه." },
  { d: "بدون درجات ثقة", why: "الجهات الرقابية تسأل أي قاعدة طُبّقت، لا مدى ثقة النموذج." },
  { d: "لسطح المكتب فقط", why: "فريق خدمة العملاء يعمل على أجهزة البنك. الجوال منتج مختلف." },
  { d: "التفعيل الجزئي فرضية", why: "لا يوجد دليل منشور بعد. أول ما يجب اختباره مع بنك." },
];

// Real quotes stay in their original English so nothing is put in someone's mouth.
const heard = [
  { q: "you start clicking Approve on autopilot and stop reading the diffs.", who: "Agent user, Hacker News", href: "https://news.ycombinator.com/item?id=48830674", d: "النسخ المطابقة تُطوى." },
  { q: "The bank showed them a confidence score. The regulator shut it down.", who: "Banking AI lead, LinkedIn", href: "https://www.linkedin.com/posts/johnforrester_a-regulator-asked-a-bank-to-explain-its-ai-activity-7438239662009114624-WaU0", d: "قواعد، لا درجات." },
  { q: "didn't know when to escalate, and quietly routed around it.", who: "Ops leader, LinkedIn", href: "https://www.linkedin.com/posts/jeffreytking_our-first-agentic-rollout-failed-in-three-activity-7465363738846638080-lVjb", d: "مكان واحد يقول ما يحتاجك." },
];

const unknowns: React.ReactNode[] = [
  "هل يبني إظهار ما لم يبحث عنه الوكيل الثقة؟",
  <>هل سيسمح البنك بتفعيل <B>2</B> من <B>3</B> مفوّضين؟</>,
  "هل سيقبل فريق الأمن التفعيل الذاتي؟",
  "هل يمكن لمستخدم نظام أن يكون المُدخِل؟",
];

const h2 = "text-3xl font-semibold leading-snug md:text-4xl";
const primary = "inline-flex h-11 items-center gap-1.5 rounded-lg bg-accent px-5 text-sm font-medium text-onaccent transition-colors hover:bg-accent-hover";
const frame = "overflow-hidden rounded-card border border-line bg-surface shadow-lg";
const dots = (
  <div className="flex items-center gap-1.5 border-b border-line bg-panel/60 px-4 py-2.5">
    {[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full bg-line-strong" />)}
  </div>
);

export const metadata = { title: "Jointly · دراسة حالة" };

export default function CaseStudyAr() {
  return (
    <div lang="ar" dir="rtl" className="alt min-h-screen bg-canvas font-arabic">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-2">
          <LangSwitch href="/" lang="en" label="English" className="inline-flex h-9 items-center rounded-lg border border-line px-3 font-sans text-sm text-sub hover:text-ink" />
          <ThemeButton />
        </div>
      </header>

      <section id="hero" className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-20 pt-4 md:grid-cols-2 md:pt-8">
        <div>
          <h1 className="text-[36px] font-semibold leading-[1.3] md:text-[54px]">سارة تُفعِّل <B>3</B> مفوّضين بالتوقيع قبل الغداء. ولا يستطيع الوكيل توقيع أي شيء.</h1>
          <p className="mt-5 max-w-xl text-lg text-sub">
            وكيل لعمليات البنك يشتغل على <B>Finacle</B> و<B>SVS</B> و<B>EFR</B>، ويوقف إذا ما كان متأكد.
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-4 md:gap-6">
            {statsAr.map((s) => (
              <div key={s.k}>
                <dd dir="ltr" className="tnum whitespace-nowrap text-end font-display text-2xl md:text-4xl">{s.v}</dd>
                <dt className="mt-1 text-xs text-muted">{s.k}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <Link href="/demo/case/" className={primary}>
              افتح العرض التجريبي (<B>5</B> دقائق) <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-3 text-[11px] text-muted">حالة افتراضية. لم تُقَس في بنك حقيقي.</p>
        </div>
        {/* Money axes stay low to high, left to right, as in the product. Do not mirror. */}
        <div dir="ltr">
          <HeroScene />
        </div>
      </section>

      <section id="inbox" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-center gap-3">
          <h2 className={h2}>من هنا تبدأ سارة يومها</h2>
          <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">مفهوم</span>
        </div>
        <div className={`mt-8 max-w-3xl ${frame}`}>
          {dots}
          <ul className="divide-y divide-line">
            {inbox.map((d, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-4">
                <span className="flex -space-x-2 rtl:space-x-reverse">{d.who.map((w) => <Avatar key={w} id={w} size={32} />)}</span>
                <span className="min-w-0 flex-1 text-sm font-medium md:text-base">{d.line}</span>
                <span className="tnum text-xs text-muted">{d.time}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-sm text-sub">الوكيل يعمل في الخلفية. سارة لا ترى إلا القرارات.</p>
      </section>

      <section id="slow" className="border-y border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>العمل ليس صعبًا. إنه بطيء.</h2>
          <p className="mt-2 text-sub"><B>4</B> أنظمة، <B>4</B> تسليمات، ومندوب توصيل واحد.</p>
          <p className="mt-10 text-xs font-medium text-muted">اليوم</p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {days.map((d) => (
              <div key={d.day}>
                <p className="text-xs text-muted">{d.day}</p>
                <div className="mt-2 flex h-8 items-center gap-1">
                  {d.icons.map(({ I, label }, i) => <I key={i} aria-label={label} className="h-5 w-5 text-sub md:h-6 md:w-6" />)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
            <div className="crawl h-full rounded-full bg-warn" style={{ transformOrigin: "right" }} />
          </div>
          <p className="mt-8 text-xs font-medium text-muted">مع <B>Jointly</B></p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 w-[8%] min-w-8 overflow-hidden rounded-full bg-line">
              <div className="crawl-fast h-full rounded-full bg-ok" style={{ transformOrigin: "right" }} />
            </div>
            <span className="text-sm font-medium text-ok-ink"><B>1h 54m</B></span>
          </div>
        </div>
      </section>


      <section id="shadow" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>راقب قبل أن يتصرف</h2>
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
            <p className="rounded-card border border-line bg-surface px-5 py-4"><span className="tnum font-display text-3xl">12</span> <span className="text-sm text-sub">حالة مُدخِل تمت مراقبتها</span></p>
            <ArrowLeft className="h-5 w-5 -rotate-90 text-accent md:rotate-0" />
            <p className="rounded-card border border-line bg-surface px-5 py-4"><span className="tnum font-display text-3xl">3</span> <span className="text-sm text-sub">خطوات غير موجودة في الإجراءات</span></p>
            <ArrowLeft className="h-5 w-5 -rotate-90 text-accent md:rotate-0" />
            <ul className="flex flex-wrap gap-2">
              {learned.map((l, i) => <li key={i} className="rounded-full bg-accent-soft px-3 py-1.5 text-sm text-accent-ink">{l}</li>)}
            </ul>
          </div>
          <p className="mt-4 text-xs text-muted">توضيحي. هكذا يتعلم الوكيل العمل غير المكتوب أولًا.</p>
        </div>
      </section>

      <section id="grid" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className={h2}>كل المصادر في جدول واحد</h2>
        <div dir="ltr" className={`mt-8 ${frame}`}>
          {dots}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/landing/evidence-grid.png" alt="جدول الأدلة: صفوف لمحمد وخليفة وراشد والتفويض، وخلية واحدة كهرمانية على خطاب 2023" className="w-full object-cover object-left max-md:h-56" />
        </div>
        <p className="mt-4 text-sm text-sub"><B>17</B> خلية تطابق سجلات البنك. سارة تراجع القيمة الوحيدة التي اضطر الوكيل لقراءتها.</p>
      </section>

      <section id="mandate" className="mx-auto max-w-6xl border-t border-line px-6 py-20">
        <h2 className={h2}>تفويض بنص حر يصبح صورة.</h2>
        <figure className="mt-8">
          <Link href="/demo/case/?tab=map" dir="ltr" className={`block ${frame}`}>
            {dots}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/landing/signing-map.png" alt="خريطة التوقيع: محمد وخليفة وراشد مع أزواج الاعتماد حسب المبلغ" className="w-full" />
          </Link>
          <figcaption className="mt-3 text-sub">تستطيع سارة مراجعتها في ثوانٍ.</figcaption>
        </figure>
      </section>

      <section id="moments" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}><B>4</B> لحظات</h2>
          <div className="mt-10">
            <Moments
              see="شاهدها مباشرة"
              titles={["يطابق الأشخاص برقم الهوية، لا بالاسم أبدًا", "يكتشف الهوية المنتهية قبل بدء أي عمل", "يقرأ خطابًا غير واضح من 2023، ويطلب من سارة التأكيد", "يفعّل ما هو آمن، ويوقف الباقي"]}
            />
          </div>
        </div>
      </section>

      <section id="roles" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>من يقرر ماذا</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {lanes.map((l) => (
              <div key={l.title} className="rounded-card border border-line bg-surface p-6">
                {l.icon}
                <p className="mt-4 font-semibold">{l.title}</p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {l.items.map((it) => <li key={it} className={l.never ? "text-bad-ink line-through decoration-bad" : "text-sub"}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-sub">
            تنتهي كل حالة بسجل قرار يستطيع المدقق قراءته: القاعدة، والاقتباس، والمعتمِد، والوقت.{" "}
            <Link href="/demo/case/?tab=decisions" className="text-accent-ink underline underline-offset-2">شاهد سجل <B>Creekside</B></Link>
          </p>
        </div>
      </section>

      <section id="patterns" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}><B>6</B> أنماط أعيد استخدامها</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {patterns.map(({ I, title }) => (
              <div key={title} className="rounded-card border border-line bg-surface p-6">
                <I aria-hidden className="h-6 w-6 text-accent" />
                <p className="mt-4 font-semibold">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gaveup" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>ما الذي تنازلت عنه</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {gaveUp.map((g) => (
              <li key={g.why} className="rounded-card border border-line bg-surface p-6">
                <p className="font-medium">{g.d}</p>
                <p className="mt-1 text-sm text-sub">{g.why}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="heard" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>ماذا سمعت، وماذا غيّرت</h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {heard.map((h) => (
              <li key={h.href} className="flex flex-col rounded-card border border-line bg-surface p-6">
                <p lang="en" dir="ltr" className="font-sans text-lg leading-snug">&ldquo;{h.q}&rdquo;</p>
                <a href={h.href} target="_blank" rel="noreferrer" lang="en" className="mt-2 font-sans text-xs text-muted underline-offset-2 hover:underline">{h.who}</a>
                <ArrowLeft className="my-4 h-4 w-4 -rotate-90 text-accent" />
                <p className="text-sm font-medium">{h.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="next" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>ما الذي سأختبره بعد ذلك</h2>
          <ul className="mt-8 max-w-2xl space-y-3 rounded-card border border-line bg-surface p-6">
            {unknowns.map((u, i) => (
              <li key={i} className="flex gap-3 text-sm text-sub">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border-2 border-line" /> {u}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t border-line bg-panel/50">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <p className={h2}>شوفه بنفسك</p>
            <p className="mt-3 text-sm text-sub">
              تصميم بسمة منور ·{" "}
              <a href="mailto:bismamunawardigital@gmail.com" className="underline-offset-2 hover:underline">البريد</a>
            </p>
            <p className="mt-1 text-xs text-muted">كل الأشخاص والحسابات والأنظمة البنكية افتراضية.</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-warn-soft px-3 py-1 text-xs font-medium text-warn-ink">
              المراجعة اللغوية من متحدث أصلي قيد الانتظار · <span lang="en" className="font-sans">Native review pending</span>
            </p>
          </div>
          <Link href="/demo/case/" className={primary}>
            افتح العرض التجريبي <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
