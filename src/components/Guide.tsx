"use client";

import { useLang } from "@/lib/lang";
import { track } from "@/lib/track";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { hasEvent, useStore } from "@/lib/store";
import { PORTFOLIO_URL } from "@/content/links";
import { Avatar, Button, cn } from "./ui";

const KEY = "jointly-guide";
const prepEn = ["Read the forms", "Checked 3 Emirates IDs", "Matched them in Finacle", "Read the mandate in SVS", "Built the setup plan", "Tested it against the rules"];
const tasksEn = [
  { label: "Check the value the agent couldn't read on the blurry letter.", hint: "A 2023 letter may raise Khalifa's solo limit, but the scan is blurry, so the agent won't guess. Check its reading against the scan, and press Enter if it matches.", sel: "#scan-value" },
  { label: "Sign off the plan once everything checks out.", hint: "Every stage of the setup now passes the bank's rules. Read what sign-off will do, and then sign it off.", sel: '[aria-label="Decision bar"] .bg-accent' },
  { label: "Release the 2 partners who are ready to go live.", hint: "The setup is done and has been read back, and Mohammed and Khalifa can approve payments together. Release them so they can log in today.", sel: '[aria-label="Decision bar"] .bg-accent' },
  { label: "Skip ahead to when Rashid renews his ID, and then release him too.", hint: "Rashid's Emirates ID has expired, so he's still waiting. Skip ahead to when he renews it, and then release him.", sel: "[data-renew], [aria-label=\"Decision bar\"] .bg-accent" },
];
const bonusEn = { label: "Disagree with the agent and see what it does.", hint: "Imagine you think the letter says 10,000. Type 10,000 and see what the agent does.", sel: "#scan-value" };
const decisionsEn: Record<string, [string, string]> = {
  noconf: ["Rejected: a confidence %", "Studies show miscalibrated scores raise trust in wrong answers. Check states instead."],
  notimer: ["Rejected: auto-proceed timers", "Fine for drafts, never for writes to a bank system."],
  match: ["Why the agent matched people by Emirates ID", "Mohammed's name is spelled 3 different ways across the bank's systems, so matching by name would have created duplicate users. The agent matches on the Emirates ID instead, and it reused the login he already had."],
  grey: ["Why the agent's reading is in grey", "Sara only needs to type when she disagrees, which saves her time. A supervisor re-checks a sample of accepted readings, because people tend to accept what they see first."],
  two: ["Why there were only 2 decisions", "The rules passed every stage that was an exact copy of the bank's records, so your attention went only to the value the agent had to read."],
  back: ["Why it read everything back", "Old bank systems sometimes time out, so the agent retried and then compared every change with what you approved. Nobody goes live on a half-written setup."],
  first: ["Why 2 partners went live first", "The rules confirmed that Mohammed and Khalifa can approve payments together, so they don't have to wait for Rashid's ID."],
  record: ["Why there's a record", "Every value has a source and an approver, so an auditor can replay this case step by step."],
  wait: ["Bonus, why it waited", "You disagreed with the agent, so it stopped and asked the branch for a clean copy, because it never overrides a person."],
};
const phoneEn = ["Khalifa receives an SMS with a secure link.", "He scans his Emirates ID and his face to prove it's him.", "He sets his own password, which the bank never sees.", "He's logged in, and Creekside's account is ready for him."];
const skipsEn: Record<string, string> = { executed: "1 hour later", partially_live: "Later that afternoon", rashid_ready: "2 days later" };
const showsEn: [string, string][] = [
  ["Who decides", "The agent prepares the work, and the rules and people make the decisions."],
  ["Evidence", "Every value shows where it came from and which rule checked it."],
  ["Failure", "A blurry scan, an expired ID and a system timeout each have a safe way through."],
  ["Audit", "Every step ends up in a record that an auditor can read."],
];

const UI_EN = {
  designs: "Design decisions",
  bonusTask: "Bonus task",
  allDone: "All 4 steps done",
  stepOf: (step: number) => `Step ${step + 1} of 4 · About ${Math.max(1, 3 - step)} minute${3 - step === 1 ? "" : "s"} left`,
  intro1: "You're Sara, and you work in the bank's account operations team.",
  intro2: '{tx.intro2}',
  intro3: '{tx.intro3}',
  intro4: '{tx.intro4}',
  start: 'Start the guided demo (3 min)',
  watch: 'Watch it play (90 s)',
  explore: 'Explore on my own',
  skipIntro: 'Skip intro',
  finale: '{tx.finale}',
  showsHead: 'What this shows about how I design',
  portfolio: "Back to Bisma's portfolio",
  backCase: 'Back to the case study',
  restart: 'Restart',
  letMe: 'Let me try',
  watching: 'Watching it play',
  customer: 'What the customer saw',
};
const UI_AR: typeof UI_EN = {
  designs: "قرارات التصميم",
  bonusTask: "مهمة إضافية",
  allDone: "اكتملت الخطوات الأربع",
  stepOf: (step: number) => `الخطوة ${step + 1} من 4 · حوالي ${Math.max(1, 3 - step)} ${3 - step === 1 ? "دقيقة" : "دقائق"} متبقية`,
  intro1: 'أنتِ سارة، وتعملين في فريق العمليات في البنك.',
  intro2: 'لدى Creekside General Trading ثلاثة شركاء يوقّعون المدفوعات معًا، ومهمتك أن تُدخلي الثلاثة إلى الخدمات المصرفية عبر الإنترنت.',
  intro3: 'أنجز الوكيل التحضير، والآن يحتاجك لتراجعي عمله وتعتمدي الإعداد.',
  intro4: 'انتبهي للحظة التي يطلب فيها الوكيل المساعدة بدل أن يخمّن.',
  start: 'ابدئي الجولة الموجّهة (3 دقائق)',
  watch: 'شاهديها تعمل (90 ثانية)',
  explore: 'استكشفي بنفسك',
  skipIntro: 'تخطّي المقدمة',
  finale: 'أصبحت Creekside جاهزة. بدأ الشركاء الثلاثة العمل خلال ساعة و54 دقيقة، بقرارين منك ولا قرار من الوكيل.',
  showsHead: 'ما يُظهره هذا عن طريقتي في التصميم',
  portfolio: 'العودة إلى أعمال بسمة',
  backCase: 'العودة إلى دراسة الحالة',
  restart: 'من جديد',
  letMe: 'دعيني أجرّب',
  watching: 'العرض يعمل',
  customer: 'ما رآه العميل',
};

const tasksArText = [
  { label: "تحقّقي من القيمة التي لم يستطع الوكيل قراءتها في الخطاب غير الواضح.", hint: "قد يرفع خطاب 2023 حدّ خليفة المنفرد، لكن المسح غير واضح، لذلك لا يخمّن الوكيل. قارني قراءته بالمسح، واضغطي Enter إذا تطابقت." },
  { label: "اعتمدي الخطة بعد أن يتأكد كل شيء.", hint: "كل مراحل الإعداد تجتاز الآن قواعد البنك. اقرئي ما سيفعله الاعتماد، ثم اعتمديه." },
  { label: "فعّلي الشريكين الجاهزين للعمل.", hint: "اكتمل الإعداد وأُعيدت قراءته من النظام، ويستطيع محمد وخليفة اعتماد المدفوعات معًا. فعّليهما ليدخلا اليوم." },
  { label: "انتقلي إلى وقت تجديد راشد لهويته، ثم فعّليه أيضًا.", hint: "انتهت صلاحية الهوية الإماراتية لراشد، لذلك ما زال ينتظر. انتقلي إلى وقت تجديدها، ثم فعّليه." },
];
const copy = {
  en: { tasks: tasksEn, bonus: bonusEn, decisions: decisionsEn, phone: phoneEn, shows: showsEn, prep: prepEn, skips: skipsEn, tx: UI_EN },
  ar: {
    tasks: tasksEn.map((t, i) => ({ ...t, ...tasksArText[i] })),
    bonus: { ...bonusEn, label: "اختلفي مع الوكيل وشاهدي ما يفعل.", hint: "تخيّلي أنك ترين أن الخطاب يقول 10,000. اكتبي 10,000 وشاهدي ما يفعل الوكيل." },
    decisions: {
      noconf: ["مرفوض: نسبة الثقة", "تُظهر الدراسات أن النسب غير المعايرة تزيد الثقة في الإجابات الخاطئة. لذلك نعرض حالات التحقق بدلًا منها."],
      notimer: ["مرفوض: المتابعة التلقائية بعد مهلة", "مقبولة للمسودات، لكن ليس للكتابة في نظام بنكي."],
      match: ["لماذا طابق الوكيل الأشخاص برقم الهوية الإماراتية", "اسم محمد مكتوب بثلاث طرق في أنظمة البنك، والمطابقة بالاسم كانت ستنشئ مستخدمين مكررين. لذلك يطابق الوكيل برقم الهوية، واستخدم حساب الدخول الذي لديه."],
      grey: ["لماذا قراءة الوكيل باللون الرمادي", "لا تكتب سارة إلا إذا اختلفت معه، وهذا يوفّر وقتها. ويراجع مشرف عينة من القراءات المقبولة، لأن الناس يميلون إلى قبول ما يرونه أولًا."],
      two: ["لماذا كان هناك قراران فقط", "اجتازت القواعد كل مرحلة منسوخة حرفيًا من سجلات البنك، فذهب انتباهك فقط إلى القيمة التي احتاج الوكيل إلى قراءتها."],
      back: ["لماذا أعاد قراءة كل شيء", "الأنظمة البنكية القديمة تتوقف أحيانًا، لذلك أعاد الوكيل المحاولة ثم قارن كل تغيير بما اعتمدتِه. لا أحد يبدأ العمل على إعداد نصف مكتوب."],
      first: ["لماذا بدأ شريكان أولًا", "أكدت القواعد أن محمد وخليفة يستطيعان اعتماد المدفوعات معًا، فلا حاجة لانتظار هوية راشد."],
      record: ["لماذا يوجد سجل", "لكل قيمة مصدر ومعتمِد، فيستطيع المدقق إعادة تتبع هذه الحالة خطوة بخطوة."],
      wait: ["إضافي: لماذا انتظر", "اختلفتِ مع الوكيل، فتوقف وطلب من الفرع نسخة واضحة، لأنه لا يتجاوز قرار إنسان أبدًا."],
    } as typeof decisionsEn,
    phone: ["تصل إلى خليفة رسالة نصية فيها رابط آمن.", "يمسح هويته الإماراتية ووجهه ليثبت أنه هو.", "يختار كلمة المرور بنفسه، والبنك لا يراها.", "دخل الآن، وحساب Creekside جاهز له."],
    shows: [["من يقرر", "الوكيل يجهّز العمل، والقواعد والأشخاص يتخذون القرارات."], ["الدليل", "كل قيمة تُظهر مصدرها والقاعدة التي تحققت منها."], ["الفشل", "للمسح غير الواضح والهوية المنتهية وتوقف النظام طريق آمن لكل منها."], ["التدقيق", "كل خطوة تنتهي في سجل يستطيع المدقق قراءته."]] as [string, string][],
    prep: ["قرأ النماذج", "تحقق من 3 هويات إماراتية", "طابقهم في Finacle", "قرأ التفويض في SVS", "بنى خطة الإعداد", "اختبرها مقابل القواعد"],
    skips: { executed: "بعد ساعة", partially_live: "لاحقًا في اليوم نفسه", rashid_ready: "بعد يومين" } as typeof skipsEn,
    tx: UI_AR,
  },
};

type Mode = "off" | "intro" | "guide" | "auto" | "bonus";
const emit = (name: string, detail?: unknown) => window.dispatchEvent(new CustomEvent(name, { detail }));

function useGuide() {
  const { state } = useStore();
  const logHas = (id: string) => state.log.some((e) => e.id === id);
  const done = [state.confirmed !== undefined, logHas("signoff"), logHas("release"), logHas("release-rashid")];
  const step = done.findIndex((d) => !d);
  return { done, step: step === -1 ? 4 : step };
}

export function GuideRail() {
  const { tasks, bonus, decisions, tx } = copy[useLang()];
  const [mode, setMode] = useState<Mode>("off");
  const [list, setList] = useState<string[]>([]);
  const [phoneSeen, setPhoneSeen] = useState(false);
  const { done, step } = useGuide();
  useEffect(() => {
    document.title = step < 4 ? `Step ${step + 1} of 4 · Jointly` : "Done · Jointly";
    if (step > 0) track(step === 4 ? "finale" : "guide_task", { step });
  }, [step]);
  const { dispatch, setTab } = useStore();
  useEffect(() => {
    const m = (e: Event) => setMode((e as CustomEvent<Mode>).detail);
    const d = (e: Event) => setList((l) => (l.includes((e as CustomEvent<string>).detail) ? l : [...l, (e as CustomEvent<string>).detail]));
    const ph = () => setPhoneSeen(true);
    window.addEventListener("jointly:guide-mode", m);
    window.addEventListener("jointly:decision", d);
    window.addEventListener("jointly:phone-done", ph);
    return () => {
      window.removeEventListener("jointly:guide-mode", m);
      window.removeEventListener("jointly:decision", d);
      window.removeEventListener("jointly:phone-done", ph);
    };
  }, []);
  if (mode === "off" || mode === "intro") return null;
  const items = mode === "bonus" ? [bonus] : tasks;
  const cur = mode === "bonus" ? 0 : step;
  return (
    <div className="mx-3 mt-4 space-y-3 rounded-card border border-line bg-surface p-3 text-xs" aria-label="Guide">
      <p className="font-medium text-muted">{mode === "bonus" ? tx.bonusTask : step < 4 ? tx.stepOf(step) : tx.allDone}</p>
      <ol className="space-y-2">
        {items.map((t, i) => {
          const ok = mode !== "bonus" && done[i];
          return (
            <li key={t.label}>
              <button type="button" onClick={() => emit("jointly:spot-go")} className={cn("flex w-full gap-2 text-left", i === cur ? "font-semibold text-ink" : "text-sub")}>
                <span className={cn("mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full", ok ? "tick-in bg-ok text-onaccent" : i === cur ? "slide-in-end bg-brand" : "border border-line")}>{ok && <Check className="h-2.5 w-2.5" strokeWidth={3} />}</span>
                {t.label}
              </button>
            </li>
          );
        })}
      </ol>
      {step === 4 && mode !== "bonus" && (
        <button type="button" className="text-left text-accent-ink hover:underline" onClick={() => { dispatch({ type: "reset" }); setTab("review"); emit("jointly:guide-mode", "bonus"); }}>
          Bonus: {bonus.label}
        </button>
      )}
      {list.length > 0 && (
        <details>
          <summary className="cursor-pointer text-sub">{tx.designs} ({list.length})</summary>
          <ul className="mt-2 space-y-2">
            {list.map((k) => (
              <li key={k}>
                <p className="font-medium text-ink">{decisions[k][0]}</p>
                <p className="text-sub">{decisions[k][1]}</p>
              </li>
            ))}
          </ul>
        </details>
      )}
      {phoneSeen && <button type="button" className="text-accent-ink hover:underline" onClick={() => emit("jointly:phone")}>{tx.customer}</button>}
      <div className="flex items-center justify-between border-t border-line pt-2">
        <Link href="/" className="text-sub hover:text-ink">{tx.backCase}</Link>
        <button type="button" className="text-sub hover:text-ink" onClick={() => { dispatch({ type: "reset" }); setTab("review"); emit("jointly:guide-mode", "guide"); }}>{tx.restart}</button>
      </div>
    </div>
  );
}

export function Guide() {
  const { tasks, bonus, phone, skips, tx } = copy[useLang()];
  const { state, dispatch, hydrated, setTab } = useStore();
  const path = usePathname();
  const [mode, setModeRaw] = useState<Mode>("off");
  const [, setCard] = useState<string | null>(null);
  const [skip, setSkip] = useState<string | null>(null);
  const [phoneAt, setPhoneAt] = useState(-1);
  const [box, setBox] = useState<{ top: number; left: number; away: boolean } | null>(null);
  const shown = useRef(new Set<string>());
  const { step } = useGuide();
  const setMode = useCallback((m: Mode) => {
    setModeRaw(m);
    emit("jointly:guide-mode", m);
    if (m !== "intro") localStorage.setItem(KEY, "seen");
  }, []);
  const onCase = path.startsWith("/demo/case");
  useEffect(() => {
    if (!hydrated || !onCase) return;
    const deep = /[?&](moment|view|tab)=/.test(window.location.search);
    const fromHero = sessionStorage.getItem("jointly-from-hero");
    sessionStorage.removeItem("jointly-from-hero");
    if (deep) localStorage.setItem(KEY, "seen");
    else if (fromHero || !localStorage.getItem(KEY)) setMode("intro");
  }, [hydrated, onCase, setMode]);
  useEffect(() => {
    const m = (e: Event) => setModeRaw((e as CustomEvent<Mode>).detail);
    const intro = () => setMode("intro");
    const ph = () => setPhoneAt(0);
    window.addEventListener("jointly:guide-mode", m);
    window.addEventListener("jointly:intro", intro);
    window.addEventListener("jointly:phone", ph);
    const k = (e: KeyboardEvent) => e.key === "Escape" && setModeRaw((cur) => (cur === "intro" ? (emit("jointly:guide-mode", "off"), localStorage.setItem(KEY, "seen"), "off") : cur));
    window.addEventListener("keydown", k);
    return () => {
      window.removeEventListener("jointly:guide-mode", m);
      window.removeEventListener("jointly:intro", intro);
      window.removeEventListener("jointly:phone", ph);
      window.removeEventListener("keydown", k);
    };
  }, [setMode]);
  const active = mode === "guide" || mode === "auto" || mode === "bonus";
  const decide = useCallback((k: string) => {
    if (shown.current.has(k)) return;
    shown.current.add(k);
    emit("jointly:decision", k);
    setCard(k);
    setTimeout(() => setCard((c) => (c === k ? null : c)), 8000);
  }, []);
  useEffect(() => {
    if (!active) return;
    if (mode === "bonus") {
      if (state.copy === "requested" || state.mine) decide("wait");
      return;
    }
    if (step === 0) decide("match");
    if (state.confirmed !== undefined) { decide("grey"); decide("noconf"); }
    if (state.log.some((e) => e.id === "signoff")) decide("two");
    if (hasEvent(state, "ex-readback")) { decide("back"); decide("notimer"); }
    if (state.log.some((e) => e.id === "release")) decide("first");
    if (state.phase === "live") decide("record");
  }, [active, mode, step, state, decide]);
  const prevPhase = useRef(state.phase);
  useEffect(() => {
    if (prevPhase.current === state.phase) return;
    prevPhase.current = state.phase;
    if (!skips[state.phase]) return;
    setSkip(skips[state.phase]);
    const t = setTimeout(() => setSkip(null), 3000);
    if (state.phase === "partially_live" && !shown.current.has("phone")) {
      shown.current.add("phone");
      setTimeout(() => setPhoneAt(0), 1500);
    }
    return () => clearTimeout(t);
  }, [state.phase, active, skips]);
  useEffect(() => {
    if (phoneAt < 0) return;
    if (phoneAt >= phone.length) {
      setPhoneAt(-1);
      emit("jointly:phone-done");
      return;
    }
    const t = setTimeout(() => setPhoneAt((n) => n + 1), 2000);
    return () => clearTimeout(t);
  }, [phoneAt, phone.length]);
  useEffect(() => {
    if (mode !== "auto" || state.queue.length || phoneAt >= 0) return;
    const act = () => {
      if (state.phase === "in_review" && state.confirmed === undefined) dispatch({ type: "confirm", value: 25000 });
      else if (state.phase === "re_review") dispatch({ type: "signoff" });
      else if (state.phase === "executed") dispatch({ type: "release" });
      else if (state.phase === "partially_live") dispatch({ type: "renew" });
      else if (state.phase === "rashid_ready") dispatch({ type: "releaseRashid" });
    };
    const t = setTimeout(act, 3500);
    return () => clearTimeout(t);
  }, [mode, state.phase, state.queue.length, state.confirmed, phoneAt, dispatch]);
  const working = state.queue.length > 0;
  const task = mode === "bonus" ? bonus : tasks[step];
  const sel = !working && task && step < 4 ? task.sel : null;
  useEffect(() => {
    document.querySelectorAll(".guide-spot").forEach((e) => e.classList.remove("guide-spot"));
    if (!active || !sel) return setBox(null);
    const place = () => {
      document.querySelectorAll(".guide-spot").forEach((e) => e.classList.remove("guide-spot"));
      const t = document.querySelector<HTMLElement>(sel);
      if (!t) return setBox(null);
      t.classList.add("guide-spot");
      const r = t.getBoundingClientRect();
      const W = 360, H = 120, M = 12;
      const away = r.bottom < 0 || r.top > window.innerHeight;
      const left = Math.min(Math.max(M, r.left), window.innerWidth - W - M);
      const top = r.top - H - M > 60 ? r.top - H - M : Math.min(r.bottom + M, window.innerHeight - H - 80);
      setBox({ top, left, away });
    };
    place();
    const id = window.setInterval(place, 400);
    const go = () => document.querySelector<HTMLElement>(sel)?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.addEventListener("jointly:spot-go", go);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("jointly:spot-go", go);
      document.querySelectorAll(".guide-spot").forEach((e) => e.classList.remove("guide-spot"));
    };
  }, [active, sel, state.phase, setTab]);
  if (!hydrated || !onCase) return null;
  const wait = state.queueGroup === "revise" ? "The agent is updating the plan with your value, which takes a few seconds." : state.queueGroup === "execute" ? (state.queue.length <= 2 ? "The agent is reading back every change to check that it matches what you approved." : "The agent is setting everything up in Digital Banking Admin, so there's nothing for you to do yet.") : working ? "The agent is reading back every change to check that it matches what you approved." : null;
  return (
    <>
      {mode === "intro" && <Intro onStart={() => { setMode("guide"); setTab("review"); }} onAuto={() => { dispatch({ type: "reset" }); setTab("review"); setMode("auto"); }} onExplore={() => setMode("off")} />}
      {skip && <div role="status" className="fixed left-1/2 top-24 z-50 -translate-x-1/2 animate-enter rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-canvas shadow-lg">{skip}</div>}
      {active && (wait || (box && task)) && state.phase !== "live" && (
        <div role="status" className="fixed z-40 w-[360px] rounded-card border border-brand/40 bg-surface p-4 text-sm shadow-lg" style={wait || !box ? { left: 260, bottom: 84 } : { top: box.top, left: box.left }}>
          <p className="text-sub">{wait ?? task!.hint}</p>
          {mode === "auto" && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted">{tx.watching}</span>
              <Button size="sm" onClick={() => setMode("guide")}>{tx.letMe}</Button>
            </div>
          )}
        </div>
      )}
      {active && box?.away && !wait && (
        <button type="button" onClick={() => emit("jointly:spot-go")} className="fixed bottom-24 end-8 z-40 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium shadow-lg">Take me back</button>
      )}
      {phoneAt >= 0 && phoneAt < phone.length && (
        <div className="fixed end-8 top-24 z-50 w-[240px] animate-enter rounded-[28px] border-4 border-ink bg-surface p-4 shadow-xl" role="status" aria-label="What the customer saw">
          <div className="flex h-[300px] flex-col items-center justify-center gap-3 rounded-2xl bg-canvas p-4 text-center">
            <Avatar id="khalifa" size={48} />
            <p className="text-sm font-medium">{phone[phoneAt]}</p>
            <p className="text-xs text-muted">{phoneAt + 1} of {phone.length}</p>
          </div>
          <button type="button" className="mt-2 w-full text-center text-xs text-sub hover:text-ink" onClick={() => setPhoneAt(phone.length)}>Skip</button>
        </div>
      )}
      {active && mode !== "bonus" && state.phase === "live" && <Finale onBonus={() => { dispatch({ type: "reset" }); setTab("review"); setMode("bonus"); }} />}
    </>
  );
}

function Intro({ onStart, onAuto, onExplore }: { onStart: () => void; onAuto: () => void; onExplore: () => void }) {
  const { prep, tx } = copy[useLang()];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Scenario intro">
      <div className="relative w-[560px] max-w-[92vw] rounded-card border border-line bg-surface p-7 shadow-xl">
        <button type="button" onClick={onExplore} className="absolute end-5 top-5 text-xs text-sub hover:text-ink">{tx.skipIntro}</button>
        <div className="intro-beat flex items-center gap-3" style={{ animationDelay: "0s" }}>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-canvas">SM</span>
          <p className="text-base font-medium">{tx.intro1}</p>
        </div>
        <div className="intro-beat mt-5 rounded-lg border border-line bg-canvas p-4" style={{ animationDelay: "1.5s" }}>
          <p className="text-sm font-semibold">Creekside General Trading LLC</p>
          <div className="mt-2 flex gap-2">
            {(["mohammed", "khalifa", "rashid"] as const).map((p) => <Avatar key={p} id={p} size={32} />)}
          </div>
          <p className="mt-3 text-sm text-sub">Creekside General Trading has 3 partners who sign payments together, and your job is to get all 3 of them onto online banking.</p>
        </div>
        <div className="intro-beat mt-5" style={{ animationDelay: "3s" }}>
          <ul className="grid grid-cols-2 gap-1.5 text-xs text-sub">
            {prep.map((x) => (
              <li key={x} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-ok" strokeWidth={3} /> {x}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm">The agent has already done the preparation, and now it needs you to check its work and sign off the setup.</p>
          <p className="mt-1 text-xs text-muted">Watch for the moment the agent asks for help instead of guessing.</p>
        </div>
        <div className="intro-beat mt-6 flex flex-wrap items-center gap-2" style={{ animationDelay: "5s" }}>
          <Button variant="primary" onClick={onStart}>{tx.start}</Button>
          <Button onClick={() => { track("watch_play"); onAuto(); }}>{tx.watch}</Button>
          <Button variant="ghost" onClick={onExplore}>{tx.explore}</Button>
        </div>
      </div>
    </div>
  );
}

function Finale({ onBonus }: { onBonus: () => void }) {
  const { shows, tx } = copy[useLang()];
  return (
    <div className="fixed inset-x-0 bottom-0 top-0 z-40 flex items-center justify-center bg-ink/30 lg:start-[232px]" role="dialog" aria-label="Finale">
      <div className="w-[720px] max-w-[92vw] animate-enter rounded-card border border-line bg-surface p-8 shadow-xl">
        <p className="text-lg font-semibold">Creekside is live. All 3 partners went live in 1 hour 54 minutes, with 2 decisions from you and none from the agent.</p>
        <p className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">{tx.showsHead}</p>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          {shows.map(([k, v]) => (
            <div key={k} className="rounded-lg border border-line bg-canvas p-3">
              <dt className="text-sm font-semibold">{k}</dt>
              <dd className="mt-1 text-sm text-sub">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href="/?back=1#roles" onClick={() => track("case_study_from_finale")} className="inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-medium text-onaccent hover:bg-accent-hover">Read the case study</Link>
          <Button onClick={onBonus}><RotateCcw className="h-3.5 w-3.5" /> Try disagreeing with the agent</Button>
          <a href={PORTFOLIO_URL} onClick={() => track("portfolio_click", { from: "finale" })} className="ms-auto text-sm text-accent-ink hover:underline">{tx.portfolio}</a>
        </div>
      </div>
    </div>
  );
}
