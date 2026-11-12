import { useEffect, useState } from "react";
import { getActivityLogs } from "../features/activity/api/activityApi";
import type {
  ActivityLog,
  ActivityLogPagination,
  ActivityAction,
  ActivityEntity,
} from "../features/activity/types/activity.types";
import { useToast } from "../components/feedback/useToast";
import { Search, X } from "lucide-react";

export function ActivityPage() {
  const { notify } = useToast();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<ActivityLogPagination | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [actionFilter, setActionFilter] = useState<ActivityAction | "">("");
  const [entityFilter, setEntityFilter] = useState<ActivityEntity | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);

        const response = await getActivityLogs({
          page: currentPage,
          limit: 20,
          order: "desc",
          search: debouncedSearch || undefined,
          action: actionFilter || undefined,
          entityType: entityFilter || undefined,
          from: fromDate
            ? new Date(`${fromDate}T00:00:00`).toISOString()
            : undefined,

          to: toDate
            ? new Date(`${toDate}T23:59:59.999`).toISOString()
            : undefined,
        });

        setActivities(response.activities);
        setPagination(response.pagination);
      } catch (error) {
        notify({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to load activity logs. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [
    currentPage,
    debouncedSearch,
    actionFilter,
    entityFilter,
    fromDate,
    toDate,
    notify,
  ]);

  function formatActivityAction(action: ActivityAction): string {
    const labels: Record<ActivityAction, string> = {
      LOGIN: "Logged In",
      LOGOUT: "Logged Out",

      PRODUCT_CREATED: "Product Created",
      PRODUCT_UPDATED: "Product Updated",
      PRODUCT_DELETED: "Product Deleted",
      PRODUCT_RESTORED: "Product Restored",
      PRODUCT_ACTIVATED: "Product Activated",
      PRODUCT_DEACTIVATED: "Product Deactivated",

      STOCK_RECEIVED: "Stock Received",
      STOCK_ADJUSTED: "Stock Adjusted",
      STOCK_REMOVED: "Stock Removed",

      SALE_CREATED: "Sale Created",
      SALE_CANCELLED: "Sale Cancelled",

      BUSINESS_DAY_OPENED: "Business Day Opened",
      BUSINESS_DAY_CLOSED: "Business Day Closed",

      USER_CREATED: "User Created",
      USER_UPDATED: "User Updated",
      USER_DISABLED: "User Disabled",
    };

    return labels[action];
  }

  function getActivityBadgeStyle(action: ActivityAction): string {
    if (
      action.includes("CREATED") ||
      action.includes("RECEIVED") ||
      action.includes("RESTORED") ||
      action.includes("ACTIVATED") ||
      action === "LOGIN" ||
      action === "BUSINESS_DAY_OPENED"
    ) {
      return "10 text-green-600";
    }

    if (
      action.includes("DELETED") ||
      action.includes("CANCELLED") ||
      action.includes("REMOVED") ||
      action.includes("DISABLED") ||
      action.includes("DEACTIVATED") ||
      action === "LOGOUT" ||
      action === "BUSINESS_DAY_CLOSED"
    ) {
      return "10 text-red-600";
    }

    return "10 text-blue-600";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Activity</h1>

        <p className="mt-1 text-sm text-text-secondary">
          Monitor recent activity across your shop.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-surface p-6">
        {/* Header and Search */}
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold text-text-primary">Activity Logs</h2>

            <div className="relative w-full sm:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search activity descriptions..."
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-10 text-sm text-text-primary outline-none transition focus:border-primary"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition hover:text-text-primary"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Action Filter */}
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value as ActivityAction | "");
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
            >
              <option value="">All Activities</option>
              <option value="LOGIN">Logged In</option>
              <option value="LOGOUT">Logged Out</option>
              <option value="PRODUCT_CREATED">Product Created</option>
              <option value="PRODUCT_UPDATED">Product Updated</option>
              <option value="PRODUCT_DELETED">Product Deleted</option>
              <option value="PRODUCT_RESTORED">Product Restored</option>
              <option value="PRODUCT_ACTIVATED">Product Activated</option>
              <option value="PRODUCT_DEACTIVATED">Product Deactivated</option>
              <option value="STOCK_RECEIVED">Stock Received</option>
              <option value="STOCK_ADJUSTED">Stock Adjusted</option>
              <option value="STOCK_REMOVED">Stock Removed</option>
              <option value="SALE_CREATED">Sale Created</option>
              <option value="SALE_CANCELLED">Sale Cancelled</option>
              <option value="BUSINESS_DAY_OPENED">Business Day Opened</option>
              <option value="BUSINESS_DAY_CLOSED">Business Day Closed</option>
              <option value="USER_CREATED">User Created</option>
              <option value="USER_UPDATED">User Updated</option>
              <option value="USER_DISABLED">User Disabled</option>
            </select>

            {/* Entity Filter */}
            <select
              value={entityFilter}
              onChange={(e) => {
                setActionFilter(e.target.value as ActivityAction | "");
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
            >
              <option value="">All Entities</option>
              <option value="PRODUCT">Product</option>
              <option value="SALE">Sale</option>
              <option value="USER">User</option>
              <option value="BUSINESS_DAY">Business Day</option>
            </select>

            {/* Start Date */}
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
            />

            {/* End Date */}
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate || undefined}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setActionFilter("");
                setEntityFilter("");
                setFromDate("");
                setToDate("");
                setSearch("");
                setCurrentPage(1);
              }}
              disabled={
                !actionFilter &&
                !entityFilter &&
                !fromDate &&
                !toDate &&
                !search
              }
              className="text-sm font-medium text-primary transition hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
            >
              Clear Filters
            </button>
          </div>

          <p className="text-sm text-text-secondary">
            TOTAL RECORD: {pagination?.total ?? 0}
          </p>
        </div>

        {/* Activity Content */}
        {loading ? (
          <div className="py-8 text-center">
            <p className="text-sm text-text-secondary">
              Loading activity logs...
            </p>
          </div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-medium text-text-primary">
              {search.trim()
                ? "No matching activities found"
                : "No activity recorded yet"}
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              {search.trim()
                ? "Try a different search term."
                : "Activities will appear here as users perform actions in your shop."}
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Activity Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-background/60">
                  <tr className="border-b border-border text-text-secondary">
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Activity</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Entity</th>
                    <th className="px-4 py-3 font-medium">Date & Time</th>
                  </tr>
                </thead>

                <tbody>
                  {activities.map((activity) => (
                    <tr
                      key={activity.id}
                      className="border-b border-border transition-colors hover:bg-background/60 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-text-primary">
                        {activity.user.fullName}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${getActivityBadgeStyle(activity.action)}`}
                        >
                          {formatActivityAction(activity.action)}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-text-secondary">
                        {activity.description ?? "No description"}
                      </td>

                      <td className="px-4 py-3 text-text-secondary">
                        {activity.entityType
                          ? activity.entityType.replaceAll("_", " ")
                          : "—"}
                      </td>

                      {/* <td className="whitespace-nowrap px-4 py-3 text-text-secondary">
                        {new Date(activity.createdAt).toLocaleString()}
                      </td> */}

                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="text-sm text-text-primary">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </div>

                        <div className="mt-1 text-xs text-text-secondary">
                          {new Date(activity.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            // second: "2-digit"
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <p className="text-sm text-text-secondary">
                Page {pagination?.page ?? currentPage} of{" "}
                {pagination?.totalPages ?? 1}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1 || loading}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="rounded-lg border border-border px-3 py-2 text-sm text-text-primary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    loading || currentPage >= (pagination?.totalPages ?? 1)
                  }
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="rounded-lg border border-border px-3 py-2 text-sm text-text-primary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
