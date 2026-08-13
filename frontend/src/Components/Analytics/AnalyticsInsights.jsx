import React from "react";
import {
  ArrowUpRight,
  ChartNoAxesColumnIncreasing,
  Target,
  ArrowRight,
} from "lucide-react";

function AnalyticsInsights({
  onDetailedReport = () => {},
}) {
  const insights = [
    {
      title: "Impressions increased by 18.6%",
      description:
        "Your campaign reach is growing consistently.",
      icon: ArrowUpRight,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      title: "Video content is driving the most engagement.",
      description:
        'Consider creating more videos like "What is GERD?"',
      icon: ChartNoAxesColumnIncreasing,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: "Quiz completion rate improved by 4.8%",
      description:
        "Great job! Keep up the momentum.",
      icon: Target,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      {/* =========================================
          HEADER
      ========================================= */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50">
          <span className="text-sm">💡</span>
        </div>

        <h2 className="text-xs font-semibold text-slate-800">
          Insights
        </h2>
      </div>

      {/* =========================================
          INSIGHTS
      ========================================= */}
      <div
        className="
          mt-3
          grid
          grid-cols-1
          gap-3
          lg:grid-cols-3
          lg:gap-0
        "
      >
        {insights.map((insight, index) => {
          const Icon = insight.icon;

          return (
            <div
              key={insight.title}
              className={`
                flex
                items-center
                gap-3
                py-2
                lg:px-4
                ${
                  index !== insights.length - 1
                    ? "lg:border-r lg:border-slate-200"
                    : ""
                }
              `}
            >
              {/* ICON */}
              <div
                className={`
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  ${insight.iconBg}
                `}
              >
                <Icon
                  size={19}
                  strokeWidth={1.7}
                  className={insight.iconColor}
                />
              </div>

              {/* TEXT */}
              <div className="min-w-0">
                <p className="text-[10px] font-semibold leading-4 text-slate-700">
                  {insight.title}
                </p>

                <p className="mt-0.5 text-[9px] leading-4 text-slate-400">
                  {insight.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================
          DETAILED REPORT
      ========================================= */}
      <div
        className="
          mt-3
          flex
          flex-col
          gap-2
          border-t
          border-slate-100
          pt-3
          sm:flex-row
          sm:items-center
          sm:justify-end
        "
      >
        <button
          type="button"
          onClick={onDetailedReport}
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
            text-[10px]
            font-medium
            text-violet-600
            transition
            hover:bg-violet-50
          "
        >
          View Detailed Report

          <ArrowRight size={13} />
        </button>
      </div>
    </section>
  );
}

export default AnalyticsInsights;