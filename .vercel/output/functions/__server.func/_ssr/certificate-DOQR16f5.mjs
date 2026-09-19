import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as ledgerTotals, c as useQreg, n as PageHeader, o as microToMt, r as StatusBlock, s as useEngine, t as Button } from "./button-CAGtxb23.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as KernaMark } from "./router-7n-9vqKq.mjs";
import { a as mwhFromMilli, n as formatMwh, o as truncateHash, r as formatUsd, t as formatMt } from "./format-WEjDsVVj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/certificate-DOQR16f5.js
var import_jsx_runtime = require_jsx_runtime();
function CertificatePage() {
	const { ready, error } = useEngine();
	const records = useQreg((s) => s.records);
	const verifyResults = useQreg((s) => s.verifyResults);
	const exportJsonl = useQreg((s) => s.exportJsonl);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBlock, { message: error });
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBlock, { message: "Preparing certificate…" });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Audit instrument",
			title: "CARB SB 253 certificate.",
			lede: "Rendered from the sealed MRR 2024 run. Print this page for an archival PDF, or download the machine-readable JSONL ledger with Merkle leaves and Ed25519 signatures.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: downloadLedger,
					children: "Download JSONL"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => window.print(),
					children: "Print certificate"
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "cert-paper mx-auto max-w-3xl rounded-xl bg-paper p-8 text-ink shadow-[var(--shadow-border)] md:p-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-start justify-between gap-4 border-b border-ink/15 pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KernaMark, { className: "size-10 text-ink" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-medium uppercase tracking-[0.22em] text-ink/55",
							children: "Even The Odds Foundry"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "KERNA Ledger VCI · Q-Reg 1.0.0"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-right text-[10px] uppercase tracking-[0.16em] text-ink/55",
						children: [
							"Audit grade",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"31 Dec 2024"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mt-8 text-2xl font-medium tracking-tight md:text-3xl",
					children: [
						"CARB SB 253 / MRR 2024",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Compliance certificate"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-sm leading-relaxed text-ink/70",
					children: "This instrument attests that the listed California entities were evaluated by Q-Reg PolicyEngine against Title 17 CCR §95111 (statutory factor 0.428 MT/MWh), sealed under RFC 8032 Ed25519, and independently re-verified by CleanRoomVerifier."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-8 grid grid-cols-2 gap-4 text-sm md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertStat, {
							k: "Energy",
							v: `${formatMwh(totals.mwh)} MWh`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertStat, {
							k: "Scope 2",
							v: `${formatMt(totals.mt)} MT`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertStat, {
							k: "BLACK deficit",
							v: `${formatMt(totals.blackMt)} MT`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertStat, {
							k: "Exposure",
							v: formatUsd(totals.surrenderUsd)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "mt-8 w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-ink/15 text-[10px] uppercase tracking-[0.14em] text-ink/55",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Entity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "MWh"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "MT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Gate"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: records.map((record) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-ink/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5",
								children: record.preimage.entity
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 font-mono tabular",
								children: formatMwh(mwhFromMilli(record.preimage.mwh_milli))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 font-mono tabular",
								children: formatMt(record.preimage.emissions_micro === null ? null : microToMt(record.preimage.emissions_micro))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px]",
									children: record.preimage.gate
								})
							})
						]
					}, record.preimage.record_id)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-2 border-t border-ink/15 pt-6 font-mono text-[11px] leading-relaxed text-ink/70",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["MERKLE ROOT ", totals.merkleRoot] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["CHAIN HEAD ", totals.chainHead] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"CLEAN-ROOM ",
							passed,
							"/",
							records.length,
							" ACCEPTED · PUBKEY ",
							truncateHash(records[0]?.publicKey ?? "", 8)
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "CITATION Title 17 CCR §95111 · 4:1 surrender priced at $160/MT on BLACK deficit" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-[11px] leading-relaxed text-ink/50",
					children: "Demonstration audit key, not a custody HSM. KERNA Ledger VCI does not issue CARB allowances. This certificate is a cryptographic filing artifact generated from the sealed ledger."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
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
      ` })
	] });
}
function CertStat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-[10px] uppercase tracking-[0.14em] text-ink/50",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 font-mono text-sm tabular",
		children: v
	})] });
}
//#endregion
export { CertificatePage as component };
