import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Shell";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-6 text-center text-ink">
      <Logo />
      <h1 className="max-w-xl font-display text-3xl tracking-tight md:text-4xl">This page isn&apos;t set up yet. Unlike Creekside.</h1>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex h-11 items-center rounded-lg border border-line bg-surface px-5 text-sm font-medium hover:bg-panel">
          Back to the case study
        </Link>
        <Link href="/demo/case/" className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-accent px-5 text-sm font-medium text-onaccent hover:bg-accent-hover">
          Open the demo <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
