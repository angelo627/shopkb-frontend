export function StaffDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Staff Dashboard
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Overview of your daily shop activities.
        </p>
      </div>

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Today's Sales</p>

          <p className="mt-2 text-2xl font-bold text-text-primary">₦0.00</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Stock Items</p>

          <p className="mt-2 text-2xl font-bold text-text-primary">0</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Sales Today</p>

          <p className="mt-2 text-2xl font-bold text-text-primary">0</p>
        </div>
      </section>

      {/* Main Sections */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent Sales */}
        <div className="min-h-80 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Recent Sales
          </h2>

          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-text-secondary">
              Recent sales will appear here.
            </p>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="min-h-80 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Stock Alerts
          </h2>

          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-text-secondary">
              Stock alerts will appear here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
