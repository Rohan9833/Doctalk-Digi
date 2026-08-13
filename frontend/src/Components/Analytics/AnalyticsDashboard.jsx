import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  ChevronDown,
  ArrowRight,
  MapPin,
} from "lucide-react";

/* =========================================================
   MOCK DATA
========================================================= */

const performanceData = [
  {
    day: "12 May",
    impressions: 128000,
    views: 76000,
    clicks: 28000,
    engagements: 11000,
  },
  {
    day: "13 May",
    impressions: 160000,
    views: 98000,
    clicks: 38000,
    engagements: 14000,
  },
  {
    day: "14 May",
    impressions: 140000,
    views: 80000,
    clicks: 30000,
    engagements: 9000,
  },
  {
    day: "15 May",
    impressions: 175000,
    views: 105000,
    clicks: 45000,
    engagements: 18000,
  },
  {
    day: "16 May",
    impressions: 175000,
    views: 104000,
    clicks: 44000,
    engagements: 17000,
  },
  {
    day: "17 May",
    impressions: 205000,
    views: 106000,
    clicks: 38000,
    engagements: 13000,
  },
  {
    day: "18 May",
    impressions: 220000,
    views: 120000,
    clicks: 48000,
    engagements: 22000,
  },
];

const contentTypeData = [
  {
    name: "Videos",
    value: 38.6,
    views: "252,781",
  },
  {
    name: "Posters",
    value: 25.4,
    views: "166,467",
  },
  {
    name: "Doctor Pages",
    value: 15.8,
    views: "103,543",
  },
  {
    name: "Quizzes",
    value: 12.7,
    views: "83,105",
  },
  {
    name: "Others",
    value: 7.5,
    views: "48,425",
  },
];

const deviceData = [
  {
    name: "Mobile",
    value: 62.3,
    views: "407,928",
  },
  {
    name: "Desktop",
    value: 25.7,
    views: "168,345",
  },
  {
    name: "Tablet",
    value: 9.4,
    views: "61,556",
  },
  {
    name: "Others",
    value: 2.6,
    views: "16,492",
  },
];

const topContent = [
  {
    title: "What is GERD?",
    type: "Video",
    views: "125,456",
    engagement: "24.6%",
  },
  {
    title: "Don't Ignore Heartburn",
    type: "Poster",
    views: "98,765",
    engagement: "21.3%",
  },
  {
    title: "Dr. Manohar Lele Page",
    type: "Doctor Page",
    views: "76,543",
    engagement: "18.9%",
  },
  {
    title: "GERD Awareness Quiz",
    type: "Quiz",
    views: "64,321",
    engagement: "32.7%",
  },
  {
    title: "Foods to Avoid GERD",
    type: "Video",
    views: "54,210",
    engagement: "19.8%",
  },
];

const languageData = [
  {
    name: "English",
    value: 68.6,
  },
  {
    name: "Hindi",
    value: 17.4,
  },
  {
    name: "Marathi",
    value: 6.2,
  },
  {
    name: "Gujarati",
    value: 3.1,
  },
  {
    name: "Others",
    value: 4.7,
  },
];

const locationData = [
  {
    name: "India",
    views: "425,642",
    percentage: "64.9%",
  },
  {
    name: "United States",
    views: "98,765",
    percentage: "15.1%",
  },
  {
    name: "United Kingdom",
    views: "45,321",
    percentage: "6.9%",
  },
  {
    name: "Others",
    views: "84,593",
    percentage: "13.1%",
  },
];

const funnelData = [
  {
    name: "Impressions",
    value: "1,245,681",
    percentage: "",
  },
  {
    name: "Views",
    value: "654,321",
    percentage: "52.5%",
  },
  {
    name: "Clicks",
    value: "98,765",
    percentage: "15.1%",
  },
  {
    name: "Engagements",
    value: "76,543",
    percentage: "77.5%",
  },
  {
    name: "Completions",
    value: "24,876",
    percentage: "32.5%",
  },
];

/* =========================================================
   CHART COLORS
========================================================= */

const CONTENT_COLORS = [
  "#5635E8",
  "#2F6BFF",
  "#2EB67D",
  "#F3AE2B",
  "#5B6380",
];

const DEVICE_COLORS = [
  "#5635E8",
  "#2F6BFF",
  "#A0A7B8",
  "#9185B8",
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

function AnalyticsDashboard() {
  return (
    <div className="w-full space-y-3">
      {/* =================================================
          ROW 1
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-3
          xl:grid-cols-[1.35fr_1.1fr_1.55fr]
        "
      >
        {/* PERFORMANCE */}
        <PerformanceCard />

        {/* CONTENT TYPE */}
        <ContentTypeCard />

        {/* TOP CONTENT */}
        <TopContentCard />
      </div>

      {/* =================================================
          ROW 2
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-3
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        {/* DEVICE */}
        <AudienceDeviceCard />

        {/* LOCATION */}
        <AudienceLocationCard />

        {/* LANGUAGE */}
        <LanguageCard />

        {/* FUNNEL */}
        <FunnelCard />
      </div>
    </div>
  );
}

/* =========================================================
   PERFORMANCE CARD
========================================================= */

function PerformanceCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-800">
          Performance Over Time
        </h2>

        <button
          type="button"
          className="
            flex
            h-7
            items-center
            gap-1
            rounded-md
            border
            border-slate-200
            bg-white
            px-2
            text-[10px]
            text-slate-600
          "
        >
          Daily
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        <ChartLegend
          label="Impressions"
          dotClass="bg-violet-600"
        />

        <ChartLegend
          label="Views"
          dotClass="bg-blue-500"
        />

        <ChartLegend
          label="Clicks"
          dotClass="bg-emerald-500"
        />

        <ChartLegend
          label="Engagements"
          dotClass="bg-orange-500"
        />
      </div>

      {/* Chart */}
      <div className="mt-2 h-[190px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={performanceData}
            margin={{
              top: 5,
              right: 5,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="2 3"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="day"
              tick={{
                fontSize: 9,
                fill: "#64748B",
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fontSize: 9,
                fill: "#64748B",
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                value >= 1000
                  ? `${value / 1000}K`
                  : value
              }
            />

            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
                fontSize: "10px",
              }}
              formatter={(value) =>
                value.toLocaleString()
              }
            />

            <Line
              type="monotone"
              dataKey="impressions"
              stroke="#5635E8"
              strokeWidth={2}
              dot={{
                r: 2.5,
              }}
              activeDot={{
                r: 4,
              }}
            />

            <Line
              type="monotone"
              dataKey="views"
              stroke="#2F6BFF"
              strokeWidth={2}
              dot={{
                r: 2.5,
              }}
            />

            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#2EB67D"
              strokeWidth={2}
              dot={{
                r: 2.5,
              }}
            />

            <Line
              type="monotone"
              dataKey="engagements"
              stroke="#F97316"
              strokeWidth={2}
              dot={{
                r: 2.5,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* =========================================================
   CONTENT TYPE CARD
========================================================= */

function ContentTypeCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="text-xs font-semibold text-slate-800">
        Content Type Performance
      </h2>

      <div className="mt-2 flex min-h-[220px] flex-col items-center justify-center sm:flex-row">
        {/* DONUT */}
        <div className="h-[175px] w-[175px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={contentTypeData}
                dataKey="value"
                nameKey="name"
                innerRadius={42}
                outerRadius={70}
                paddingAngle={0}
              >
                {contentTypeData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={CONTENT_COLORS[index]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center */}
          <div className="-mt-[105px] flex flex-col items-center justify-center">
            <span className="text-[9px] text-slate-500">
              Total Views
            </span>

            <span className="text-sm font-semibold text-slate-800">
              654,321
            </span>
          </div>
        </div>

        {/* LEGEND */}
        <div className="mt-2 w-full space-y-2 sm:mt-0">
          {contentTypeData.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex min-w-0 items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      CONTENT_COLORS[index],
                  }}
                />

                <span className="truncate text-[9px] text-slate-600">
                  {item.name}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <span className="text-[9px] font-medium text-slate-700">
                  {item.value}%
                </span>

                <span className="text-[8px] text-slate-400">
                  ({item.views})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomLink label="View All Content Performance" />
    </div>
  );
}

/* =========================================================
   TOP CONTENT CARD
========================================================= */

function TopContentCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="text-xs font-semibold text-slate-800">
        Top Performing Content
      </h2>

      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[430px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-2 text-left text-[9px] font-medium text-slate-500">
                Content
              </th>

              <th className="pb-2 text-left text-[9px] font-medium text-slate-500">
                Type
              </th>

              <th className="pb-2 text-right text-[9px] font-medium text-slate-500">
                Views
              </th>

              <th className="pb-2 text-right text-[9px] font-medium text-slate-500">
                Engagement Rate
              </th>
            </tr>
          </thead>

          <tbody>
            {topContent.map((item) => (
              <tr
                key={item.title}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100">
                      <span className="text-[9px] font-semibold text-slate-500">
                        {item.title.charAt(0)}
                      </span>
                    </div>

                    <span className="max-w-[125px] truncate text-[9px] font-medium text-slate-700">
                      {item.title}
                    </span>
                  </div>
                </td>

                <td className="py-2">
                  <ContentTypeBadge type={item.type} />
                </td>

                <td className="py-2 text-right text-[9px] text-slate-600">
                  {item.views}
                </td>

                <td className="py-2 text-right text-[9px] font-medium text-slate-700">
                  {item.engagement}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BottomLink label="View All Top Performing Content" />
    </div>
  );
}

/* =========================================================
   DEVICE CARD
========================================================= */

function AudienceDeviceCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="text-xs font-semibold text-slate-800">
        Audience by Device
      </h2>

      <div className="mt-2 flex min-h-[185px] flex-col items-center justify-center sm:flex-row">
        <div className="h-[155px] w-[155px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceData}
                dataKey="value"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={0}
              >
                {deviceData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={DEVICE_COLORS[index]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="-mt-[94px] flex flex-col items-center">
            <span className="text-[8px] text-slate-500">
              Total Views
            </span>

            <span className="text-sm font-semibold text-slate-800">
              654,321
            </span>
          </div>
        </div>

        <div className="mt-3 w-full space-y-2 sm:mt-0">
          {deviceData.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      DEVICE_COLORS[index],
                  }}
                />

                <span className="text-[9px] text-slate-600">
                  {item.name}
                </span>
              </div>

              <span className="text-[9px] text-slate-500">
                {item.value}% ({item.views})
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomLink label="View Full Report" />
    </div>
  );
}

/* =========================================================
   LOCATION CARD
========================================================= */

function AudienceLocationCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="text-xs font-semibold text-slate-800">
        Audience by Location
      </h2>

      {/* Map placeholder */}
      <div className="relative mt-2 flex h-[150px] items-center justify-center overflow-hidden rounded-lg bg-violet-50/40">
        <div className="relative">
          <div className="text-[55px] leading-none text-violet-200">
            ◈
          </div>

          <div className="absolute left-8 top-3">
            <MapPin
              size={18}
              className="text-violet-500"
              fill="currentColor"
            />
          </div>

          <div className="absolute right-3 top-8">
            <MapPin
              size={13}
              className="text-violet-400"
              fill="currentColor"
            />
          </div>

          <div className="absolute bottom-2 left-3">
            <MapPin
              size={12}
              className="text-violet-300"
              fill="currentColor"
            />
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        {locationData.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between border-b border-slate-50 py-1 last:border-0"
          >
            <span className="text-[9px] text-slate-600">
              {item.name}
            </span>

            <span className="text-[9px] text-slate-500">
              {item.views} ({item.percentage})
            </span>
          </div>
        ))}
      </div>

      <BottomLink label="View Full Report" />
    </div>
  );
}

/* =========================================================
   LANGUAGE CARD
========================================================= */

function LanguageCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="text-xs font-semibold text-slate-800">
        Language Breakdown
      </h2>

      <div className="mt-4 space-y-4">
        {languageData.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-medium text-slate-600">
                {item.name}
              </span>

              <span className="text-[9px] text-slate-500">
                {item.value}%
              </span>
            </div>

            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-violet-600"
                style={{
                  width: `${item.value}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7">
        <BottomLink label="View Full Report" />
      </div>
    </div>
  );
}

/* =========================================================
   FUNNEL CARD
========================================================= */

function FunnelCard() {
  const funnelWidths = [
    "100%",
    "82%",
    "62%",
    "48%",
    "34%",
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="text-xs font-semibold text-slate-800">
        Funnel Overview
      </h2>

      <div className="mt-4 flex min-h-[180px] items-center gap-3">
        {/* FUNNEL */}
        <div className="flex flex-1 flex-col items-center gap-1">
          {funnelData.map((item, index) => (
            <div
              key={item.name}
              className="
                flex
                h-7
                items-center
                justify-center
                rounded-sm
                bg-violet-600
                text-[8px]
                font-medium
                text-white
              "
              style={{
                width: funnelWidths[index],
                opacity: 1 - index * 0.08,
              }}
            >
              {index === 0 && "Impressions"}
            </div>
          ))}
        </div>

        {/* VALUES */}
        <div className="w-[100px] space-y-3">
          {funnelData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-2"
            >
              <span className="truncate text-[8px] text-slate-500">
                {item.name}
              </span>

              <span className="whitespace-nowrap text-[8px] font-medium text-slate-700">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomLink label="View Full Funnel Report" />
    </div>
  );
}

/* =========================================================
   CHART LEGEND
========================================================= */

function ChartLegend({ label, dotClass }) {
  return (
    <div className="flex items-center gap-1">
      <span
        className={`h-1.5 w-1.5 rounded-full ${dotClass}`}
      />

      <span className="text-[8px] text-slate-600">
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   CONTENT TYPE BADGE
========================================================= */

function ContentTypeBadge({ type }) {
  const styles = {
    Video: "bg-violet-50 text-violet-600 border-violet-100",
    Poster: "bg-blue-50 text-blue-600 border-blue-100",
    "Doctor Page":
      "bg-emerald-50 text-emerald-600 border-emerald-100",
    Quiz: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <span
      className={`
        inline-flex
        whitespace-nowrap
        rounded
        border
        px-1.5
        py-0.5
        text-[8px]
        font-medium
        ${styles[type] || styles.Video}
      `}
    >
      {type}
    </span>
  );
}

/* =========================================================
   BOTTOM LINK
========================================================= */

function BottomLink({ label }) {
  return (
    <button
      type="button"
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
      {label}

      <ArrowRight size={12} />
    </button>
  );
}

export default AnalyticsDashboard;