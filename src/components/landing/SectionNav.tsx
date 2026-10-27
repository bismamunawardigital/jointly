"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui";

export function SectionNav({ items }: { items: [string, string][] }) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState("");
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
  );
}
