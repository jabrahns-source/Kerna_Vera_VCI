export function StatusBlock({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-card px-5 py-8 text-center text-sm text-muted-foreground shadow-[var(--shadow-border)]">
      {message}
    </div>
  );
}
