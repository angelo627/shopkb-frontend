export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Here's an overview of what's happening in your shop.
        </p>
      </div>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Sales */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Sales</p>

              <p className="mt-2 text-2xl font-bold text-text-primary">₦0.00</p>
            </div>

            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              Sales
            </div>
          </div>

          <p className="mt-4 text-xs text-text-secondary">
            No sales data available yet.
          </p>
        </div>

        {/* Inventory */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-secondary">Stock Items</p>

              <p className="mt-2 text-2xl font-bold text-text-primary">0</p>
            </div>

            <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
              Stock
            </div>
          </div>

          <p className="mt-4 text-xs text-text-secondary">
            Inventory information will appear here.
          </p>
        </div>

        {/* Finance */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-secondary">Finance</p>

              <p className="mt-2 text-2xl font-bold text-text-primary">₦0.00</p>
            </div>

            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              Finance
            </div>
          </div>

          <p className="mt-4 text-xs text-text-secondary">
            Financial summary will appear here.
          </p>
        </div>

        {/* Users */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-secondary">Users</p>

              <p className="mt-2 text-2xl font-bold text-text-primary">0</p>
            </div>

            <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
              Users
            </div>
          </div>

          <p className="mt-4 text-xs text-text-secondary">
            User information will appear here.
          </p>
        </div>
      </section>

      {/* Main Sections */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Sales Overview */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Sales Overview
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Sales performance will appear here.
            </p>
          </div>

          <div className="flex h-72 items-center justify-center">
            <p className="text-sm text-text-secondary">
              Sales chart will appear here.
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Recent system activity will appear here.
            </p>
          </div>

          <div className="flex h-72 items-center justify-center">
            <p className="text-sm text-text-secondary">No recent activity.</p>
          </div>
        </div>
      </section>

      {/* Secondary Sections */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Low Stock */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Low Stock
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Products that need attention.
            </p>
          </div>

          <div className="flex h-48 items-center justify-center">
            <p className="text-sm text-text-secondary">
              No low-stock products.
            </p>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Recent Sales
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Your most recent sales will appear here.
            </p>
          </div>

          <div className="flex h-48 items-center justify-center">
            <p className="text-sm text-text-secondary">No recent sales.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
