export const QREG_VERSION = "1.0.0";
export const PRODUCT_NAME = "KERNA Ledger VCI";
export const ENGINE_NAME = "Q-Reg PolicyEngine";
export const STATUTORY_FACTOR = 0.428;
export const MICRO_SCALE = 1_000_000;
export const DRIFT_BOUND = 1e-6;
export const ALLOWANCE_PRICE_USD = 160;
export const SURRENDER_RATIO = 4;
export const CITATION = "Title 17 CCR \u00a795111";
export const GENESIS_HASH = "00".repeat(32);

export const DEMO_SIGNING_JWK = {
  kty: "OKP",
  crv: "Ed25519",
  d: "sSg0B_QLYJg8p9WBAzf8_PgSDEvWu2CTNyXYs2U3AKo",
  x: "H5smtpS_ab4K3ZJolnXPT2OsbDQv9I5ceXfHpoNdCvM",
} as const;

export type Gate = "GREEN" | "YELLOW" | "BLACK" | "PIPELINE_ERROR";
export type Status = "LIVE" | "PIPELINE_ERROR";

export type FilingInput = {
  entity: string
  facilityId: string
  sector: string
  airBasin: string
  intervalStart: string
  intervalEnd: string
  mwh: number
  factor?: number | null
  warning?: string | null
  retrievalFailure?: boolean
  deficit?: boolean
};

export type Evaluation = {
  gate: Gate
  status: Status
  sealable: boolean
  factor: number | null
  mwhMilli: number
  emissionsMicro: number | null
  emissionsMt: number | null
  warning: string | null
  reason: string
  citation: string
  drift: number | null
  valid: boolean
  rejection: string | null
};

/** Canonical pre-image. Keys must stay stable — they are the signed schema. */
export type FilingPreimage = {
  air_basin: string
  citation: string
  emissions_micro: number | null
  entity: string
  facility_id: string
  factor: number | null
  gate: Gate
  interval_end: string
  interval_start: string
  mwh_milli: number
  record_id: string
  sealable: boolean
  sector: string
  status: Status
  warning: string | null
};

export type SealedRecord = {
  preimage: FilingPreimage
  evaluation: Evaluation
  leafHash: string
  signature: string
  publicKey: string
  prevHash: string
  chainHead: string
  merkleRoot: string
  sealedAt: string
  inclusion: InclusionProof
};

export type InclusionProof = {
  index: number
  leafCount: number
  siblings: string[]
};

export type VerifyIssue = {
  code: string
  message: string
};

export type VerifyResult = {
  recordId: string
  entity: string
  accepted: boolean
  issues: VerifyIssue[]
  recomputedLeaf: string | null
};

export type AdversarialVerdict = "REJECTED" | "ACCEPTED";

export type AdversarialResult = {
  vector: number
  name: string
  mechanism: string
  detection: string
  verdict: AdversarialVerdict
  detail: string
};

export type TheoremId = 1 | 2 | 3 | 4 | 5 | 6;

export type TheoremResult = {
  id: TheoremId
  title: string
  statement: string
  proved: boolean
  domainSize: number
  counterexamples: string[]
  notes: string
};
