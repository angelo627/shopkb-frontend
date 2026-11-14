import { useEffect, useState } from "react";
import {
  getDailyReport,
  type DailyReportResponse,
} from "../features/report/api/getDailyReport";
import {
  getWeeklyReport,
  type WeeklyReportResponse,
} from "../features/report/api/getWeeklyReport";
import {
  getMonthlyReport,
  type MonthlyReportResponse,
} from "../features/report/api/getMonthlyReport";
import { useToast } from "../components/feedback/useToast";

import { ShoppingBag, PackagePlus, Activity, Banknote } from "lucide-react";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export function ReportsPage() {
  const { notify } = useToast();

  const [report, setReport] = useState<DailyReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [weeklyReport, setWeeklyReport] = useState<WeeklyReportResponse | null>(
    null,
  );
  const [isWeeklyLoading, setIsWeeklyLoading] = useState(true);

  const [monthlyReport, setMonthlyReport] =
    useState<MonthlyReportResponse | null>(null);

  const [isMonthlyLoading, setIsMonthlyLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [currentBusinessYear, setCurrentBusinessYear] = useState(
    new Date().getFullYear(),
  );

  const years = Array.from(
    { length: 6 },
    (_, index) => currentBusinessYear - index,
  );

  useEffect(() => {
    async function fetchReport() {
      try {
        const data = await getDailyReport();
        setReport(data);
      } catch (error) {
        notify({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to load daily report. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchReport();
  }, [notify]);

  useEffect(() => {
    async function fetchWeeklyReport() {
      try {
        const data = await getWeeklyReport();
        setWeeklyReport(data);
      } catch (error) {
        notify({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to load weekly report. Please try again.",
        });
      } finally {
        setIsWeeklyLoading(false);
      }
    }

    fetchWeeklyReport();
  }, [notify]);

  useEffect(() => {
    async function fetchMonthlyReport() {
      try {
        const data = await getMonthlyReport();

        setMonthlyReport(data);
        setSelectedYear(data.year);
        setSelectedMonth(data.month);
        setCurrentBusinessYear(data.year);
      } catch (error) {
        notify({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to load monthly report. Please try again.",
        });
      } finally {
        setIsMonthlyLoading(false);
      }
    }

    fetchMonthlyReport();
  }, [notify]);

  async function handleMonthlyReportChange(year: number, month: number) {
    setIsMonthlyLoading(true);

    try {
      const data = await getMonthlyReport(year, month);
      setMonthlyReport(data);
    } catch (error) {
      notify({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to load the selected monthly report. Please try again.",
      });
    } finally {
      setIsMonthlyLoading(false);
    }
  }

  const reportCards = [
    {
      title: "Items Sold",
      value: report?.itemsSold ?? 0,
      description: "Total quantity of items sold today",
      icon: ShoppingBag,
    },
    {
      title: "Stock Received",
      value: report?.stockReceived ?? 0,
      description: "Total quantity of stock received today",
      icon: PackagePlus,
    },
    {
      title: "Activities",
      value: report?.activities ?? 0,
      description: "Recorded shop activities today",
      icon: Activity,
    },
    ...(report?.revenue !== undefined
      ? [
          {
            title: "Revenue",
            value: report.revenue,
            description: "Total sales revenue today",
            icon: Banknote,
          },
        ]
      : []),
  ];

  const weeklyReportCards = [
    {
      title: "Items Sold",
      value: weeklyReport?.itemsSold ?? 0,
      description: "Total quantity of items sold this week",
      icon: ShoppingBag,
    },
    {
      title: "Stock Received",
      value: weeklyReport?.stockReceived ?? 0,
      description: "Total quantity of stock received this week",
      icon: PackagePlus,
    },
    {
      title: "Activities",
      value: weeklyReport?.activities ?? 0,
      description: "Recorded shop activities this week",
      icon: Activity,
    },
    ...(weeklyReport?.revenue !== undefined
      ? [
          {
            title: "Revenue",
            value: weeklyReport.revenue,
            description: "Total sales revenue this week",
            icon: Banknote,
          },
        ]
      : []),
  ];

  const monthlyReportCards = [
    {
      title: "Items Sold",
      value: monthlyReport?.itemsSold ?? 0,
      description: "Total quantity of items sold this month",
      icon: ShoppingBag,
    },
    {
      title: "Stock Received",
      value: monthlyReport?.stockReceived ?? 0,
      description: "Total quantity of stock received this month",
      icon: PackagePlus,
    },
    {
      title: "Activities",
      value: monthlyReport?.activities ?? 0,
      description: "Recorded shop activities this month",
      icon: Activity,
    },
    ...(monthlyReport?.revenue !== undefined
      ? [
          {
            title: "Revenue",
            value: monthlyReport.revenue,
            description: "Total sales revenue this month",
            icon: Banknote,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Reports</h1>

        <p className="mt-1 text-sm text-text-secondary">
          View and monitor reports for your shop.
        </p>
      </div>

      {/* Daily Report */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Daily Report
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            A summary of today's shop activities.
          </p>

          {report && (
            <p className="mt-2 text-xs text-text-secondary">
              Report date:{" "}
              {new Date(`${report.date}T00:00:00`).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading daily report...</p>
        ) : report ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {reportCards.map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-border bg-background p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text-secondary">
                    {card.title}
                  </p>

                  <card.icon size={20} className="text-text-secondary " />
                </div>

                <p className="mt-4 text-2xl font-bold text-text-primary">
                  {card.title === "Revenue"
                    ? `₦${Number(card.value).toLocaleString("en-NG")}`
                    : Number(card.value).toLocaleString("en-NG")}
                </p>

                <p className="mt-2 text-xs text-text-secondary">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">
            Unable to load the daily report.
          </p>
        )}
      </section>

      {/* Weekly Report */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Weekly Report
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            A summary of this week's shop activities.
          </p>

          {weeklyReport && (
            <p className="mt-2 text-xs text-text-secondary">
              {new Date(weeklyReport.startDate).toLocaleDateString("en-NG")} -{" "}
              {new Date(weeklyReport.endDate).toLocaleDateString("en-NG")}
            </p>
          )}
        </div>

        {isWeeklyLoading ? (
          <p className="text-sm text-text-secondary">
            Loading weekly report...
          </p>
        ) : weeklyReport ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {weeklyReportCards.map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-border bg-background p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text-secondary">
                    {card.title}
                  </p>

                  <card.icon size={20} className="text-text-secondary" />
                </div>

                <p className="mt-4 text-2xl font-bold text-text-primary">
                  {card.title === "Revenue"
                    ? `₦${Number(card.value).toLocaleString("en-NG")}`
                    : Number(card.value).toLocaleString("en-NG")}
                </p>

                <p className="mt-2 text-xs text-text-secondary">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">
            Unable to load the weekly report.
          </p>
        )}
      </section>

      {/* Monthly Report */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Monthly Report
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              A summary of the selected month's shop activities.
            </p>
          </div>

          <div className="flex gap-3">
            {/* Month Selector */}
            <select
              value={selectedMonth}
              onChange={(e) => {
                const month = Number(e.target.value);
                setSelectedMonth(month);
                handleMonthlyReportChange(selectedYear, month);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => {
                const year = Number(e.target.value);
                setSelectedYear(year);
                handleMonthlyReportChange(year, selectedMonth);
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isMonthlyLoading ? (
          <p className="text-sm text-text-secondary">
            Loading monthly report...
          </p>
        ) : monthlyReport ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {monthlyReportCards.map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-border bg-background p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text-secondary">
                    {card.title}
                  </p>

                  <card.icon size={20} className="text-text-secondary" />
                </div>

                <p className="mt-4 text-2xl font-bold text-text-primary">
                  {card.title === "Revenue"
                    ? `₦${Number(card.value).toLocaleString("en-NG")}`
                    : Number(card.value).toLocaleString("en-NG")}
                </p>

                <p className="mt-2 text-xs text-text-secondary">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">
            Unable to load the monthly report.
          </p>
        )}
      </section>
    </div>
  );
}
