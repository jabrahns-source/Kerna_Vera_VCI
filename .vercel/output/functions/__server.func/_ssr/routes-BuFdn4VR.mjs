import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as ledgerTotals, c as useQreg, n as PageHeader, o as microToMt, r as StatusBlock, s as useEngine, t as Button } from "./button-CAGtxb23.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { a as mwhFromMilli, n as formatMwh, r as formatUsd, t as formatMt } from "./format-WEjDsVVj.mjs";
import { t as GateChip } from "./gate-chip-BHwm8swj.mjs";
import { t as HashLine } from "./hash-line-GCvhBaYZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BuFdn4VR.js
var import_jsx_runtime = require_jsx_runtime();
function Command() {
	const { ready, busy, error } = useEngine();
	const records = useQreg((s) => s.records);
	const verifyResults = useQreg((s) => s.verifyResults);
	const runBenchmark = useQreg((s) => s.runBenchmark);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBlock, { message: error });
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBlock, { message: busy ? "Sealing MRR 2024 ledger…" : "Starting PolicyEngine…" });
	const totals = ledgerTotals(records);
	const passed = verifyResults.filter((r) => r.accepted).length;
	const gateTotal = Math.max(totals.count, 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Command · CARB MRR 2024",
			title: "Verified carbon intelligence.",
			lede: "Q-Reg evaluates California Scope 2 filings at the statutory 0.428 MT/MWh factor, then seals them to an Ed25519 / SHA-256 Merkle chain. Clean-room verification runs independently of the engine.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => void runBenchmark(),
				disabled: busy,
				children: "Re-run benchmark"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "kerna-enter-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Evaluated energy",
					value: `${formatMwh(totals.mwh)} MWh`,
					hint: "Six MRR intervals"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Scope 2 GHG",
					value: `${formatMt(totals.mt)} MT`,
					hint: "PIPELINE_ERROR contributes none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Surrender exposure",
					value: formatUsd(totals.surrenderUsd),
					hint: `${formatMt(totals.blackMt)} MT BLACK × $160`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Clean-room",
					value: `${passed}/${totals.count}`,
					hint: "Independent re-verification"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "kerna-enter-3 mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Gate allocation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-muted-foreground",
							children: [
								totals.gates.GREEN,
								" GREEN · ",
								totals.gates.YELLOW,
								" YELLOW · ",
								totals.gates.BLACK,
								" BLACK ·",
								" ",
								totals.gates.PIPELINE_ERROR,
								" ERROR"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-3 overflow-hidden rounded-full bg-secondary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								className: "bg-gate-green",
								flex: totals.gates.GREEN / gateTotal
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								className: "bg-gate-yellow",
								flex: totals.gates.YELLOW / gateTotal
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								className: "bg-gate-black",
								flex: totals.gates.BLACK / gateTotal
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								className: "bg-gate-error",
								flex: totals.gates.PIPELINE_ERROR / gateTotal
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[640px] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
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
										children: "MT CO₂e"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2 font-medium",
										children: "Gate"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2 font-medium",
										children: "Sealable"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: records.map((record) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/60 last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: record.preimage.entity
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-[11px] text-muted-foreground",
											children: record.preimage.facility_id
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 font-mono tabular",
										children: formatMwh(mwhFromMilli(record.preimage.mwh_milli))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 font-mono tabular",
										children: formatMt(record.preimage.emissions_micro === null ? null : microToMt(record.preimage.emissions_micro))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GateChip, { gate: record.preimage.gate })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 text-muted-foreground",
										children: record.preimage.sealable ? "Yes" : "Hold"
									})
								]
							}, record.preimage.record_id)) })]
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Committed Merkle root"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Binary tree over length-delimited SHA-256 leaves."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashLine, {
								label: "Root",
								value: totals.merkleRoot
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashLine, {
								label: "Chain",
								value: totals.chainHead
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Invariant surface"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Li, {
								to: "/adversarial",
								label: "9 adversarial vectors",
								detail: "Clean-room rejection suite"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Li, {
								to: "/proofs",
								label: "6 SMT theorems",
								detail: "Gate algebra + float bound"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Li, {
								to: "/certificate",
								label: "SB 253 certificate",
								detail: "Printable audit instrument"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Li, {
								to: "/engine",
								label: "File an interval",
								detail: "Evaluate against §95111"
							})
						]
					})]
				})]
			})]
		})
	] });
}
function Metric({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-mono text-2xl tabular tracking-tight",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function Bar({ className, flex }) {
	if (flex <= 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		style: { flex }
	});
}
function Li({ to, label, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "group flex items-start justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: detail
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "mt-0.5 size-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
	}) });
}
//#endregion
export { Command as component };
