import { Outlet, useNavigate } from "react-router-dom";

import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Settings,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import { useAuth } from "../features/auth/useAuth";
import { logout } from "../features/auth/api/logout";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Sales",
    path: "/sales",
    icon: BarChart3,
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: Boxes,
  },
  {
    label: "Finance",
    path: "/finance",
    icon: Wallet,
  },
  {
    label: "Delivery",
    path: "/delivery",
    icon: Truck,
  },
  {
    label: "Users",
    path: "/users",
    icon: Users,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export function DashboardLayout() {
  const { clearAuthentication } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      clearAuthentication();
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar items={navigationItems} onLogout={handleLogout} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
