import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { GateChip } from "@/components/qreg/gate-chip";
import { HashLine } from "@/components/qreg/hash-line";
import { PageHeader } from "@/components/qreg/page-header";
import { useEngine } from "@/components/qreg/use-engine";
import { Button } from "@/components/ui/button";
import { formatMt, formatMwh, formatUsd, mwhFromMilli } from "@/lib/qreg/format";
import { previewRows, previewTotals } from "@/lib/qreg/preview";
import { ledgerTotals, useQreg } from "@/lib/qreg/store";
import { microToMt } from "@/lib/qreg/engine";
import type { Gate } from "@/lib/qreg/types";

export const Route = createFileRoute("/")({ component: Command });

function Command() {
  useEngine();
  const records = useQreg((s) => s.records);
  const verifyResults = useQreg((s) => s.verifyResults);
  const runBenchmark = useQreg((s) => s.runBenchmark);
  const busy = useQreg((s) => s.busy);
  const error = useQreg((s) => s.error);

  const sealed = records.length > 0;
  const preview = previewTotals();
  const totals = sealed ? ledgerTotals(records) : preview;
  const passed = verifyResults.filter((r) => r.accepted).length;
  const gateTotal = Math.max(totals.count, 1);
  const rows = sealed
    ? records.map((record) => ({
        id: record.preimage.record_id,
        entity: record.preimage.entity,
        facilityId: record.preimage.facility_id,
        mwh: mwhFromMilli(record.preimage.mwh_milli),
        mt:
          record.preimage.emissions_micro === null
            ? null
            : microToMt(record.preimage.emissions_micro),
        gate: record.preimage.gate,
        sealable: record.preimage.sealable,
      }))
    : previewRows().map((row) => ({
        id: row.recordId,
        entity: row.entity,
        facilityId: row.facilityId,
        mwh: row.mwh,
        mt: row.evaluation.emissionsMt,
        gate: row.evaluation.gate,
        sealable: row.evaluation.sealable,
      }));

  return (
    <div className="min-w-0">
      <PageHeader
        kicker="Command · CARB MRR 2024"
        title="Verified carbon intelligence."
        lede="Q-Reg evaluates California Scope 2 filings at the statutory 0.428 MT/MWh factor, then seals them to an Ed25519 / SHA-256 Merkle chain. Clean-room verification runs independently of the engine."
        action={
          <Button variant="outline" onClick={() => void runBenchmark()} disabled={busy}>
            Re-run benchmark
          </Button>
        }
      />

      {error ? (
        <p className="mb-4 text-sm text-destructive">{error}</p>
      ) : null}

      <div className="kerna-enter-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Evaluated energy" value={`${formatMwh(totals.mwh)} MWh`} hint="Six MRR intervals" />
        <Metric
          label="Scope 2 GHG"
          value={`${formatMt(totals.mt)} MT`}
          hint="PIPELINE_ERROR contributes none"
        />
        <Metric
          label="Surrender exposure"
          value={formatUsd(totals.surrenderUsd)}
          hint={`${formatMt(totals.blackMt)} MT BLACK × $160`}
        />
        <Metric
          label="Clean-room"
          value={sealed ? `${passed}/${totals.count}` : "sealing"}
          hint="Independent re-verification"
        />
      </div>

      <div className="kerna-enter-3 mt-6 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="min-w-0 overflow-hidden rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-medium">Gate allocation</h2>
            <p className="text-[11px] text-muted-foreground">
              {totals.gates.GREEN} GREEN · {totals.gates.YELLOW} YELLOW · {totals.gates.BLACK} BLACK ·{" "}
              {totals.gates.PIPELINE_ERROR} ERROR
            </p>
          </div>
          <div className="flex h-3 overflow-hidden rounded-full bg-secondary">
            <Bar className="bg-gate-green" flex={totals.gates.GREEN / gateTotal} />
            <Bar className="bg-gate-yellow" flex={totals.gates.YELLOW / gateTotal} />
            <Bar className="bg-gate-black" flex={totals.gates.BLACK / gateTotal} />
            <Bar className="bg-gate-error" flex={totals.gates.PIPELINE_ERROR / gateTotal} />
          </div>
          <div className="mt-6 -mx-5 overflow-x-auto px-5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="pb-2 font-medium">Entity</th>
                  <th className="pb-2 font-medium">MWh</th>
                  <th className="pb-2 font-medium">MT</th>
                  <th className="pb-2 font-medium">Gate</th>
                  <th className="hidden pb-2 font-medium sm:table-cell">Sealable</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-3">
                      <p className="font-medium">{row.entity}</p>
                      <p className="hidden font-mono text-[11px] text-muted-foreground sm:block">
                        {row.facilityId}
                      </p>
                    </td>
                    <td className="py-3 font-mono tabular">{formatMwh(row.mwh)}</td>
                    <td className="py-3 font-mono tabular">{formatMt(row.mt)}</td>
                    <td className="py-3">
                      <GateChip gate={row.gate as Gate} />
                    </td>
                    <td className="hidden py-3 text-muted-foreground sm:table-cell">
                      {row.sealable ? "Yes" : "Hold"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex min-w-0 flex-col gap-4">
          <div className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <h2 className="text-sm font-medium">Committed Merkle root</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Binary tree over length-delimited SHA-256 leaves.
            </p>
            <div className="mt-4 min-w-0 space-y-2">
              {sealed ? (
                <>
                  <HashLine label="Root" value={ledgerTotals(records).merkleRoot} />
                  <HashLine label="Chain" value={ledgerTotals(records).chainHead} />
                </>
              ) : (
                <p className="font-mono text-xs text-muted-foreground">Sealing Ed25519 chain…</p>
              )}
            </div>
          </div>
          <div className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <h2 className="text-sm font-medium">Invariant surface</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <Li to="/adversarial" label="9 adversarial vectors" detail="Clean-room rejection suite" />
              <Li to="/proofs" label="6 SMT theorems" detail="Gate algebra + float bound" />
              <Li to="/certificate" label="SB 253 certificate" detail="Printable audit instrument" />
              <Li to="/engine" label="File an interval" detail="Evaluate against §95111" />
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-mono text-2xl tabular tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Bar({ className, flex }: { className: string; flex: number }) {
  if (flex <= 0) return null;
  return <div className={className} style={{ flex }} />;
}

function Li({ to, label, detail }: { to: string; label: string; detail: string }) {
  return (
    <li>
      <Link to={to} className="group flex items-start justify-between gap-3">
        <span>
          <span className="block font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">{detail}</span>
        </span>
        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </li>
  );
}
