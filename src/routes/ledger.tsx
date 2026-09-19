import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GateChip } from "@/components/qreg/gate-chip";
import { HashLine } from "@/components/qreg/hash-line";
import { PageHeader } from "@/components/qreg/page-header";
import { StatusBlock } from "@/components/qreg/status-block";
import { useEngine } from "@/components/qreg/use-engine";
import { Button } from "@/components/ui/button";
import { formatMt, formatMwh, mwhFromMilli } from "@/lib/qreg/format";
import { microToMt } from "@/lib/qreg/engine";
import { useQreg } from "@/lib/qreg/store";

export const Route = createFileRoute("/ledger")({ component: LedgerPage });

function LedgerPage() {
  const { ready, busy, error } = useEngine();
  const records = useQreg((s) => s.records);
  const verifyResults = useQreg((s) => s.verifyResults);
  const verifyAll = useQreg((s) => s.verifyAll);
  const exportJsonl = useQreg((s) => s.exportJsonl);
  const resetLedger = useQreg((s) => s.resetLedger);
  const [openId, setOpenId] = useState<string | null>(null);

  if (error) return <StatusBlock message={error} />;
  if (!ready) return <StatusBlock message="Loading sealed ledger…" />;

  function download() {
    const blob = new Blob([exportJsonl()], { type: "application/jsonl" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CARB_MRR_2024_Sealed_Ledger.jsonl";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Sealed ledger downloaded");
  }

  const passed = verifyResults.filter((r) => r.accepted).length;

  return (
    <div>
      <PageHeader
        kicker="Sealed ledger"
        title="Length-delimited Merkle chain."
        lede="Each leaf is SHA-256(uint32be(len) ∥ canonical JSON). Chain head is SHA-256(prev ∥ leaf). Inclusion proofs are binary Merkle siblings. Signatures are RFC 8032 Ed25519 over the leaf digest."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void verifyAll()} disabled={busy}>
              Re-verify ({passed}/{records.length})
            </Button>
            <Button variant="outline" onClick={download}>
              Download JSONL
            </Button>
            <Button variant="ghost" onClick={() => void resetLedger()}>
              Reset
            </Button>
          </div>
        }
      />

      <ol className="space-y-3">
        {records.map((record, index) => {
          const check = verifyResults.find((v) => v.recordId === record.preimage.record_id);
          const open = openId === record.preimage.record_id;
          const mt =
            record.preimage.emissions_micro === null
              ? null
              : microToMt(record.preimage.emissions_micro);
          return (
            <li
              key={record.preimage.record_id}
              className="rounded-xl bg-card shadow-[var(--shadow-border)]"
            >
              <button
                type="button"
                className="flex w-full flex-col gap-3 p-5 text-left md:flex-row md:items-center md:justify-between"
                onClick={() => setOpenId(open ? null : record.preimage.record_id)}
              >
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {String(index).padStart(2, "0")} · {record.preimage.record_id}
                  </p>
                  <p className="mt-1 text-sm font-medium">{record.preimage.entity}</p>
                  <p className="text-xs text-muted-foreground">{record.preimage.sector}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs tabular">
                    {formatMwh(mwhFromMilli(record.preimage.mwh_milli))} MWh
                  </span>
                  <span className="font-mono text-xs tabular">{formatMt(mt)} MT</span>
                  <GateChip gate={record.preimage.gate} />
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {check?.accepted ? "Verified" : "Failed"}
                  </span>
                </div>
              </button>
              {open ? (
                <div className="space-y-2 border-t border-border px-5 py-4">
                  <HashLine label="Leaf" value={record.leafHash} />
                  <HashLine label="Prev" value={record.prevHash} />
                  <HashLine label="Chain" value={record.chainHead} />
                  <HashLine label="Root" value={record.merkleRoot} />
                  <HashLine label="Signature" value={record.signature} />
                  {check && !check.accepted ? (
                    <ul className="pt-2 text-sm text-destructive">
                      {check.issues.map((issue) => (
                        <li key={issue.code + issue.message}>{issue.message}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
