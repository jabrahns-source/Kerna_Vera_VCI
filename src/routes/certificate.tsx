import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { KernaMark } from "@/components/qreg/mark";
import { PageHeader } from "@/components/qreg/page-header";
import { StatusBlock } from "@/components/qreg/status-block";
import { useEngine } from "@/components/qreg/use-engine";
import { Button } from "@/components/ui/button";
import { microToMt } from "@/lib/qreg/engine";
import { formatMt, formatMwh, formatUsd, mwhFromMilli, truncateHash } from "@/lib/qreg/format";
import { ledgerTotals, useQreg } from "@/lib/qreg/store";

export const Route = createFileRoute("/certificate")({ component: CertificatePage });

function CertificatePage() {
  const { ready, error } = useEngine();
  const records = useQreg((s) => s.records);
  const verifyResults = useQreg((s) => s.verifyResults);
  const exportJsonl = useQreg((s) => s.exportJsonl);

  if (error) return <StatusBlock message={error} />;
  if (!ready) return <StatusBlock message="Preparing certificate…" />;

  const totals = ledgerTotals(records);
  const passed = verifyResults.filter((r) => r.accepted).length;

  function downloadLedger() {
    const blob = new Blob([exportJsonl()], { type: "application/jsonl" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CARB_MRR_2024_Sealed_Ledger.jsonl";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Sealed ledger downloaded");
  }

  return (
    <div>
      <PageHeader
        kicker="Audit instrument"
        title="CARB SB 253 certificate."
        lede="Rendered from the sealed MRR 2024 run. Print this page for an archival PDF, or download the machine-readable JSONL ledger with Merkle leaves and Ed25519 signatures."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={downloadLedger}>
              Download JSONL
            </Button>
            <Button onClick={() => window.print()}>Print certificate</Button>
          </div>
        }
      />

      <article className="cert-paper mx-auto max-w-3xl rounded-xl bg-paper p-8 text-ink shadow-[var(--shadow-border)] md:p-12">
        <header className="flex items-start justify-between gap-4 border-b border-ink/15 pb-6">
          <div className="flex items-center gap-3">
            <KernaMark className="size-10 text-ink" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-ink/55">
                Even The Odds Foundry
              </p>
              <p className="text-sm font-medium">KERNA Ledger VCI · Q-Reg 1.0.0</p>
            </div>
          </div>
          <p className="text-right text-[10px] uppercase tracking-[0.16em] text-ink/55">
            Audit grade
            <br />
            31 Dec 2024
          </p>
        </header>

        <h2 className="mt-8 text-2xl font-medium tracking-tight md:text-3xl">
          CARB SB 253 / MRR 2024
          <br />
          Compliance certificate
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/70">
          This instrument attests that the listed California entities were evaluated by Q-Reg
          PolicyEngine against Title 17 CCR §95111 (statutory factor 0.428 MT/MWh), sealed under
          RFC 8032 Ed25519, and independently re-verified by CleanRoomVerifier.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <CertStat k="Energy" v={`${formatMwh(totals.mwh)} MWh`} />
          <CertStat k="Scope 2" v={`${formatMt(totals.mt)} MT`} />
          <CertStat k="BLACK deficit" v={`${formatMt(totals.blackMt)} MT`} />
          <CertStat k="Exposure" v={formatUsd(totals.surrenderUsd)} />
        </dl>

        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/15 text-[10px] uppercase tracking-[0.14em] text-ink/55">
              <th className="pb-2 font-medium">Entity</th>
              <th className="pb-2 font-medium">MWh</th>
              <th className="pb-2 font-medium">MT</th>
              <th className="pb-2 font-medium">Gate</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.preimage.record_id} className="border-b border-ink/10">
                <td className="py-2.5">{record.preimage.entity}</td>
                <td className="py-2.5 font-mono tabular">
                  {formatMwh(mwhFromMilli(record.preimage.mwh_milli))}
                </td>
                <td className="py-2.5 font-mono tabular">
                  {formatMt(
                    record.preimage.emissions_micro === null
                      ? null
                      : microToMt(record.preimage.emissions_micro),
                  )}
                </td>
                <td className="py-2.5">
                  <span className="font-mono text-[11px]">{record.preimage.gate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 space-y-2 border-t border-ink/15 pt-6 font-mono text-[11px] leading-relaxed text-ink/70">
          <p>MERKLE ROOT {totals.merkleRoot}</p>
          <p>CHAIN HEAD {totals.chainHead}</p>
          <p>
            CLEAN-ROOM {passed}/{records.length} ACCEPTED · PUBKEY {truncateHash(records[0]?.publicKey ?? "", 8)}
          </p>
          <p>CITATION Title 17 CCR §95111 · 4:1 surrender priced at $160/MT on BLACK deficit</p>
        </div>

        <p className="mt-8 text-[11px] leading-relaxed text-ink/50">
          Demonstration audit key, not a custody HSM. KERNA Ledger VCI does not issue CARB
          allowances. This certificate is a cryptographic filing artifact generated from the
          sealed ledger.
        </p>
      </article>

      <style>{`
        @media print {
          body { background: white !important; }
          header, aside, nav, .cert-hide { display: none !important; }
          main { padding: 0 !important; }
          .cert-paper {
            box-shadow: none !important;
            max-width: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

function CertStat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.14em] text-ink/50">{k}</dt>
      <dd className="mt-1 font-mono text-sm tabular">{v}</dd>
    </div>
  );
}
