import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "../pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";

function DashboardPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-text-primary">ShopKB Dashboard</h1>

      <p className="mt-2 text-text-secondary">Authentication is working.</p>
    </main>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
