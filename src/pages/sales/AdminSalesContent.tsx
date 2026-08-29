export function AdminSalesContent() {
  return (
    <>
      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Total Sales</p>

          <p className="mt-2 text-2xl font-bold text-text-primary">₦0.00</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Number of Sales</p>

          <p className="mt-2 text-2xl font-bold text-text-primary">0</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Completed</p>

          <p className="mt-2 text-2xl font-bold text-green-600">0</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-secondary">Pending</p>

          <p className="mt-2 text-2xl font-bold text-orange-600">0</p>
        </div>
      </section>

      {/* Sales Table */}
      <section className="rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Recent Sales
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Your latest sales transactions.
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
          >
            New Sale
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="px-6 py-3 font-medium text-text-secondary">
                  Product
                </th>

                <th className="px-6 py-3 font-medium text-text-secondary">
                  Quantity
                </th>

                <th className="px-6 py-3 font-medium text-text-secondary">
                  Amount
                </th>

                <th className="px-6 py-3 font-medium text-text-secondary">
                  Status
                </th>

                <th className="px-6 py-3 font-medium text-text-secondary">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-text-secondary"
                >
                  No sales available yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
