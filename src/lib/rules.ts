import { EvidenceKey, PersonId, firstName, people, personById } from "@/data/seed";

export type Version = 1 | 2;

export interface Rule {
  id: string;
  label: string;
  signers: PersonId[];
  count: number;
  currency: "AED";
  maxAmount?: number;
  sources: EvidenceKey[];
}

const ALL: PersonId[] = ["mohammed", "bilal", "omar"];

export function buildRules(version: Version): Rule[] {
  const limit = version === 1 ? 10_000 : 25_000;
  return [
    {
      id: "R1",
      label: "Any two of Mohammed, Bilal and Omar sign jointly",
      signers: ALL,
      count: 2,
      currency: "AED",
      sources: ["svs-man-c1"],
    },
    {
      id: "R2",
      label: `Bilal signs alone up to AED ${fmt(limit)}`,
      signers: ["bilal"],
      count: 1,
      currency: "AED",
      maxAmount: limit,
      sources: version === 1 ? ["svs-man-c2"] : ["svs-man-c2", "svs-amd"],
    },
  ];
}

export const fmt = (n: number) => n.toLocaleString("en-US");

export function singleLimit(rules: Rule[]): number | undefined {
  return rules.find((r) => r.count === 1)?.maxAmount;
}

export interface Tx {
  initiator: PersonId;
  approvers: PersonId[];
  amount: number;
  currency: string;
}

export type Outcome = "allowed" | "blocked" | "held" | "not_covered";

export interface Evaluation {
  outcome: Outcome;
  reason: string;
  ruleId?: string;
}

export function signersOf(tx: Tx): PersonId[] {
  return Array.from(new Set([tx.initiator, ...tx.approvers]));
}

export function evaluate(tx: Tx, rules: Rule[], held: PersonId[] = []): Evaluation {
  if (tx.currency !== "AED") {
    return {
      outcome: "not_covered",
      reason: `The mandate only covers AED payments. ${tx.currency} can't be assumed, so it is not set up.`,
    };
  }
  if (!(tx.amount > 0)) return { outcome: "blocked", reason: "Enter an amount above zero." };

  const signers = signersOf(tx);
  const heldSigner = signers.find((s) => held.includes(s));
  if (heldSigner) {
    return {
      outcome: "held",
      reason: `${firstName(heldSigner)} is held: KYC pending (EID expired). No signing until it clears.`,
    };
  }

  const match = rules.find(
    (r) =>
      r.currency === tx.currency &&
      (r.maxAmount === undefined || tx.amount <= r.maxAmount) &&
      signers.filter((s) => r.signers.includes(s)).length >= r.count,
  );
  if (match) return { outcome: "allowed", reason: `Matches ${match.id}: ${match.label}.`, ruleId: match.id };

  if (signers.length === 1) {
    const solo = signers[0];
    const own = rules.find((r) => r.count === 1 && r.signers.includes(solo));
    if (own && own.maxAmount !== undefined && tx.amount > own.maxAmount) {
      return {
        outcome: "blocked",
        reason: `Above ${firstName(solo)}'s single limit of AED ${fmt(own.maxAmount)}. A second signatory must approve.`,
      };
    }
    return { outcome: "blocked", reason: `${firstName(solo)} can't sign alone. Any two signatories must approve.` };
  }
  return { outcome: "blocked", reason: "No rule in the mandate allows this combination." };
}

export interface BoundaryTest {
  id: string;
  label: string;
  tx: Tx;
  expected: Outcome;
  actual: Evaluation;
  pass: boolean;
}

export function boundaryTests(rules: Rule[], held: PersonId[]): BoundaryTest[] {
  const limit = singleLimit(rules) ?? 0;
  const cases: Omit<BoundaryTest, "actual" | "pass">[] = [
    {
      id: "at-limit",
      label: `AED ${fmt(limit)} by Bilal alone`,
      tx: { initiator: "bilal", approvers: [], amount: limit, currency: "AED" },
      expected: "allowed",
    },
    {
      id: "over-limit",
      label: `AED ${fmt(limit + 1)} by Bilal alone`,
      tx: { initiator: "bilal", approvers: [], amount: limit + 1, currency: "AED" },
      expected: "blocked",
    },
    {
      id: "over-limit-joint",
      label: `AED ${fmt(limit + 1)} by Mohammed + Bilal`,
      tx: { initiator: "mohammed", approvers: ["bilal"], amount: limit + 1, currency: "AED" },
      expected: "allowed",
    },
    {
      id: "mohammed-alone",
      label: "AED 500 by Mohammed alone",
      tx: { initiator: "mohammed", approvers: [], amount: 500, currency: "AED" },
      expected: "blocked",
    },
    {
      id: "held",
      label: "Any amount by Omar",
      tx: { initiator: "omar", approvers: ["bilal"], amount: 5_000, currency: "AED" },
      expected: "held",
    },
    {
      id: "usd",
      label: "USD 1,000 by Bilal",
      tx: { initiator: "bilal", approvers: [], amount: 1_000, currency: "USD" },
      expected: "not_covered",
    },
  ];
  return cases.map((c) => {
    const actual = evaluate(c.tx, rules, held);
    return { ...c, actual, pass: actual.outcome === c.expected };
  });
}

export interface ComboCheck {
  ruleId: string;
  label: string;
  available: PersonId[];
  needed: number;
  satisfiable: boolean;
  groups: PersonId[][];
}

export interface Eligibility {
  eligible: boolean;
  ready: PersonId[];
  held: PersonId[];
  combos: ComboCheck[];
  summary: string;
}

function choose<T>(items: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (items.length < k) return [];
  const [head, ...rest] = items;
  return [...choose(rest, k - 1).map((c) => [head, ...c]), ...choose(rest, k)];
}

export function releaseEligibility(rules: Rule[], held: PersonId[]): Eligibility {
  const ready = people.map((p) => p.id).filter((id) => !held.includes(id));
  const combos = rules.map((r) => {
    const available = r.signers.filter((s) => ready.includes(s));
    return {
      ruleId: r.id,
      label: r.label,
      available,
      needed: r.count,
      satisfiable: available.length >= r.count,
      groups: choose(available, r.count),
    };
  });
  const eligible = held.length === 0 || combos.some((c) => c.satisfiable);
  const names = (ids: PersonId[]) => ids.map(firstName).join(" + ");
  const best = combos.find((c) => c.satisfiable && c.needed > 1) ?? combos.find((c) => c.satisfiable);
  const summary = eligible
    ? held.length === 0
      ? "Everyone is ready. Release all."
      : `${names(best!.groups[0])} can still form a valid approval. Eligible for partial release.`
    : "Hold all: the ready signatories can't form any valid approval combination.";
  return { eligible, ready, held, combos, summary };
}

export interface StageItem {
  key: string;
  label: string;
  value: string;
  sources: EvidenceKey[];
}

export interface Stage {
  id: 1 | 2 | 3 | 4;
  title: string;
  short: string;
  items: StageItem[];
}

export function buildStages(version: Version): Stage[] {
  const rules = buildRules(version);
  const limit = singleLimit(rules)!;
  const r2Sources = rules[1].sources;
  return [
    {
      id: 1,
      title: "User creation",
      short: "Users",
      items: people.map((p) => ({
        key: `user-${p.id}`,
        label: p.name,
        value: p.digitalUser.existing
          ? `Link existing user ${p.digitalUser.userId} (same RCIF ${p.rcif}). No new login.`
          : p.eidValid
            ? `New user on RCIF ${p.rcif}. Mobile ending ${p.mobileLast4}.`
            : `New user on RCIF ${p.rcif}. Switched off until KYC clears.`,
        sources: p.digitalUser.existing ? ["admin-user-mohammed"] : ["finacle-cif"],
      })),
    },
    {
      id: 2,
      title: "User to role mapping",
      short: "Roles",
      items: people.map((p) => ({
        key: `role-${p.id}`,
        label: p.name,
        value: p.id === "bilal" ? "Authorizer: joint and single" : "Authorizer: joint",
        sources: p.id === "bilal" ? ["svs-man-c1", "svs-man-c2"] : ["svs-man-c1"],
      })),
    },
    {
      id: 3,
      title: "Authorization rules",
      short: "Auth rules",
      items: rules.map((r) => ({
        key: `rule-${r.id}`,
        label: r.id,
        value: r.label + (r.maxAmount === undefined ? ", any AED amount" : ""),
        sources: r.sources,
      })),
    },
    {
      id: 4,
      title: "Workflow setup",
      short: "Workflows",
      items: [
        {
          key: "wf-low",
          label: `AED 1 to ${fmt(limit)}`,
          value: "Bilal approves alone, or any two approve",
          sources: r2Sources,
        },
        {
          key: "wf-high",
          label: `Above AED ${fmt(limit)}`,
          value: "Any two of Mohammed, Bilal and Omar approve",
          sources: ["svs-man-c1", ...r2Sources],
        },
        {
          key: "wf-other",
          label: "Other currencies",
          value: "Not set up. The mandate doesn't cover them.",
          sources: ["svs-man"],
        },
      ],
    },
  ];
}

export function stageHash(stage: Stage): string {
  return stage.items.map((i) => `${i.key}=${i.label}|${i.value}`).join(";");
}

export interface Approval {
  stageId: number;
  by: string;
  at: string;
  hash: string;
}

export function approvalValid(approval: Approval | undefined, stage: Stage): boolean {
  return !!approval && approval.hash === stageHash(stage);
}

export interface ItemDiff {
  key: string;
  beforeLabel: string;
  afterLabel: string;
  before: string;
  after: string;
  sources: EvidenceKey[];
}

export function diffStage(before: Stage, after: Stage): ItemDiff[] {
  return after.items.flatMap((a) => {
    const b = before.items.find((i) => i.key === a.key);
    if (b && b.value === a.value && b.label === a.label) return [];
    return [
      {
        key: a.key,
        beforeLabel: b?.label ?? "",
        afterLabel: a.label,
        before: b?.value ?? "",
        after: a.value,
        sources: a.sources,
      },
    ];
  });
}

export interface PolicyCheck {
  id: string;
  label: string;
  pass: boolean;
}

export function policyChecks(version: Version, held: PersonId[]): PolicyCheck[] {
  const rules = buildRules(version);
  const stages = buildStages(version);
  const users = stages[0].items.map((i) => i.key.replace("user-", ""));
  const roles = stages[1].items.map((i) => i.key.replace("role-", ""));
  const signers = Array.from(new Set(rules.flatMap((r) => r.signers)));
  const tests = boundaryTests(rules, held);
  return [
    ...tests.map((t) => ({ id: `bt-${t.id}`, label: `Boundary: ${t.label}`, pass: t.pass })),
    { id: "users", label: "Every signatory in a rule has a user", pass: signers.every((s) => users.includes(s)) },
    { id: "roles", label: "Every signatory in a rule has an authorizer role", pass: signers.every((s) => roles.includes(s)) },
    {
      id: "bands",
      label: "Workflow bands match the rule limits",
      pass: stages[3].items[0].label.endsWith(fmt(singleLimit(rules)!)),
    },
    {
      id: "no-duplicate",
      label: "No duplicate login for an existing user",
      pass: people.filter((p) => p.digitalUser.existing).every((p) => stages[0].items.find((i) => i.key === `user-${p.id}`)!.value.startsWith("Link")),
    },
  ];
}

export const heldIds = (omarRenewed: boolean): PersonId[] => (omarRenewed ? [] : ["omar"]);
export const nameOf = (id: PersonId) => personById(id).name;
