"use client";

import { Phase, Tab } from "@/lib/store";

interface Moment {
  title: string;
  body: string;
  tab: Tab;
  readyWhen: Phase[];
  notReady: string;
}

const order: Phase[] = ["new", "running", "in_review", "revising", "re_review", "executing", "executed", "releasing", "partially_live", "renewing", "live"];
const after = (p: Phase) => order.slice(order.indexOf(p));

export const moments: Moment[] = [
  {
    title: "The agent did the legwork",
    body: "Sara only checks what it had to read. Here, that's 1 amber value from a blurry letter.",
    tab: "review",
    readyWhen: after("in_review"),
    notReady: "The agent is still gathering evidence. Show me opens the live run.",
  },
  {
    title: "Approval is tied to the content",
    body: "Sara checks a blurry letter herself. Only stages 3 and 4 change, so her first approvals stay.",
    tab: "review",
    readyWhen: after("in_review"),
    notReady: "This opens once the agent sends the plan for review.",
  },
  {
    title: "Release what's safe, hold the rest",
    body: "Rashid is held. The rules prove the other two can still sign, so Sara releases them now.",
    tab: "release",
    readyWhen: after("executed"),
    notReady: "This opens after Sara approves all 4 stages and the agent sets them up.",
  },
  {
    title: "Keep secrets away from the agent",
    body: "The agent never sees a password. Each person sets their own login.",
    tab: "release",
    readyWhen: after("releasing"),
    notReady: "This opens after Sara releases Mohammed and Khalifa.",
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useTourTarget(n: number) {
  return {};
}

