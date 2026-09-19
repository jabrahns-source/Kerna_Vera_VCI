import type { ReactNode } from "react";

export function PageHeader({
  kicker,
  title,
  lede,
  action,
}: {
  kicker: string
  title: string
  lede: string
  action?: ReactNode
}) {
  return (
    <div className="kerna-enter mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {kicker}
        </p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{lede}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
