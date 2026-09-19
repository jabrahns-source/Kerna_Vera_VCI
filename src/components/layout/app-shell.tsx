import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  FileCheck2,
  Gavel,
  LayoutGrid,
  ScrollText,
  ShieldAlert,
  Sigma,
} from "lucide-react";
import { KernaMark } from "@/components/qreg/mark";
import { cn } from "@/lib/utils";
import { QREG_VERSION } from "@/lib/qreg/types";

const NAV = [
  { to: "/", label: "Command", short: "Home", icon: LayoutGrid },
  { to: "/engine", label: "Engine", short: "Engine", icon: Sigma },
  { to: "/ledger", label: "Ledger", short: "Ledger", icon: ScrollText },
  { to: "/adversarial", label: "Adversary", short: "Attack", icon: ShieldAlert },
  { to: "/proofs", label: "Theorems", short: "Proofs", icon: Gavel },
  { to: "/certificate", label: "Certificate", short: "Cert", icon: FileCheck2 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 kerna-grain opacity-70" />
      <div className="relative mx-auto flex min-h-dvh max-w-[1440px]">
        <aside className="sticky top-0 hidden h-dvh w-[220px] shrink-0 flex-col border-r border-border px-5 py-6 md:flex">
          <Link to="/" className="flex items-center gap-3">
            <KernaMark className="size-8" />
            <span className="flex flex-col leading-none">
              <span className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground">
                KERNA
              </span>
              <span className="mt-1 text-sm font-medium tracking-tight">Ledger VCI</span>
            </span>
          </Link>
          <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Q-Reg {QREG_VERSION}
          </p>
          <nav className="mt-6 flex flex-1 flex-col gap-1">
            {NAV.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex h-10 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors duration-150",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Title 17 CCR §95111
            <br />
            CARB SB 253 · MRR 2024
          </p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
          <header className="flex h-12 min-w-0 items-center justify-between gap-3 overflow-hidden border-b border-border px-4 md:px-8">
            <p className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Audit grade · Ed25519 · SHA-256
            </p>
            <p className="hidden shrink-0 font-mono text-[11px] text-muted-foreground sm:block">
              RFC 8032 · FIPS 180-4
            </p>
          </header>
          <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 md:hidden">
        <ul className="grid grid-cols-6">
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <li key={item.to} className="min-w-0">
                <Link
                  to={item.to}
                  className={cn(
                    "flex h-16 min-w-0 flex-col items-center justify-center gap-1 px-0.5 text-[9px] tracking-wide",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="w-full truncate text-center">{item.short}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
