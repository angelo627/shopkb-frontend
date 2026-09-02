import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { ElementType } from "react";

export interface SidebarItem {
  label: string;
  path: string;
  icon: ElementType;
}

interface SidebarProps {
  items: SidebarItem[];
  onLogout: () => void;
}

export function Sidebar({ items, onLogout }: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface">
      {/* Header */}
      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-border px-5">
        <img
          src="/logo.png"
          alt="IG Genesis & Sons"
          className="h-11 w-11 object-contain"
        />

        <div className="leading-tight">
          <p className="text-sm font-bold text-text-primary">IG GENESIS</p>

          <p className="text-xs font-medium text-text-secondary">& SONS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "text-text-secondary hover:bg-background hover:text-text-primary"
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-border p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-red-600 hover:text-white"
        >
          <LogOut className="h-5 w-5 shrink-0" />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
