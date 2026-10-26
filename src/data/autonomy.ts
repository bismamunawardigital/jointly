import type { Tab } from "@/lib/store";

export type Lane = "agent" | "rules" | "human" | "never";

export interface AutonomyItem {
  text: string;
  tab?: Tab;
  event?: string;
}

export interface AutonomyLane {
  id: Lane;
  title: string;
  why: string;
  items: AutonomyItem[];
}

export const autonomy: AutonomyLane[] = [
  {
    id: "agent",
    title: "Agent does it alone",
    why: "Slow, checkable work. Every step is logged with its source.",
    items: [
      { text: "Reads the forms, Finacle, SVS and EFR", tab: "run", event: "intake-forms" },
      { text: "Matches people on EID and RCIF", tab: "evidence", event: "id-svs" },
      { text: "Drafts the plan, with a source on every line", tab: "plan", event: "plan-build" },
      { text: "Sets up users, roles and rules", tab: "release", event: "ex-rules" },
      { text: "Drafts the customer messages", tab: "release", event: "rel-mohammed" },
    ],
  },
  {
    id: "rules",
    title: "Rules decide",
    why: "Yes or no questions with one right answer. Code, not a model.",
    items: [
      { text: "Who can sign, and up to what amount", tab: "simulator", event: "policy-check" },
      { text: "Does the setup match the plan?", tab: "release", event: "ex-readback" },
      { text: "Can the people who are ready sign together?", tab: "release", event: "ex-eligibility" },
    ],
  },
  {
    id: "human",
    title: "A person approves",
    why: "It changes who can move money. A named person signs off.",
    items: [
      { text: "Each of the 4 setup stages", tab: "review", event: "all-approved" },
      { text: "Sending a stage back with a note", tab: "review", event: "return-3" },
      { text: "Letting customers in", tab: "release", event: "release" },
    ],
  },
  {
    id: "never",
    title: "Never allowed",
    why: "Hard limits, not settings. Nobody can switch them on.",
    items: [
      { text: "Waive EFR" },
      { text: "Match people on a similar name" },
      { text: "Approve its own work" },
      { text: "Release access the mandate can't support" },
      { text: "See, make or send a password" },
    ],
  },
];
