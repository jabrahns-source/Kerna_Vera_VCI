import { MRR_2024 } from "./datasets/mrr2024";
import { blackSurrenderUsd, evaluate } from "./engine";
import type { Evaluation, Gate } from "./types";

export type PreviewRow = {
  recordId: string
  entity: string
  facilityId: string
  sector: string
  mwh: number
  evaluation: Evaluation
};

export function previewRows(): PreviewRow[] {
  return MRR_2024.map((entity) => ({
    recordId: entity.recordId,
    entity: entity.entity,
    facilityId: entity.facilityId,
    sector: entity.sector,
    mwh: entity.mwh,
    evaluation: evaluate(entity),
  }));
}

export function previewTotals() {
  const rows = previewRows();
  let mwh = 0;
  let mt = 0;
  let blackMt = 0;
  const gates: Record<Gate, number> = {
    GREEN: 0,
    YELLOW: 0,
    BLACK: 0,
    PIPELINE_ERROR: 0,
  };
  for (const row of rows) {
    mwh += row.mwh;
    if (row.evaluation.emissionsMt !== null) mt += row.evaluation.emissionsMt;
    if (row.evaluation.gate === "BLACK" && row.evaluation.emissionsMt !== null) {
      blackMt += row.evaluation.emissionsMt;
    }
    gates[row.evaluation.gate] += 1;
  }
  return {
    mwh,
    mt,
    blackMt,
    surrenderUsd: blackSurrenderUsd(blackMt),
    gates,
    count: rows.length,
  };
}
