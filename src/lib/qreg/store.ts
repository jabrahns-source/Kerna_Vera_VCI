import { create } from "zustand";
import { runAdversarialSuite } from "./adversarial";
import { importSigningKey } from "./crypto";
import { MRR_2024 } from "./datasets/mrr2024";
import { evaluate, blackSurrenderUsd, microToMt } from "./engine";
import { proveAll } from "./formal";
import { ledgerJsonl, sealRecord } from "./seal";
import { verifyLedger } from "./verifier";
import {
  GENESIS_HASH,
  type AdversarialResult,
  type FilingInput,
  type SealedRecord,
  type TheoremResult,
  type VerifyResult,
} from "./types";

const STORAGE_KEY = "kerna.qreg.v1.ledger";

type QregStore = {
  ready: boolean
  busy: boolean
  error: string | null
  records: SealedRecord[]
  verifyResults: VerifyResult[]
  adversarial: AdversarialResult[]
  theorems: TheoremResult[]
  init: () => Promise<void>
  runBenchmark: () => Promise<void>
  fileAndSeal: (input: FilingInput) => Promise<SealedRecord>
  resetLedger: () => Promise<void>
  verifyAll: () => Promise<VerifyResult[]>
  runAdversary: () => Promise<AdversarialResult[]>
  runProofs: () => Promise<TheoremResult[]>
  exportJsonl: () => string
};

function loadRecords(): SealedRecord[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SealedRecord[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(records: SealedRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

let signingKeyPromise: Promise<CryptoKey> | null = null;
function signingKey() {
  signingKeyPromise ??= importSigningKey();
  return signingKeyPromise;
}

async function sealBenchmark(): Promise<SealedRecord[]> {
  const key = await signingKey();
  const records: SealedRecord[] = [];
  let prev = GENESIS_HASH;
  const leaves: string[] = [];
  for (const entity of MRR_2024) {
    const input: FilingInput = {
      entity: entity.entity,
      facilityId: entity.facilityId,
      sector: entity.sector,
      airBasin: entity.airBasin,
      intervalStart: entity.intervalStart,
      intervalEnd: entity.intervalEnd,
      mwh: entity.mwh,
      factor: entity.factor,
      warning: entity.warning,
      retrievalFailure: entity.retrievalFailure,
      deficit: entity.deficit,
    };
    const evaluation = evaluate(input);
    const record = await sealRecord({
      input,
      evaluation,
      recordId: entity.recordId,
      sealedAt: "2024-12-31T23:59:59.000Z",
      prevHash: prev,
      priorLeaves: leaves,
      signingKey: key,
    });
    records.push(record);
    leaves.push(record.leafHash);
    prev = record.chainHead;
  }
  return records;
}

export function ledgerTotals(records: SealedRecord[]) {
  let mwh = 0;
  let mt = 0;
  let blackMt = 0;
  const gates = { GREEN: 0, YELLOW: 0, BLACK: 0, PIPELINE_ERROR: 0 };
  for (const record of records) {
    mwh += record.preimage.mwh_milli / 1000;
    const em = record.preimage.emissions_micro;
    if (em !== null) mt += microToMt(em);
    if (record.preimage.gate === "BLACK" && em !== null) blackMt += microToMt(em);
    gates[record.preimage.gate] += 1;
  }
  return {
    mwh,
    mt,
    blackMt,
    surrenderUsd: blackSurrenderUsd(blackMt),
    gates,
    merkleRoot: records.at(-1)?.merkleRoot ?? GENESIS_HASH,
    chainHead: records.at(-1)?.chainHead ?? GENESIS_HASH,
    count: records.length,
  };
}

export const useQreg = create<QregStore>((set, get) => ({
  ready: false,
  busy: false,
  error: null,
  records: [],
  verifyResults: [],
  adversarial: [],
  theorems: [],
  init: async () => {
    if (get().ready || get().busy) return;
    set({ busy: true, error: null });
    try {
      await signingKey();
      const existing = loadRecords();
      const records = existing ?? (await sealBenchmark());
      if (!existing) persist(records);
      const verifyResults = await verifyLedger(records);
      set({ records, verifyResults, ready: true, busy: false });
    } catch (err) {
      set({
        busy: false,
        error: err instanceof Error ? err.message : "Engine failed to start",
      });
    }
  },
  runBenchmark: async () => {
    set({ busy: true, error: null });
    try {
      const records = await sealBenchmark();
      persist(records);
      const verifyResults = await verifyLedger(records);
      set({ records, verifyResults, busy: false, adversarial: [], theorems: [] });
    } catch (err) {
      set({
        busy: false,
        error: err instanceof Error ? err.message : "Benchmark failed",
      });
    }
  },
  fileAndSeal: async (input) => {
    const key = await signingKey();
    const { records } = get();
    const evaluation = evaluate(input);
    if (!evaluation.valid) {
      throw new Error(evaluation.rejection ?? "Filing rejected");
    }
    const prev = records.at(-1)?.chainHead ?? GENESIS_HASH;
    const leaves = records.map((r) => r.leafHash);
    const record = await sealRecord({
      input,
      evaluation,
      recordId: `qreg-${Date.now().toString(36)}`,
      sealedAt: new Date().toISOString(),
      prevHash: prev,
      priorLeaves: leaves,
      signingKey: key,
    });
    const next = [...records, record];
    persist(next);
    const verifyResults = await verifyLedger(next);
    set({ records: next, verifyResults });
    return record;
  },
  resetLedger: async () => {
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    set({ records: [], verifyResults: [], adversarial: [], theorems: [], ready: false });
    await get().runBenchmark();
    set({ ready: true });
  },
  verifyAll: async () => {
    const verifyResults = await verifyLedger(get().records);
    set({ verifyResults });
    return verifyResults;
  },
  runAdversary: async () => {
    set({ busy: true, error: null });
    try {
      const key = await signingKey();
      const adversarial = await runAdversarialSuite(key);
      set({ adversarial, busy: false });
      return adversarial;
    } catch (err) {
      set({
        busy: false,
        error: err instanceof Error ? err.message : "Adversary suite failed",
      });
      return [];
    }
  },
  runProofs: async () => {
    set({ busy: true, error: null });
    try {
      const theorems = await proveAll();
      set({ theorems, busy: false });
      return theorems;
    } catch (err) {
      set({
        busy: false,
        error: err instanceof Error ? err.message : "Prover failed",
      });
      return [];
    }
  },
  exportJsonl: () => ledgerJsonl(get().records),
}));
