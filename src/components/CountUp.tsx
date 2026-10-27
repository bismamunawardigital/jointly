"use client";

import { useEffect, useRef, useState } from "react";

export const hm = (n: number) => `${Math.floor(n / 60)}h ${n % 60}m`;

export function CountUp({ to, format = (n) => String(n), ms = 600 }: { to: number; format?: (n: number) => string; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / ms);
        setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      setN(0);
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, ms]);
  return <span ref={ref} className="tnum">{format(n)}</span>;
}
