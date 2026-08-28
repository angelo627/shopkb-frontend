import { Outlet, useNavigate } from "react-router-dom";

import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { useAuth } from "../features/auth/useAuth";
import { logout } from "../features/auth/api/logout";
import { adminNavigation, staffNavigation } from "../config/navigation";


export function DashboardLayout() {
  const { user, clearAuthentication } = useAuth();
  const navigate = useNavigate();

  const navigationItems = user?.role === "STAFF" ? staffNavigation : adminNavigation;


  async function handleLogout() {
    try {
      await logout();
    } finally {
      clearAuthentication();
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar items={navigationItems} onLogout={handleLogout} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="shrink-0">
          <Topbar />
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
