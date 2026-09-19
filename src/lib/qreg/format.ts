import type { Gate } from "./types";

export function formatMt(value: number | null | undefined, digits = 4): string {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(digits)}`;
}

export function formatMwh(value: number, digits = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatUsd(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export function truncateHash(hash: string, edge = 6): string {
  if (hash.length <= edge * 2 + 1) return hash;
  return `${hash.slice(0, edge)}…${hash.slice(-edge)}`;
}

export function gateLabel(gate: Gate): string {
  if (gate === "PIPELINE_ERROR") return "PIPELINE ERROR";
  return gate;
}

export function mwhFromMilli(milli: number): number {
  return milli / 1000;
}
