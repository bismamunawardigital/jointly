"use client";

import { setLang, useLang } from "@/lib/lang";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Briefcase, LayoutGrid, Monitor, Compass, RotateCcw, Languages } from "lucide-react";
import { business, checker } from "@/data/seed";
import { useStore } from "@/lib/store";
import { cn } from "./ui";
import { EvidenceDrawer } from "./EvidenceDrawer";
import { Guide, GuideRail } from "./Guide";
import { DensitySwitch, ThemeSwitch } from "./ThemeToggle";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight text-ink", className)}>
      <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden>
        <circle cx="7" cy="7" r="6" fill="none" stroke="rgb(var(--brand))" strokeWidth="2" />
        <circle cx="13" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      Jointly
    </span>
  );
}

const nav = [
  { href: "/demo/", label: "Queue", icon: LayoutGrid },
  { href: "/demo/case/", label: business.name, icon: Briefcase },
  { href: "/", label: "Case study", icon: BookOpen },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { dispatch, setTab, state } = useStore();
  const needsSara = state.phase === "in_review" || state.phase === "re_review";
  const lang = useLang();
  const ar = lang === "ar";
  useEffect(() => {
    document.documentElement.dir = ar ? "rtl" : "ltr";
    document.documentElement.lang = ar ? "ar" : "en";
    return () => { document.documentElement.dir = "ltr"; document.documentElement.lang = "en"; };
  }, [ar]);
  const L: Record<string, string> = ar ? { Queue: "قائمة العمل", "Case study": "دراسة الحالة" } : {};
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-8 text-center lg:hidden">
        <Monitor className="h-6 w-6 text-muted" />
        <Logo />
        <p className="max-w-xs text-sm text-sub">Jointly is a desktop workbench for operations teams. Open it on a laptop to try the demo.</p>
        <Link href="/" className="text-sm font-medium text-accent">
          Read the case study
        </Link>
      </div>
      <div className="hidden h-screen lg:flex">
        <aside className="flex w-[232px] shrink-0 flex-col border-e border-line bg-panel/70">
          <div className="px-5 pb-6 pt-5">
            <Logo />
            <p className="mt-1 text-xs text-muted">{ar ? "منصة العمليات" : "Operations workbench"}</p>
          </div>
          <nav className="flex flex-col gap-0.5 px-3">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = href === "/" ? false : path === href || path === href.slice(0, -1);
              return (
                <Link
                  key={href}
                  href={ar && href === "/" ? "/ar/" : href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-sub transition-colors duration-150 hover:bg-surface hover:text-ink",
                    active && "bg-surface font-medium text-ink shadow-sm ring-1 ring-line",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{L[label] ?? label}</span>
                  {href === "/demo/" && needsSara && <span aria-label="1 case needs you" className="tick-in ms-auto rounded-full bg-warn-soft px-1.5 text-xs font-medium text-warn-ink">1</span>}
                </Link>
              );
            })}
          </nav>
          <GuideRail />
          <div className="mt-auto space-y-3 border-t border-line px-4 py-4">
            <button onClick={() => window.dispatchEvent(new CustomEvent("jointly:intro"))} className="flex items-center gap-2 text-sm text-sub hover:text-ink">
              <Compass className="h-3.5 w-3.5" /> {ar ? "ابدأ الدليل من جديد" : "Restart guide"}
            </button>
            <button type="button" onClick={() => setLang(ar ? "en" : "ar")} className="flex items-center gap-2 text-sm text-sub hover:text-ink"><Languages className="h-3.5 w-3.5" /> {ar ? "English" : "العربية"}</button>
            <ThemeSwitch />
            <DensitySwitch />
            <button
              onClick={() => {
                dispatch({ type: "reset" });
                setTab("run");
              }}
              className="flex items-center gap-2 text-sm text-sub hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" /> {ar ? "إعادة ضبط العرض" : "Reset demo"}
            </button>
            <div className="flex items-center gap-2.5 pt-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface text-xs font-semibold shadow-sm ring-1 ring-line">{checker.initials}</span>
              <div className="leading-tight">
                <p className="text-sm font-medium">{checker.name}</p>
                <p className="text-xs text-muted">{checker.role}</p>
              </div>
            </div>
            {ar ? (
              <p className="text-xs leading-snug text-muted">عرض للأعمال ببيانات مصطنعة. شاشات المنتج بالإنجليزية مثل أنظمة البنك. المراجعة اللغوية من متحدث أصلي قيد الانتظار · <span lang="en">Native review pending</span></p>
            ) : (
              <p className="text-xs leading-snug text-muted">Portfolio demo. Synthetic data, no real bank systems.</p>
            )}
          </div>
        </aside>
        <main dir="ltr" lang="en" className="min-w-0 flex-1 overflow-hidden">{children}</main>
      </div>
      <EvidenceDrawer />
      <Guide />
    </>
  );
}
