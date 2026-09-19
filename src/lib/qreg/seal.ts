import { canonicalJson, utf8Bytes } from "./canonical";
import { leafDigest, signLeaf } from "./crypto";
import { evaluate } from "./engine";
import { chainAdvance, inclusionProof, merkleRoot } from "./merkle";
import {
  DEMO_SIGNING_JWK,
  GENESIS_HASH,
  type Evaluation,
  type FilingInput,
  type FilingPreimage,
  type SealedRecord,
} from "./types";

export function toPreimage(
  input: FilingInput,
  evaluation: Evaluation,
  recordId: string,
): FilingPreimage {
  return {
    air_basin: input.airBasin,
    citation: evaluation.citation,
    emissions_micro: evaluation.emissionsMicro,
    entity: input.entity,
    facility_id: input.facilityId,
    factor: evaluation.factor,
    gate: evaluation.gate,
    interval_end: input.intervalEnd,
    interval_start: input.intervalStart,
    mwh_milli: evaluation.mwhMilli,
    record_id: recordId,
    sealable: evaluation.sealable,
    sector: input.sector,
    status: evaluation.status,
    warning: evaluation.warning,
  };
}

export async function sealRecord(args: {
  input: FilingInput
  evaluation?: Evaluation
  recordId: string
  sealedAt: string
  prevHash: string
  priorLeaves: string[]
  signingKey: CryptoKey
}): Promise<SealedRecord> {
  const evaluation = args.evaluation ?? evaluate(args.input);
  if (!evaluation.valid) {
    throw new Error(evaluation.rejection ?? "Filing rejected by PolicyEngine");
  }
  const preimage = toPreimage(args.input, evaluation, args.recordId);
  const payload = utf8Bytes(canonicalJson(preimage));
  const leafHash = await leafDigest(payload);
  const signature = await signLeaf(leafHash, args.signingKey);
  const prevHash = args.prevHash || GENESIS_HASH;
  const chainHead = await chainAdvance(prevHash, leafHash);
  const leaves = [...args.priorLeaves, leafHash];
  const root = await merkleRoot(leaves);
  const inclusion = await inclusionProof(leaves, leaves.length - 1);
  return {
    preimage,
    evaluation,
    leafHash,
    signature,
    publicKey: DEMO_SIGNING_JWK.x,
    prevHash,
    chainHead,
    merkleRoot: root,
    sealedAt: args.sealedAt,
    inclusion,
  };
}

export function ledgerJsonl(records: SealedRecord[]): string {
  return records
    .map((record) =>
      JSON.stringify({
        record_id: record.preimage.record_id,
        entity: record.preimage.entity,
        facility_id: record.preimage.facility_id,
        sector: record.preimage.sector,
        air_basin: record.preimage.air_basin,
        interval_start: record.preimage.interval_start,
        interval_end: record.preimage.interval_end,
        mwh: record.preimage.mwh_milli / 1000,
        mwh_milli: record.preimage.mwh_milli,
        factor: record.preimage.factor,
        emissions_mt:
          record.preimage.emissions_micro === null
            ? null
            : record.preimage.emissions_micro / 1_000_000,
        emissions_micro: record.preimage.emissions_micro,
        gate: record.preimage.gate,
        status: record.preimage.status,
        sealable: record.preimage.sealable,
        citation: record.preimage.citation,
        warning: record.preimage.warning,
        leaf_hash: record.leafHash,
        signature: record.signature,
        public_key: record.publicKey,
        prev_hash: record.prevHash,
        chain_head: record.chainHead,
        merkle_root: record.merkleRoot,
        sealed_at: record.sealedAt,
        inclusion: record.inclusion,
      }),
    )
    .join("\n");
}
