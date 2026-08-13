import React, { useState } from "react";
import {
  Eye,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FileText,
  BarChart3,
  HelpCircle,
  Users,
  PlayCircle,
  Trophy,
  Activity,
  Image,
  Database,
} from "lucide-react";

const reportsData = [
  {
    id: 1,
    name: "Campaign Performance Summary",
    description: "Overall performance of the campaign",
    type: "Summary",
    source: "Analytics",
    campaign: "GERD Awareness Campaign",
    date: "18 May 2025",
    time: "11:32 AM",
    generatedBy: "Developer Admin",
    downloads: 28,
  },
  {
    id: 2,
    name: "Quiz Performance Report",
    description: "Detailed quiz performance analytics",
    type: "Quiz",
    source: "Quizzes",
    campaign: "GERD Awareness Campaign",
    date: "18 May 2025",
    time: "10:15 AM",
    generatedBy: "Developer Admin",
    downloads: 35,
  },
  {
    id: 3,
    name: "Doctor Engagement Report",
    description: "Doctor engagement and activity",
    type: "Engagement",
    source: "Doctors",
    campaign: "GERD Awareness Campaign",
    date: "17 May 2025",
    time: "04:20 PM",
    generatedBy: "Developer Admin",
    downloads: 22,
  },
  {
    id: 4,
    name: "Content Performance Report",
    description: "Scenes, videos and posters performance",
    type: "Content",
    source: "Media Library",
    campaign: "GERD Awareness Campaign",
    date: "17 May 2025",
    time: "02:45 PM",
    generatedBy: "Developer Admin",
    downloads: 18,
  },
  {
    id: 5,
    name: "Audience Demographics Report",
    description: "Audience demographics and insights",
    type: "Audience",
    source: "Analytics",
    campaign: "GERD Awareness Campaign",
    date: "16 May 2025",
    time: "11:05 AM",
    generatedBy: "Developer Admin",
    downloads: 16,
  },
  {
    id: 6,
    name: "Daily Activity Report",
    description: "Daily activity summary",
    type: "Activity",
    source: "Analytics",
    campaign: "GERD Awareness Campaign",
    date: "16 May 2025",
    time: "09:15 AM",
    generatedBy: "Developer Admin",
    downloads: 14,
  },
  {
    id: 7,
    name: "Media Library Report",
    description: "Media library usage and stats",
    type: "Media",
    source: "Media Library",
    campaign: "GERD Awareness Campaign",
    date: "15 May 2025",
    time: "05:30 PM",
    generatedBy: "Developer Admin",
    downloads: 12,
  },
  {
    id: 8,
    name: "Quiz Leaderboard Report",
    description: "Top performing quizzes and scores",
    type: "Quiz",
    source: "Quizzes",
    campaign: "GERD Awareness Campaign",
    date: "15 May 2025",
    time: "03:10 PM",
    generatedBy: "Developer Admin",
    downloads: 10,
  },
];

function ReportsContent({
  onViewReport = () => {},
  onDownloadReport = () => {},
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReports, setSelectedReports] = useState([]);

  const tabs = [
    {
      id: "all",
      label: "All Reports",
      count: 128,
    },
    {
      id: "scheduled",
      label: "Scheduled",
      count: 24,
    },
    {
      id: "generated",
      label: "Generated",
      count: 356,
    },
    {
      id: "downloaded",
      label: "Downloaded",
      count: 278,
    },
    {
      id: "failed",
      label: "Failed",
      count: 6,
    },
  ];

  const allSelected =
    selectedReports.length === reportsData.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedReports([]);
    } else {
      setSelectedReports(
        reportsData.map((report) => report.id)
      );
    }
  };

  const toggleReport = (id) => {
    setSelectedReports((previous) =>
      previous.includes(id)
        ? previous.filter((reportId) => reportId !== id)
        : [...previous, id]
    );
  };

  return (
    <div className="w-full min-w-0">
      {/* =========================================
          TABS
      ========================================= */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-center gap-5 border-b border-slate-200">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative
                  shrink-0
                  pb-2.5
                  text-[11px]
                  font-medium
                  transition
                  ${
                    active
                      ? "text-violet-600"
                      : "text-slate-500 hover:text-slate-700"
                  }
                `}
              >
                {tab.label} ({tab.count})

                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-violet-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================
          REPORT TABLE
      ========================================= */}
      <div className="mt-2.5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* =====================================
            DESKTOP TABLE
        ===================================== */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[1050px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="w-10 px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="
                      h-3.5
                      w-3.5
                      cursor-pointer
                      rounded
                      border-slate-300
                      text-violet-600
                      focus:ring-violet-500
                    "
                  />
                </th>

                <TableHeader>Report Name</TableHeader>

                <TableHeader>Type</TableHeader>

                <TableHeader>Data Source</TableHeader>

                <TableHeader>Campaign</TableHeader>

                <TableHeader>Generated On</TableHeader>

                <TableHeader>Generated By</TableHeader>

                <TableHeader>Downloads</TableHeader>

                <TableHeader center>
                  Actions
                </TableHeader>
              </tr>
            </thead>

            <tbody>
              {reportsData.map((report) => (
                <tr
                  key={report.id}
                  className="
                    border-b
                    border-slate-100
                    transition
                    last:border-b-0
                    hover:bg-violet-50/20
                  "
                >
                  {/* CHECKBOX */}
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(
                        report.id
                      )}
                      onChange={() =>
                        toggleReport(report.id)
                      }
                      className="
                        h-3.5
                        w-3.5
                        cursor-pointer
                        rounded
                        border-slate-300
                        text-violet-600
                        focus:ring-violet-500
                      "
                    />
                  </td>

                  {/* REPORT NAME */}
                  <td className="px-3 py-3">
                    <div className="flex min-w-[210px] items-center gap-2">
                      <ReportIcon type={report.type} />

                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-medium text-slate-700">
                          {report.name}
                        </p>

                        <p className="mt-0.5 truncate text-[9px] text-slate-400">
                          {report.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* TYPE */}
                  <td className="px-3 py-3">
                    <TypeBadge type={report.type} />
                  </td>

                  {/* DATA SOURCE */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <SourceIcon
                        source={report.source}
                      />

                      <span className="whitespace-nowrap text-[10px] text-slate-600">
                        {report.source}
                      </span>
                    </div>
                  </td>

                  {/* CAMPAIGN */}
                  <td className="px-3 py-3">
                    <span className="block max-w-[130px] text-[10px] leading-4 text-slate-600">
                      {report.campaign}
                    </span>
                  </td>

                  {/* GENERATED ON */}
                  <td className="px-3 py-3">
                    <div className="whitespace-nowrap">
                      <p className="text-[10px] text-slate-600">
                        {report.date}
                      </p>

                      <p className="mt-0.5 text-[9px] text-slate-400">
                        {report.time}
                      </p>
                    </div>
                  </td>

                  {/* GENERATED BY */}
                  <td className="px-3 py-3">
                    <div className="flex min-w-[125px] items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[9px] font-semibold text-violet-600">
                        DA
                      </div>

                      <span className="whitespace-nowrap text-[10px] text-slate-600">
                        {report.generatedBy}
                      </span>
                    </div>
                  </td>

                  {/* DOWNLOADS */}
                  <td className="px-3 py-3 text-center">
                    <span className="text-[10px] font-medium text-slate-600">
                      {report.downloads}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <ActionButton
                        title="View Report"
                        icon={<Eye size={13} />}
                        onClick={() =>
                          onViewReport(report)
                        }
                      />

                      <ActionButton
                        title="Download Report"
                        icon={
                          <Download size={13} />
                        }
                        onClick={() =>
                          onDownloadReport(report)
                        }
                      />

                      <ActionButton
                        title="More"
                        icon={
                          <MoreVertical size={13} />
                        }
                        onClick={() =>
                          console.log(
                            "More:",
                            report.id
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* =====================================
            MOBILE REPORT CARDS
        ===================================== */}
        <div className="grid gap-2.5 p-2.5 lg:hidden">
          {reportsData.map((report) => (
            <div
              key={report.id}
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-3
                transition
                hover:border-violet-200
                hover:bg-violet-50/20
              "
            >
              {/* TOP */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <ReportIcon type={report.type} />

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-700">
                      {report.name}
                    </p>

                    <p className="mt-0.5 truncate text-[9px] text-slate-400">
                      {report.description}
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={selectedReports.includes(
                    report.id
                  )}
                  onChange={() =>
                    toggleReport(report.id)
                  }
                  className="
                    mt-1
                    h-3.5
                    w-3.5
                    shrink-0
                    cursor-pointer
                    rounded
                    border-slate-300
                    text-violet-600
                    focus:ring-violet-500
                  "
                />
              </div>

              {/* TYPE + SOURCE */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <TypeBadge type={report.type} />

                <div className="flex items-center gap-1">
                  <SourceIcon
                    source={report.source}
                  />

                  <span className="text-[9px] text-slate-500">
                    {report.source}
                  </span>
                </div>
              </div>

              {/* INFO */}
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2.5">
                <InfoItem
                  label="Campaign"
                  value={report.campaign}
                />

                <InfoItem
                  label="Downloads"
                  value={report.downloads}
                />

                <InfoItem
                  label="Generated On"
                  value={`${report.date} ${report.time}`}
                />

                <InfoItem
                  label="Generated By"
                  value={report.generatedBy}
                />
              </div>

              {/* ACTIONS */}
              <div className="mt-3 flex justify-end gap-1 border-t border-slate-100 pt-2.5">
                <ActionButton
                  title="View Report"
                  icon={<Eye size={13} />}
                  onClick={() =>
                    onViewReport(report)
                  }
                />

                <ActionButton
                  title="Download Report"
                  icon={<Download size={13} />}
                  onClick={() =>
                    onDownloadReport(report)
                  }
                />

                <ActionButton
                  title="More"
                  icon={<MoreVertical size={13} />}
                  onClick={() =>
                    console.log(
                      "More:",
                      report.id
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* =====================================
            PAGINATION
        ===================================== */}
        <div
          className="
            flex
            flex-col
            gap-2.5
            border-t
            border-slate-100
            px-3
            py-2.5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* COUNT */}
          <p className="text-[10px] text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">
              1 to 8
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">
              128
            </span>{" "}
            reports
          </p>

          {/* PAGINATION */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <PaginationButton>
                <ChevronLeft size={13} />
              </PaginationButton>

              <PaginationButton active>
                1
              </PaginationButton>

              <PaginationButton>2</PaginationButton>

              <PaginationButton>3</PaginationButton>

              <span className="px-0.5 text-[10px] text-slate-400">
                ...
              </span>

              <PaginationButton>16</PaginationButton>

              <PaginationButton>
                <ChevronRight size={13} />
              </PaginationButton>
            </div>

            <select
              defaultValue="10"
              className="
                h-8
                rounded-lg
                border
                border-slate-200
                bg-white
                px-2
                text-[10px]
                text-slate-600
                outline-none
                focus:border-violet-400
              "
            >
              <option value="10">
                10 per page
              </option>

              <option value="20">
                20 per page
              </option>

              <option value="50">
                50 per page
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TABLE HEADER
========================================================= */

function TableHeader({ children, center = false }) {
  return (
    <th
      className={`
        px-3
        py-3
        text-[10px]
        font-semibold
        uppercase
        tracking-wide
        text-slate-500
        ${center ? "text-center" : "text-left"}
      `}
    >
      {children}
    </th>
  );
}

/* =========================================================
   REPORT ICON
========================================================= */

function ReportIcon({ type }) {
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

    Content: {
      icon: PlayCircle,
      bg: "bg-pink-50",
      color: "text-pink-500",
    },

    Audience: {
      icon: Users,
      bg: "bg-blue-50",
      color: "text-blue-500",
    },

    Activity: {
      icon: Activity,
      bg: "bg-violet-50",
      color: "text-violet-500",
    },

    Media: {
      icon: Image,
      bg: "bg-emerald-50",
      color: "text-emerald-500",
    },
  };

  const current = config[type] || {
    icon: FileText,
    bg: "bg-slate-50",
    color: "text-slate-500",
  };

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
        size={14}
        strokeWidth={1.8}
        className={current.color}
      />
    </div>
  );
}

/* =========================================================
   TYPE BADGE
========================================================= */

function TypeBadge({ type }) {
  const styles = {
    Summary:
      "border-violet-100 bg-violet-50 text-violet-600",

    Quiz:
      "border-emerald-100 bg-emerald-50 text-emerald-600",

    Engagement:
      "border-orange-100 bg-orange-50 text-orange-600",

    Content:
      "border-pink-100 bg-pink-50 text-pink-600",

    Audience:
      "border-blue-100 bg-blue-50 text-blue-600",

    Activity:
      "border-violet-100 bg-violet-50 text-violet-600",

    Media:
      "border-emerald-100 bg-emerald-50 text-emerald-600",
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
        ${styles[type] || styles.Summary}
      `}
    >
      {type}
    </span>
  );
}

/* =========================================================
   SOURCE ICON
========================================================= */

function SourceIcon({ source }) {
  const config = {
    Analytics: {
      icon: BarChart3,
      bg: "bg-emerald-50",
      color: "text-emerald-500",
    },

    Quizzes: {
      icon: HelpCircle,
      bg: "bg-emerald-50",
      color: "text-emerald-500",
    },

    Doctors: {
      icon: Users,
      bg: "bg-orange-50",
      color: "text-orange-500",
    },

    "Media Library": {
      icon: Image,
      bg: "bg-violet-50",
      color: "text-violet-500",
    },
  };

  const current = config[source] || {
    icon: Database,
    bg: "bg-slate-50",
    color: "text-slate-500",
  };

  const Icon = current.icon;

  return (
    <div
      className={`
        flex
        h-5
        w-5
        shrink-0
        items-center
        justify-center
        rounded
        ${current.bg}
      `}
    >
      <Icon
        size={11}
        strokeWidth={1.8}
        className={current.color}
      />
    </div>
  );
}

/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionButton({
  icon,
  title,
  onClick,
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="
        flex
        h-7
        w-7
        items-center
        justify-center
        rounded-md
        border
        border-slate-200
        bg-white
        text-slate-500
        transition
        hover:border-violet-200
        hover:bg-violet-50
        hover:text-violet-600
      "
    >
      {icon}
    </button>
  );
}

/* =========================================================
   MOBILE INFO ITEM
========================================================= */

function InfoItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[8px] uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[10px] font-medium text-slate-600">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   PAGINATION BUTTON
========================================================= */

function PaginationButton({
  children,
  active = false,
}) {
  return (
    <button
      type="button"
      className={`
        flex
        h-7
        min-w-7
        items-center
        justify-center
        rounded-md
        px-1.5
        text-[10px]
        font-medium
        transition
        ${
          active
            ? "border border-violet-300 bg-violet-50 text-violet-600"
            : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50"
        }
      `}
    >
      {children}
    </button>
  );
}

export default ReportsContent;