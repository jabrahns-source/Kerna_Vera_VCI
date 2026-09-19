import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { s as cn } from "./types-WNOmZHGT.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-CTDvBmrK.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-medium tracking-[0.14em] uppercase", {
	variants: { variant: {
		default: "border-transparent bg-secondary text-muted-foreground",
		green: "border-transparent bg-gate-green/15 text-gate-green",
		yellow: "border-transparent bg-gate-yellow/15 text-gate-yellow",
		black: "border-transparent bg-gate-black/15 text-gate-black",
		error: "border-transparent bg-gate-error/15 text-gate-error",
		outline: "border-border text-muted-foreground",
		paper: "border-transparent bg-primary text-primary-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };
