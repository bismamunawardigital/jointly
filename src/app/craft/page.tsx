import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SpecDrawing } from "@/components/SpecDrawing";

export default function Craft() {
  return (
    <div className="min-h-screen bg-canvas">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-sub hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to the case study
        </Link>
        <h1 className="mt-6 font-display text-4xl">The one card Sara uses all day</h1>
        <p className="mt-2 text-sub">Every space comes from one small scale. The only colour is the status.</p>
        <div className="mt-8">
          <SpecDrawing />
        </div>
      </main>
    </div>
  );
}
