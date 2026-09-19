import { i as __toESM } from "../_runtime.mjs";
import { o as STATUTORY_FACTOR, s as cn } from "./types-WNOmZHGT.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as useQreg, i as evaluate, n as PageHeader, r as StatusBlock, s as useEngine, t as Button } from "./button-CAGtxb23.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as formatMwh, t as formatMt } from "./format-WEjDsVVj.mjs";
import { t as GateChip } from "./gate-chip-BHwm8swj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine-B2AHlQyh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-[var(--shadow-border)] outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground", className),
		...props
	});
}
var PRESETS = [
	{
		label: "Custom facility",
		entity: "Custom Facility",
		facilityId: "CUSTOM-001",
		sector: "Industrial",
		airBasin: "Statewide"
	},
	{
		label: "PG&E EPE",
		entity: "PG&E Electric Power Entity",
		facilityId: "PGE-EPE-001",
		sector: "Electric Power Entity",
		airBasin: "Statewide"
	},
	{
		label: "Tesla Fremont",
		entity: "Tesla Fremont",
		facilityId: "TESLA-FRE-FREMONT",
		sector: "Vehicle Manufacturing",
		airBasin: "San Francisco Bay"
	},
	{
		label: "Chevron Richmond",
		entity: "Chevron Richmond",
		facilityId: "CVX-RCH-REFINERY",
		sector: "Petroleum Refining",
		airBasin: "San Francisco Bay"
	}
];
function EnginePage() {
	const { ready, busy, error } = useEngine();
	const fileAndSeal = useQreg((s) => s.fileAndSeal);
	const [preset, setPreset] = (0, import_react.useState)(0);
	const [entity, setEntity] = (0, import_react.useState)(PRESETS[0].entity);
	const [facilityId, setFacilityId] = (0, import_react.useState)(PRESETS[0].facilityId);
	const [mwh, setMwh] = (0, import_react.useState)("100");
	const [factor, setFactor] = (0, import_react.useState)(String(STATUTORY_FACTOR));
	const [warning, setWarning] = (0, import_react.useState)("");
	const [retrievalFailure, setRetrievalFailure] = (0, import_react.useState)(false);
	const [deficit, setDeficit] = (0, import_react.useState)(false);
	const [start, setStart] = (0, import_react.useState)("2024-01-01T00:00");
	const [end, setEnd] = (0, import_react.useState)("2024-12-31T23:59");
	const [sealing, setSealing] = (0, import_react.useState)(false);
	const input = (0, import_react.useMemo)(() => ({
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
		deficit
	}), [
		entity,
		facilityId,
		preset,
		start,
		end,
		mwh,
		factor,
		warning,
		retrievalFailure,
		deficit
	]);
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
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBlock, { message: error });
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBlock, { message: "Starting PolicyEngine…" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "PolicyEngine",
		title: "Evaluate a filing interval.",
		lede: "Fixed-point micro-MT arithmetic. Statutory factor 0.428 MT/MWh under Title 17 CCR §95111. YELLOW never seals. PIPELINE_ERROR never becomes BLACK."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "kerna-enter space-y-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
			onSubmit: (e) => {
				e.preventDefault();
				onSeal();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "preset",
						children: "Entity preset"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						id: "preset",
						className: "flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
						value: preset,
						onChange: (e) => {
							const i = Number(e.target.value);
							setPreset(i);
							const p = PRESETS[i];
							if (p) {
								setEntity(p.entity);
								setFacilityId(p.facilityId);
							}
						},
						children: PRESETS.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: i,
							children: p.label
						}, p.facilityId))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Entity",
							value: entity,
							onChange: setEntity
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Facility ID",
							value: facilityId,
							onChange: setFacilityId
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "MWh",
							value: mwh,
							onChange: setMwh,
							type: "number"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Claimed factor",
							value: factor,
							onChange: setFactor
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Interval start",
							value: start,
							onChange: setStart,
							type: "datetime-local"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Interval end",
							value: end,
							onChange: setEnd,
							type: "datetime-local"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Warning / quality hold",
					value: warning,
					onChange: setWarning,
					placeholder: "Leave empty for GREEN"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-5 pt-1 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: retrievalFailure,
							onChange: (e) => setRetrievalFailure(e.target.checked)
						}), "Retrieval failure"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: deficit,
							onChange: (e) => setDeficit(e.target.checked)
						}), "BLACK deficit"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: sealing || busy || !evaluation.valid,
					children: sealing ? "Sealing…" : evaluation.sealable ? "Seal to ledger" : "Append (not sealable)"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "kerna-enter-2 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Engine decision"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GateChip, { gate: evaluation.gate })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-6 grid grid-cols-2 gap-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							k: "Status",
							v: evaluation.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							k: "Sealable",
							v: evaluation.sealable ? "True" : "False"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							k: "Factor",
							v: evaluation.factor === null ? "None" : String(evaluation.factor)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							k: "MWh (milli)",
							v: String(evaluation.mwhMilli)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							k: "Emissions",
							v: evaluation.emissionsMt === null ? "None" : `${formatMt(evaluation.emissionsMt)} MT`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							k: "Drift",
							v: evaluation.drift === null ? "—" : `${evaluation.drift.toExponential(2)} MT`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm leading-relaxed text-muted-foreground",
					children: evaluation.reason
				}),
				evaluation.rejection ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-destructive",
					children: evaluation.rejection
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 font-mono text-[11px] text-muted-foreground",
					children: evaluation.citation
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: [
						formatMwh(Number.parseFloat(mwh) || 0),
						" MWh × 0.428 =",
						" ",
						formatMt((Number.parseFloat(mwh) || 0) * STATUTORY_FACTOR),
						" MT (IEEE float reference)"
					]
				})
			]
		})]
	})] });
}
function safeIso(value) {
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "invalid";
	return d.toISOString();
}
function Field({ label, value, onChange, type = "text", placeholder }) {
	const id = label.toLowerCase().replace(/\s+/g, "-");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: id,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id,
			type,
			value,
			placeholder,
			onChange: (e) => onChange(e.target.value),
			step: type === "number" ? "any" : void 0
		})]
	});
}
function Item({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 font-mono text-sm",
		children: v
	})] });
}
//#endregion
export { EnginePage as component };
