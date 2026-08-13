import React, { useState } from "react";
import {
  Eye,
  Pencil,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";

const scenesData = [
  {
    id: 1,
    title: "What is GERD?",
    description: "Introduction to GERD",
    quiz: "GERD Awareness Quiz",
    sceneNo: 1,
    type: "Video",
    duration: "01:25",
    status: "Published",
    views: "12,456",
    completions: "8,932",
    lastUpdated: "18 May 2025",
    updatedTime: "11:32 AM",
    thumbnail:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200&q=80",
  },
  {
    id: 2,
    title: "How GERD Occurs",
    description: "Understanding the cause",
    quiz: "GERD Awareness Quiz",
    sceneNo: 2,
    type: "Animation",
    duration: "02:10",
    status: "Published",
    views: "15,892",
    completions: "10,245",
    lastUpdated: "18 May 2025",
    updatedTime: "11:32 AM",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&q=80",
  },
  {
    id: 3,
    title: "Common Symptoms",
    description: "Symptoms to watch for",
    quiz: "GERD Awareness Quiz",
    sceneNo: 3,
    type: "Video",
    duration: "01:45",
    status: "Published",
    views: "13,224",
    completions: "9,876",
    lastUpdated: "17 May 2025",
    updatedTime: "04:20 PM",
    thumbnail:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=200&q=80",
  },
  {
    id: 4,
    title: "Lifestyle Triggers",
    description: "Foods & habits to avoid",
    quiz: "GERD Awareness Quiz",
    sceneNo: 4,
    type: "Animation",
    duration: "01:58",
    status: "Published",
    views: "11,876",
    completions: "8,154",
    lastUpdated: "17 May 2025",
    updatedTime: "04:20 PM",
    thumbnail:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=200&q=80",
  },
  {
    id: 5,
    title: "Diagnosis Process",
    description: "How GERD is diagnosed",
    quiz: "GERD Awareness Quiz",
    sceneNo: 5,
    type: "Video",
    duration: "02:30",
    status: "Draft",
    views: "-",
    completions: "-",
    lastUpdated: "16 May 2025",
    updatedTime: "09:15 AM",
    thumbnail:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?w=200&q=80",
  },
  {
    id: 6,
    title: "Treatment Options",
    description: "Medications & therapies",
    quiz: "GERD Awareness Quiz",
    sceneNo: 6,
    type: "Video",
    duration: "02:05",
    status: "Published",
    views: "14,105",
    completions: "9,876",
    lastUpdated: "15 May 2025",
    updatedTime: "09:15 AM",
    thumbnail:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80",
  },
  {
    id: 7,
    title: "When to See a Doctor",
    description: "Red flags",
    quiz: "GERD Awareness Quiz",
    sceneNo: 7,
    type: "Animation",
    duration: "01:40",
    status: "Published",
    views: "9,876",
    completions: "6,543",
    lastUpdated: "15 May 2025",
    updatedTime: "09:15 AM",
    thumbnail:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80",
  },
  {
    id: 8,
    title: "Summary & Takeaways",
    description: "Key points to remember",
    quiz: "GERD Awareness Quiz",
    sceneNo: 8,
    type: "Video",
    duration: "01:20",
    status: "Published",
    views: "11,234",
    completions: "7,876",
    lastUpdated: "14 May 2025",
    updatedTime: "02:45 PM",
    thumbnail:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&q=80",
  },
];

function SceneVideoTable({ onSelectScene }) {
  const [selectedRows, setSelectedRows] = useState([]);

  const allSelected =
    selectedRows.length === scenesData.length && scenesData.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(scenesData.map((scene) => scene.id));
    }
  };

  const toggleRow = (id) => {
    setSelectedRows((previous) =>
      previous.includes(id)
        ? previous.filter((rowId) => rowId !== id)
        : [...previous, id]
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =========================================
          DESKTOP TABLE
      ========================================= */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1050px] border-collapse">
          {/* TABLE HEADER */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="w-12 px-3 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="
                    h-4
                    w-4
                    cursor-pointer
                    rounded
                    border-slate-300
                    text-violet-600
                    focus:ring-violet-500
                  "
                />
              </th>

              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Scene / Video Title
              </th>

              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Quiz
              </th>

              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Scene No.
              </th>

              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Type
              </th>

              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Duration
              </th>

              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Views
              </th>

              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Completions
              </th>

              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Last Updated
              </th>

              <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {scenesData.map((scene) => (
              <tr
                key={scene.id}
                onClick={() => onSelectScene?.(scene)}
                className="
                  cursor-pointer
                  border-b
                  border-slate-100
                  transition
                  last:border-b-0
                  hover:bg-violet-50/30
                "
              >
                {/* CHECKBOX */}
                <td
                  className="px-3 py-3"
                  onClick={(event) => event.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(scene.id)}
                    onChange={() => toggleRow(scene.id)}
                    className="
                      h-4
                      w-4
                      cursor-pointer
                      rounded
                      border-slate-300
                      text-violet-600
                      focus:ring-violet-500
                    "
                  />
                </td>

                {/* TITLE */}
                <td className="px-3 py-3">
                  <div className="flex min-w-[220px] items-center gap-3">
                    {/* Thumbnail */}
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-slate-100">
                      <img
                        src={scene.thumbnail}
                        alt={scene.title}
                        className="h-full w-full object-cover"
                      />

                      {/* Play icon */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/90">
                          <Play
                            size={9}
                            fill="currentColor"
                            className="ml-[1px] text-slate-700"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800">
                        {scene.title}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-slate-400">
                        {scene.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* QUIZ */}
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={(event) => event.stopPropagation()}
                    className="whitespace-nowrap text-xs font-medium text-violet-600 hover:text-violet-800"
                  >
                    {scene.quiz}
                  </button>
                </td>

                {/* SCENE NO */}
                <td className="px-3 py-3 text-xs font-medium text-slate-700">
                  {scene.sceneNo}
                </td>

                {/* TYPE */}
                <td className="px-3 py-3">
                  <TypeBadge type={scene.type} />
                </td>

                {/* DURATION */}
                <td className="px-3 py-3 text-xs text-slate-600">
                  {scene.duration}
                </td>

                {/* STATUS */}
                <td className="px-3 py-3">
                  <StatusBadge status={scene.status} />
                </td>

                {/* VIEWS */}
                <td className="px-3 py-3 text-xs text-slate-600">
                  {scene.views}
                </td>

                {/* COMPLETIONS */}
                <td className="px-3 py-3 text-xs text-slate-600">
                  {scene.completions}
                </td>

                {/* LAST UPDATED */}
                <td className="px-3 py-3">
                  <div className="whitespace-nowrap">
                    <p className="text-[11px] text-slate-600">
                      {scene.lastUpdated}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {scene.updatedTime}
                    </p>
                  </div>
                </td>

                {/* ACTIONS */}
                <td
                  className="px-3 py-3"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex items-center justify-center gap-1">
                    <ActionButton
                      icon={<Eye size={15} />}
                      title="Preview"
                      onClick={() => onSelectScene?.(scene)}
                    />

                    <ActionButton
                      icon={<Pencil size={14} />}
                      title="Edit"
                      onClick={() => console.log("Edit:", scene.id)}
                    />

                    <ActionButton
                      icon={<MoreVertical size={15} />}
                      title="More"
                      onClick={() => console.log("More:", scene.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================================
          MOBILE / TABLET CARDS
      ========================================= */}
      <div className="grid gap-3 p-3 lg:hidden">
        {scenesData.map((scene) => (
          <div
            key={scene.id}
            onClick={() => onSelectScene?.(scene)}
            className="
              cursor-pointer
              rounded-xl
              border
              border-slate-200
              p-3
              transition
              hover:border-violet-200
              hover:bg-violet-50/20
            "
          >
            {/* Top */}
            <div className="flex gap-3">
              {/* Thumbnail */}
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <img
                  src={scene.thumbnail}
                  alt={scene.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90">
                    <Play
                      size={11}
                      fill="currentColor"
                      className="ml-[1px] text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-800">
                      {scene.title}
                    </h3>

                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {scene.description}
                    </p>
                  </div>

                  <StatusBadge status={scene.status} />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <TypeBadge type={scene.type} />

                  <span className="text-xs text-slate-400">•</span>

                  <span className="text-xs text-slate-500">
                    Scene {scene.sceneNo}
                  </span>

                  <span className="text-xs text-slate-400">•</span>

                  <span className="text-xs text-slate-500">
                    {scene.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="text-xs text-slate-400">
                {scene.views !== "-" ? `${scene.views} views` : "No views"}
              </div>

              <div
                className="flex items-center gap-1"
                onClick={(event) => event.stopPropagation()}
              >
                <ActionButton
                  icon={<Eye size={15} />}
                  title="Preview"
                  onClick={() => onSelectScene?.(scene)}
                />

                <ActionButton
                  icon={<Pencil size={14} />}
                  title="Edit"
                  onClick={() => console.log("Edit:", scene.id)}
                />

                <ActionButton
                  icon={<MoreVertical size={15} />}
                  title="More"
                  onClick={() => console.log("More:", scene.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================
          PAGINATION
      ========================================= */}
      <div
        className="
          flex
          flex-col
          gap-3
          border-t
          border-slate-100
          px-4
          py-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* Result count */}
        <p className="text-xs text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-700">1 to 8</span> of{" "}
          <span className="font-medium text-slate-700">386</span> scenes
        </p>

        <div className="flex items-center justify-between gap-3">
          {/* Per page */}
          <select
            defaultValue="10"
            className="
              h-9
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              text-xs
              text-slate-600
              outline-none
              focus:border-violet-400
              focus:ring-2
              focus:ring-violet-500/10
            "
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>

          {/* Pages */}
          <div className="flex items-center gap-1">
            <PaginationButton>
              <ChevronLeft size={15} />
            </PaginationButton>

            <PaginationButton active>1</PaginationButton>

            <PaginationButton>2</PaginationButton>

            <PaginationButton>3</PaginationButton>

            <span className="px-1 text-xs text-slate-400">...</span>

            <PaginationButton>39</PaginationButton>

            <PaginationButton>
              <ChevronRight size={15} />
            </PaginationButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   TYPE BADGE
========================================= */

function TypeBadge({ type }) {
  const isVideo = type === "Video";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-md
        border
        px-2
        py-1
        text-[10px]
        font-medium
        ${
          isVideo
            ? "border-violet-200 bg-violet-50 text-violet-600"
            : "border-sky-200 bg-sky-50 text-sky-600"
        }
      `}
    >
      {type}
    </span>
  );
}

/* =========================================
   STATUS BADGE
========================================= */

function StatusBadge({ status }) {
  const styles = {
    Published: "border-emerald-200 bg-emerald-50 text-emerald-600",
    Draft: "border-orange-200 bg-orange-50 text-orange-600",
    Archived: "border-slate-200 bg-slate-50 text-slate-500",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        whitespace-nowrap
        rounded-md
        border
        px-2
        py-1
        text-[10px]
        font-medium
        ${styles[status] || styles.Archived}
      `}
    >
      {status}
    </span>
  );
}

/* =========================================
   ACTION BUTTON
========================================= */

function ActionButton({ icon, title, onClick }) {
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

/* =========================================
   PAGINATION BUTTON
========================================= */

function PaginationButton({ children, active = false }) {
  return (
    <button
      type="button"
      className={`
        flex
        h-8
        min-w-8
        items-center
        justify-center
        rounded-md
        px-2
        text-xs
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

export default SceneVideoTable;