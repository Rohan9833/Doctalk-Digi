import React from "react";
import {
  FileText,
  Eye,
  Download,
  Clock3,
  Users,
  PieChart,
  CalendarDays,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
  Plus,
} from "lucide-react";

function ReportsHeader({
  reportType = "all",
  setReportType = () => {},

  dataSource = "all",
  setDataSource = () => {},

  campaign = "all",
  setCampaign = () => {},

  dateRange = "12 May 2025 - 18 May 2025",
  setDateRange = () => {},

  onScheduleReport = () => {},
  onCreateReport = () => {},
  onFilter = () => {},
  onReset = () => {},
}) {
  const stats = [
    {
      title: "Total Reports",
      value: "128",
      icon: FileText,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      trend: "18.6%",
      trendText: "vs last 7 days",
    },
    {
      title: "Reports Generated",
      value: "356",
      icon: Eye,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      trend: "16.3%",
      trendText: "vs last 7 days",
    },
    {
      title: "Total Downloads",
      value: "278",
      icon: Download,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      trend: "14.8%",
      trendText: "vs last 7 days",
    },
    {
      title: "Scheduled Reports",
      value: "24",
      icon: Clock3,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      trend: "20.2%",
      trendText: "vs last 7 days",
    },
    {
      title: "Unique Users",
      value: "94",
      icon: Users,
      iconBg: "bg-pink-50",
      iconColor: "text-pink-500",
      trend: "17.5%",
      trendText: "vs last 7 days",
    },
    {
      title: "Data Sources",
      value: "8",
      icon: PieChart,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
      trend: null,
      trendText: "No change",
    },
  ];

  return (
    <div className="w-full space-y-3">
      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
        {/* TITLE */}
        <div>
          <h1 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            Reports
          </h1>

          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>Dashboard</span>

            <span className="text-slate-300">›</span>

            <span className="text-slate-700">Reports</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-1.5 sm:flex-row">
          {/* Schedule Report */}
          <button
            type="button"
            onClick={onScheduleReport}
            className="
              inline-flex
              h-8
              items-center
              justify-center
              gap-1.5
              rounded-lg
              border
              border-violet-300
              bg-white
              px-3
              text-[11px]
              font-medium
              text-violet-600
              transition
              hover:bg-violet-50
            "
          >
            <CalendarDays size={14} strokeWidth={1.8} />

            <span>Schedule Report</span>
          </button>

          {/* Create New Report */}
          <button
            type="button"
            onClick={onCreateReport}
            className="
              inline-flex
              h-8
              items-center
              justify-center
              gap-1.5
              rounded-lg
              bg-violet-600
              px-3
              text-[11px]
              font-medium
              text-white
              shadow-sm
              transition
              hover:bg-violet-700
            "
          >
            <Plus size={15} strokeWidth={2} />

            <span>Create New Report</span>
          </button>
        </div>
      </div>

      {/* =========================================
          STATISTICS
      ========================================= */}
      <div
        className="
          grid
          grid-cols-2
          gap-2.5
          lg:grid-cols-3
          xl:grid-cols-6
        "
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="
                min-h-[105px]
                rounded-xl
                border
                border-slate-200
                bg-white
                p-2.5
                shadow-sm
              "
            >
              {/* ICON + TITLE + VALUE */}
              <div className="flex items-start gap-2">
                <div
                  className={`
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    ${stat.iconBg}
                  `}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.8}
                    className={stat.iconColor}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-medium leading-4 text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-0.5 truncate text-[15px] font-semibold tracking-tight text-slate-900 sm:text-base">
                    {stat.value}
                  </p>
                </div>
              </div>

              {/* TREND */}
              <div className="mt-2 flex items-center gap-1 text-[9px]">
                {stat.trend ? (
                  <>
                    <span className="font-medium text-emerald-500">
                      ↑ {stat.trend}
                    </span>

                    <span className="truncate text-slate-500">
                      {stat.trendText}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-slate-400">—</span>

                    <span className="text-slate-500">{stat.trendText}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================
          FILTER BAR
      ========================================= */}
      <div className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
        <div
          className="
            grid
            grid-cols-1
            gap-1.5
            sm:grid-cols-2
            lg:grid-cols-3
            xl:flex
            xl:items-center
          "
        >
          {/* SEARCH */}
          <div className="relative min-w-0 xl:flex-1">
            <FileText
              size={14}
              strokeWidth={1.8}
              className="
                pointer-events-none
                absolute
                left-2.5
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Search by report name or keywords..."
              className="
                h-8
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                pl-8
                pr-3
                text-[11px]
                text-slate-700
                outline-none
                placeholder:text-slate-400
                focus:border-violet-400
                focus:ring-2
                focus:ring-violet-500/10
              "
            />
          </div>

          {/* REPORT TYPE */}
          <FilterSelect
            value={reportType}
            onChange={setReportType}
            options={[
              {
                value: "all",
                label: "Report Type: All",
              },
              {
                value: "summary",
                label: "Report Type: Summary",
              },
              {
                value: "quiz",
                label: "Report Type: Quiz",
              },
              {
                value: "engagement",
                label: "Report Type: Engagement",
              },
              {
                value: "content",
                label: "Report Type: Content",
              },
              {
                value: "audience",
                label: "Report Type: Audience",
              },
            ]}
          />

          {/* DATA SOURCE */}
          <FilterSelect
            value={dataSource}
            onChange={setDataSource}
            options={[
              {
                value: "all",
                label: "Data Source: All",
              },
              {
                value: "analytics",
                label: "Data Source: Analytics",
              },
              {
                value: "quizzes",
                label: "Data Source: Quizzes",
              },
              {
                value: "doctors",
                label: "Data Source: Doctors",
              },
              {
                value: "media",
                label: "Data Source: Media Library",
              },
            ]}
          />

          {/* CAMPAIGN */}
          <FilterSelect
            value={campaign}
            onChange={setCampaign}
            options={[
              {
                value: "all",
                label: "Campaign: All",
              },
              {
                value: "gerd",
                label: "GERD Awareness Campaign",
              },
              {
                value: "diabetes",
                label: "Diabetes Awareness Campaign",
              },
            ]}
          />

          {/* DATE RANGE */}
          <FilterSelect
            value={dateRange}
            onChange={setDateRange}
            icon={<CalendarDays size={13} />}
            options={[
              {
                value: "12 May 2025 - 18 May 2025",
                label: "12 May 2025 - 18 May 2025",
              },
              {
                value: "05 May 2025 - 11 May 2025",
                label: "05 May 2025 - 11 May 2025",
              },
              {
                value: "this-month",
                label: "This Month",
              },
            ]}
          />

          {/* FILTER BUTTON */}
          <button
            type="button"
            onClick={onFilter}
            className="
              inline-flex
              h-8
              shrink-0
              items-center
              justify-center
              gap-1.5
              rounded-lg
              border
              border-slate-200
              bg-white
              px-2.5
              text-[11px]
              font-medium
              text-slate-700
              transition
              hover:bg-slate-50
            "
          >
            <SlidersHorizontal size={14} strokeWidth={1.8} />

            <span>Filters</span>
          </button>

          {/* RESET */}
          <button
            type="button"
            onClick={onReset}
            className="
              inline-flex
              h-8
              shrink-0
              items-center
              justify-center
              gap-1.5
              rounded-lg
              px-2.5
              text-[11px]
              font-medium
              text-slate-500
              transition
              hover:bg-slate-50
              hover:text-slate-700
            "
          >
            <RotateCcw size={13} strokeWidth={1.8} />

            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   FILTER SELECT
========================================= */

function FilterSelect({ value, onChange, options, icon = null }) {
  return (
    <div className="relative min-w-0 xl:flex-1">
      {icon && (
        <span
          className="
            pointer-events-none
            absolute
            left-2.5
            top-1/2
            z-10
            -translate-y-1/2
            text-slate-400
          "
        >
          {icon}
        </span>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          h-8
          w-full
          appearance-none
          rounded-lg
          border
          border-slate-200
          bg-white
          pr-7
          text-[11px]
          text-slate-700
          outline-none
          transition
          focus:border-violet-400
          focus:ring-2
          focus:ring-violet-500/10
          ${icon ? "pl-8" : "pl-2.5"}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={13}
        strokeWidth={1.8}
        className="
          pointer-events-none
          absolute
          right-2
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />
    </div>
  );
}

export default ReportsHeader;
