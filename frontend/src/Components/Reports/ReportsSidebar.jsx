import React from "react";
import {
  BarChart3,
  HelpCircle,
  Users,
  Image,
  Download,
  ArrowRight,
  FileText,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* =========================================================
   MOCK DATA
========================================================= */

const reportOverviewData = [
  {
    name: "Summary",
    value: 32,
    percentage: "25%",
  },
  {
    name: "Quiz",
    value: 28,
    percentage: "22%",
  },
  {
    name: "Engagement",
    value: 20,
    percentage: "16%",
  },
  {
    name: "Content",
    value: 18,
    percentage: "14%",
  },
  {
    name: "Audience",
    value: 16,
    percentage: "12%",
  },
  {
    name: "Others",
    value: 14,
    percentage: "11%",
  },
];

const overviewColors = [
  "#5635E8",
  "#2EB67D",
  "#F3A623",
  "#F45B87",
  "#5B9CFF",
  "#A5ADBE",
];

const dataSources = [
  {
    name: "Analytics",
    value: 62,
    percentage: "48%",
    icon: BarChart3,
    bg: "bg-violet-50",
    color: "text-violet-600",
  },
  {
    name: "Quizzes",
    value: 28,
    percentage: "22%",
    icon: HelpCircle,
    bg: "bg-emerald-50",
    color: "text-emerald-600",
  },
  {
    name: "Doctors",
    value: 16,
    percentage: "12%",
    icon: Users,
    bg: "bg-orange-50",
    color: "text-orange-500",
  },
  {
    name: "Media Library",
    value: 12,
    percentage: "9%",
    icon: Image,
    bg: "bg-pink-50",
    color: "text-pink-500",
  },
  {
    name: "Others",
    value: 10,
    percentage: "8%",
    icon: FileText,
    bg: "bg-slate-100",
    color: "text-slate-500",
  },
];

const recentReports = [
  {
    id: 1,
    name: "Campaign Performance Summary",
    date: "18 May 2025, 11:32 AM",
    type: "Summary",
  },
  {
    id: 2,
    name: "Quiz Performance Report",
    date: "18 May 2025, 10:15 AM",
    type: "Quiz",
  },
  {
    id: 3,
    name: "Doctor Engagement Report",
    date: "17 May 2025, 04:20 PM",
    type: "Engagement",
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

function ReportsSidebar({
  onDownloadReport = () => {},
  onViewAllReports = () => {},
}) {
  return (
    <aside className="w-full space-y-3">
      {/* =========================================
          REPORT OVERVIEW
      ========================================= */}
      <ReportOverview />

      {/* =========================================
          TOP DATA SOURCES
      ========================================= */}
      <TopDataSources />

      {/* =========================================
          RECENT REPORTS
      ========================================= */}
      <RecentReports
        onDownloadReport={onDownloadReport}
        onViewAllReports={onViewAllReports}
      />
    </aside>
  );
}

/* =========================================================
   REPORT OVERVIEW
========================================================= */

function ReportOverview() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="text-xs font-semibold text-slate-800">
        Report Overview
      </h2>

      <div className="mt-2 flex items-center gap-3">
        {/* DONUT */}
        <div className="relative h-[145px] w-[145px] shrink-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={reportOverviewData}
                dataKey="value"
                nameKey="name"
                innerRadius={42}
                outerRadius={66}
                paddingAngle={0}
                strokeWidth={0}
              >
                {reportOverviewData.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        overviewColors[index]
                      }
                    />
                  )
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* CENTER VALUE */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              flex
              flex-col
              items-center
              justify-center
            "
          >
            <span className="text-xl font-semibold text-slate-800">
              128
            </span>

            <span className="text-[9px] text-slate-500">
              Total
            </span>
          </div>
        </div>

        {/* LEGEND */}
        <div className="min-w-0 flex-1 space-y-2">
          {reportOverviewData.map(
            (item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex min-w-0 items-center gap-1.5">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        overviewColors[index],
                    }}
                  />

                  <span className="truncate text-[9px] text-slate-600">
                    {item.name}
                  </span>
                </div>

                <span className="shrink-0 text-[9px] text-slate-500">
                  {item.value} ({item.percentage})
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TOP DATA SOURCES
========================================================= */

function TopDataSources() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="text-xs font-semibold text-slate-800">
        Top Data Sources
      </h2>

      <div className="mt-3 space-y-2.5">
        {dataSources.map((source) => {
          const Icon = source.icon;

          return (
            <div
              key={source.name}
              className="flex items-center justify-between gap-2"
            >
              {/* SOURCE */}
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className={`
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    ${source.bg}
                  `}
                >
                  <Icon
                    size={13}
                    strokeWidth={1.8}
                    className={source.color}
                  />
                </div>

                <span className="truncate text-[10px] text-slate-600">
                  {source.name}
                </span>
              </div>

              {/* VALUE */}
              <span className="shrink-0 text-[9px] text-slate-500">
                {source.value} ({source.percentage})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   RECENT REPORTS
========================================================= */

function RecentReports({
  onDownloadReport,
  onViewAllReports,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="text-xs font-semibold text-slate-800">
        Recent Reports
      </h2>

      <div className="mt-3 space-y-2">
        {recentReports.map((report) => (
          <div
            key={report.id}
            className="
              flex
              items-center
              justify-between
              gap-2
              rounded-lg
              p-1
              transition
              hover:bg-slate-50
            "
          >
            {/* REPORT INFO */}
            <div className="flex min-w-0 items-center gap-2">
              <RecentReportIcon
                type={report.type}
              />

              <div className="min-w-0">
                <p className="truncate text-[9px] font-medium text-slate-700">
                  {report.name}
                </p>

                <p className="mt-0.5 truncate text-[8px] text-slate-400">
                  {report.date}
                </p>
              </div>
            </div>

            {/* DOWNLOAD */}
            <button
              type="button"
              title="Download Report"
              onClick={() =>
                onDownloadReport(report)
              }
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-md
                border
                border-slate-200
                bg-white
                text-violet-500
                transition
                hover:border-violet-200
                hover:bg-violet-50
              "
            >
              <Download
                size={13}
                strokeWidth={1.8}
              />
            </button>
          </div>
        ))}
      </div>

      {/* VIEW ALL */}
      <button
        type="button"
        onClick={onViewAllReports}
        className="
          mt-3
          flex
          w-full
          items-center
          justify-center
          gap-1
          text-[9px]
          font-medium
          text-violet-600
          transition
          hover:text-violet-700
        "
      >
        View All Reports

        <ArrowRight size={12} />
      </button>
    </div>
  );
}

/* =========================================================
   RECENT REPORT ICON
========================================================= */

function RecentReportIcon({ type }) {
  const config = {
    Summary: {
      icon: BarChart3,
      bg: "bg-violet-50",
      color: "text-violet-600",
    },

    Quiz: {
      icon: HelpCircle,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
    },

    Engagement: {
      icon: Users,
      bg: "bg-orange-50",
      color: "text-orange-500",
    },
  };

  const current =
    config[type] || config.Summary;

  const Icon = current.icon;

  return (
    <div
      className={`
        flex
        h-7
        w-7
        shrink-0
        items-center
        justify-center
        rounded-md
        ${current.bg}
      `}
    >
      <Icon
        size={13}
        strokeWidth={1.8}
        className={current.color}
      />
    </div>
  );
}

export default ReportsSidebar;