import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Ban, Check, FileText, Printer, Search, ShieldCheck, Truck, Undo2, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/Shell";
import { ThemeButton } from "@/components/ThemeToggle";
import { AgentMark, Avatar } from "@/components/ui";
import { Moments } from "@/components/landing/Moments";
import { LangSwitch } from "@/components/landing/LangSwitch";
import { Gloss } from "@/components/landing/Gloss";
import { HeroFrame } from "@/components/landing/HeroFrame";
import { DaysSwimlane } from "@/components/landing/DaysSwimlane";
import { LiveGrid, MandateToggle } from "@/components/landing/LivePreview";
import { statsAr } from "@/content/stats";

const B = ({ children }: { children: React.ReactNode }) => <bdi>{children}</bdi>;

const in30: [string, React.ReactNode][] = [
  ["المشكلة", <>من <B>4</B> إلى <B>5</B> أيام من الإعداد اليدوي، وأرقام سرية يوصلها مندوب</>],
  ["المستخدم", "سارة، مدققة في فريق خدمة العملاء ببنك إماراتي"],
  ["ما بنيته", "وكيل يُحضّر، وقواعد تتحقق، وشاشة تعتمد منها سارة"],
  ["النتيجة", <>أقل من ساعتين، وقرارا إعداد (حالة افتراضية، لم تُقَس)</>],
  ["دوري", <>البحث، وتصميم الخدمة، وتصميم المنتج، ونموذج أولي بنيته مع <B>Devin</B></>],
];

const swim = {
  lanes: ["العميل", "المُدخِل", "المدقق", "الأنظمة", "المندوب"],
  today: "اليوم",
  jointly: "مع Jointly",
  pains: ["4 جولات بين المُدخِل والمدقق", "تعليمات بنص حر في SVS", "أرقام سرية مع المندوب"],
  todayNodes: ["يوقّع النماذج", "يقرأ Finacle|وSVS", "نص حر|في SVS", "يُعدّ|مرحلة", "يراجع|ويُرجع", "طباعة|الرقم السري", "المندوب|يوصّل", "أول دخول|اليوم 5"],
  jointlyNodes: ["يوقّع النماذج", "الوكيل يُحضّر|4 أنظمة", "سارة تتحقق|من أمر واحد", "تعتمد الخطة", "الوكيل يُعدّ|Admin", "تفعيل برسالة|أول دخول"],
  empty: "لا حاجة لخطوة",
  caption: "توضيحي ومبسّط. أُعيد رسمه لهذه الدراسة، وليس خريطة البنك الداخلية.",
};

const inbox: { who: ("mohammed" | "khalifa" | "rashid")[]; line: React.ReactNode; time: string }[] = [
  { who: ["khalifa"], line: <>تأكيد قيمة في خطاب غير واضح · <B>Creekside</B></>, time: "2 د" },
  { who: ["mohammed", "khalifa"], line: <>اعتماد مُدخِل مدفوعات جديد · <B>Saffron Bay</B></>, time: "1 د" },
  { who: ["rashid"], line: <>تفعيل راشد بعد تجديد هويته · <B>Creekside</B></>, time: "30 ث" },
];

const days: { day: string; label: string; icons: LucideIcon[] }[] = [
  { day: "اليوم 1", label: "نموذج ورقي", icons: [FileText] },
  { day: "اليوم 2", label: "مراجعة السجلات", icons: [Search] },
  { day: "اليوم 3", label: "3 إرجاعات", icons: [Undo2, Undo2, Undo2] },
  { day: "اليوم 4", label: "طباعة الأرقام السرية", icons: [Printer] },
  { day: "اليوم 5", label: "مندوب التوصيل", icons: [Truck] },
];

const why: [React.ReactNode, string][] = [
  [<>التفويض نص حر. عبارة &laquo;خليفة منفردًا حتى <B>10,000</B>&raquo; موجودة في خطاب ممسوح ضوئيًا، لا في حقل.</>, "الوكيل يقرأها ويقتبس السطر."],
  [<>الأنظمة لا تتفق. <B>Finacle</B> يقول &laquo;أي اثنين&raquo;، والتفاصيل في <B>SVS</B>.</>, "القواعد تختار المصدر الأحدث والأدق، وتوضح السبب."],
  [<>لا توجد واجهة برمجية للكتابة. <B>Digital Banking Admin</B> شاشة تنتهي مهلتها.</>, "الوكيل يكتب خطوة بخطوة، ثم يقرأ ما كتبه، ويعيد المحاولة بأمان."],
];

const systems: { name: string; tag: string; k: "r" | "w" | "c"; d: string }[] = [
  { name: "Finacle", tag: "قراءة", k: "r", d: "سجلات العملاء ورمز التفويض المختصر" },
  { name: "SVS", tag: "قراءة", k: "r", d: "التفويضات والخطابات الموقّعة، وكثير منها ممسوح ضوئيًا" },
  { name: "EFR", tag: "فحص", k: "c", d: "هل الهوية الإماراتية سارية اليوم؟" },
  { name: "Digital Banking Admin", tag: "كتابة", k: "w", d: "المستخدمون والأدوار والقواعد ومسارات الاعتماد. افتراض: لا توجد واجهة برمجية للكتابة." },
];

const adminRun: [string, React.ReactNode, "warn" | "plain" | "ok"][] = [
  ["10:45", "انتهت المهلة. لم يُكتب شيء ناقص.", "warn"],
  ["10:45", "أُعيدت المحاولة.", "plain"],
  ["10:46", <>قراءة النتيجة: <B>0</B> اختلافات عن الخطة المعتمدة.</>, "ok"],
];

const learned: React.ReactNode[] = [<>مراجعة خطابات <B>SVS</B></>, "إعادة استخدام حسابات الدخول الحالية", <>إعادة فحص <B>EFR</B> قبل التفعيل</>];

const lanes: { icon: React.ReactNode; title: string; items: string[]; never?: boolean }[] = [
  { icon: <AgentMark size={40} className="text-person-agent" />, title: "الوكيل يقوم بـ", items: ["قراءة كل السجلات", "بناء الخطة", "التنفيذ بعد الاعتماد"] },
  { icon: <ShieldCheck className="h-10 w-10 text-accent" />, title: "القواعد تحدد", items: ["من يوقّع", "حتى أي مبلغ", "من يُفعَّل"] },
  { icon: <UserRound className="h-10 w-10 text-ink" />, title: "سارة تعتمد", items: ["القيم غير الواضحة", "اعتماد الخطة", "كل تفعيل"] },
  { icon: <Ban className="h-10 w-10 text-bad" />, title: "ممنوع دائمًا", items: ["اعتماد عمله بنفسه", "إرسال كلمات المرور", "مطابقة الأشخاص بالاسم"], never: true },
];

const patterns: { I: LucideIcon; title: string; why: React.ReactNode }[] = [
  { I: Search, title: "طابِق بالمعرّف، لا بالاسم", why: <>الاسم يُكتب بـ <B>3</B> طرق في الأنظمة. المعرّف لا يتغيّر.</> },
  { I: FileText, title: "لكل ادعاء مصدر", why: "سارة تراجع المصدر، لا كلام الوكيل." },
  { I: AlertTriangle, title: "أظهِر ما لست متأكدًا منه", why: "انتباه سارة يذهب إلى القيمة الوحيدة التي تحتاجه." },
  { I: Check, title: "الاعتماد يبقى مع المحتوى", why: "إذا تغيّرت الخطة، لا ينتقل الاعتماد القديم إليها." },
  { I: ShieldCheck, title: "القواعد مكتوبة في الكود", why: "المُدخلات نفسها تعطي النتيجة نفسها، والتدقيق يستطيع إعادتها." },
  { I: UserRound, title: "فعّل الآمن، وأوقف الباقي", why: <>شخصان يُفعَّلان اليوم، بدل أن ينتظر <B>3</B> بسبب هوية واحدة.</> },
];

const gaveUp: { d: React.ReactNode; why: string }[] = [
  { d: <>أبقيت <B>4</B> اعتمادات، كإجراء واحد</>, why: "ضوابط البنك تتطلب ذلك. نقرات أقل، والسجل نفسه." },
  { d: "بدون درجات ثقة", why: "الجهات الرقابية تسأل أي قاعدة طُبّقت، لا مدى ثقة النموذج." },
  { d: "لسطح المكتب فقط", why: "فريق خدمة العملاء يعمل على أجهزة البنك. الجوال منتج مختلف." },
  { d: "التفعيل الجزئي فرضية", why: "لا يوجد دليل منشور بعد. أول ما يجب اختباره مع بنك." },
];

// Real quotes stay in their original English so nothing is put in someone's mouth.
const heard = [
  { tr: "تبدأ بالضغط على «اعتماد» تلقائيًا، وتتوقف عن قراءة الفروقات.", q: "you start clicking Approve on autopilot and stop reading the diffs.", who: "Agent user, Hacker News", href: "https://news.ycombinator.com/item?id=48830674", d: "النسخ المطابقة تُطوى." },
  { tr: "عرض البنك عليهم درجة ثقة. فأوقفها المنظّم.", q: "The bank showed them a confidence score. The regulator shut it down.", who: "Banking AI lead, LinkedIn", href: "https://www.linkedin.com/posts/johnforrester_a-regulator-asked-a-bank-to-explain-its-ai-activity-7438239662009114624-WaU0", d: "قواعد، لا درجات." },
  { tr: "لم يعرف متى يُصعّد، فتجاوز الأمر بصمت.", q: "didn't know when to escalate, and quietly routed around it.", who: "Ops leader, LinkedIn", href: "https://www.linkedin.com/posts/jeffreytking_our-first-agentic-rollout-failed-in-three-activity-7465363738846638080-lVjb", d: "مكان واحد يقول ما يحتاجك." },
];

const sources = [
  { s: "Vasconcelos et al., CSCW 2023", href: "https://doi.org/10.1145/3579605", f: "التحقق الأسهل يقلل الثقة المفرطة." },
  { s: "Steyvers and Kumar, 2024", href: "https://journals.sagepub.com/doi/full/10.1177/17456916231181102", f: "إظهار درجة اليقين يساعد الناس على الاعتماد على الذكاء الاصطناعي بالقدر الصحيح." },
  { s: "Buçinca et al., CSCW 2021", href: "https://doi.org/10.1145/3449287", f: "فحص صغير إلزامي يقلل الموافقة دون قراءة." },
  { s: "Amershi et al., CHI 2019", href: "https://doi.org/10.1145/3290605.3300233", f: "ادعم التصحيح السريع." },
  { s: "EU AI Act, Article 14", href: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-14", f: "يجب أن يتمكن البشر من إيقاف النظام." },
  { s: "Feng, McDonald and Zhang, 2025", href: "https://arxiv.org/html/2506.12469v1", f: "الاستقلالية قرار تصميمي." },
];

const measures: React.ReactNode[] = [
  "نسبة الاتفاق في وضع المراقبة: كم مرة تطابق خطة الوكيل خطة المُدخِل",
  "نسبة التعديل: كم مرة تغيّر سارة ما قرأه الوكيل",
  "من الطلب إلى أول دخول، لكل حالة",
  <>عمليات كتابة غير معتمدة: يجب أن تبقى <B>0</B></>,
];

const unknowns: React.ReactNode[] = [
  "هل يبني إظهار ما لم يبحث عنه الوكيل الثقة؟",
  <>هل سيسمح البنك بتفعيل <B>2</B> من <B>3</B> مفوّضين؟</>,
  "هل سيقبل فريق الأمن التفعيل الذاتي؟",
  "هل يمكن لمستخدم نظام أن يكون المُدخِل؟",
];

const elsewhere: [string, React.ReactNode][] = [
  ["الحكومة", "تجديد رخصة تجارية عبر سجلات لا تتشارك البيانات."],
  ["الرعاية الصحية", "الموافقة المسبقة للتأمين من خطابات تحويل بنص حر."],
  ["البنوك", <>تعديل التفويضات على حسابات قائمة، بالأنظمة الـ <B>4</B> نفسها.</>],
];

const scene = {
  hold: <span dir="rtl">موقوف مؤقتًا</span>,
  low: <span dir="rtl">من <B>AED 1</B> إلى <B>25,000</B></span>,
  high: <span dir="rtl">أكثر من <B>25,000</B></span>,
  live: <span dir="rtl">مفعّل · <B>2</B> من <B>3</B></span>,
};

const h2 = "text-3xl font-semibold leading-snug md:text-4xl";
const primary = "inline-flex h-11 items-center gap-1.5 rounded-lg bg-accent px-5 text-sm font-medium text-onaccent transition-colors hover:bg-accent-hover";
const frame = "overflow-hidden rounded-card border border-line bg-surface shadow-lg";
const tag = "rounded-full border border-line px-2 py-0.5 text-[11px] text-muted";
const dots = (
  <div className="flex items-center gap-1.5 border-b border-line bg-panel/60 px-4 py-2.5">
    {[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full bg-line-strong" />)}
  </div>
);

const ogTitle = "Jointly · ذكاء اصطناعي وكيلي لعمليات البنوك · بسمة منور";
const ogDesc = "وكيل ذكاء اصطناعي يُعدّ الخدمات المصرفية الرقمية للمفوّضين بالتوقيع المشترك عبر 4 أنظمة قديمة. ويبقى شخص يعتمد كل قرار.";
const ogImage = { url: "/og-ar.png", width: 1200, height: 630, alt: "دراسة حالة Jointly: العنوان على اليمين، وشاشة المراجعة مع جدول الأدلة على اليسار" };

export const metadata: Metadata = {
  title: "Jointly · دراسة حالة في الذكاء الاصطناعي الوكيلي من بسمة منور",
  description: ogDesc,
  openGraph: { title: ogTitle, description: ogDesc, url: "/ar/", siteName: "Jointly", locale: "ar_AE", type: "website", images: [ogImage] },
  twitter: { card: "summary_large_image", title: ogTitle, description: ogDesc, images: [ogImage] },
};

export default function CaseStudyAr() {
  return (
    <div lang="ar" dir="rtl" className="alt min-h-screen bg-canvas font-arabic">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo href="/ar/" />
        <div className="flex items-center gap-2">
          <LangSwitch href="/" lang="en" label="English" className="inline-flex h-9 items-center rounded-lg border border-line px-3 font-sans text-sm text-sub hover:text-ink" />
          <ThemeButton />
        </div>
      </header>

      <section id="hero" className="mx-auto grid max-w-6xl items-start gap-10 px-6 pb-12 pt-2 md:grid-cols-[1fr_1.05fr] md:pt-4">
        <div>
          <p className="text-[13px] text-muted">دراسة حالة · ذكاء اصطناعي وكيلي لعمليات البنوك · بسمة منور، مصممة منتجات</p>
          <h1 className="mt-3 text-[34px] font-semibold leading-[1.3] md:text-[46px]">سارة تُفعِّل <B>3</B> مفوّضين بالتوقيع قبل الغداء. ولا يستطيع الوكيل توقيع أي شيء.</h1>
          <p className="mt-4 max-w-xl text-base text-sub md:text-lg">
            وكيل ذكاء اصطناعي ينجز إعداد العمليات الخلفية للبنك عبر <B>4</B> أنظمة قديمة. ويبقى شخص يعتمد كل قرار يحرّك المال.
          </p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <Gloss term="المفوّضون بالتوقيع المشترك" def="شخصان أو أكثر يجب أن يعتمدوا مدفوعات الشركة معًا." />
            <Gloss term="فريق عمليات الحسابات" def="فريق البنك الذي يُعدّ الخدمات المصرفية الرقمية للشركات يدويًا." />
          </p>
          <dl className="mt-6 grid grid-cols-3 gap-4 md:gap-6">
            {statsAr.map((s) => (
              <div key={s.k}>
                <dd className="tnum font-display text-2xl leading-tight md:text-3xl">{s.v}</dd>
                <dt className="mt-1 text-xs text-muted">{s.k}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <Link href="/demo/case/" className={primary}>
              افتح العرض التجريبي (<B>5</B> دقائق) <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-3 text-[11px] text-muted">حالة افتراضية. لم تُقَس في بنك حقيقي. العرض التجريبي باللغة الإنجليزية.</p>
        </div>
        <HeroFrame callouts={["سحب الوكيل كل السجلات من Finacle وSVS وEFR", "الأخضر = نُسخ كما هو. الكهرماني = اضطر الوكيل لقراءة مستند", "سارة تقرر الكهرماني فقط. ثم تعتمد الخطة."]} />
      </section>

      <section id="in30" aria-label="في 30 ثانية" className="border-y border-line">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-xs font-medium text-muted">في <B>30</B> ثانية</p>
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
        <p className="mt-4 text-sm text-sub">صباح عادي عبر عدة حالات. العرض التجريبي يفتح واحدة منها.</p>
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
                  {d.icons.map((I, i) => <I key={i} aria-hidden className="h-4 w-4 text-sub md:h-6 md:w-6" />)}
                </div>
                <p className="mt-1 text-[11px] leading-snug text-sub md:text-xs">{d.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
            <div className="crawl h-full rounded-full bg-warn max-md:[animation:none]" style={{ transformOrigin: "right" }} />
          </div>
          <p className="mt-8 text-xs font-medium text-muted">مع <B>Jointly</B></p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 w-[8%] min-w-8 overflow-hidden rounded-full bg-line">
              <div className="crawl-fast h-full rounded-full bg-ok" style={{ transformOrigin: "right" }} />
            </div>
            <span className="text-sm font-medium text-ok-ink">ساعة و54 دقيقة</span>
          </div>
        </div>
      </section>

      <section id="days" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>أين تذهب الأيام</h2>
          <p className="mt-2 text-sub"><B>5</B> مسارات، <B>4</B> حلقات إرجاع، ومندوب واحد.</p>
          {/* Time runs left to right here, like the product's timelines. Do not mirror. */}
          <div dir="ltr" className="mt-8">
            <DaysSwimlane t={swim} />
          </div>
        </div>
      </section>

      <section id="why" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>لماذا وكيل، وليس نموذجًا أفضل</h2>
          <ul className="mt-8 space-y-3">
            {why.map(([mess, fix]) => (
              <li key={fix} className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
                <p className="rounded-card border border-line bg-surface px-5 py-4 text-sm text-sub">{mess}</p>
                <ArrowLeft aria-hidden className="mx-auto h-5 w-5 -rotate-90 text-accent md:rotate-0" />
                <p className="rounded-card border border-ok/30 bg-ok-soft px-5 py-4 text-sm font-medium text-ok-ink">{fix}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-sub">روبوت القواعد وحده يتعطل عند أول سطر بنص حر. والنموذج وحده لا يُؤتمن على المال. لذلك النموذج يقرأ، والقواعد تقرر.</p>
        </div>
      </section>

      <section id="legacy" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>كيف يعمل مع <B>4</B> أنظمة قديمة</h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {systems.map((x) => (
              <li key={x.name} className="rounded-card border border-line bg-surface p-5">
                <div className="flex items-center justify-between gap-2">
                  <p lang="en" dir="ltr" className="font-sans font-semibold">{x.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${x.k === "w" ? "bg-accent-soft text-accent-ink" : x.k === "c" ? "bg-ok-soft text-ok-ink" : "bg-panel text-sub"}`}>{x.tag}</span>
                </div>
                <p className="mt-2 text-sm text-sub">{x.d}</p>
              </li>
            ))}
          </ul>
          <ol className="mt-4 flex flex-col gap-2 md:me-auto md:w-fit md:flex-row md:items-center">
            {adminRun.map(([t, l, tone], i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                {i > 0 && <ArrowLeft aria-hidden className="hidden h-4 w-4 text-muted md:block" />}
                <span className={`rounded-full px-3 py-1 ${tone === "warn" ? "bg-warn-soft text-warn-ink" : tone === "ok" ? "bg-ok-soft text-ok-ink" : "bg-panel text-sub"}`}>
                  <bdi className="tnum font-mono text-xs">{t}</bdi> {l}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-muted">أنظمة وبيانات افتراضية، مبنية على إعدادات مصرفية أساسية شائعة.</p>
        </div>
      </section>

      <section id="shadow" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>راقب قبل أن يتصرف</h2>
          <p className="mt-2 max-w-2xl text-sub">قبل أن يتصرف، يعمل الوكيل في وضع المراقبة. يتابع المُدخِلين في خدمة العملاء ويقارن خطته بخطتهم.</p>
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
            <p className="rounded-card border border-line bg-surface px-5 py-4"><span className="tnum font-display text-3xl">12</span> <span className="text-sm text-sub">حالة مُدخِل تمت مراقبتها</span></p>
            <ArrowLeft className="h-5 w-5 -rotate-90 text-accent md:rotate-0" />
            <p className="rounded-card border border-line bg-surface px-5 py-4"><span className="tnum font-display text-3xl">3</span> <span className="text-sm text-sub">خطوات غير موجودة في الإجراءات المكتوبة</span></p>
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
        <div className="mt-8">
          <LiveGrid />
        </div>
        <p className="mt-4 text-sm text-sub"><B>17</B> خلية تطابق سجلات البنك. سارة تراجع قيمة <B>1</B> فقط، وهي التي اضطر الوكيل لقراءتها.</p>
      </section>

      <section id="mandate" className="mx-auto max-w-6xl border-t border-line px-6 py-20">
        <h2 className={h2}>تفويض بنص حر يصبح صورة.</h2>
        <p className="mt-2 text-sub">تستطيع سارة مراجعتها في ثوانٍ.</p>
        <div className="mt-8">
          <MandateToggle before="قبل أن تراجع سارة الخطاب" after="بعد المراجعة" see="شاهدها مباشرة" label="افتح خريطة التوقيع في العرض" />
        </div>
      </section>

      <section id="moments" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}><B>4</B> لحظات</h2>
          <div className="mt-10">
            <Moments
              see="شاهدها مباشرة"
              titles={["يطابق الأشخاص برقم الهوية، لا بالاسم أبدًا", "يكتشف الهوية المنتهية قبل بدء أي عمل", "يقرأ خطابًا غير واضح من 2023، ويطلب من سارة التأكيد", "يفعّل ما هو آمن، ويوقف الباقي"]}
              v={{ id: "هوية تنتهي بـ", expired: "انتهت الهوية في 14 أغسطس", letter: "المبلغ في الخطاب AED", alt: "مسح غير واضح لخطاب تعديل 2023", scene }}
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
            <Link href="/demo/case/?view=record" className="text-accent-ink underline underline-offset-2">شاهد سجل <B>Creekside</B></Link>
          </p>
        </div>
      </section>

      <section id="heard" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>ماذا سمعت، وماذا غيّرت</h2>
          <div className="mt-10 max-w-2xl rounded-card border border-line bg-surface p-6">
            <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">بتصرّف</span>
            <p className="mt-3 text-lg leading-relaxed">إعداد شركة واحدة بمفوّضين مشتركين يأخذ من <B>4</B> إلى <B>5</B> أيام. معظمه قراءة مستندات العميل وتعليمات بنص حر في <B>SVS</B>، ثم الإعداد يدويًا.</p>
            <p className="mt-2 text-xs text-muted">أحد أعضاء فريق خدمة العملاء، بتصرّف من مقابلة</p>
            <ArrowLeft className="my-4 h-4 w-4 -rotate-90 text-accent" />
            <p className="text-sm font-medium">لذلك الوكيل يقرأ، وسارة تراجع فقط ما قرأه.</p>
          </div>
          <p className="mt-10 text-xs font-medium text-muted">إشارات من فرق تستخدم الوكلاء بالفعل</p>
          <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {heard.map((h) => (
              <li key={h.href} className="flex flex-col rounded-card border border-line bg-surface p-6">
                <p lang="en" dir="ltr" className="font-sans text-lg leading-snug">&ldquo;{h.q}&rdquo;</p>
                <p className="mt-2 text-sm text-sub"><span className="text-xs text-muted">ترجمة:</span> {h.tr}</p>
                <a href={h.href} target="_blank" rel="noreferrer" lang="en" className="mt-2 font-sans text-xs text-muted underline-offset-2 hover:underline">{h.who}</a>
                <ArrowLeft className="my-4 h-4 w-4 -rotate-90 text-accent" />
                <p className="text-sm font-medium">{h.d}</p>
              </li>
            ))}
          </ul>
          <details className="mt-6 text-sm">
            <summary className="cursor-pointer text-sub">المصادر</summary>
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer" lang="en" className="font-sans text-accent-ink underline-offset-2 hover:underline">{s.s}</a>
                  <span className="text-muted"> · {s.f}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </section>

      <section id="patterns" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}><B>6</B> أنماط أعيد استخدامها</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {patterns.map(({ I, title, why: w }) => (
              <div key={title} className="rounded-card border border-line bg-surface p-6">
                <I aria-hidden className="h-6 w-6 text-accent" />
                <p className="mt-4 font-semibold">{title}</p>
                <p className="mt-1 text-sm text-sub">{w}</p>
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

      <section id="measure" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>كيف سأعرف أنه ينجح</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {measures.map((m, i) => (
              <li key={i} className="rounded-card border border-line bg-surface p-5">
                <span className={tag}>خطة، لا نتائج</span>
                <p className="mt-3 text-sm font-medium">{m}</p>
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

      <section id="elsewhere" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className={h2}>أين سأستخدم هذا النمط بعد ذلك</h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {elsewhere.map(([k, v]) => (
              <li key={k} className="rounded-card border border-line bg-surface p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{k}</p>
                  <span className={tag}>توضيحي</span>
                </div>
                <p className="mt-2 text-sm text-sub">{v}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sub">الشكل نفسه: اقرأ المستندات غير المرتبة، ودع القواعد تقرر، وشخص يعتمد، ثم اقرأ ما كُتب.</p>
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
