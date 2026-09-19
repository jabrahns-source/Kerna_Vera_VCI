import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Badge } from "./badge-CTDvBmrK.mjs";
import { i as gateLabel } from "./format-WEjDsVVj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gate-chip-BHwm8swj.js
var import_jsx_runtime = require_jsx_runtime();
var variant = {
	GREEN: "green",
	YELLOW: "yellow",
	BLACK: "black",
	PIPELINE_ERROR: "error"
};
function GateChip({ gate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: variant[gate],
		children: gateLabel(gate)
	});
}
//#endregion
export { GateChip as t };
