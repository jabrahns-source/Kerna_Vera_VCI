import { Badge } from "@/components/ui/badge";
import type { Gate } from "@/lib/qreg/types";
import { gateLabel } from "@/lib/qreg/format";

const variant: Record<Gate, "green" | "yellow" | "black" | "error"> = {
  GREEN: "green",
  YELLOW: "yellow",
  BLACK: "black",
  PIPELINE_ERROR: "error",
};

export function GateChip({ gate }: { gate: Gate }) {
  return <Badge variant={variant[gate]}>{gateLabel(gate)}</Badge>;
}
