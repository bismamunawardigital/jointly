import { EvidenceKey } from "@/data/seed";

export type Group = "run" | "revise" | "execute" | "release" | "renew";
export type EventStatus = "ok" | "warn" | "block" | "info";
export type Actor =
  | "Intake Agent"
  | "KYC Agent"
  | "Identity Agent"
  | "Mandate Agent"
  | "Planner Agent"
  | "Rules engine"
  | "Executor Agent"
  | "Release Agent"
  | "Messaging";

export interface AgentEvent {
  id: string;
  group: Group;
  step: StepId;
  time: string;
  actor: Actor;
  call: string;
  system: string;
  title: string;
  detail?: string;
  status: EventStatus;
  evidence?: EvidenceKey[];
  assumption?: string;
  dynamic?: "policy-v1" | "policy-v2";
}

export type StepId = "intake" | "identity" | "mandate" | "plan" | "policy" | "review" | "execute" | "release";

export const steps: { id: StepId; label: string }[] = [
  { id: "intake", label: "Intake & KYC" },
  { id: "identity", label: "Identity" },
  { id: "mandate", label: "Mandate" },
  { id: "plan", label: "Plan" },
  { id: "policy", label: "Policy check" },
  { id: "review", label: "Review" },
  { id: "execute", label: "Execute" },
  { id: "release", label: "Release" },
];

export const script: AgentEvent[] = [
  {
    id: "intake-forms", group: "run", step: "intake", time: "Mon 09:12", actor: "Intake Agent",
    call: "docs.readForms", system: "Document store", status: "ok",
    title: "Read 3 signed registration forms",
    detail: "Al Noor Trading LLC, account AE07…0123 456. Three joint signatories named.",
    evidence: ["form-mohammed", "form-bilal", "form-omar"],
  },
  {
    id: "kyc-check", group: "run", step: "intake", time: "Mon 09:13", actor: "KYC Agent",
    call: "kyc.checkEID", system: "KYC service", status: "block",
    title: "Omar Khalid's Emirates ID expired on 14-Aug-2026",
    detail: "Caught before any setup work. Omar is held. The run carries on for Mohammed and Bilal.",
    evidence: ["eid-omar"],
  },
  {
    id: "kyc-request", group: "run", step: "intake", time: "Mon 09:13", actor: "KYC Agent",
    call: "kyc.requestEIDUpdate", system: "KYC service", status: "warn",
    title: "Started an EID update request for Omar",
    detail: "Sent Omar an SMS with the renewal steps, using an approved template. I'll recheck KYC once it's renewed.",
  },
  {
    id: "id-finacle", group: "run", step: "identity", time: "Mon 09:15", actor: "Identity Agent",
    call: "finacle.inquiryCIF", system: "Finacle", status: "ok",
    title: "Found 3 customer records by EID",
    detail: "RCIF 100234, 100587 and 100912. Names are spelled differently across sources, so I matched on EID + RCIF only.",
    evidence: ["finacle-cif"],
  },
  {
    id: "id-svs", group: "run", step: "identity", time: "Mon 09:16", actor: "Identity Agent",
    call: "svs.getSignatories", system: "SVS", status: "ok",
    title: "Matched all 3 SVS signatories on RCIF",
    detail: "\"Mohammed Al Mansouri\" in SVS and \"MOHD A MANSOURI\" in Finacle are the same RCIF 100234.",
    evidence: ["svs-signatories"],
  },
  {
    id: "id-digital", group: "run", step: "identity", time: "Mon 09:17", actor: "Identity Agent",
    call: "admin.findUser", system: "Digital Banking Admin", status: "ok",
    title: "Mohammed already has a digital banking login",
    detail: "User DBU-77120 on the same RCIF. I'll link it instead of creating a second one. Bilal and Omar need new users.",
    evidence: ["admin-user-mohammed"],
  },
  {
    id: "mandate-finacle", group: "run", step: "mandate", time: "Mon 09:19", actor: "Mandate Agent",
    call: "finacle.getModeOfOperation", system: "Finacle", status: "info",
    title: "Finacle says JOINTLY - ANY TWO",
    evidence: ["finacle-mop"],
  },
  {
    id: "mandate-svs", group: "run", step: "mandate", time: "Mon 09:20", actor: "Mandate Agent",
    call: "svs.getDocuments(type=MANDATE)", system: "SVS", status: "info",
    title: "Found mandate SVS-MAN-2019-0441",
    detail: "Searched document type: Mandate. Not searched: Letter, Board resolution.",
    evidence: ["svs-man"],
  },
  {
    id: "mandate-conflict", group: "run", step: "mandate", time: "Mon 09:21", actor: "Mandate Agent",
    call: "sources.compare", system: "Finacle + SVS", status: "warn",
    title: "SVS is more specific than Finacle",
    detail: "SVS adds a single-signing band for Bilal up to AED 10,000. Rules built from SVS. Finacle record flagged for cleanup.",
    evidence: ["finacle-mop", "svs-man-c2"],
  },
  {
    id: "plan-build", group: "run", step: "plan", time: "Mon 09:24", actor: "Planner Agent",
    call: "plan.build", system: "Jointly", status: "ok",
    title: "Built plan v1 for all 4 stages",
    detail: "3 users (1 linked, 2 new), 3 roles, 2 authorization rules, 3 workflow bands.",
  },
  {
    id: "policy-check", group: "run", step: "policy", time: "Mon 09:26", actor: "Rules engine",
    call: "policy.check", system: "Jointly", status: "ok",
    title: "Policy check passed", dynamic: "policy-v1",
  },
  {
    id: "submit", group: "run", step: "review", time: "Mon 09:31", actor: "Planner Agent",
    call: "review.submit", system: "Jointly", status: "info",
    title: "Sent plan v1 to Sara M. for review",
    detail: "All 4 stages in one review sitting. I can't approve my own work.",
  },

  {
    id: "rev-amendment", group: "revise", step: "mandate", time: "Mon 10:08", actor: "Mandate Agent",
    call: "svs.getDocuments(type=ALL)", system: "SVS", status: "warn",
    title: "Found amendment SVS-AMD-2023-0107",
    detail: "It's filed as a Letter, so my first search missed it. I now search every document type on this account.",
    evidence: ["svs-amd"],
  },
  {
    id: "rev-precedence", group: "revise", step: "mandate", time: "Mon 10:09", actor: "Mandate Agent",
    call: "rules.applyPrecedence", system: "Jointly", status: "info",
    title: "Later dated instruction wins",
    detail: "The 01-Mar-2023 amendment replaces the 2019 clause. Bilal's single limit is now AED 25,000.",
    evidence: ["svs-amd", "svs-man-c2"],
    assumption: "Precedence rule to validate with the bank",
  },
  {
    id: "rev-plan", group: "revise", step: "plan", time: "Mon 10:10", actor: "Planner Agent",
    call: "plan.revise", system: "Jointly", status: "ok",
    title: "Plan v2: changed 1 rule and the workflow that uses it",
    detail: "Stages 1 and 2 didn't change, so Sara's approvals on them stay.",
  },
  {
    id: "rev-policy", group: "revise", step: "policy", time: "Mon 10:11", actor: "Rules engine",
    call: "policy.check", system: "Jointly", status: "ok",
    title: "Reran checks at the new 25,000 edges", dynamic: "policy-v2",
  },
  {
    id: "rev-submit", group: "revise", step: "review", time: "Mon 10:12", actor: "Planner Agent",
    call: "review.resubmit", system: "Jointly", status: "info",
    title: "Sent only stages 3 and 4 back to Sara, as a diff",
  },

  {
    id: "ex-link", group: "execute", step: "execute", time: "Mon 10:41", actor: "Executor Agent",
    call: "admin.linkUser", system: "Digital Banking Admin", status: "ok",
    title: "Linked Mohammed's existing login to Al Noor Trading",
  },
  {
    id: "ex-users", group: "execute", step: "execute", time: "Mon 10:42", actor: "Executor Agent",
    call: "admin.createUser", system: "Digital Banking Admin", status: "ok",
    title: "Created users for Bilal and Omar",
    detail: "Omar's user is switched off until KYC clears.",
  },
  {
    id: "ex-roles", group: "execute", step: "execute", time: "Mon 10:43", actor: "Executor Agent",
    call: "admin.assignRoles", system: "Digital Banking Admin", status: "ok",
    title: "Assigned 3 authorizer roles",
  },
  {
    id: "ex-rules", group: "execute", step: "execute", time: "Mon 10:44", actor: "Executor Agent",
    call: "admin.setAuthRules", system: "Digital Banking Admin", status: "ok",
    title: "Set 2 authorization rules from the approved plan",
  },
  {
    id: "ex-workflow", group: "execute", step: "execute", time: "Mon 10:45", actor: "Executor Agent",
    call: "admin.setWorkflow", system: "Digital Banking Admin", status: "ok",
    title: "Set 3 workflow bands",
  },
  {
    id: "ex-readback", group: "execute", step: "execute", time: "Mon 10:46", actor: "Rules engine",
    call: "admin.readBack", system: "Digital Banking Admin", status: "ok",
    title: "Read-back check: configured = approved",
    detail: "Compared all 4 stages field by field against approved plan v2. 0 differences.",
  },
  {
    id: "ex-eligibility", group: "execute", step: "release", time: "Mon 10:47", actor: "Release Agent",
    call: "release.checkEligibility", system: "Jointly", status: "warn",
    title: "Mohammed + Bilal can satisfy \"any two\". Partial release is possible",
    detail: "Omar is still held. A person must decide to release.",
    assumption: "Partial release is a bank policy to validate",
  },

  {
    id: "rel-mohammed", group: "release", step: "release", time: "Mon 10:52", actor: "Messaging",
    call: "notify.send", system: "SMS gateway", status: "ok",
    title: "Told Mohammed that Al Noor Trading is on his existing login",
  },
  {
    id: "rel-bilal-link", group: "release", step: "release", time: "Mon 10:53", actor: "Messaging",
    call: "activation.send", system: "SMS gateway", status: "ok",
    title: "Sent Bilal a secure activation link",
    detail: "He verifies his EID with a face check and sets his own credentials. No password is created, seen or sent by the agent.",
    assumption: "Digital activation, subject to bank security approval",
  },
  {
    id: "rel-mohammed-login", group: "release", step: "release", time: "Mon 11:06", actor: "Release Agent",
    call: "admin.watchLogin", system: "Digital Banking Admin", status: "ok",
    title: "Mohammed logged in and can see Al Noor Trading",
  },
  {
    id: "rel-bilal-verified", group: "release", step: "release", time: "Mon 12:48", actor: "Release Agent",
    call: "activation.status", system: "Identity service", status: "ok",
    title: "Bilal passed the EID face check and set his credentials",
  },
  {
    id: "rel-bilal-login", group: "release", step: "release", time: "Mon 13:22", actor: "Release Agent",
    call: "admin.watchLogin", system: "Digital Banking Admin", status: "ok",
    title: "Bilal's first login. Al Noor Trading is live, 2 of 3",
  },

  {
    id: "ren-kyc", group: "renew", step: "intake", time: "Wed 09:40", actor: "KYC Agent",
    call: "kyc.checkEID", system: "KYC service", status: "ok",
    title: "Omar's EID is renewed and valid",
  },
  {
    id: "ren-eligibility", group: "renew", step: "release", time: "Wed 09:40", actor: "Release Agent",
    call: "release.checkEligibility", system: "Jointly", status: "ok",
    title: "Adding Omar keeps every approval combination valid",
  },
  {
    id: "ren-enable", group: "renew", step: "execute", time: "Wed 09:41", actor: "Executor Agent",
    call: "admin.enableUser", system: "Digital Banking Admin", status: "ok",
    title: "Switched on Omar's user",
    detail: "Added for future transactions only. Payments already waiting keep their original approvers.",
  },
  {
    id: "ren-link", group: "renew", step: "release", time: "Wed 09:41", actor: "Messaging",
    call: "activation.send", system: "SMS gateway", status: "ok",
    title: "Sent Omar a secure activation link",
  },
  {
    id: "ren-login", group: "renew", step: "release", time: "Wed 11:15", actor: "Release Agent",
    call: "admin.watchLogin", system: "Digital Banking Admin", status: "ok",
    title: "Omar's first login. All 3 signatories are live",
  },
];

export const eventById = (id: string) => script.find((e) => e.id === id)!;
export const groupEvents = (g: Group) => script.filter((e) => e.group === g).map((e) => e.id);

export interface CustomerMessage {
  afterEvent: string;
  to: string;
  channel: "SMS";
  text: string;
}

export const customerMessages: CustomerMessage[] = [
  {
    afterEvent: "kyc-request",
    to: "Omar Khalid · mobile ending 9935",
    channel: "SMS",
    text: "Hi Omar, your Emirates ID on file expired on 14 Aug. Please renew it with ICP. Mohammed and Bilal can go ahead today, and we'll add you automatically once it's renewed. No need to fill in the form again.",
  },
  {
    afterEvent: "rel-mohammed",
    to: "Mohammed Al Mansoori · mobile ending 2207",
    channel: "SMS",
    text: "Hi Mohammed, Al Noor Trading LLC is now on your existing digital banking login. No new password needed. Just log in as usual.",
  },
  {
    afterEvent: "rel-bilal-link",
    to: "Bilal Hassan · mobile ending 4410",
    channel: "SMS",
    text: "Hi Bilal, your Al Noor Trading access is ready. Tap the secure link to verify your Emirates ID and set up your login. The link works for 24 hours.",
  },
  {
    afterEvent: "ren-link",
    to: "Omar Khalid · mobile ending 9935",
    channel: "SMS",
    text: "Hi Omar, thanks for renewing your Emirates ID. Your Al Noor Trading access is ready. Tap the secure link to set up your login.",
  },
];
