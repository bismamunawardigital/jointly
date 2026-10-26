export type PersonId = "mohammed" | "bilal" | "omar";

export interface Person {
  id: PersonId;
  name: string;
  initials: string;
  tint: string;
  formName: string;
  finacleName: string;
  svsName: string;
  rcif: string;
  eidLast4: string;
  eidExpiry: string;
  eidValid: boolean;
  mobileLast4: string;
  digitalUser: { existing: true; userId: string } | { existing: false };
}

export const business = {
  id: "al-noor",
  name: "Al Noor Trading LLC",
  iban: "AE07 0331 2345 6789 0123 456",
  accountType: "AED current account",
  finacleMop: "JOINTLY - ANY TWO",
  submittedAt: "Mon 09:12",
};

export const people: Person[] = [
  {
    id: "mohammed",
    name: "Mohammed Abdulla Al Mansoori",
    initials: "MA",
    tint: "#E7EEFC",
    formName: "Mohammed Abdulla Al Mansoori",
    finacleName: "MOHD A MANSOURI",
    svsName: "Mohammed Al Mansouri",
    rcif: "100234",
    eidLast4: "3391",
    eidExpiry: "02-Feb-2029",
    eidValid: true,
    mobileLast4: "2207",
    digitalUser: { existing: true, userId: "DBU-77120" },
  },
  {
    id: "bilal",
    name: "Bilal Hassan",
    initials: "BH",
    tint: "#E9F5EA",
    formName: "Bilal Hassan",
    finacleName: "BILAL HASSAN",
    svsName: "Bilal Hassan",
    rcif: "100587",
    eidLast4: "7714",
    eidExpiry: "19-Nov-2027",
    eidValid: true,
    mobileLast4: "4410",
    digitalUser: { existing: false },
  },
  {
    id: "omar",
    name: "Omar Khalid",
    initials: "OK",
    tint: "#FBEDE3",
    formName: "Omar Khalid",
    finacleName: "OMAR KHALID",
    svsName: "Omar Khalid",
    rcif: "100912",
    eidLast4: "5082",
    eidExpiry: "14-Aug-2026",
    eidValid: false,
    mobileLast4: "9935",
    digitalUser: { existing: false },
  },
];

export const personById = (id: PersonId) => people.find((p) => p.id === id)!;
export const firstName = (id: PersonId) => personById(id).name.split(" ")[0];

export type EvidenceKey =
  | "form-mohammed"
  | "form-bilal"
  | "form-omar"
  | "eid-omar"
  | "finacle-cif"
  | "finacle-mop"
  | "svs-signatories"
  | "svs-man"
  | "svs-man-c1"
  | "svs-man-c2"
  | "svs-amd"
  | "admin-user-mohammed";

export interface Evidence {
  key: EvidenceKey;
  title: string;
  system: string;
  ref: string;
  body: string;
  highlight?: string;
  note?: string;
}

const mandateText =
  "Any two of Mohammed Abdulla Al Mansoori, Bilal Hassan and Omar Khalid shall sign jointly. Notwithstanding the above, Bilal Hassan may sign singly for AED payments up to and including AED 10,000.";

export const evidence: Record<EvidenceKey, Evidence> = {
  "form-mohammed": {
    key: "form-mohammed",
    title: "Signed registration form",
    system: "Document store",
    ref: "FORM-AN-0001",
    body: "Signatory: Mohammed Abdulla Al Mansoori. EID ending 3391. Signed 24-Oct-2026.",
    highlight: "Mohammed Abdulla Al Mansoori",
  },
  "form-bilal": {
    key: "form-bilal",
    title: "Signed registration form",
    system: "Document store",
    ref: "FORM-AN-0002",
    body: "Signatory: Bilal Hassan. EID ending 7714. Signed 24-Oct-2026.",
    highlight: "Bilal Hassan",
  },
  "form-omar": {
    key: "form-omar",
    title: "Signed registration form",
    system: "Document store",
    ref: "FORM-AN-0003",
    body: "Signatory: Omar Khalid. EID ending 5082. Signed 24-Oct-2026.",
    highlight: "Omar Khalid",
  },
  "eid-omar": {
    key: "eid-omar",
    title: "Emirates ID status",
    system: "KYC service",
    ref: "EID ending 5082",
    body: "Holder: Omar Khalid. Status: expired. Expiry date: 14-Aug-2026.",
    highlight: "expired. Expiry date: 14-Aug-2026",
    note: "KYC is never waived. Omar is held until a renewed EID is on file.",
  },
  "finacle-cif": {
    key: "finacle-cif",
    title: "Customer records (inquiryCIF)",
    system: "Finacle",
    ref: "RCIF 100234 · 100587 · 100912",
    body: "100234 MOHD A MANSOURI, EID ending 3391. 100587 BILAL HASSAN, EID ending 7714. 100912 OMAR KHALID, EID ending 5082.",
    highlight: "MOHD A MANSOURI",
  },
  "finacle-mop": {
    key: "finacle-mop",
    title: "Mode of Operation",
    system: "Finacle",
    ref: "Account AE07…0123 456",
    body: "Mode of Operation: JOINTLY - ANY TWO",
    highlight: "JOINTLY - ANY TWO",
    note: "Coarse. It has no amount bands and no single-signing rights.",
  },
  "svs-signatories": {
    key: "svs-signatories",
    title: "Signatory records",
    system: "SVS",
    ref: "Account AE07…0123 456",
    body: "Mohammed Al Mansouri (RCIF 100234). Bilal Hassan (RCIF 100587). Omar Khalid (RCIF 100912).",
    highlight: "Mohammed Al Mansouri (RCIF 100234)",
  },
  "svs-man": {
    key: "svs-man",
    title: "Mandate, 2019",
    system: "SVS",
    ref: "SVS-MAN-2019-0441",
    body: mandateText,
    highlight:
      "Notwithstanding the above, Bilal Hassan may sign singly for AED payments up to and including AED 10,000.",
  },
  "svs-man-c1": {
    key: "svs-man-c1",
    title: "Mandate, 2019 · clause 1",
    system: "SVS",
    ref: "SVS-MAN-2019-0441",
    body: mandateText,
    highlight: "Any two of Mohammed Abdulla Al Mansoori, Bilal Hassan and Omar Khalid shall sign jointly.",
  },
  "svs-man-c2": {
    key: "svs-man-c2",
    title: "Mandate, 2019 · clause 2",
    system: "SVS",
    ref: "SVS-MAN-2019-0441",
    body: mandateText,
    highlight:
      "Notwithstanding the above, Bilal Hassan may sign singly for AED payments up to and including AED 10,000.",
  },
  "svs-amd": {
    key: "svs-amd",
    title: "Amendment letter, 2023",
    system: "SVS",
    ref: "SVS-AMD-2023-0107",
    body: "The single-signing limit of Bilal Hassan is revised to AED 25,000 with effect from 01-Mar-2023.",
    highlight: "revised to AED 25,000",
    note: "Filed under document type Letter, not Mandate.",
  },
  "admin-user-mohammed": {
    key: "admin-user-mohammed",
    title: "Existing digital banking user",
    system: "Digital Banking Admin",
    ref: "DBU-77120",
    body: "User DBU-77120, RCIF 100234. Active since 2021 on a personal account. Token registered.",
    highlight: "RCIF 100234",
    note: "Same RCIF, so we link this login instead of creating a second one.",
  },
};

export const svsDocTypes = ["Mandate", "Letter", "Board resolution", "Specimen signature"] as const;

export interface QueueCase {
  id: string;
  business: string;
  type: string;
  stage: string;
  status: "Agent working" | "Needs you" | "Partially live" | "Live" | "New";
  owner: string;
  age: string;
  clickable: boolean;
}

export const otherCases: QueueCase[] = [
  {
    id: "gulf-horizon",
    business: "Gulf Horizon Logistics",
    type: "Joint signatories (4)",
    stage: "Release",
    status: "Live",
    owner: "None",
    age: "1d",
    clickable: false,
  },
  {
    id: "saffron-bay",
    business: "Saffron Bay Interiors",
    type: "Add non-signatory",
    stage: "Review",
    status: "Needs you",
    owner: "Sara M.",
    age: "3h",
    clickable: false,
  },
  {
    id: "al-reem",
    business: "Al Reem Pharmacy",
    type: "Single signatory",
    stage: "Identity",
    status: "Agent working",
    owner: "Agent",
    age: "25m",
    clickable: false,
  },
];

export const checker = { name: "Sara M.", role: "CF Checker", initials: "SM" };
