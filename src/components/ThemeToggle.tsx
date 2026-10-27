"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "./ui";

export function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === "dark"), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem("jointly-theme", next ? "dark" : "light");
    } catch {}
  };
  return { dark, toggle };
}

export function ThemeSwitch() {
  const { dark, toggle } = useTheme();
  return (
    <label className="flex cursor-pointer items-center justify-between text-sm text-sub">
      Dark mode
      <button
        role="switch"
        aria-checked={dark}
        onClick={toggle}
        className={cn("relative h-5 w-9 rounded-full transition-colors duration-150", dark ? "bg-accent" : "bg-line-strong")}
      >
        <span className={cn("absolute left-0 top-0.5 h-4 w-4 rounded-full bg-surface shadow-sm transition-transform duration-200 ease-out", dark ? "translate-x-[18px]" : "translate-x-0.5")} />
      </button>
    </label>
  );
}

export function ThemeButton() {
  const { dark, toggle } = useTheme();
  const Icon = dark ? Sun : Moon;
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-sub transition-colors hover:bg-panel hover:text-ink"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function DensitySwitch() {
  const [compact, setCompact] = useState(false);
  useEffect(() => setCompact(document.documentElement.dataset.density === "compact"), []);
  const toggle = () => {
    const next = !compact;
    setCompact(next);
    if (next) document.documentElement.dataset.density = "compact";
    else delete document.documentElement.dataset.density;
    try {
      localStorage.setItem("jointly-density", next ? "compact" : "comfortable");
    } catch {}
  };
  return (
    <label className="flex cursor-pointer items-center justify-between text-sm text-sub">
      Compact view
      <button
        role="switch"
        aria-checked={compact}
        onClick={toggle}
        className={cn("relative h-5 w-9 rounded-full transition-colors duration-150", compact ? "bg-accent" : "bg-line-strong")}
      >
        <span className={cn("absolute left-0 top-0.5 h-4 w-4 rounded-full bg-surface shadow-sm transition-transform duration-200 ease-out", compact ? "translate-x-[18px]" : "translate-x-0.5")} />
      </button>
    </label>
  );
}
