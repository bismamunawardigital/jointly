"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Briefcase, LayoutGrid, Monitor, RotateCcw } from "lucide-react";
import { business, checker } from "@/data/seed";
import { useStore } from "@/lib/store";
import { cn } from "./ui";
import { EvidenceDrawer } from "./EvidenceDrawer";
import { Tour } from "./Tour";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight text-ink", className)}>
      <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden>
        <circle cx="7" cy="7" r="6" fill="none" stroke="#1E5BD8" strokeWidth="2" />
        <circle cx="13" cy="7" r="6" fill="none" stroke="#17181C" strokeWidth="2" />
      </svg>
      Jointly
    </span>
  );
}

const nav = [
  { href: "/demo/", label: "Command center", icon: LayoutGrid },
  { href: "/demo/case/", label: business.name, icon: Briefcase },
  { href: "/", label: "Case study", icon: BookOpen },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { state, dispatch, setTab } = useStore();
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
        <aside className="flex w-[232px] shrink-0 flex-col border-r border-line bg-panel/60">
          <div className="px-5 pb-6 pt-5">
            <Logo />
            <p className="mt-1 text-xs text-muted">joint signatories live in hours</p>
          </div>
          <nav className="flex flex-col gap-0.5 px-3">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = href === "/" ? false : path === href || path === href.slice(0, -1);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-sub transition-colors duration-150 hover:bg-white hover:text-ink",
                    active && "bg-white font-medium text-ink shadow-[0_0_0_1px_#E6E7EA]",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto space-y-3 border-t border-line px-4 py-4">
            <label className="flex cursor-pointer items-center justify-between text-sm text-sub">
              Guided tour
              <button
                role="switch"
                aria-checked={state.tourOn}
                onClick={() => dispatch({ type: "tour", on: !state.tourOn })}
                className={cn("relative h-5 w-9 rounded-full transition-colors duration-150", state.tourOn ? "bg-accent" : "bg-line")}
              >
                <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200 ease-out", state.tourOn ? "translate-x-[18px]" : "translate-x-0.5")} />
              </button>
            </label>
            <button
              onClick={() => {
                dispatch({ type: "reset" });
                setTab("run");
              }}
              className="flex items-center gap-2 text-sm text-sub hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset demo
            </button>
            <div className="flex items-center gap-2.5 pt-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-semibold shadow-[0_0_0_1px_#E6E7EA]">{checker.initials}</span>
              <div className="leading-tight">
                <p className="text-sm font-medium">{checker.name}</p>
                <p className="text-xs text-muted">{checker.role}</p>
              </div>
            </div>
            <p className="text-[11px] leading-snug text-muted">Portfolio demo. Synthetic data, no real bank systems.</p>
          </div>
        </aside>
        <main className="min-w-0 flex-1 overflow-hidden">{children}</main>
      </div>
      <EvidenceDrawer />
      <Tour />
    </>
  );
}
