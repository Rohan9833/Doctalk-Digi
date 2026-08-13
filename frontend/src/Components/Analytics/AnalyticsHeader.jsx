import React from "react";
import {
  Download,
  CalendarDays,
  ChevronDown,
  SlidersHorizontal,
  Users,
  Eye,
  MousePointerClick,
  ChartNoAxesColumnIncreasing,
  Trophy,
  Percent,
} from "lucide-react";

function AnalyticsHeader({
  campaign = "all",
  setCampaign = () => {},

  contentType = "all",
  setContentType = () => {},

  dateRange = "12 May 2025 - 18 May 2025",
  setDateRange = () => {},

  onFilter = () => {},
  onExport = () => {},
}) {
  const stats = [
    {
      title: "Total Impressions",
      value: "1,245,681",
      icon: Users,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      trend: "18.6%",
      trendText: "vs 05 May - 11 May",
    },
    {
      title: "Total Views",
      value: "654,321",
      icon: Eye,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      trend: "16.3%",
      trendText: "vs 05 May - 11 May",
    },
    {
      title: "Total Clicks",
      value: "98,765",
      icon: MousePointerClick,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      trend: "14.8%",
      trendText: "vs 05 May - 11 May",
    },
    {
      title: "Total Engagements",
      value: "76,543",
      icon: ChartNoAxesColumnIncreasing,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      trend: "20.2%",
      trendText: "vs 05 May - 11 May",
    },
    {
      title: "Quizzes Completed",
      value: "24,876",
      icon: Trophy,
      iconBg: "bg-pink-50",
      iconColor: "text-pink-500",
      trend: "15.7%",
      trendText: "vs 05 May - 11 May",
    },
    {
      title: "Avg. Completion Rate",
      value: "68.7%",
      icon: Percent,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
      trend: "4.8%",
      trendText: "vs 05 May - 11 May",
    },
  ];

  return (
    <div className="w-full space-y-3">
      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            Analytics
          </h1>

          <p className="mt-0.5 text-[11px] text-slate-500">
            Track the performance of your campaign and content
            across all channels.
          </p>
        </div>

        {/* Export */}
        <button
          type="button"
          onClick={onExport}
          className="
            inline-flex
            h-8
            items-center
            justify-center
            gap-1.5
            self-start
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
            xl:self-auto
          "
        >
          <Download size={14} strokeWidth={1.8} />

          <span>Export Report</span>
        </button>
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
            xl:flex
            xl:items-center
          "
        >
          {/* Campaign */}
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

          {/* Content Type */}
          <FilterSelect
            value={contentType}
            onChange={setContentType}
            options={[
              {
                value: "all",
                label: "Content Type: All",
              },
              {
                value: "video",
                label: "Video",
              },
              {
                value: "poster",
                label: "Poster",
              },
              {
                value: "doctor-page",
                label: "Doctor Page",
              },
              {
                value: "quiz",
                label: "Quiz",
              },
            ]}
          />

          {/* Date Range */}
          <FilterSelect
            value={dateRange}
            onChange={setDateRange}
            icon={<CalendarDays size={13} />}
            options={[
              {
                value: "12 May 2025 - 18 May 2025",
                label: "Date Range: 12 May 2025 - 18 May 2025",
              },
              {
                value: "05 May 2025 - 11 May 2025",
                label: "Date Range: 05 May 2025 - 11 May 2025",
              },
              {
                value: "this-month",
                label: "Date Range: This Month",
              },
            ]}
          />

          {/* Filters */}
          <button
            type="button"
            onClick={onFilter}
            className="
              inline-flex
              h-8
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
              xl:shrink-0
            "
          >
            <SlidersHorizontal
              size={14}
              strokeWidth={1.8}
            />

            <span>Filters</span>
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
              <div className="flex items-start gap-2">
                {/* Icon */}
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

                {/* Title + Value */}
                <div className="min-w-0">
                  <p className="text-[9px] font-medium leading-4 text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-0.5 truncate text-[15px] font-semibold tracking-tight text-slate-900 sm:text-base">
                    {stat.value}
                  </p>
                </div>
              </div>

              {/* Trend */}
              <div className="mt-2 flex items-center gap-1 text-[9px]">
                <span className="font-medium text-emerald-500">
                  ↑ {stat.trend}
                </span>

                <span className="truncate text-slate-500">
                  {stat.trendText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================
   FILTER SELECT
========================================= */

function FilterSelect({
  value,
  onChange,
  options,
  icon = null,
}) {
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
          <option
            key={option.value}
            value={option.value}
          >
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

export default AnalyticsHeader;