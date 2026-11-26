import { useEffect, useState } from "react";
import {
  getSales,
  type SaleListResponse,
  type SaleStatus,
} from "../api/getSales";
import { useToast } from "../../../components/feedback/useToast";
import { CancelSale } from "./CancelSale";

interface GetSalesProps {
  refreshTrigger: number;
}

export function GetSales({ refreshTrigger }: GetSalesProps) {
  const [sales, setSales] = useState<SaleListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { notify } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<SaleStatus | "">("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  useEffect(() => {
    let ignore = false;

    async function fetchSales() {
      setIsLoading(true);

      try {
        const response = await getSales({
          page: currentPage,
          limit: 10,
          search: debouncedSearch || undefined,
          status: status || undefined,
          from: fromDate || undefined,
          to: toDate || undefined,
        });

        if (ignore) return;

        setSales(response.items);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        if (ignore) return;

        notify({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to retrieve sales.",
        });
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void fetchSales();

    return () => {
      ignore = true;
    };
  }, [
    currentPage,
    debouncedSearch,
    status,
    fromDate,
    toDate,
    notify,
    refreshKey,
    refreshTrigger,
  ]);

  return (
    <section className="rounded-xl border border-border bg-surface">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Recent Sales
          </h2>
          <p className="mt-1 text-sm text-text-secondary">Your latest sales.</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by product name..."
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm text-text-primary outline-none transition-colors focus:border-primary"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-text-primary"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as SaleStatus | "");
              setCurrentPage(1);
            }}
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={(e) => {
              setFromDate(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Start date"
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none focus:border-primary"
          />

          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => {
              setToDate(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="End date"
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none focus:border-primary"
          />
        </div>

        {(fromDate || toDate) && (
          <button
            type="button"
            onClick={() => {
              setFromDate("");
              setToDate("");
              setCurrentPage(1);
            }}
            className="rounded-lg border border-border px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
          >
            ×
          </button>
        )}
      </div>

      {/* Sales */}
      <div className="space-y-4 p-4 sm:p-6">
        {isLoading ? (
          <p className="py-10 text-center text-text-secondary">
            Loading sales...
          </p>
        ) : sales.length === 0 ? (
          <p className="py-10 text-center text-text-secondary">
            No sales available yet.
          </p>
        ) : (
          sales.map((sale) => (
            <article
              key={sale.id}
              className="overflow-hidden rounded-xl border border-border bg-background"
            >
              {/* Sale Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
                <div>
                  <p className="font-semibold text-text-primary">
                    Sale #{sale.id.slice(0, 8).toUpperCase()}
                  </p>

                  <p className="mt-1 text-xs text-text-secondary">
                    {new Date(sale.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    sale.status === "COMPLETED"
                      ? "bg-green-500/10 text-green-600"
                      : "bg-red-500/10 text-red-600"
                  }`}
                >
                  {sale.status}
                </span>
              </div>

              {/* Sale Content */}
              <div className="grid items-stretch gap-4 p-4 md:grid-cols-2">
                {/* Products */}
                <div className="flex flex-col">
                  <h3 className="mb-3 text-sm font-medium text-text-primary">
                    Products Purchased ({sale.items.length})
                  </h3>

                  <div className="max-h-52 space-y-3 overflow-y-auto rounded-lg border border-border p-3">
                    {sale.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-text-primary">
                            {item.product.name}
                          </p>

                          <p className="mt-1 text-xs text-text-secondary">
                            {item.product.sku}
                          </p>

                          <p className="mt-1 text-xs text-text-secondary">
                            ₦{Number(item.unitPrice).toLocaleString("en-NG")} ×{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-medium text-text-primary">
                          ₦{Number(item.totalAmount).toLocaleString("en-NG")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {sale.status === "COMPLETED" && (
                    <div className="mt-auto flex justify-start pt-3">
                      <button
                        type="button"
                        onClick={() => setSelectedSaleId(sale.id)}
                        className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/10"
                      >
                        Cancel Sale
                      </button>
                    </div>
                  )}
                </div>

                {/* Transaction Details */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-text-primary">
                    Transaction Details
                  </h3>

                  <div className="space-y-4 rounded-lg border border-border p-4">
                    <div>
                      <p className="text-xs text-text-secondary">Cashier</p>
                      <p className="mt-1 text-sm font-medium text-text-primary">
                        {sale.soldBy.fullName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-secondary">
                        Business Date
                      </p>
                      <p className="mt-1 text-sm font-medium text-text-primary">
                        {new Date(
                          sale.businessDay.businessDate,
                        ).toLocaleDateString("en-NG")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-secondary">
                        Total Quantity
                      </p>
                      <p className="mt-1 text-sm font-medium text-text-primary">
                        {sale.items.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        )}
                      </p>
                    </div>

                    <div className="border-t border-border pt-3">
                      <p className="text-xs text-text-secondary">
                        Total Amount
                      </p>
                      <p className="mt-1 text-xl font-bold text-text-primary">
                        ₦
                        {Number(sale.totalAmount).toLocaleString("en-NG", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {selectedSaleId && (
        <CancelSale
          saleId={selectedSaleId}
          onClose={() => setSelectedSaleId(null)}
          onSuccess={() => {
            setRefreshKey((key) => key + 1);
          }}
        />
      )}

      {sales.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-text-secondary">
            page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => page - 1)}
              disabled={currentPage === 1 || isLoading}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((page) => page + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
