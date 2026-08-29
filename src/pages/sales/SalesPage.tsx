import { useAuth } from "../../features/auth/useAuth";

import { AdminSalesContent } from "./AdminSalesContent";
import { StaffSalesContent } from "./StaffSalesContent";

export function SalesPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Sales</h1>

        <p className="mt-1 text-sm text-text-secondary">
          Manage and monitor your shop's sales.
        </p>
      </div>

      {user?.role === "STAFF" ? <StaffSalesContent /> : <AdminSalesContent />}
    </div>
  );
}
