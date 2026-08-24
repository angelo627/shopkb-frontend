import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Sales", path: "/sales" },
  { label: "Inventory", path: "/inventory" },
  { label: "Finance", path: "/finance" },
  { label: "Delivery", path: "/delivery" },
  { label: "Users", path: "/users" },
  { label: "Settings", path: "/settings" },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-xl font-bold text-primary">ShopKB</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-background hover:text-text-primary"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
