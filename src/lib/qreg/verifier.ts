/**
 * Clean-room auditor.
 *
 * Deliberately does not import PolicyEngine (`engine.ts`) or the sealer.
 * Statutory constants are re-declared here. Hashing, signature checks, and
 * gate invariants are recomputed from the pre-image alone.
 */
import { canonicalJson, utf8Bytes } from "./canonical";
import {
  hexToBytes,
  importVerifyKey,
  leafDigest,
  sha256,
  concatBytes,
  verifyLeaf,
} from "./crypto";
import { verifyInclusion } from "./merkle";
import {
  GENESIS_HASH,
  type SealedRecord,
  type VerifyIssue,
  type VerifyResult,
} from "./types";

const STATUTORY_FACTOR = 0.428;
const MICRO_SCALE = 1_000_000;
const DRIFT_BOUND = 1e-6;

function issue(code: string, message: string): VerifyIssue {
  return { code, message };
}

async function chainAdvance(prevHash: string, leafHash: string): Promise<string> {
  const digest = await sha256(concatBytes(hexToBytes(prevHash), hexToBytes(leafHash)));
  return Array.from(digest, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyRecord(
  record: SealedRecord,
  expectedPrev: string,
): Promise<VerifyResult> {
  const issues: VerifyIssue[] = [];
  const pre = record.preimage;
  let recomputedLeaf: string | null = null;

  try {
    const payload = utf8Bytes(canonicalJson(pre));
    recomputedLeaf = await leafDigest(payload);
    if (recomputedLeaf !== record.leafHash) {
      issues.push(
        issue(
          "PREIMAGE_MISMATCH",
          `Pre-image SHA-256 mismatch (stored ${record.leafHash.slice(0, 12)}…, recomputed ${recomputedLeaf.slice(0, 12)}…)`,
        ),
      );
    }
  } catch (err) {
    issues.push(issue("PREIMAGE_ERROR", err instanceof Error ? err.message : "pre-image failed"));
  }

  const verifyKey = await importVerifyKey(record.publicKey);
  const leafForSig = recomputedLeaf ?? record.leafHash;
  const sigOk = await verifyLeaf(leafForSig, record.signature, verifyKey);
  if (!sigOk) {
    issues.push(issue("SIGNATURE_FAILURE", "Cryptographic signature failure"));
  }

  if (pre.mwh_milli < 0) {
    issues.push(issue("INTERVAL_RANGE", "Interval range validation failure"));
  }
  const start = Date.parse(pre.interval_start);
  const end = Date.parse(pre.interval_end);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    issues.push(issue("INTERVAL_RANGE", "Interval range validation failure"));
  }

  if (pre.status === "PIPELINE_ERROR") {
    if (pre.gate !== "PIPELINE_ERROR") {
      issues.push(
        issue(
          "FAULT_ISOLATION",
          "Fault isolation check (PIPELINE_ERROR ≠ BLACK): status PIPELINE_ERROR requires matching gate",
        ),
      );
    }
    if (pre.gate === "BLACK") {
      issues.push(issue("FAULT_ISOLATION", "Fault isolation check (PIPELINE_ERROR ≠ BLACK)"));
    }
    if (pre.emissions_micro !== null) {
      issues.push(
        issue("SCORE_ON_RETRIEVAL_FAILURE", "Invariant check: SCORE_ON_RETRIEVAL_FAILURE = None"),
      );
    }
    if (pre.factor !== null) {
      issues.push(
        issue("SCORE_ON_RETRIEVAL_FAILURE", "Invariant check: SCORE_ON_RETRIEVAL_FAILURE = None"),
      );
    }
  }

  if (pre.gate === "YELLOW" && pre.sealable) {
    issues.push(issue("REMEDIATION_HOLD", "Invariant check: YELLOW never sealed"));
  }

  if (pre.sealable) {
    const safe =
      pre.gate === "GREEN" && pre.status === "LIVE" && pre.factor === STATUTORY_FACTOR;
    if (!safe) {
      issues.push(
        issue(
          "SEALING_SAFETY",
          "Sealable ⇒ Gate=GREEN ∧ Status=LIVE ∧ Factor=0.428",
        ),
      );
    }
  }

  if (pre.gate === "GREEN" && pre.factor !== STATUTORY_FACTOR) {
    issues.push(issue("STATUTORY_FACTOR", "Title 17 CCR §95111 statutory check"));
  }

  if (pre.factor !== null && pre.factor !== STATUTORY_FACTOR) {
    issues.push(issue("UNAPPROVED_FACTOR", "Title 17 CCR §95111 statutory check"));
  }

  if (pre.emissions_micro !== null) {
    const mwh = pre.mwh_milli / 1000;
    const drift = Math.abs(pre.emissions_micro / MICRO_SCALE - mwh * STATUTORY_FACTOR);
    if (drift > DRIFT_BOUND) {
      issues.push(issue("FLOAT_DRIFT", "Fixed-point integer arithmetic check"));
    }
    const expectedMicro = pre.mwh_milli * 428;
    if (pre.emissions_micro !== expectedMicro) {
      issues.push(issue("FLOAT_DRIFT", "Fixed-point integer arithmetic check"));
    }
  }

  if (record.prevHash !== expectedPrev) {
    issues.push(
      issue(
        "CHAIN_BREAK",
        `Merkle chain predecessor mismatch (expected ${expectedPrev.slice(0, 12)}…)`,
      ),
    );
  }

  const recomputedHead = await chainAdvance(record.prevHash, record.leafHash);
  if (recomputedHead !== record.chainHead) {
    issues.push(issue("CHAIN_HEAD", "Chain head does not match SHA-256(prev || leaf)"));
  }

  const inclusionOk = await verifyInclusion(
    record.leafHash,
    record.inclusion,
    record.merkleRoot,
  );
  if (!inclusionOk) {
    issues.push(issue("INCLUSION", "Merkle inclusion proof failed"));
  }

  return {
    recordId: pre.record_id,
    entity: pre.entity,
    accepted: issues.length === 0,
    issues,
    recomputedLeaf,
  };
}

export async function verifyLedger(records: SealedRecord[]): Promise<VerifyResult[]> {
  const results: VerifyResult[] = [];
  let prev = GENESIS_HASH;
  for (const record of records) {
    results.push(await verifyRecord(record, prev));
    prev = record.chainHead;
  }
  return results;
}
