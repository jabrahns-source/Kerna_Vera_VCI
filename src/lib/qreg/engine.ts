import {
  CITATION,
  DRIFT_BOUND,
  MICRO_SCALE,
  STATUTORY_FACTOR,
  type Evaluation,
  type FilingInput,
} from "./types";

export function mwhToMilli(mwh: number): number {
  return Math.round(mwh * 1000);
}

export function milliToMwh(milli: number): number {
  return milli / 1000;
}

/** Z[φ]_μ = MWh_milli × 428. Exact for filings quantized to 0.001 MWh. */
export function emissionsMicroFromMilli(mwhMilli: number): number {
  return mwhMilli * 428;
}

export function microToMt(micro: number): number {
  return micro / MICRO_SCALE;
}

export function floatDrift(mwh: number, emissionsMicro: number): number {
  return Math.abs(emissionsMicro / MICRO_SCALE - mwh * STATUTORY_FACTOR);
}

function invalid(reason: string, input: FilingInput): Evaluation {
  return {
    gate: "PIPELINE_ERROR",
    status: "PIPELINE_ERROR",
    sealable: false,
    factor: null,
    mwhMilli: Number.isFinite(input.mwh) ? mwhToMilli(input.mwh) : 0,
    emissionsMicro: null,
    emissionsMt: null,
    warning: reason,
    reason,
    citation: CITATION,
    drift: null,
    valid: false,
    rejection: reason,
  };
}

export function evaluate(input: FilingInput): Evaluation {
  const start = Date.parse(input.intervalStart);
  const end = Date.parse(input.intervalEnd);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return invalid("Interval range validation failure", input);
  }
  if (!Number.isFinite(input.mwh) || input.mwh < 0) {
    return invalid("Interval range validation failure", input);
  }

  if (input.retrievalFailure) {
    return {
      gate: "PIPELINE_ERROR",
      status: "PIPELINE_ERROR",
      sealable: false,
      factor: null,
      mwhMilli: mwhToMilli(input.mwh),
      emissionsMicro: null,
      emissionsMt: null,
      warning: input.warning ?? "Node retrieval failure",
      reason: "SCORE_ON_RETRIEVAL_FAILURE = None",
      citation: CITATION,
      drift: null,
      valid: true,
      rejection: null,
    };
  }

  const claimed = input.factor ?? STATUTORY_FACTOR;
  const mwhMilli = mwhToMilli(input.mwh);
  const emissionsMicro = emissionsMicroFromMilli(mwhMilli);
  const drift = floatDrift(input.mwh, emissionsMicro);

  if (drift > DRIFT_BOUND) {
    return invalid("Fixed-point integer arithmetic check", input);
  }

  if (claimed !== STATUTORY_FACTOR) {
    return {
      gate: "BLACK",
      status: "LIVE",
      sealable: false,
      factor: claimed,
      mwhMilli,
      emissionsMicro,
      emissionsMt: microToMt(emissionsMicro),
      warning: `Unapproved factor ${claimed} MT/MWh`,
      reason: "Title 17 CCR §95111 statutory check",
      citation: CITATION,
      drift,
      valid: true,
      rejection: null,
    };
  }

  if (input.deficit) {
    return {
      gate: "BLACK",
      status: "LIVE",
      sealable: false,
      factor: STATUTORY_FACTOR,
      mwhMilli,
      emissionsMicro,
      emissionsMt: microToMt(emissionsMicro),
      warning: input.warning ?? "BLACK deficit interval",
      reason: "Statutory 4:1 surrender on BLACK deficit",
      citation: CITATION,
      drift,
      valid: true,
      rejection: null,
    };
  }

  if (input.warning) {
    return {
      gate: "YELLOW",
      status: "LIVE",
      sealable: false,
      factor: STATUTORY_FACTOR,
      mwhMilli,
      emissionsMicro,
      emissionsMt: microToMt(emissionsMicro),
      warning: input.warning,
      reason: "Remediation hold — YELLOW never sealed",
      citation: CITATION,
      drift,
      valid: true,
      rejection: null,
    };
  }

  return {
    gate: "GREEN",
    status: "LIVE",
    sealable: true,
    factor: STATUTORY_FACTOR,
    mwhMilli,
    emissionsMicro,
    emissionsMt: microToMt(emissionsMicro),
    warning: null,
    reason: "Statutory factor 0.428 MT/MWh · sealable",
    citation: CITATION,
    drift,
    valid: true,
    rejection: null,
  };
}

export function blackSurrenderUsd(blackMt: number): number {
  return Math.round(blackMt * 160 * 100) / 100;
}
