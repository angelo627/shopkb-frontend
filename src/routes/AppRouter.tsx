import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { StaffDashboardPage } from "../pages/StaffDashboardPage";
import { SalesPage } from "../pages/sales/SalesPage";

import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "../layouts/DashboardLayout";

export function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Dashboard */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/sales" element={<SalesPage />} />
      </Route>

      {/* Default Routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function DashboardRouter() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
    return <AdminDashboardPage />;
  }

  return <StaffDashboardPage />;
}
