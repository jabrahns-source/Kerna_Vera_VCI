import type { FilingInput } from "../types";

export type BenchmarkEntity = FilingInput & {
  recordId: string
  notes: string
};

/**
 * CARB MRR 2024 representative filings.
 *
 * Totals (engine-computed, not hardcoded):
 *   1,835.00 MWh
 *   734.0200 MT CO₂e  (PIPELINE_ERROR contributes none)
 *   BLACK deficit 487.92 MT × $160/MT = $78,067.20
 *   Gates: 1 GREEN · 2 YELLOW · 2 BLACK · 1 PIPELINE_ERROR
 */
export const MRR_2024: BenchmarkEntity[] = [
  {
    recordId: "mrr-2024-001",
    entity: "PG&E Electric Power Entity",
    facilityId: "PGE-EPE-001",
    sector: "Electric Power Entity",
    airBasin: "Statewide",
    intervalStart: "2024-01-01T00:00:00.000Z",
    intervalEnd: "2024-12-31T23:59:59.000Z",
    mwh: 250,
    notes: "Specified source with verified e-tags. Statutory factor applied.",
  },
  {
    recordId: "mrr-2024-002",
    entity: "Tesla Fremont",
    facilityId: "TESLA-FRE-FREMONT",
    sector: "Vehicle Manufacturing",
    airBasin: "San Francisco Bay",
    intervalStart: "2024-01-01T00:00:00.000Z",
    intervalEnd: "2024-12-31T23:59:59.000Z",
    mwh: 175,
    warning: "Behind-the-meter solar subtraction unverified",
    notes: "YELLOW remediation hold — on-site PV claim pending meter-data review.",
  },
  {
    recordId: "mrr-2024-003",
    entity: "Chevron Richmond",
    facilityId: "CVX-RCH-REFINERY",
    sector: "Petroleum Refining",
    airBasin: "San Francisco Bay",
    intervalStart: "2024-01-01T00:00:00.000Z",
    intervalEnd: "2024-12-31T23:59:59.000Z",
    mwh: 150,
    warning: "Cogen steam allocation pending ARB review",
    notes: "YELLOW remediation hold — cogeneration allocation not yet accepted.",
  },
  {
    recordId: "mrr-2024-004",
    entity: "LADWP Haynes",
    facilityId: "LADWP-HAY-GEN",
    sector: "Electricity Generation",
    airBasin: "South Coast",
    intervalStart: "2024-01-01T00:00:00.000Z",
    intervalEnd: "2024-12-31T23:59:59.000Z",
    mwh: 720,
    deficit: true,
    warning: "Unbundled REC claim rejected under MRR",
    notes: "BLACK deficit interval. Statutory 4:1 surrender exposure applies.",
  },
  {
    recordId: "mrr-2024-005",
    entity: "CalPortland Mojave",
    facilityId: "CPC-MJV-CEMENT",
    sector: "Cement Manufacturing",
    airBasin: "Mojave Desert",
    intervalStart: "2024-01-01T00:00:00.000Z",
    intervalEnd: "2024-12-31T23:59:59.000Z",
    mwh: 420,
    deficit: true,
    warning: "Stationary combustion double-counted against Title V",
    notes: "BLACK deficit interval. Scope 2 grid power with overlapping Title V claim.",
  },
  {
    recordId: "mrr-2024-006",
    entity: "CAISO OASIS Node",
    facilityId: "CAISO-OASIS-EPE",
    sector: "Electric Power Entity",
    airBasin: "Statewide",
    intervalStart: "2024-01-01T00:00:00.000Z",
    intervalEnd: "2024-12-31T23:59:59.000Z",
    mwh: 120,
    retrievalFailure: true,
    warning: "e-tag retrieval timeout",
    notes: "PIPELINE_ERROR. Score is None; fault is isolated from BLACK.",
  },
];

export const MRR_YEAR = 2024;
export const MRR_REGULATION = "CARB SB 253 / Mandatory Reporting Regulation 2024";
