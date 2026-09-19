import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/qreg/page-header";
import { StatusBlock } from "@/components/qreg/status-block";
import { useEngine } from "@/components/qreg/use-engine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQreg } from "@/lib/qreg/store";

export const Route = createFileRoute("/proofs")({ component: ProofsPage });

type TheoremView = {
  id: number
  title: string
  statement: string
  notes: string
  proved?: boolean
  domainSize?: number
  counterexamples?: string[]
};

function ProofsPage() {
  const { ready, busy, error } = useEngine();
  const theorems = useQreg((s) => s.theorems);
  const runProofs = useQreg((s) => s.runProofs);

  if (error) return <StatusBlock message={error} />;

  const proved = theorems.filter((t) => t.proved).length;

  return (
    <div>
      <PageHeader
        kicker="Formal invariants"
        title="Six theorems on the gate algebra."
        lede="Bounded model checking over the product domain D of MWh, claimed factors, retrieval faults, deficit flags, quality holds, and inverted intervals. Theorem 6 samples the float-drift identity through 10⁶ MWh."
        action={
          <Button onClick={() => void runProofs()} disabled={busy}>
            {busy && theorems.length === 0 ? "Proving…" : "Execute prover"}
          </Button>
        }
      />

      {theorems.length > 0 ? (
        <p className="mb-6 font-mono text-sm text-muted-foreground">
          {proved}/{theorems.length} theorems discharged
        </p>
      ) : null}

      <ol className="space-y-3">
        {(theorems.length > 0 ? theorems : THEOREM_COPY).map((t: TheoremView) => (
          <li key={t.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] text-muted-foreground">
                Theorem {t.id}
              </p>
              {t.proved === undefined ? (
                <Badge variant="outline">Unproved</Badge>
              ) : (
                <Badge variant={t.proved ? "green" : "black"}>
                  {t.proved ? "Proved" : "Failed"}
                </Badge>
              )}
            </div>
            <h2 className="mt-2 text-base font-medium">{t.title}</h2>
            <p className="mt-2 font-mono text-xs leading-relaxed text-foreground/85">{t.statement}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.notes}</p>
            {t.domainSize !== undefined ? (
              <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Domain |D| = {t.domainSize}
                {t.counterexamples && t.counterexamples.length > 0
                  ? ` · counterexamples ${t.counterexamples.join("; ")}`
                  : ""}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

const THEOREM_COPY: TheoremView[] = [
  {
    id: 1,
    title: "Gate Mutual Exclusivity",
    statement: "∀ x ∈ D, ¬(Gate(x) = GREEN ∧ Gate(x) = BLACK)",
    notes: "GREEN and BLACK are disjoint constructors of the gate algebra.",
  },
  {
    id: 2,
    title: "Fault Isolation",
    statement: "∀ x (Status(x) = PIPELINE_ERROR ⇒ Gate(x) = PIPELINE_ERROR ∧ Gate(x) ≠ BLACK)",
    notes: "A retrieval fault cannot be silently rewritten as a BLACK deficit.",
  },
  {
    id: 3,
    title: "Null Score on Fault",
    statement: "∀ x (Status(x) = PIPELINE_ERROR ⇒ Score(x) = None)",
    notes: "SCORE_ON_RETRIEVAL_FAILURE is the constant None.",
  },
  {
    id: 4,
    title: "Remediation Hold",
    statement: "∀ x (Gate(x) = YELLOW ⇒ Sealable(x) = False)",
    notes: "Warning-state filings remain on remediation hold.",
  },
  {
    id: 5,
    title: "Sealing Safety",
    statement: "∀ x (Sealable(x) = True ⇒ Gate(x) = GREEN ∧ Status(x) = LIVE ∧ Factor(x) = 0.428)",
    notes: "Only live GREEN filings at the statutory factor are sealable.",
  },
  {
    id: 6,
    title: "Float Drift Bound",
    statement: "∀ m ∈ [0, 10⁶], |Z[φ]_μ / 10⁶ − (m × 0.428)| ≤ 10⁻⁶ MT CO₂e",
    notes: "Z[φ]_μ = round(m × 1000) × 428. Exact on milli-MWh filings.",
  },
];
