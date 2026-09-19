import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as useQreg, n as PageHeader, r as StatusBlock, s as useEngine, t as Button } from "./button-CAGtxb23.mjs";
import { t as Badge } from "./badge-CTDvBmrK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proofs-BvOtORt5.js
var import_jsx_runtime = require_jsx_runtime();
function ProofsPage() {
	const { ready, busy, error } = useEngine();
	const theorems = useQreg((s) => s.theorems);
	const runProofs = useQreg((s) => s.runProofs);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBlock, { message: error });
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBlock, { message: "Starting PolicyEngine…" });
	const proved = theorems.filter((t) => t.proved).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Formal invariants",
			title: "Six theorems on the gate algebra.",
			lede: "Bounded model checking over the product domain D of MWh, claimed factors, retrieval faults, deficit flags, quality holds, and inverted intervals. Theorem 6 samples the float-drift identity through 10⁶ MWh.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => void runProofs(),
				disabled: busy,
				children: busy && theorems.length === 0 ? "Proving…" : "Execute prover"
			})
		}),
		theorems.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-6 font-mono text-sm text-muted-foreground",
			children: [
				proved,
				"/",
				theorems.length,
				" theorems discharged"
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "space-y-3",
			children: (theorems.length > 0 ? theorems : THEOREM_COPY).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[11px] text-muted-foreground",
							children: ["Theorem ", t.id]
						}), t.proved === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: "Unproved"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: t.proved ? "green" : "black",
							children: t.proved ? "Proved" : "Failed"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-base font-medium",
						children: t.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-xs leading-relaxed text-foreground/85",
						children: t.statement
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: t.notes
					}),
					t.domainSize !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
						children: [
							"Domain |D| = ",
							t.domainSize,
							t.counterexamples && t.counterexamples.length > 0 ? ` · counterexamples ${t.counterexamples.join("; ")}` : ""
						]
					}) : null
				]
			}, t.id))
		})
	] });
}
var THEOREM_COPY = [
	{
		id: 1,
		title: "Gate Mutual Exclusivity",
		statement: "∀ x ∈ D, ¬(Gate(x) = GREEN ∧ Gate(x) = BLACK)",
		notes: "GREEN and BLACK are disjoint constructors of the gate algebra."
	},
	{
		id: 2,
		title: "Fault Isolation",
		statement: "∀ x (Status(x) = PIPELINE_ERROR ⇒ Gate(x) = PIPELINE_ERROR ∧ Gate(x) ≠ BLACK)",
		notes: "A retrieval fault cannot be silently rewritten as a BLACK deficit."
	},
	{
		id: 3,
		title: "Null Score on Fault",
		statement: "∀ x (Status(x) = PIPELINE_ERROR ⇒ Score(x) = None)",
		notes: "SCORE_ON_RETRIEVAL_FAILURE is the constant None."
	},
	{
		id: 4,
		title: "Remediation Hold",
		statement: "∀ x (Gate(x) = YELLOW ⇒ Sealable(x) = False)",
		notes: "Warning-state filings remain on remediation hold."
	},
	{
		id: 5,
		title: "Sealing Safety",
		statement: "∀ x (Sealable(x) = True ⇒ Gate(x) = GREEN ∧ Status(x) = LIVE ∧ Factor(x) = 0.428)",
		notes: "Only live GREEN filings at the statutory factor are sealable."
	},
	{
		id: 6,
		title: "Float Drift Bound",
		statement: "∀ m ∈ [0, 10⁶], |Z[φ]_μ / 10⁶ − (m × 0.428)| ≤ 10⁻⁶ MT CO₂e",
		notes: "Z[φ]_μ = round(m × 1000) × 428. Exact on milli-MWh filings."
	}
];
//#endregion
export { ProofsPage as component };
