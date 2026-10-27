import { track as vt } from "@vercel/analytics";

export function track(name: string, data?: Record<string, string | number>) {
  try {
    vt(name, data);
  } catch {}
}
