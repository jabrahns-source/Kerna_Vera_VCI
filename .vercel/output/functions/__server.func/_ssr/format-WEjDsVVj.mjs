//#region node_modules/.nitro/vite/services/ssr/assets/format-WEjDsVVj.js
function formatMt(value, digits = 4) {
	if (value === null || value === void 0) return "—";
	return `${value.toFixed(digits)}`;
}
function formatMwh(value, digits = 2) {
	return value.toLocaleString("en-US", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	});
}
function formatUsd(value) {
	return value.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2
	});
}
function truncateHash(hash, edge = 6) {
	if (hash.length <= edge * 2 + 1) return hash;
	return `${hash.slice(0, edge)}…${hash.slice(-edge)}`;
}
function gateLabel(gate) {
	if (gate === "PIPELINE_ERROR") return "PIPELINE ERROR";
	return gate;
}
function mwhFromMilli(milli) {
	return milli / 1e3;
}
//#endregion
export { mwhFromMilli as a, gateLabel as i, formatMwh as n, truncateHash as o, formatUsd as r, formatMt as t };
