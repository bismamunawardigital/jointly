import Link from "next/link";
import { ArrowLeft, Bot, Check, ShieldCheck, UserRound } from "lucide-react";

const flow = [
  { icon: Bot, label: "الوكيل يقترح" },
  { icon: ShieldCheck, label: "القواعد تتحقق" },
  { icon: UserRound, label: "الموظف يعتمد" },
  { icon: Bot, label: "الوكيل ينفّذ" },
  { icon: Check, label: "النظام يتأكد" },
];

const proof = [
  { k: "عمل البنك", v: "1h 34m", n: "بدلاً من 4 إلى 5 أيام" },
  { k: "مراحل الاعتماد", v: "4", n: "واحدة فقط احتاجت تدقيقاً" },
  { k: "ما اعتمده الوكيل بنفسه", v: "0", n: "عن قصد" },
];

const patterns = [
  { t: "المطابقة بالهوية لا بالاسم", b: "الاسم يُكتب بثلاث طرق في ثلاثة أنظمة. الوكيل يطابق برقم الهوية الإماراتية ورقم العميل فقط." },
  { t: "الدليل بجانب القرار", b: "كل سطر في الخطة يعرض النص الأصلي من SVS أو Finacle مع تظليل الكلمات المطابقة." },
  { t: "ما قرأه الوكيل وما لم يقرأه", b: "المرحلة الثالثة تقول بوضوح: قرأتُ مستنداً واحداً من اثنين. لا حاجة لأن تتذكر سارة." },
  { t: "القواعد تقرر، لا الذكاء الاصطناعي", b: "من يحق له التوقيع ومتى يُحسم بمحرّك قواعد ثابت، ويمكن اختباره بأي مبلغ." },
  { t: "أطلق الجاهز، وأمسك الباقي", b: "محمد وخليفة يبدآن اليوم لأن أي اثنين يكفيان. راشد ينضم بعد تجديد هويته." },
  { t: "سجل قرار لكل حالة", b: "لماذا اعتُمدت هذه الحالة؟ القاعدة، والنص، ومن اعتمد، ومتى. جاهز للمدقق." },
];

export default function ArabicCaseStudy() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-canvas font-arabic">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <p className="text-lg font-semibold">
          <bdi dir="ltr">Jointly</bdi>
        </p>
        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex h-9 items-center rounded-lg border border-line px-3 text-sm text-sub hover:text-ink">
            English
          </Link>
          <Link href="/demo/" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-sm font-medium text-onaccent hover:bg-accent-hover">
            افتح العرض التجريبي <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-16 pt-12">
        <p className="text-sm text-muted">دراسة حالة · تصميم وكيل ذكاء اصطناعي يمكن التحقق منه · بسمة منور</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-snug md:text-5xl">مهمة بنكية تأخذ 4 أيام، تنتهي قبل الغداء. والموظف ما زال صاحب القرار.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sub">
          تفعيل الخدمات المصرفية الرقمية لشركة لديها 3 مفوّضين بالتوقيع يأخذ عادةً من 4 إلى 5 أيام من المراسلات. في
          <bdi dir="ltr"> Jointly </bdi>
          يتولى الوكيل النسخ والمطابقة بين 4 أنظمة قديمة، وتراجع سارة ما احتاج إلى تفسير فقط، وتحدد القواعد الثابتة من يحق له التوقيع. الوكيل لا يعتمد عمله بنفسه أبداً.
        </p>
        <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
          {proof.map((x) => (
            <div key={x.k} className="bg-surface px-4 py-3">
              <dt className="text-xs text-muted">{x.k}</dt>
              <dd className="tnum mt-0.5 text-xl font-semibold">
                <bdi dir="ltr">{x.v}</bdi>
              </dd>
              <dd className="text-[11px] text-muted">{x.n}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-[11px] text-muted">أرقام من حالة تجريبية مصطنعة، وليست قياساً من بنك حقيقي.</p>
        <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
          {flow.map(({ icon: Icon, label }, i) => (
            <span key={label} className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5">
                <Icon className="h-3.5 w-3.5 text-accent" /> {label}
              </span>
              {i < flow.length - 1 && <ArrowLeft className="h-3.5 w-3.5 text-muted" />}
            </span>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold">المشكلة ليست صعبة. إنها بطيئة.</h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-sub">
            لا أحد محتار. الفريق ينسخ الأسماء نفسها بين 4 أنظمة، وينتظر بعضه بعضاً، وخطاب واحد فائت قد يغيّر من يحق له التوقيع. مثلاً: تعديل عام 2023 رفع حد خليفة من{" "}
            <bdi dir="ltr">AED 10,000</bdi> إلى{" "}
            <bdi dir="ltr">AED 25,000</bdi>.
          </p>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold">6 أنماط أعيد استخدامها مع أي وكيل</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {patterns.map((p, i) => (
              <div key={p.t} className="rounded-xl border border-line p-5">
                <p className="tnum text-xs text-muted">
                  <bdi dir="ltr">0{i + 1}</bdi>
                </p>
                <p className="mt-2 font-semibold">{p.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-sub">{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-panel/50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold">رسالة العميل، بلهجة إماراتية</h2>
          <div className="mt-6 max-w-md rounded-2xl rounded-tr-sm border border-line bg-surface p-4 text-sm leading-relaxed">
            هلا محمد، حسابك الرقمي لشركة كريك سايد جاهز. تقدر تبدأ الحين، وأي دفعة تحتاج توقيعين بتحتاجك إنت وخليفة لين ما ينضم راشد. أي شي تحتاجه، كلمنا.
          </div>
          <p className="mt-3 text-xs text-muted">الواجهة والقواعد بالفصحى، واللحظات الودية بالإماراتية. يحتاج النص العربي إلى مراجعة متحدث إماراتي قبل النشر.</p>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-10 text-xs text-muted">
        عرض تجريبي لمحفظة أعمال. بيانات مصطنعة، ولا اتصال بأنظمة بنكية حقيقية.
      </footer>
    </div>
  );
}
