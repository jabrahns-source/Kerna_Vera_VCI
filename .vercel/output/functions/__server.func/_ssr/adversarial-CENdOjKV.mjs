import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as useQreg, n as PageHeader, r as StatusBlock, s as useEngine, t as Button } from "./button-CAGtxb23.mjs";
import { t as Badge } from "./badge-CTDvBmrK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/adversarial-CENdOjKV.js
var import_jsx_runtime = require_jsx_runtime();
function AdversaryPage() {
	const { ready, busy, error } = useEngine();
	const adversarial = useQreg((s) => s.adversarial);
	const runAdversary = useQreg((s) => s.runAdversary);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBlock, { message: error });
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBlock, { message: "Starting PolicyEngine…" });
	const rejected = adversarial.filter((r) => r.verdict === "REJECTED").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Adversarial suite",
			title: "Nine attack vectors. Zero accepted.",
			lede: "Each vector mutates a sealed GREEN filing or forges an illegal state, then hands the artifact to CleanRoomVerifier — which shares no PolicyEngine imports. The expected verdict is REJECTED.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => void runAdversary(),
				disabled: busy,
				children: busy && adversarial.length === 0 ? "Executing…" : "Run 9-vector suite"
			})
		}),
		adversarial.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-6 font-mono text-sm text-muted-foreground",
			children: [
				rejected,
				"/",
				adversarial.length,
				" rejected by CleanRoomVerifier"
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-6 text-sm text-muted-foreground",
			children: "Run the suite to execute live mutations against the demonstration signing key."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
			children: (adversarial.length > 0 ? adversarial : PLACEHOLDER).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-col rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[11px] text-muted-foreground",
							children: ["Vector ", String(item.vector).padStart(2, "0")]
						}), item.verdict ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: item.verdict === "REJECTED" ? "black" : "green",
							children: item.verdict
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: "Pending"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-sm font-medium",
						children: item.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted-foreground",
						children: item.mechanism
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-auto pt-4 text-xs leading-relaxed text-foreground/80",
						children: item.detection
					})
				]
			}, item.vector))
		})
	] });
}
var PLACEHOLDER = [
	{
		vector: 1,
		name: "Leaf Hash Tampering",
		mechanism: "Emissions payload mutated post-hashing (+10⁻⁶ MT)",
		detection: "Pre-image SHA-256 mismatch"
	},
	{
		vector: 2,
		name: "Signature Forgery",
		mechanism: "8-bit bit-flip in Ed25519 signature",
		detection: "Cryptographic signature failure"
	},
	{
		vector: 3,
		name: "Unicode Section Drift",
		mechanism: "ensure_ascii=False serialization on § symbol",
		detection: "Pre-image mismatch across byte encodings"
	},
	{
		vector: 4,
		name: "Unapproved Factor",
		mechanism: "Attempted injection of 0.427 MT/MWh",
		detection: "Title 17 CCR §95111 statutory check"
	},
	{
		vector: 5,
		name: "Temporal Inversion",
		mechanism: "Negative MWh consumption interval",
		detection: "Interval range validation failure"
	},
	{
		vector: 6,
		name: "Float Rounding Drift",
		mechanism: "Truncated binary float error (> 10⁻⁶ MT)",
		detection: "Fixed-point integer arithmetic check"
	},
	{
		vector: 7,
		name: "YELLOW Auto-Seal",
		mechanism: "Maliciously setting sealable = True on warning state",
		detection: "Invariant check: YELLOW never sealed"
	},
	{
		vector: 8,
		name: "Silent Fault Conversion",
		mechanism: "Forcing PIPELINE_ERROR to BLACK",
		detection: "Fault isolation check (PIPELINE_ERROR ≠ BLACK)"
	},
	{
		vector: 9,
		name: "Fallback Factor Bypass",
		mechanism: "Injecting numeric emissions score during node outage",
		detection: "Invariant check: SCORE_ON_RETRIEVAL_FAILURE = None"
	}
];
//#endregion
export { AdversaryPage as component };
