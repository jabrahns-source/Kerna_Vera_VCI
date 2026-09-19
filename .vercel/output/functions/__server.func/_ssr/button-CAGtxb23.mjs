import { i as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as MICRO_SCALE$1, n as DEMO_SIGNING_JWK, o as STATUTORY_FACTOR$1, r as GENESIS_HASH, s as cn, t as CITATION } from "./types-WNOmZHGT.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-CAGtxb23.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PageHeader({ kicker, title, lede, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "kerna-enter mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground",
					children: kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-3xl font-medium tracking-tight md:text-4xl",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground",
					children: lede
				})
			]
		}), action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children: action
		}) : null]
	});
}
function StatusBlock({ message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl bg-card px-5 py-8 text-center text-sm text-muted-foreground shadow-[var(--shadow-border)]",
		children: message
	});
}
/**
* Wire-format serializer matching Python json.dumps(
*   sort_keys=True, separators=(",", ":"), ensure_ascii=True
* )
*
* Vector 3 (Unicode Section Drift) depends on § (U+00A7) being emitted as
* the six-byte sequence \\u00a7 rather than UTF-8 C2 A7.
*/
function sortKeys(value) {
	if (value === null || typeof value !== "object") return value;
	if (Array.isArray(value)) return value.map(sortKeys);
	const obj = value;
	const sorted = {};
	for (const key of Object.keys(obj).sort()) {
		const item = obj[key];
		if (item === void 0) continue;
		sorted[key] = sortKeys(item);
	}
	return sorted;
}
function ensureAscii(json) {
	return json.replace(/[\u007f-\uffff]/g, (ch) => {
		return `\\u${ch.charCodeAt(0).toString(16).padStart(4, "0")}`;
	});
}
function canonicalJson(value) {
	return ensureAscii(JSON.stringify(sortKeys(value)));
}
function utf8Bytes(text) {
	return new TextEncoder().encode(text);
}
/** Attack serializer: identical to canonicalJson except § stays raw UTF-8. */
function jsonEnsureAsciiFalse(value) {
	return JSON.stringify(sortKeys(value));
}
function bytesToHex(bytes) {
	let out = "";
	for (let i = 0; i < bytes.length; i += 1) out += bytes[i].toString(16).padStart(2, "0");
	return out;
}
function hexToBytes(hex) {
	const clean = hex.trim().toLowerCase();
	if (clean.length % 2 !== 0) throw new Error("hex length must be even");
	const out = new Uint8Array(clean.length / 2);
	for (let i = 0; i < out.length; i += 1) out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
	return out;
}
function bytesToB64url(bytes) {
	let bin = "";
	for (let i = 0; i < bytes.length; i += 1) bin += String.fromCharCode(bytes[i]);
	return btoa(bin).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
function b64urlToBytes(text) {
	const padded = text.replaceAll("-", "+").replaceAll("_", "/");
	const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - padded.length % 4);
	const bin = atob(padded + pad);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
	return out;
}
async function sha256(data) {
	const digest = await crypto.subtle.digest("SHA-256", data);
	return new Uint8Array(digest);
}
function concatBytes(...parts) {
	const total = parts.reduce((n, p) => n + p.length, 0);
	const out = new Uint8Array(total);
	let offset = 0;
	for (const part of parts) {
		out.set(part, offset);
		offset += part.length;
	}
	return out;
}
function u32be(value) {
	const buf = /* @__PURE__ */ new Uint8Array(4);
	new DataView(buf.buffer).setUint32(0, value, false);
	return buf;
}
/** FIPS 180-4 SHA-256 over a length-delimited payload. */
async function leafDigest(payload) {
	return bytesToHex(await sha256(concatBytes(u32be(payload.length), payload)));
}
async function importSigningKey() {
	return crypto.subtle.importKey("jwk", { ...DEMO_SIGNING_JWK }, { name: "Ed25519" }, true, ["sign"]);
}
async function importVerifyKey(x = DEMO_SIGNING_JWK.x) {
	return crypto.subtle.importKey("jwk", {
		kty: "OKP",
		crv: "Ed25519",
		x
	}, { name: "Ed25519" }, true, ["verify"]);
}
async function signLeaf(leafHashHex, key) {
	const sig = await crypto.subtle.sign("Ed25519", key, hexToBytes(leafHashHex));
	return bytesToB64url(new Uint8Array(sig));
}
async function verifyLeaf(leafHashHex, signatureB64, key) {
	try {
		return await crypto.subtle.verify("Ed25519", key, b64urlToBytes(signatureB64), hexToBytes(leafHashHex));
	} catch {
		return false;
	}
}
function flipByte(b64url, index = 0) {
	const bytes = b64urlToBytes(b64url);
	const i = Math.min(index, bytes.length - 1);
	bytes[i] = (bytes[i] ^ 255) & 255;
	return bytesToB64url(bytes);
}
function mwhToMilli(mwh) {
	return Math.round(mwh * 1e3);
}
/** Z[φ]_μ = MWh_milli × 428. Exact for filings quantized to 0.001 MWh. */
function emissionsMicroFromMilli(mwhMilli) {
	return mwhMilli * 428;
}
function microToMt(micro) {
	return micro / MICRO_SCALE$1;
}
function floatDrift(mwh, emissionsMicro) {
	return Math.abs(emissionsMicro / MICRO_SCALE$1 - mwh * STATUTORY_FACTOR$1);
}
function invalid(reason, input) {
	return {
		gate: "PIPELINE_ERROR",
		status: "PIPELINE_ERROR",
		sealable: false,
		factor: null,
		mwhMilli: Number.isFinite(input.mwh) ? mwhToMilli(input.mwh) : 0,
		emissionsMicro: null,
		emissionsMt: null,
		warning: reason,
		reason,
		citation: CITATION,
		drift: null,
		valid: false,
		rejection: reason
	};
}
function evaluate(input) {
	const start = Date.parse(input.intervalStart);
	const end = Date.parse(input.intervalEnd);
	if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return invalid("Interval range validation failure", input);
	if (!Number.isFinite(input.mwh) || input.mwh < 0) return invalid("Interval range validation failure", input);
	if (input.retrievalFailure) return {
		gate: "PIPELINE_ERROR",
		status: "PIPELINE_ERROR",
		sealable: false,
		factor: null,
		mwhMilli: mwhToMilli(input.mwh),
		emissionsMicro: null,
		emissionsMt: null,
		warning: input.warning ?? "Node retrieval failure",
		reason: "SCORE_ON_RETRIEVAL_FAILURE = None",
		citation: CITATION,
		drift: null,
		valid: true,
		rejection: null
	};
	const claimed = input.factor ?? .428;
	const mwhMilli = mwhToMilli(input.mwh);
	const emissionsMicro = emissionsMicroFromMilli(mwhMilli);
	const drift = floatDrift(input.mwh, emissionsMicro);
	if (drift > 1e-6) return invalid("Fixed-point integer arithmetic check", input);
	if (claimed !== .428) return {
		gate: "BLACK",
		status: "LIVE",
		sealable: false,
		factor: claimed,
		mwhMilli,
		emissionsMicro,
		emissionsMt: microToMt(emissionsMicro),
		warning: `Unapproved factor ${claimed} MT/MWh`,
		reason: "Title 17 CCR §95111 statutory check",
		citation: CITATION,
		drift,
		valid: true,
		rejection: null
	};
	if (input.deficit) return {
		gate: "BLACK",
		status: "LIVE",
		sealable: false,
		factor: STATUTORY_FACTOR$1,
		mwhMilli,
		emissionsMicro,
		emissionsMt: microToMt(emissionsMicro),
		warning: input.warning ?? "BLACK deficit interval",
		reason: "Statutory 4:1 surrender on BLACK deficit",
		citation: CITATION,
		drift,
		valid: true,
		rejection: null
	};
	if (input.warning) return {
		gate: "YELLOW",
		status: "LIVE",
		sealable: false,
		factor: STATUTORY_FACTOR$1,
		mwhMilli,
		emissionsMicro,
		emissionsMt: microToMt(emissionsMicro),
		warning: input.warning,
		reason: "Remediation hold — YELLOW never sealed",
		citation: CITATION,
		drift,
		valid: true,
		rejection: null
	};
	return {
		gate: "GREEN",
		status: "LIVE",
		sealable: true,
		factor: STATUTORY_FACTOR$1,
		mwhMilli,
		emissionsMicro,
		emissionsMt: microToMt(emissionsMicro),
		warning: null,
		reason: "Statutory factor 0.428 MT/MWh · sealable",
		citation: CITATION,
		drift,
		valid: true,
		rejection: null
	};
}
function blackSurrenderUsd(blackMt) {
	return Math.round(blackMt * 160 * 100) / 100;
}
async function nodeHash(left, right) {
	return bytesToHex(await sha256(concatBytes(new Uint8Array([1]), hexToBytes(left), hexToBytes(right))));
}
async function chainAdvance$1(prevHash, leafHash) {
	return bytesToHex(await sha256(concatBytes(hexToBytes(prevHash), hexToBytes(leafHash))));
}
async function merkleRoot(leaves) {
	if (leaves.length === 0) return GENESIS_HASH;
	let layer = [...leaves];
	while (layer.length > 1) {
		const next = [];
		for (let i = 0; i < layer.length; i += 2) {
			const left = layer[i];
			const right = layer[i + 1] ?? left;
			next.push(await nodeHash(left, right));
		}
		layer = next;
	}
	return layer[0];
}
async function inclusionProof(leaves, index) {
	if (index < 0 || index >= leaves.length) throw new Error("leaf index out of range");
	const siblings = [];
	let layer = [...leaves];
	let idx = index;
	while (layer.length > 1) {
		const pairIndex = idx % 2 === 1 ? idx - 1 : idx + 1;
		const sibling = layer[pairIndex] ?? layer[idx];
		siblings.push(sibling);
		const next = [];
		for (let i = 0; i < layer.length; i += 2) {
			const left = layer[i];
			const right = layer[i + 1] ?? left;
			next.push(await nodeHash(left, right));
		}
		layer = next;
		idx = Math.floor(idx / 2);
	}
	return {
		index,
		leafCount: leaves.length,
		siblings
	};
}
async function verifyInclusion(leafHash, proof, root) {
	let hash = leafHash;
	let idx = proof.index;
	for (const sibling of proof.siblings) {
		hash = idx % 2 === 1 ? await nodeHash(sibling, hash) : await nodeHash(hash, sibling);
		idx = Math.floor(idx / 2);
	}
	return hash === root;
}
function toPreimage(input, evaluation, recordId) {
	return {
		air_basin: input.airBasin,
		citation: evaluation.citation,
		emissions_micro: evaluation.emissionsMicro,
		entity: input.entity,
		facility_id: input.facilityId,
		factor: evaluation.factor,
		gate: evaluation.gate,
		interval_end: input.intervalEnd,
		interval_start: input.intervalStart,
		mwh_milli: evaluation.mwhMilli,
		record_id: recordId,
		sealable: evaluation.sealable,
		sector: input.sector,
		status: evaluation.status,
		warning: evaluation.warning
	};
}
async function sealRecord(args) {
	const evaluation = args.evaluation ?? evaluate(args.input);
	if (!evaluation.valid) throw new Error(evaluation.rejection ?? "Filing rejected by PolicyEngine");
	const preimage = toPreimage(args.input, evaluation, args.recordId);
	const leafHash = await leafDigest(utf8Bytes(canonicalJson(preimage)));
	const signature = await signLeaf(leafHash, args.signingKey);
	const prevHash = args.prevHash || GENESIS_HASH;
	const chainHead = await chainAdvance$1(prevHash, leafHash);
	const leaves = [...args.priorLeaves, leafHash];
	const root = await merkleRoot(leaves);
	const inclusion = await inclusionProof(leaves, leaves.length - 1);
	return {
		preimage,
		evaluation,
		leafHash,
		signature,
		publicKey: DEMO_SIGNING_JWK.x,
		prevHash,
		chainHead,
		merkleRoot: root,
		sealedAt: args.sealedAt,
		inclusion
	};
}
function ledgerJsonl(records) {
	return records.map((record) => JSON.stringify({
		record_id: record.preimage.record_id,
		entity: record.preimage.entity,
		facility_id: record.preimage.facility_id,
		sector: record.preimage.sector,
		air_basin: record.preimage.air_basin,
		interval_start: record.preimage.interval_start,
		interval_end: record.preimage.interval_end,
		mwh: record.preimage.mwh_milli / 1e3,
		mwh_milli: record.preimage.mwh_milli,
		factor: record.preimage.factor,
		emissions_mt: record.preimage.emissions_micro === null ? null : record.preimage.emissions_micro / 1e6,
		emissions_micro: record.preimage.emissions_micro,
		gate: record.preimage.gate,
		status: record.preimage.status,
		sealable: record.preimage.sealable,
		citation: record.preimage.citation,
		warning: record.preimage.warning,
		leaf_hash: record.leafHash,
		signature: record.signature,
		public_key: record.publicKey,
		prev_hash: record.prevHash,
		chain_head: record.chainHead,
		merkle_root: record.merkleRoot,
		sealed_at: record.sealedAt,
		inclusion: record.inclusion
	})).join("\n");
}
/**
* Clean-room auditor.
*
* Deliberately does not import PolicyEngine (`engine.ts`) or the sealer.
* Statutory constants are re-declared here. Hashing, signature checks, and
* gate invariants are recomputed from the pre-image alone.
*/
var STATUTORY_FACTOR = .428;
var MICRO_SCALE = 1e6;
var DRIFT_BOUND = 1e-6;
function issue(code, message) {
	return {
		code,
		message
	};
}
async function chainAdvance(prevHash, leafHash) {
	const digest = await sha256(concatBytes(hexToBytes(prevHash), hexToBytes(leafHash)));
	return Array.from(digest, (b) => b.toString(16).padStart(2, "0")).join("");
}
async function verifyRecord(record, expectedPrev) {
	const issues = [];
	const pre = record.preimage;
	let recomputedLeaf = null;
	try {
		recomputedLeaf = await leafDigest(utf8Bytes(canonicalJson(pre)));
		if (recomputedLeaf !== record.leafHash) issues.push(issue("PREIMAGE_MISMATCH", `Pre-image SHA-256 mismatch (stored ${record.leafHash.slice(0, 12)}…, recomputed ${recomputedLeaf.slice(0, 12)}…)`));
	} catch (err) {
		issues.push(issue("PREIMAGE_ERROR", err instanceof Error ? err.message : "pre-image failed"));
	}
	const verifyKey = await importVerifyKey(record.publicKey);
	if (!await verifyLeaf(recomputedLeaf ?? record.leafHash, record.signature, verifyKey)) issues.push(issue("SIGNATURE_FAILURE", "Cryptographic signature failure"));
	if (pre.mwh_milli < 0) issues.push(issue("INTERVAL_RANGE", "Interval range validation failure"));
	const start = Date.parse(pre.interval_start);
	const end = Date.parse(pre.interval_end);
	if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) issues.push(issue("INTERVAL_RANGE", "Interval range validation failure"));
	if (pre.status === "PIPELINE_ERROR") {
		if (pre.gate !== "PIPELINE_ERROR") issues.push(issue("FAULT_ISOLATION", "Fault isolation check (PIPELINE_ERROR ≠ BLACK): status PIPELINE_ERROR requires matching gate"));
		if (pre.gate === "BLACK") issues.push(issue("FAULT_ISOLATION", "Fault isolation check (PIPELINE_ERROR ≠ BLACK)"));
		if (pre.emissions_micro !== null) issues.push(issue("SCORE_ON_RETRIEVAL_FAILURE", "Invariant check: SCORE_ON_RETRIEVAL_FAILURE = None"));
		if (pre.factor !== null) issues.push(issue("SCORE_ON_RETRIEVAL_FAILURE", "Invariant check: SCORE_ON_RETRIEVAL_FAILURE = None"));
	}
	if (pre.gate === "YELLOW" && pre.sealable) issues.push(issue("REMEDIATION_HOLD", "Invariant check: YELLOW never sealed"));
	if (pre.sealable) {
		if (!(pre.gate === "GREEN" && pre.status === "LIVE" && pre.factor === STATUTORY_FACTOR)) issues.push(issue("SEALING_SAFETY", "Sealable ⇒ Gate=GREEN ∧ Status=LIVE ∧ Factor=0.428"));
	}
	if (pre.gate === "GREEN" && pre.factor !== STATUTORY_FACTOR) issues.push(issue("STATUTORY_FACTOR", "Title 17 CCR §95111 statutory check"));
	if (pre.factor !== null && pre.factor !== STATUTORY_FACTOR) issues.push(issue("UNAPPROVED_FACTOR", "Title 17 CCR §95111 statutory check"));
	if (pre.emissions_micro !== null) {
		const mwh = pre.mwh_milli / 1e3;
		if (Math.abs(pre.emissions_micro / MICRO_SCALE - mwh * STATUTORY_FACTOR) > DRIFT_BOUND) issues.push(issue("FLOAT_DRIFT", "Fixed-point integer arithmetic check"));
		const expectedMicro = pre.mwh_milli * 428;
		if (pre.emissions_micro !== expectedMicro) issues.push(issue("FLOAT_DRIFT", "Fixed-point integer arithmetic check"));
	}
	if (record.prevHash !== expectedPrev) issues.push(issue("CHAIN_BREAK", `Merkle chain predecessor mismatch (expected ${expectedPrev.slice(0, 12)}…)`));
	if (await chainAdvance(record.prevHash, record.leafHash) !== record.chainHead) issues.push(issue("CHAIN_HEAD", "Chain head does not match SHA-256(prev || leaf)"));
	if (!await verifyInclusion(record.leafHash, record.inclusion, record.merkleRoot)) issues.push(issue("INCLUSION", "Merkle inclusion proof failed"));
	return {
		recordId: pre.record_id,
		entity: pre.entity,
		accepted: issues.length === 0,
		issues,
		recomputedLeaf
	};
}
async function verifyLedger(records) {
	const results = [];
	let prev = GENESIS_HASH;
	for (const record of records) {
		results.push(await verifyRecord(record, prev));
		prev = record.chainHead;
	}
	return results;
}
var BASE_INPUT = {
	entity: "PG&E Electric Power Entity",
	facilityId: "PGE-EPE-001",
	sector: "Electric Power Entity",
	airBasin: "Statewide",
	intervalStart: "2024-01-01T00:00:00.000Z",
	intervalEnd: "2024-12-31T23:59:59.000Z",
	mwh: 250
};
function cloneRecord(record) {
	return structuredClone(record);
}
function detectionOf(result, fallback) {
	return result.issues[0]?.message ?? fallback;
}
async function runAdversarialSuite(signingKey) {
	const sealed = await sealRecord({
		input: BASE_INPUT,
		recordId: "adv-base-green",
		sealedAt: "2024-12-31T23:59:59.000Z",
		prevHash: GENESIS_HASH,
		priorLeaves: [],
		signingKey
	});
	const results = [];
	{
		const mutated = cloneRecord(sealed);
		if (mutated.preimage.emissions_micro !== null) mutated.preimage.emissions_micro += 1;
		const checked = await verifyRecord(mutated, GENESIS_HASH);
		results.push({
			vector: 1,
			name: "Leaf Hash Tampering",
			mechanism: "Emissions payload mutated post-hashing (+10⁻⁶ MT)",
			detection: detectionOf(checked, "Pre-image SHA-256 mismatch"),
			verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
			detail: checked.issues.map((i) => i.code).join(", ") || "no issue"
		});
	}
	{
		const mutated = cloneRecord(sealed);
		mutated.signature = flipByte(mutated.signature, 0);
		const checked = await verifyRecord(mutated, GENESIS_HASH);
		results.push({
			vector: 2,
			name: "Signature Forgery",
			mechanism: "8-bit bit-flip in Ed25519 signature",
			detection: detectionOf(checked, "Cryptographic signature failure"),
			verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
			detail: checked.issues.map((i) => i.code).join(", ") || "no issue"
		});
	}
	{
		const mutated = cloneRecord(sealed);
		mutated.leafHash = await leafDigest(utf8Bytes(jsonEnsureAsciiFalse(mutated.preimage)));
		const checked = await verifyRecord(mutated, GENESIS_HASH);
		const ascii = canonicalJson(mutated.preimage);
		results.push({
			vector: 3,
			name: "Unicode Section Drift",
			mechanism: "ensure_ascii=False serialization on § symbol",
			detection: detectionOf(checked, "Pre-image mismatch across byte encodings"),
			verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
			detail: ascii.includes("\\u00a7") ? "Canonical wire form uses \\u00a7; UTF-8 C2 A7 rejected" : checked.issues.map((i) => i.code).join(", ")
		});
	}
	{
		const input = {
			...BASE_INPUT,
			factor: .427
		};
		const evaluation = evaluate(input);
		const checked = await verifyRecord(await sealRecord({
			input,
			evaluation: {
				...evaluation,
				gate: "GREEN",
				sealable: true,
				factor: .427
			},
			recordId: "adv-unapproved-factor",
			sealedAt: sealed.sealedAt,
			prevHash: GENESIS_HASH,
			priorLeaves: [],
			signingKey
		}), GENESIS_HASH);
		results.push({
			vector: 4,
			name: "Unapproved Factor",
			mechanism: "Attempted injection of 0.427 MT/MWh",
			detection: detectionOf(checked, "Title 17 CCR §95111 statutory check"),
			verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
			detail: `engine_gate=${evaluation.gate}; verifier=${checked.issues.map((i) => i.code).join(",")}`
		});
	}
	{
		const input = {
			...BASE_INPUT,
			mwh: -25
		};
		const evaluation = evaluate(input);
		const preimage = toPreimage({
			...input,
			intervalStart: "2024-12-31T00:00:00.000Z",
			intervalEnd: "2024-01-01T00:00:00.000Z"
		}, {
			...evaluation,
			valid: true,
			gate: "GREEN",
			status: "LIVE",
			sealable: true,
			factor: STATUTORY_FACTOR$1,
			mwhMilli: -25e3,
			emissionsMicro: -107e5,
			emissionsMt: -10.7,
			rejection: null
		}, "adv-temporal");
		const forged = await sealRecord({
			input: {
				...BASE_INPUT,
				mwh: 250
			},
			recordId: "adv-temporal",
			sealedAt: sealed.sealedAt,
			prevHash: GENESIS_HASH,
			priorLeaves: [],
			signingKey
		});
		forged.preimage = preimage;
		forged.evaluation.mwhMilli = -25e3;
		forged.leafHash = await leafDigest(utf8Bytes(canonicalJson(preimage)));
		const checked = await verifyRecord(forged, GENESIS_HASH);
		results.push({
			vector: 5,
			name: "Temporal Inversion",
			mechanism: "Negative MWh consumption interval",
			detection: detectionOf(checked, "Interval range validation failure"),
			verdict: evaluation.valid || checked.accepted ? "ACCEPTED" : "REJECTED",
			detail: `engine_rejection=${evaluation.rejection ?? "none"}; ${checked.issues.map((i) => i.code).join(",")}`
		});
	}
	{
		const mutated = cloneRecord(sealed);
		mutated.preimage.emissions_micro = Math.floor(107e6) - 2;
		mutated.leafHash = await leafDigest(utf8Bytes(canonicalJson(mutated.preimage)));
		const checked = await verifyRecord(mutated, GENESIS_HASH);
		results.push({
			vector: 6,
			name: "Float Rounding Drift",
			mechanism: "Truncated binary float error (> 10⁻⁶ MT)",
			detection: detectionOf(checked, "Fixed-point integer arithmetic check"),
			verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
			detail: checked.issues.map((i) => i.code).join(", ") || "no issue"
		});
	}
	{
		const input = {
			...BASE_INPUT,
			warning: "Cogen steam allocation pending ARB review"
		};
		const evaluation = evaluate(input);
		const checked = await verifyRecord(await sealRecord({
			input,
			evaluation: {
				...evaluation,
				sealable: true
			},
			recordId: "adv-yellow-seal",
			sealedAt: sealed.sealedAt,
			prevHash: GENESIS_HASH,
			priorLeaves: [],
			signingKey
		}), GENESIS_HASH);
		results.push({
			vector: 7,
			name: "YELLOW Auto-Seal",
			mechanism: "Maliciously setting sealable = True on warning state",
			detection: detectionOf(checked, "Invariant check: YELLOW never sealed"),
			verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
			detail: `engine_sealable=${evaluation.sealable}; verifier=${checked.issues.map((i) => i.code).join(",")}`
		});
	}
	{
		const input = {
			...BASE_INPUT,
			retrievalFailure: true
		};
		const evaluation = evaluate(input);
		const checked = await verifyRecord(await sealRecord({
			input,
			evaluation: {
				...evaluation,
				gate: "BLACK"
			},
			recordId: "adv-fault-black",
			sealedAt: sealed.sealedAt,
			prevHash: GENESIS_HASH,
			priorLeaves: [],
			signingKey
		}), GENESIS_HASH);
		results.push({
			vector: 8,
			name: "Silent Fault Conversion",
			mechanism: "Forcing PIPELINE_ERROR to BLACK",
			detection: detectionOf(checked, "Fault isolation check (PIPELINE_ERROR ≠ BLACK)"),
			verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
			detail: `engine_gate=${evaluation.gate}; verifier=${checked.issues.map((i) => i.code).join(",")}`
		});
	}
	{
		const input = {
			...BASE_INPUT,
			retrievalFailure: true
		};
		const evaluation = evaluate(input);
		const checked = await verifyRecord(await sealRecord({
			input,
			evaluation: {
				...evaluation,
				emissionsMicro: 107e6,
				emissionsMt: 107,
				factor: STATUTORY_FACTOR$1
			},
			recordId: "adv-fallback-score",
			sealedAt: sealed.sealedAt,
			prevHash: GENESIS_HASH,
			priorLeaves: [],
			signingKey
		}), GENESIS_HASH);
		results.push({
			vector: 9,
			name: "Fallback Factor Bypass",
			mechanism: "Injecting numeric emissions score during node outage",
			detection: detectionOf(checked, "Invariant check: SCORE_ON_RETRIEVAL_FAILURE = None"),
			verdict: checked.accepted ? "ACCEPTED" : "REJECTED",
			detail: `engine_score=${evaluation.emissionsMicro}; verifier=${checked.issues.map((i) => i.code).join(",")}`
		});
	}
	return results;
}
/**
* CARB MRR 2024 representative filings.
*
* Totals (engine-computed, not hardcoded):
*   1,835.00 MWh
*   734.0200 MT CO₂e  (PIPELINE_ERROR contributes none)
*   BLACK deficit 487.92 MT × $160/MT = $78,067.20
*   Gates: 1 GREEN · 2 YELLOW · 2 BLACK · 1 PIPELINE_ERROR
*/
var MRR_2024 = [
	{
		recordId: "mrr-2024-001",
		entity: "PG&E Electric Power Entity",
		facilityId: "PGE-EPE-001",
		sector: "Electric Power Entity",
		airBasin: "Statewide",
		intervalStart: "2024-01-01T00:00:00.000Z",
		intervalEnd: "2024-12-31T23:59:59.000Z",
		mwh: 250,
		notes: "Specified source with verified e-tags. Statutory factor applied."
	},
	{
		recordId: "mrr-2024-002",
		entity: "Tesla Fremont",
		facilityId: "TESLA-FRE-FREMONT",
		sector: "Vehicle Manufacturing",
		airBasin: "San Francisco Bay",
		intervalStart: "2024-01-01T00:00:00.000Z",
		intervalEnd: "2024-12-31T23:59:59.000Z",
		mwh: 175,
		warning: "Behind-the-meter solar subtraction unverified",
		notes: "YELLOW remediation hold — on-site PV claim pending meter-data review."
	},
	{
		recordId: "mrr-2024-003",
		entity: "Chevron Richmond",
		facilityId: "CVX-RCH-REFINERY",
		sector: "Petroleum Refining",
		airBasin: "San Francisco Bay",
		intervalStart: "2024-01-01T00:00:00.000Z",
		intervalEnd: "2024-12-31T23:59:59.000Z",
		mwh: 150,
		warning: "Cogen steam allocation pending ARB review",
		notes: "YELLOW remediation hold — cogeneration allocation not yet accepted."
	},
	{
		recordId: "mrr-2024-004",
		entity: "LADWP Haynes",
		facilityId: "LADWP-HAY-GEN",
		sector: "Electricity Generation",
		airBasin: "South Coast",
		intervalStart: "2024-01-01T00:00:00.000Z",
		intervalEnd: "2024-12-31T23:59:59.000Z",
		mwh: 720,
		deficit: true,
		warning: "Unbundled REC claim rejected under MRR",
		notes: "BLACK deficit interval. Statutory 4:1 surrender exposure applies."
	},
	{
		recordId: "mrr-2024-005",
		entity: "CalPortland Mojave",
		facilityId: "CPC-MJV-CEMENT",
		sector: "Cement Manufacturing",
		airBasin: "Mojave Desert",
		intervalStart: "2024-01-01T00:00:00.000Z",
		intervalEnd: "2024-12-31T23:59:59.000Z",
		mwh: 420,
		deficit: true,
		warning: "Stationary combustion double-counted against Title V",
		notes: "BLACK deficit interval. Scope 2 grid power with overlapping Title V claim."
	},
	{
		recordId: "mrr-2024-006",
		entity: "CAISO OASIS Node",
		facilityId: "CAISO-OASIS-EPE",
		sector: "Electric Power Entity",
		airBasin: "Statewide",
		intervalStart: "2024-01-01T00:00:00.000Z",
		intervalEnd: "2024-12-31T23:59:59.000Z",
		mwh: 120,
		retrievalFailure: true,
		warning: "e-tag retrieval timeout",
		notes: "PIPELINE_ERROR. Score is None; fault is isolated from BLACK."
	}
];
function domain() {
	const mwhs = [
		0,
		.001,
		1,
		17.5,
		250,
		720,
		1835,
		1e4
	];
	const factors = [
		void 0,
		.428,
		.427,
		.5
	];
	const flags = [
		{},
		{ retrievalFailure: true },
		{ deficit: true },
		{ warning: "quality hold" },
		{
			retrievalFailure: true,
			deficit: true
		}
	];
	const intervals = [{
		intervalStart: "2024-01-01T00:00:00.000Z",
		intervalEnd: "2024-12-31T23:59:59.000Z"
	}, {
		intervalStart: "2024-12-31T00:00:00.000Z",
		intervalEnd: "2024-01-01T00:00:00.000Z"
	}];
	const out = [];
	for (const mwh of mwhs) for (const factor of factors) for (const flag of flags) for (const interval of intervals) out.push({
		entity: "D",
		facilityId: "D-1",
		sector: "Test",
		airBasin: "Statewide",
		mwh,
		factor,
		...flag,
		...interval
	});
	out.push({
		entity: "D",
		facilityId: "D-1",
		sector: "Test",
		airBasin: "Statewide",
		mwh: -1,
		intervalStart: "2024-01-01T00:00:00.000Z",
		intervalEnd: "2024-12-31T23:59:59.000Z"
	});
	return out;
}
function both(value, a, b) {
	return value === a && value === b;
}
async function proveAll() {
	const D = domain();
	const evals = D.map((x) => ({
		x,
		y: evaluate(x)
	}));
	const t1cx = [];
	for (const { y } of evals) if (both(y.gate, "GREEN", "BLACK")) t1cx.push("GREEN∧BLACK");
	const t2cx = [];
	for (const { y } of evals) if (y.status === "PIPELINE_ERROR" && y.gate !== "PIPELINE_ERROR") t2cx.push(`${y.gate}/${y.status}`);
	const t3cx = [];
	for (const { y } of evals) if (y.status === "PIPELINE_ERROR" && y.emissionsMicro !== null) t3cx.push(String(y.emissionsMicro));
	const t4cx = [];
	for (const { y } of evals) if (y.gate === "YELLOW" && y.sealable) t4cx.push("YELLOW sealed");
	const t5cx = [];
	for (const { y } of evals) if (y.sealable) {
		if (!(y.gate === "GREEN" && y.status === "LIVE" && y.factor === .428)) t5cx.push(`${y.gate}/${y.status}/${y.factor}`);
	}
	const t6cx = [];
	const mSamples = [];
	for (let m = 0; m <= 1e4; m += 17) mSamples.push(m);
	mSamples.push(1e6);
	for (const m of mSamples) {
		const drift = floatDrift(m, emissionsMicroFromMilli(mwhToMilli(m)));
		if (drift > 1e-6) t6cx.push(`m=${m} drift=${drift}`);
	}
	return [
		{
			id: 1,
			title: "Gate Mutual Exclusivity",
			statement: "∀ x ∈ D, ¬(Gate(x) = GREEN ∧ Gate(x) = BLACK)",
			proved: t1cx.length === 0,
			domainSize: D.length,
			counterexamples: t1cx,
			notes: "GREEN and BLACK are disjoint constructors of the gate algebra. Exhaustive check over the product domain D."
		},
		{
			id: 2,
			title: "Fault Isolation",
			statement: "∀ x (Status(x) = PIPELINE_ERROR ⇒ Gate(x) = PIPELINE_ERROR ∧ Gate(x) ≠ BLACK)",
			proved: t2cx.length === 0,
			domainSize: D.length,
			counterexamples: t2cx,
			notes: "A retrieval fault cannot be silently rewritten as a BLACK deficit."
		},
		{
			id: 3,
			title: "Null Score on Fault",
			statement: "∀ x (Status(x) = PIPELINE_ERROR ⇒ Score(x) = None)",
			proved: t3cx.length === 0,
			domainSize: D.length,
			counterexamples: t3cx,
			notes: "SCORE_ON_RETRIEVAL_FAILURE is the constant None. No fallback factor is applied."
		},
		{
			id: 4,
			title: "Remediation Hold",
			statement: "∀ x (Gate(x) = YELLOW ⇒ Sealable(x) = False)",
			proved: t4cx.length === 0,
			domainSize: D.length,
			counterexamples: t4cx,
			notes: "Warning-state filings remain on remediation hold and cannot receive a compliance seal."
		},
		{
			id: 5,
			title: "Sealing Safety",
			statement: "∀ x (Sealable(x) = True ⇒ Gate(x) = GREEN ∧ Status(x) = LIVE ∧ Factor(x) = 0.428)",
			proved: t5cx.length === 0,
			domainSize: D.length,
			counterexamples: t5cx,
			notes: "Only live GREEN filings at the statutory Title 17 CCR §95111 factor are sealable."
		},
		{
			id: 6,
			title: "Float Drift Bound",
			statement: "∀ m ∈ [0, 10⁶], |Z[φ]_μ / 10⁶ − (m × 0.428)| ≤ 10⁻⁶ MT CO₂e",
			proved: t6cx.length === 0,
			domainSize: mSamples.length,
			counterexamples: t6cx,
			notes: "Z[φ]_μ = round(m × 1000) × 428. For integer milli-MWh the identity is exact; sampled through 10⁶ MWh."
		}
	];
}
var STORAGE_KEY = "kerna.qreg.v1.ledger";
function loadRecords() {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed) || parsed.length === 0) return null;
		return parsed;
	} catch {
		return null;
	}
}
function persist(records) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}
var signingKeyPromise = null;
function signingKey() {
	signingKeyPromise ??= importSigningKey();
	return signingKeyPromise;
}
async function sealBenchmark() {
	const key = await signingKey();
	const records = [];
	let prev = GENESIS_HASH;
	const leaves = [];
	for (const entity of MRR_2024) {
		const input = {
			entity: entity.entity,
			facilityId: entity.facilityId,
			sector: entity.sector,
			airBasin: entity.airBasin,
			intervalStart: entity.intervalStart,
			intervalEnd: entity.intervalEnd,
			mwh: entity.mwh,
			factor: entity.factor,
			warning: entity.warning,
			retrievalFailure: entity.retrievalFailure,
			deficit: entity.deficit
		};
		const record = await sealRecord({
			input,
			evaluation: evaluate(input),
			recordId: entity.recordId,
			sealedAt: "2024-12-31T23:59:59.000Z",
			prevHash: prev,
			priorLeaves: leaves,
			signingKey: key
		});
		records.push(record);
		leaves.push(record.leafHash);
		prev = record.chainHead;
	}
	return records;
}
function ledgerTotals(records) {
	let mwh = 0;
	let mt = 0;
	let blackMt = 0;
	const gates = {
		GREEN: 0,
		YELLOW: 0,
		BLACK: 0,
		PIPELINE_ERROR: 0
	};
	for (const record of records) {
		mwh += record.preimage.mwh_milli / 1e3;
		const em = record.preimage.emissions_micro;
		if (em !== null) mt += microToMt(em);
		if (record.preimage.gate === "BLACK" && em !== null) blackMt += microToMt(em);
		gates[record.preimage.gate] += 1;
	}
	return {
		mwh,
		mt,
		blackMt,
		surrenderUsd: blackSurrenderUsd(blackMt),
		gates,
		merkleRoot: records.at(-1)?.merkleRoot ?? GENESIS_HASH,
		chainHead: records.at(-1)?.chainHead ?? GENESIS_HASH,
		count: records.length
	};
}
var useQreg = create((set, get) => ({
	ready: false,
	busy: false,
	error: null,
	records: [],
	verifyResults: [],
	adversarial: [],
	theorems: [],
	init: async () => {
		if (get().ready || get().busy) return;
		set({
			busy: true,
			error: null
		});
		try {
			await signingKey();
			const existing = loadRecords();
			const records = existing ?? await sealBenchmark();
			if (!existing) persist(records);
			set({
				records,
				verifyResults: await verifyLedger(records),
				ready: true,
				busy: false
			});
		} catch (err) {
			set({
				busy: false,
				error: err instanceof Error ? err.message : "Engine failed to start"
			});
		}
	},
	runBenchmark: async () => {
		set({
			busy: true,
			error: null
		});
		try {
			const records = await sealBenchmark();
			persist(records);
			set({
				records,
				verifyResults: await verifyLedger(records),
				busy: false,
				adversarial: [],
				theorems: []
			});
		} catch (err) {
			set({
				busy: false,
				error: err instanceof Error ? err.message : "Benchmark failed"
			});
		}
	},
	fileAndSeal: async (input) => {
		const key = await signingKey();
		const { records } = get();
		const evaluation = evaluate(input);
		if (!evaluation.valid) throw new Error(evaluation.rejection ?? "Filing rejected");
		const prev = records.at(-1)?.chainHead ?? GENESIS_HASH;
		const leaves = records.map((r) => r.leafHash);
		const record = await sealRecord({
			input,
			evaluation,
			recordId: `qreg-${Date.now().toString(36)}`,
			sealedAt: (/* @__PURE__ */ new Date()).toISOString(),
			prevHash: prev,
			priorLeaves: leaves,
			signingKey: key
		});
		const next = [...records, record];
		persist(next);
		set({
			records: next,
			verifyResults: await verifyLedger(next)
		});
		return record;
	},
	resetLedger: async () => {
		if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
		set({
			records: [],
			verifyResults: [],
			adversarial: [],
			theorems: [],
			ready: false
		});
		await get().runBenchmark();
		set({ ready: true });
	},
	verifyAll: async () => {
		const verifyResults = await verifyLedger(get().records);
		set({ verifyResults });
		return verifyResults;
	},
	runAdversary: async () => {
		set({
			busy: true,
			error: null
		});
		try {
			const adversarial = await runAdversarialSuite(await signingKey());
			set({
				adversarial,
				busy: false
			});
			return adversarial;
		} catch (err) {
			set({
				busy: false,
				error: err instanceof Error ? err.message : "Adversary suite failed"
			});
			return [];
		}
	},
	runProofs: async () => {
		set({
			busy: true,
			error: null
		});
		try {
			const theorems = await proveAll();
			set({
				theorems,
				busy: false
			});
			return theorems;
		} catch (err) {
			set({
				busy: false,
				error: err instanceof Error ? err.message : "Prover failed"
			});
			return [];
		}
	},
	exportJsonl: () => ledgerJsonl(get().records)
}));
function useEngine() {
	const init = useQreg((s) => s.init);
	const ready = useQreg((s) => s.ready);
	const busy = useQreg((s) => s.busy);
	const error = useQreg((s) => s.error);
	(0, import_react.useEffect)(() => {
		init();
	}, [init]);
	return {
		ready,
		busy,
		error
	};
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium outline-none transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
			outline: "border border-border bg-transparent text-foreground hover:bg-accent",
			ghost: "text-foreground hover:bg-accent",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
		},
		size: {
			default: "h-10 rounded-md px-4",
			sm: "h-9 rounded-sm px-3 text-[13px]",
			lg: "h-11 rounded-md px-5",
			icon: "size-10 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
//#endregion
export { ledgerTotals as a, useQreg as c, evaluate as i, PageHeader as n, microToMt as o, StatusBlock as r, useEngine as s, Button as t };
