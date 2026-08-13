import React from "react";
import {
    Download,
    Plus,
    Search,
    ChevronDown,
    SlidersHorizontal,
    RotateCcw,
    Video,
    Clock3,
    CircleCheck,
    Eye,
    PlayCircle,
} from "lucide-react";

function SceneVideoHeader({
    search = "",
    setSearch = () => { },
    quiz = "all",
    setQuiz = () => { },
    type = "all",
    setType = () => { },
    status = "all",
    setStatus = () => { },
    duration = "all",
    setDuration = () => { },
    onExport = () => { },
    onAddScene = () => { },
    onReset = () => { },
}) {
    const stats = [
        {
            title: "Total Scenes / Videos",
            value: "386",
            icon: Video,
            iconBg: "bg-violet-50",
            iconColor: "text-violet-600",
            footer: (
                <>
                    Active: <span className="font-medium text-emerald-500">342</span>
                    <span className="mx-1.5 text-slate-300">|</span>
                    Draft: <span className="font-medium text-orange-500">28</span>
                    <span className="mx-1.5 text-slate-300">|</span>
                    Archived: <span className="font-medium text-slate-500">16</span>
                </>
            ),
        },
        {
            title: "Total Duration",
            value: "18h 42m 36s",
            icon: Clock3,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-500",
            footer: "This campaign",
        },
        {
            title: "Published",
            value: "342",
            icon: CircleCheck,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-500",
            footer: "88.6% of total",
        },
        {
            title: "Total Views",
            value: "245,681",
            icon: Eye,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",
            footer: (
                <span className="text-emerald-500">
                    ↑ 18.6% <span className="text-slate-500">vs last 7 days</span>
                </span>
            ),
        },
        {
            title: "Total Completions",
            value: "168,732",
            icon: PlayCircle,
            iconBg: "bg-violet-50",
            iconColor: "text-violet-500",
            footer: (
                <span className="text-emerald-500">
                    ↑ 15.3% <span className="text-slate-500">vs last 7 days</span>
                </span>
            ),
        },
    ];

    return (
        <div className="w-full space-y-3.5">
            {/* ================= PAGE HEADER ================= */}
            <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                        Scenes / Videos
                    </h1>

                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                        <span>Dashboard</span>
                        <span className="text-slate-300">›</span>
                        <span className="text-slate-700">Scenes / Videos</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-1.5 sm:flex-row">
                    <button
                        type="button"
                        onClick={onExport}
                        className="
              inline-flex
              h-8.5
              items-center
              justify-center
              gap-1.5
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              text-[11px]
              font-medium
              text-violet-600
              shadow-sm
              transition
              hover:border-violet-200
              hover:bg-violet-50
            "
                    >
                        <Download size={14} strokeWidth={1.8} />
                        <span>Export (Excel)</span>
                    </button>

                    <button
                        type="button"
                        onClick={onAddScene}
                        className="
              inline-flex
              h-8.5
              items-center
              justify-center
              gap-1.5
              rounded-lg
              bg-violet-600
              px-3.5
              text-[11px]
              font-medium
              text-white
              shadow-sm
              transition
              hover:bg-violet-700
            "
                    >
                        <Plus size={16} strokeWidth={2} />
                        <span>Add New Scene / Video</span>
                    </button>
                </div>
            </div>

            {/* ================= STATISTICS ================= */}
            <div
                className="
          grid
          grid-cols-1
          gap-2.5
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-5
        "
            >
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="
                min-h-[112px]
                rounded-xl
                border
                border-slate-200
                bg-white
                p-2.5
                shadow-sm
              "
                        >
                            <div className="flex items-start gap-2">
                                <div
                                    className={`
                    flex
                    h-8.5
                    w-8.5
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    ${stat.iconBg}
                  `}
                                >
                                    <Icon
                                        size={17}
                                        strokeWidth={1.8}
                                        className={stat.iconColor}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] font-medium text-slate-500">
                                        {stat.title}
                                    </p>

                                    <p className="mt-0.5 truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2.5 text-[10px] text-slate-500">
                                {stat.footer}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ================= SEARCH + FILTERS ================= */}
            <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                <div
                    className="
            flex
            flex-col
            gap-2
            xl:flex-row
            xl:items-center
          "
                >
                    {/* Search */}
                    <div className="relative min-w-0 flex-1 xl:max-w-[270px]">
                        <Search
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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title, scene no., tags..."
                            className="
                h-8.5
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

                    {/* Filters */}
                    <div
                        className="
              grid
              grid-cols-2
              gap-1.5
              sm:grid-cols-4
              xl:flex
              xl:flex-1
            "
                    >
                        <FilterSelect
                            value={quiz}
                            onChange={setQuiz}
                            options={[
                                { value: "all", label: "Quiz: All" },
                                {
                                    value: "gerd",
                                    label: "GERD Awareness Quiz",
                                },
                            ]}
                        />

                        <FilterSelect
                            value={type}
                            onChange={setType}
                            options={[
                                { value: "all", label: "Type: All" },
                                { value: "video", label: "Video" },
                                { value: "animation", label: "Animation" },
                            ]}
                        />

                        <FilterSelect
                            value={status}
                            onChange={setStatus}
                            options={[
                                { value: "all", label: "Status: All" },
                                { value: "published", label: "Published" },
                                { value: "draft", label: "Draft" },
                                { value: "archived", label: "Archived" },
                            ]}
                        />

                        <FilterSelect
                            value={duration}
                            onChange={setDuration}
                            options={[
                                { value: "all", label: "Duration: All" },
                                { value: "short", label: "Under 2 min" },
                                { value: "medium", label: "2–5 min" },
                                { value: "long", label: "5+ min" },
                            ]}
                        />
                    </div>

                    {/* Filters Button */}
                    <button
                        type="button"
                        className="
              inline-flex
              h-8.5
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
                        <SlidersHorizontal size={14} strokeWidth={1.8} />
                        <span>Filters</span>
                    </button>

                    {/* Reset */}
                    <button
                        type="button"
                        onClick={onReset}
                        className="
              inline-flex
              h-8.5
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
              xl:shrink-0
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

/* ================= FILTER SELECT ================= */

function FilterSelect({ value, onChange, options }) {
    return (
        <div className="relative min-w-0">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="
          h-8.5
          w-full
          appearance-none
          rounded-lg
          border
          border-slate-200
          bg-white
          px-2.5
          pr-7
          text-[11px]
          text-slate-700
          outline-none
          transition
          focus:border-violet-400
          focus:ring-2
          focus:ring-violet-500/10
        "
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

export default SceneVideoHeader;