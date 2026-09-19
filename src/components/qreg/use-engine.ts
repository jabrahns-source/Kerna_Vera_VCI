import { useEffect } from "react";
import { useQreg } from "@/lib/qreg/store";

export function useEngine() {
  const init = useQreg((s) => s.init);
  const ready = useQreg((s) => s.ready);
  const busy = useQreg((s) => s.busy);
  const error = useQreg((s) => s.error);

  useEffect(() => {
    void init();
  }, [init]);

  return { ready, busy, error };
}
