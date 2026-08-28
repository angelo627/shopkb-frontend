export function StaffDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Staff Dashboard
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Here's an overview of your daily shop activities.
        </p>
      </div>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Today's Sales */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-secondary">Today's Sales</p>

              <p className="mt-2 text-2xl font-bold text-text-primary">₦0.00</p>
            </div>

            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              Sales
            </div>
          </div>

          <p className="mt-4 text-xs text-text-secondary">
            Today's sales information will appear here.
          </p>
        </div>

        {/* Stock */}
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
            Current stock information will appear here.
          </p>
        </div>

        {/* Sales Count */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-secondary">Sales Today</p>

              <p className="mt-2 text-2xl font-bold text-text-primary">0</p>
            </div>

            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              Sales
            </div>
          </div>

          <p className="mt-4 text-xs text-text-secondary">
            Number of sales made today.
          </p>
        </div>
      </section>

      {/* Main Sections */}
      <section className="grid gap-6 xl:grid-cols-2">
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

          <div className="flex h-72 items-center justify-center">
            <p className="text-sm text-text-secondary">No recent sales.</p>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Stock Alerts
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Products that may need attention.
            </p>
          </div>

          <div className="flex h-72 items-center justify-center">
            <p className="text-sm text-text-secondary">No stock alerts.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
