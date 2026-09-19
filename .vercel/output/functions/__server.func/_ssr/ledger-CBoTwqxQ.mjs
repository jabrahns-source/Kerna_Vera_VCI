import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as useQreg, n as PageHeader, o as microToMt, r as StatusBlock, s as useEngine, t as Button } from "./button-CAGtxb23.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as mwhFromMilli, n as formatMwh, t as formatMt } from "./format-WEjDsVVj.mjs";
import { t as GateChip } from "./gate-chip-BHwm8swj.mjs";
import { t as HashLine } from "./hash-line-GCvhBaYZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ledger-CBoTwqxQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LedgerPage() {
	const { ready, busy, error } = useEngine();
	const records = useQreg((s) => s.records);
	const verifyResults = useQreg((s) => s.verifyResults);
	const verifyAll = useQreg((s) => s.verifyAll);
	const exportJsonl = useQreg((s) => s.exportJsonl);
	const resetLedger = useQreg((s) => s.resetLedger);
	const [openId, setOpenId] = (0, import_react.useState)(null);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBlock, { message: error });
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBlock, { message: "Loading sealed ledger…" });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Sealed ledger",
		title: "Length-delimited Merkle chain.",
		lede: "Each leaf is SHA-256(uint32be(len) ∥ canonical JSON). Chain head is SHA-256(prev ∥ leaf). Inclusion proofs are binary Merkle siblings. Signatures are RFC 8032 Ed25519 over the leaf digest.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => void verifyAll(),
					disabled: busy,
					children: [
						"Re-verify (",
						passed,
						"/",
						records.length,
						")"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: download,
					children: "Download JSONL"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => void resetLedger(),
					children: "Reset"
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-3",
		children: records.map((record, index) => {
			const check = verifyResults.find((v) => v.recordId === record.preimage.record_id);
			const open = openId === record.preimage.record_id;
			const mt = record.preimage.emissions_micro === null ? null : microToMt(record.preimage.emissions_micro);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl bg-card shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex w-full flex-col gap-3 p-5 text-left md:flex-row md:items-center md:justify-between",
					onClick: () => setOpenId(open ? null : record.preimage.record_id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: [
									String(index).padStart(2, "0"),
									" · ",
									record.preimage.record_id
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-medium",
								children: record.preimage.entity
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: record.preimage.sector
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-xs tabular",
								children: [formatMwh(mwhFromMilli(record.preimage.mwh_milli)), " MWh"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-xs tabular",
								children: [formatMt(mt), " MT"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GateChip, { gate: record.preimage.gate }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
								children: check?.accepted ? "Verified" : "Failed"
							})
						]
					})]
				}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 border-t border-border px-5 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashLine, {
							label: "Leaf",
							value: record.leafHash
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashLine, {
							label: "Prev",
							value: record.prevHash
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashLine, {
							label: "Chain",
							value: record.chainHead
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashLine, {
							label: "Root",
							value: record.merkleRoot
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashLine, {
							label: "Signature",
							value: record.signature
						}),
						check && !check.accepted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "pt-2 text-sm text-destructive",
							children: check.issues.map((issue) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: issue.message }, issue.code + issue.message))
						}) : null
					]
				}) : null]
			}, record.preimage.record_id);
		})
	})] });
}
//#endregion
export { LedgerPage as component };
