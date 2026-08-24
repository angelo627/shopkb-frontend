interface TopbarProps {
  title?: string;
}

export function Topbar({ title = "Dashboard" }: TopbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-text-primary">User</p>

          <p className="text-xs text-text-secondary">Staff</p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          N
        </div>
      </div>
    </header>
  );
}
