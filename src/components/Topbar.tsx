import { Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";

import { adminNavigation, staffNavigation } from "../config/navigation";
import { useAuth } from "../features/auth/useAuth";
import { useTheme } from "../context/useTheme";

export function Topbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navigationItems =
    user?.role === "STAFF" ? staffNavigation : adminNavigation;

  const currentItem = navigationItems.find(
    (item) => item.path === location.pathname,
  );

  const title = currentItem?.label ?? "Dashboard";

  const initials =
    user?.fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          title={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition hover:bg-background hover:text-text-primary"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>

        {/* User Information */}
        <div className="text-right">
          <p className="text-sm font-medium text-text-primary">
            {user?.fullName ?? "User"}
          </p>

          <p className="text-xs text-text-secondary">
            {user?.role ?? "Unknown"}
          </p>
        </div>

        {/* User Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}
