import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/qreg/page-header";
import { StatusBlock } from "@/components/qreg/status-block";
import { useEngine } from "@/components/qreg/use-engine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQreg } from "@/lib/qreg/store";

export const Route = createFileRoute("/adversarial")({ component: AdversaryPage });

type VectorCard = {
  vector: number
  name: string
  mechanism: string
  detection: string
  verdict?: "REJECTED" | "ACCEPTED"
};

function AdversaryPage() {
  const { ready, busy, error } = useEngine();
  const adversarial = useQreg((s) => s.adversarial);
  const runAdversary = useQreg((s) => s.runAdversary);

  if (error) return <StatusBlock message={error} />;

  const rejected = adversarial.filter((r) => r.verdict === "REJECTED").length;

  return (
    <div>
      <PageHeader
        kicker="Adversarial suite"
        title="Nine attack vectors. Zero accepted."
        lede="Each vector mutates a sealed GREEN filing or forges an illegal state, then hands the artifact to CleanRoomVerifier — which shares no PolicyEngine imports. The expected verdict is REJECTED."
        action={
          <Button onClick={() => void runAdversary()} disabled={busy || !ready}>
            {busy && adversarial.length === 0 ? "Executing…" : "Run 9-vector suite"}
          </Button>
        }
      />

      {adversarial.length > 0 ? (
        <p className="mb-6 font-mono text-sm text-muted-foreground">
          {rejected}/{adversarial.length} rejected by CleanRoomVerifier
        </p>
      ) : (
        <p className="mb-6 text-sm text-muted-foreground">
          Run the suite to execute live mutations against the demonstration signing key.
        </p>
      )}

      <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {(adversarial.length > 0 ? adversarial : PLACEHOLDER).map((item: VectorCard) => (
          <li key={item.vector} className="flex flex-col rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-[11px] text-muted-foreground">
                Vector {String(item.vector).padStart(2, "0")}
              </p>
              {item.verdict ? (
                <Badge variant={item.verdict === "REJECTED" ? "black" : "green"}>
                  {item.verdict}
                </Badge>
              ) : (
                <Badge variant="outline">Pending</Badge>
              )}
            </div>
            <h2 className="mt-3 text-sm font-medium">{item.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.mechanism}</p>
            <p className="mt-auto pt-4 text-xs leading-relaxed text-foreground/80">{item.detection}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

const PLACEHOLDER: VectorCard[] = [
  {
    vector: 1,
    name: "Leaf Hash Tampering",
    mechanism: "Emissions payload mutated post-hashing (+10⁻⁶ MT)",
    detection: "Pre-image SHA-256 mismatch",
  },
  {
    vector: 2,
    name: "Signature Forgery",
    mechanism: "8-bit bit-flip in Ed25519 signature",
    detection: "Cryptographic signature failure",
  },
  {
    vector: 3,
    name: "Unicode Section Drift",
    mechanism: "ensure_ascii=False serialization on § symbol",
    detection: "Pre-image mismatch across byte encodings",
  },
  {
    vector: 4,
    name: "Unapproved Factor",
    mechanism: "Attempted injection of 0.427 MT/MWh",
    detection: "Title 17 CCR §95111 statutory check",
  },
  {
    vector: 5,
    name: "Temporal Inversion",
    mechanism: "Negative MWh consumption interval",
    detection: "Interval range validation failure",
  },
  {
    vector: 6,
    name: "Float Rounding Drift",
    mechanism: "Truncated binary float error (> 10⁻⁶ MT)",
    detection: "Fixed-point integer arithmetic check",
  },
  {
    vector: 7,
    name: "YELLOW Auto-Seal",
    mechanism: "Maliciously setting sealable = True on warning state",
    detection: "Invariant check: YELLOW never sealed",
  },
  {
    vector: 8,
    name: "Silent Fault Conversion",
    mechanism: "Forcing PIPELINE_ERROR to BLACK",
    detection: "Fault isolation check (PIPELINE_ERROR ≠ BLACK)",
  },
  {
    vector: 9,
    name: "Fallback Factor Bypass",
    mechanism: "Injecting numeric emissions score during node outage",
    detection: "Invariant check: SCORE_ON_RETRIEVAL_FAILURE = None",
  },
];
