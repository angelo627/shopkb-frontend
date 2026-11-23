import { CreateSale } from "../../features/sales/sections/CreateSale";
import { GetSales } from "../../features/sales/sections/GetSales";

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

      {/* Create Sale */}
      <CreateSale />

      {/* Get Sales */}
      <GetSales />
    </>
  );
}
