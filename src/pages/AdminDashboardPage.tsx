export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Overview of your shop's activities and performance.
        </p>
      </div>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Total Sales</p>

          <p className="mt-2 text-2xl font-bold text-text-primary">₦0.00</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Stock Items</p>

          <p className="mt-2 text-2xl font-bold text-text-primary">0</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Finance</p>

          <p className="mt-2 text-2xl font-bold text-text-primary">₦0.00</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Users</p>

          <p className="mt-2 text-2xl font-bold text-text-primary">0</p>
        </div>
      </section>

      {/* Main Dashboard Sections */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Sales Overview */}
        <div className="min-h-80 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Sales Overview
          </h2>

          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-text-secondary">
              Sales chart will appear here.
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="min-h-80 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Recent Activity
          </h2>

          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-text-secondary">
              Recent activity will appear here.
            </p>
          </div>
        </div>
      </section>

      {/* Lower Sections */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock */}
        <div className="min-h-64 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">Low Stock</h2>

          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-text-secondary">
              Low stock products will appear here.
            </p>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="min-h-64 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Recent Sales
          </h2>

          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-text-secondary">
              Recent sales will appear here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
