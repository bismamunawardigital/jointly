"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui";
import { track } from "@/lib/track";

export function SectionNav({ items }: { items: [string, string][] }) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState("");
  const [progress, setProgress] = useState(0);
  const [back, setBack] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(location.search).get("back")) {
      setBack(true);
      const t = setTimeout(() => setBack(false), 3000);
      return () => clearTimeout(t);
    }
  }, []);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-track]");
      if (!el) return;
      if (el.dataset.track === "cta") sessionStorage.setItem("jointly-from-hero", "1");
      track(el.dataset.track === "portfolio" ? "portfolio_click" : "hero_cta", { from: "landing" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  useEffect(() => {
    let deepest = -1;
    const onP = () => {
      const h = document.documentElement;
      setProgress(Math.min(1, h.scrollTop / Math.max(1, h.scrollHeight - innerHeight)));
    };
    onP();
    window.addEventListener("scroll", onP, { passive: true });
    const io = new IntersectionObserver((es) =>
      es.forEach((e) => {
        const i = items.findIndex(([id]) => id === e.target.id);
        if (e.isIntersecting && i > deepest) {
          deepest = i;
          track("deepest_chapter", { chapter: items[i][0] });
        }
      }),
    );
    items.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onP);
      io.disconnect();
    };
  }, [items]);
  useEffect(() => {
    const hero = document.getElementById("hero");
    const onScroll = () => setShow(!!hero && hero.getBoundingClientRect().bottom < 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    items.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [items]);
  return (
    <>
    <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-brand" style={{ transform: `scaleX(${progress})` }} />
    {back && (
      <p role="status" className="fixed left-1/2 top-14 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-1.5 text-sm text-canvas shadow-lg">Welcome back</p>
    )}
    <nav
      aria-label="Sections"
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b border-line bg-surface/95 backdrop-blur transition-transform duration-200",
        show ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <ul className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-6 text-[13px] [scrollbar-width:none]">
        {items.map(([id, label]) => (
          <li key={id} className="shrink-0">
            <a
              href={`#${id}`}
              className={cn("block border-b-2 py-2.5", active === id ? "border-brand text-ink" : "border-transparent text-sub hover:text-ink")}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
    </>
  );
}
