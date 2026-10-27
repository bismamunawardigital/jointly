import type { Metadata } from "next";
import { HeroFrame } from "@/components/landing/HeroFrame";

export const metadata: Metadata = { title: "Jointly cover", robots: { index: false } };

export default function Cover() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-surface p-12">
      <h1 className="text-[22px] font-semibold leading-[28px]">Jointly · Agentic AI for bank operations</h1>
      <div className="w-full max-w-[760px]">
        <HeroFrame callouts={[]} />
      </div>
    </main>
  );
}
