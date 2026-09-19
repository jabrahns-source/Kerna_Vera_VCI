import { GateChip } from "@/components/qreg/gate-chip";
import { PageHeader } from "@/components/qreg/page-header";
import { StatusBlock } from "@/components/qreg/status-block";
import { useEngine } from "@/components/qreg/use-engine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { evaluate } from "@/lib/qreg/engine";
import { formatMt, formatMwh } from "@/lib/qreg/format";
import { useQreg } from "@/lib/qreg/store";
import type { FilingInput } from "@/lib/qreg/types";
import { STATUTORY_FACTOR } from "@/lib/qreg/types";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/engine")({ component: EnginePage });

const PRESETS = [
  { label: "Custom facility", entity: "Custom Facility", facilityId: "CUSTOM-001", sector: "Industrial", airBasin: "Statewide" },
  { label: "PG&E EPE", entity: "PG&E Electric Power Entity", facilityId: "PGE-EPE-001", sector: "Electric Power Entity", airBasin: "Statewide" },
  { label: "Tesla Fremont", entity: "Tesla Fremont", facilityId: "TESLA-FRE-FREMONT", sector: "Vehicle Manufacturing", airBasin: "San Francisco Bay" },
  { label: "Chevron Richmond", entity: "Chevron Richmond", facilityId: "CVX-RCH-REFINERY", sector: "Petroleum Refining", airBasin: "San Francisco Bay" },
];

function EnginePage() {
  const { ready, busy, error } = useEngine();
  const fileAndSeal = useQreg((s) => s.fileAndSeal);

  const [preset, setPreset] = useState(0);
  const [entity, setEntity] = useState(PRESETS[0]!.entity);
  const [facilityId, setFacilityId] = useState(PRESETS[0]!.facilityId);
  const [mwh, setMwh] = useState("100");
  const [factor, setFactor] = useState(String(STATUTORY_FACTOR));
  const [warning, setWarning] = useState("");
  const [retrievalFailure, setRetrievalFailure] = useState(false);
  const [deficit, setDeficit] = useState(false);
  const [start, setStart] = useState("2024-01-01T00:00");
  const [end, setEnd] = useState("2024-12-31T23:59");
  const [sealing, setSealing] = useState(false);

  const input: FilingInput = useMemo(
    () => ({
      entity,
      facilityId,
      sector: PRESETS[preset]?.sector ?? "Industrial",
      airBasin: PRESETS[preset]?.airBasin ?? "Statewide",
      intervalStart: safeIso(start),
      intervalEnd: safeIso(end),
      mwh: Number.parseFloat(mwh) || 0,
      factor: Number.parseFloat(factor),
      warning: warning.trim() || null,
      retrievalFailure,
      deficit,
    }),
    [entity, facilityId, preset, start, end, mwh, factor, warning, retrievalFailure, deficit],
  );

  const evaluation = evaluate(input);

  async function onSeal() {
    setSealing(true);
    try {
      const record = await fileAndSeal(input);
      toast.success(`Appended ${record.preimage.record_id} to the Merkle chain`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Seal failed");
    } finally {
      setSealing(false);
    }
  }

  if (error) return <StatusBlock message={error} />;

  return (
    <div>
      <PageHeader
        kicker="PolicyEngine"
        title="Evaluate a filing interval."
        lede="Fixed-point micro-MT arithmetic. Statutory factor 0.428 MT/MWh under Title 17 CCR §95111. YELLOW never seals. PIPELINE_ERROR never becomes BLACK."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form
          className="kerna-enter space-y-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]"
          onSubmit={(e) => {
            e.preventDefault();
            void onSeal();
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="preset">Entity preset</Label>
            <select
              id="preset"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={preset}
              onChange={(e) => {
                const i = Number(e.target.value);
                setPreset(i);
                const p = PRESETS[i];
                if (p) {
                  setEntity(p.entity);
                  setFacilityId(p.facilityId);
                }
              }}
            >
              {PRESETS.map((p, i) => (
                <option key={p.facilityId} value={i}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Entity" value={entity} onChange={setEntity} />
            <Field label="Facility ID" value={facilityId} onChange={setFacilityId} />
            <Field label="MWh" value={mwh} onChange={setMwh} type="number" />
            <Field label="Claimed factor" value={factor} onChange={setFactor} />
            <Field label="Interval start" value={start} onChange={setStart} type="datetime-local" />
            <Field label="Interval end" value={end} onChange={setEnd} type="datetime-local" />
          </div>
          <Field
            label="Warning / quality hold"
            value={warning}
            onChange={setWarning}
            placeholder="Leave empty for GREEN"
          />
          <div className="flex flex-wrap gap-5 pt-1 text-sm">
            <label className="flex min-h-11 items-center gap-2">
              <input
                type="checkbox"
                checked={retrievalFailure}
                onChange={(e) => setRetrievalFailure(e.target.checked)}
              />
              Retrieval failure
            </label>
            <label className="flex min-h-11 items-center gap-2">
              <input
                type="checkbox"
                checked={deficit}
                onChange={(e) => setDeficit(e.target.checked)}
              />
              BLACK deficit
            </label>
          </div>
          <Button type="submit" disabled={sealing || busy || !ready || !evaluation.valid}>
            {sealing ? "Sealing…" : evaluation.sealable ? "Seal to ledger" : "Append (not sealable)"}
          </Button>
        </form>

        <section className="kerna-enter-2 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Engine decision</h2>
            <GateChip gate={evaluation.gate} />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <Item k="Status" v={evaluation.status} />
            <Item k="Sealable" v={evaluation.sealable ? "True" : "False"} />
            <Item k="Factor" v={evaluation.factor === null ? "None" : String(evaluation.factor)} />
            <Item k="MWh (milli)" v={String(evaluation.mwhMilli)} />
            <Item
              k="Emissions"
              v={
                evaluation.emissionsMt === null
                  ? "None"
                  : `${formatMt(evaluation.emissionsMt)} MT`
              }
            />
            <Item
              k="Drift"
              v={evaluation.drift === null ? "—" : `${evaluation.drift.toExponential(2)} MT`}
            />
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{evaluation.reason}</p>
          {evaluation.rejection ? (
            <p className="mt-3 text-sm text-destructive">{evaluation.rejection}</p>
          ) : null}
          <p className="mt-6 font-mono text-[11px] text-muted-foreground">{evaluation.citation}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatMwh(Number.parseFloat(mwh) || 0)} MWh × 0.428 ={" "}
            {formatMt((Number.parseFloat(mwh) || 0) * STATUTORY_FACTOR)} MT (IEEE float reference)
          </p>
        </section>
      </div>
    </div>
  );
}

function safeIso(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "invalid";
  return d.toISOString();
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        step={type === "number" ? "any" : undefined}
      />
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{k}</dt>
      <dd className="mt-1 font-mono text-sm">{v}</dd>
    </div>
  );
}
