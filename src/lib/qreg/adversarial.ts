import { jsonEnsureAsciiFalse, canonicalJson, utf8Bytes } from "./canonical";
import { flipByte, leafDigest } from "./crypto";
import { evaluate } from "./engine";
import { sealRecord, toPreimage } from "./seal";
import { verifyRecord } from "./verifier";
import {
  GENESIS_HASH,
  STATUTORY_FACTOR,
  type AdversarialResult,
  type FilingInput,
  type SealedRecord,
} from "./types";

const BASE_INPUT: FilingInput = {
  entity: "PG&E Electric Power Entity",
  facilityId: "PGE-EPE-001",
  sector: "Electric Power Entity",
  airBasin: "Statewide",
  intervalStart: "2024-01-01T00:00:00.000Z",
  intervalEnd: "2024-12-31T23:59:59.000Z",
  mwh: 250,
};

function cloneRecord(record: SealedRecord): SealedRecord {
  return structuredClone(record);
}

function detectionOf(result: { issues: { code: string; message: string }[] }, fallback: string) {
  return result.issues[0]?.message ?? fallback;
}

export async function runAdversarialSuite(signingKey: CryptoKey): Promise<AdversarialResult[]> {
  const sealed = await sealRecord({
    input: BASE_INPUT,
    recordId: "adv-base-green",
    sealedAt: "2024-12-31T23:59:59.000Z",
    prevHash: GENESIS_HASH,
    priorLeaves: [],
    signingKey,
  });

  const results: AdversarialResult[] = [];

  // Vector 1 — leaf hash tampering (+1e-6 MT)
  {
    const mutated = cloneRecord(sealed);
    if (mutated.preimage.emissions_micro !== null) {
      mutated.preimage.emissions_micro += 1;
    }
    const checked = await verifyRecord(mutated, GENESIS_HASH);
    results.push({
      vector: 1,
      name: "Leaf Hash Tampering",
      mechanism: "Emissions payload mutated post-hashing (+10⁻⁶ MT)",
      detection: detectionOf(checked, "Pre-image SHA-256 mismatch"),
      verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
      detail: checked.issues.map((i) => i.code).join(", ") || "no issue",
    });
  }

  // Vector 2 — signature forgery (8-bit flip)
  {
    const mutated = cloneRecord(sealed);
    mutated.signature = flipByte(mutated.signature, 0);
    const checked = await verifyRecord(mutated, GENESIS_HASH);
    results.push({
      vector: 2,
      name: "Signature Forgery",
      mechanism: "8-bit bit-flip in Ed25519 signature",
      detection: detectionOf(checked, "Cryptographic signature failure"),
      verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
      detail: checked.issues.map((i) => i.code).join(", ") || "no issue",
    });
  }

  // Vector 3 — Unicode section drift
  {
    const mutated = cloneRecord(sealed);
    const drifted = utf8Bytes(jsonEnsureAsciiFalse(mutated.preimage));
    mutated.leafHash = await leafDigest(drifted);
    const checked = await verifyRecord(mutated, GENESIS_HASH);
    const ascii = canonicalJson(mutated.preimage);
    results.push({
      vector: 3,
      name: "Unicode Section Drift",
      mechanism: "ensure_ascii=False serialization on § symbol",
      detection: detectionOf(checked, "Pre-image mismatch across byte encodings"),
      verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
      detail: ascii.includes("\\u00a7")
        ? "Canonical wire form uses \\u00a7; UTF-8 C2 A7 rejected"
        : checked.issues.map((i) => i.code).join(", "),
    });
  }

  // Vector 4 — unapproved factor 0.427
  {
    const input: FilingInput = { ...BASE_INPUT, factor: 0.427 };
    const evaluation = evaluate(input);
    const attempted = await sealRecord({
      input,
      evaluation: {
        ...evaluation,
        gate: "GREEN",
        sealable: true,
        factor: 0.427,
      },
      recordId: "adv-unapproved-factor",
      sealedAt: sealed.sealedAt,
      prevHash: GENESIS_HASH,
      priorLeaves: [],
      signingKey,
    });
    const checked = await verifyRecord(attempted, GENESIS_HASH);
    results.push({
      vector: 4,
      name: "Unapproved Factor",
      mechanism: "Attempted injection of 0.427 MT/MWh",
      detection: detectionOf(checked, "Title 17 CCR §95111 statutory check"),
      verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
      detail: `engine_gate=${evaluation.gate}; verifier=${checked.issues.map((i) => i.code).join(",")}`,
    });
  }

  // Vector 5 — temporal inversion / negative MWh
  {
    const input: FilingInput = { ...BASE_INPUT, mwh: -25 };
    const evaluation = evaluate(input);
    const preimage = toPreimage(
      { ...input, intervalStart: "2024-12-31T00:00:00.000Z", intervalEnd: "2024-01-01T00:00:00.000Z" },
      {
        ...evaluation,
        valid: true,
        gate: "GREEN",
        status: "LIVE",
        sealable: true,
        factor: STATUTORY_FACTOR,
        mwhMilli: -25000,
        emissionsMicro: -25000 * 428,
        emissionsMt: -10.7,
        rejection: null,
      },
      "adv-temporal",
    );
    const forged = await sealRecord({
      input: { ...BASE_INPUT, mwh: 250 },
      recordId: "adv-temporal",
      sealedAt: sealed.sealedAt,
      prevHash: GENESIS_HASH,
      priorLeaves: [],
      signingKey,
    });
    forged.preimage = preimage;
    forged.evaluation.mwhMilli = -25000;
    const payload = utf8Bytes(canonicalJson(preimage));
    forged.leafHash = await leafDigest(payload);
    const checked = await verifyRecord(forged, GENESIS_HASH);
    results.push({
      vector: 5,
      name: "Temporal Inversion",
      mechanism: "Negative MWh consumption interval",
      detection: detectionOf(checked, "Interval range validation failure"),
      verdict: evaluation.valid || checked.accepted ? "ACCEPTED" : "REJECTED",
      detail: `engine_rejection=${evaluation.rejection ?? "none"}; ${checked.issues.map((i) => i.code).join(",")}`,
    });
  }

  // Vector 6 — float rounding drift
  {
    const mutated = cloneRecord(sealed);
    mutated.preimage.emissions_micro = Math.floor(250 * 0.428 * 1_000_000) - 2;
    const payload = utf8Bytes(canonicalJson(mutated.preimage));
    mutated.leafHash = await leafDigest(payload);
    const checked = await verifyRecord(mutated, GENESIS_HASH);
    results.push({
      vector: 6,
      name: "Float Rounding Drift",
      mechanism: "Truncated binary float error (> 10⁻⁶ MT)",
      detection: detectionOf(checked, "Fixed-point integer arithmetic check"),
      verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
      detail: checked.issues.map((i) => i.code).join(", ") || "no issue",
    });
  }

  // Vector 7 — YELLOW auto-seal
  {
    const input: FilingInput = {
      ...BASE_INPUT,
      warning: "Cogen steam allocation pending ARB review",
    };
    const evaluation = evaluate(input);
    const forced = await sealRecord({
      input,
      evaluation: { ...evaluation, sealable: true },
      recordId: "adv-yellow-seal",
      sealedAt: sealed.sealedAt,
      prevHash: GENESIS_HASH,
      priorLeaves: [],
      signingKey,
    });
    const checked = await verifyRecord(forced, GENESIS_HASH);
    results.push({
      vector: 7,
      name: "YELLOW Auto-Seal",
      mechanism: "Maliciously setting sealable = True on warning state",
      detection: detectionOf(checked, "Invariant check: YELLOW never sealed"),
      verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
      detail: `engine_sealable=${evaluation.sealable}; verifier=${checked.issues.map((i) => i.code).join(",")}`,
    });
  }

  // Vector 8 — silent fault conversion
  {
    const input: FilingInput = { ...BASE_INPUT, retrievalFailure: true };
    const evaluation = evaluate(input);
    const forced = await sealRecord({
      input,
      evaluation: { ...evaluation, gate: "BLACK" },
      recordId: "adv-fault-black",
      sealedAt: sealed.sealedAt,
      prevHash: GENESIS_HASH,
      priorLeaves: [],
      signingKey,
    });
    const checked = await verifyRecord(forced, GENESIS_HASH);
    results.push({
      vector: 8,
      name: "Silent Fault Conversion",
      mechanism: "Forcing PIPELINE_ERROR to BLACK",
      detection: detectionOf(checked, "Fault isolation check (PIPELINE_ERROR ≠ BLACK)"),
      verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
      detail: `engine_gate=${evaluation.gate}; verifier=${checked.issues.map((i) => i.code).join(",")}`,
    });
  }

  // Vector 9 — fallback factor bypass
  {
    const input: FilingInput = { ...BASE_INPUT, retrievalFailure: true };
    const evaluation = evaluate(input);
    const forced = await sealRecord({
      input,
      evaluation: {
        ...evaluation,
        emissionsMicro: 107_000_000,
        emissionsMt: 107,
        factor: STATUTORY_FACTOR,
      },
      recordId: "adv-fallback-score",
      sealedAt: sealed.sealedAt,
      prevHash: GENESIS_HASH,
      priorLeaves: [],
      signingKey,
    });
    const checked = await verifyRecord(forced, GENESIS_HASH);
    results.push({
      vector: 9,
      name: "Fallback Factor Bypass",
      mechanism: "Injecting numeric emissions score during node outage",
      detection: detectionOf(checked, "Invariant check: SCORE_ON_RETRIEVAL_FAILURE = None"),
      verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
      detail: `engine_score=${evaluation.emissionsMicro}; verifier=${checked.issues.map((i) => i.code).join(",")}`,
    });
  }

  return results;
}
