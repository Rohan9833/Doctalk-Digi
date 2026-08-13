import React, { useState } from "react";
import {
    X,
    Play,
    Pause,
    Volume2,
    Maximize,
    FileText,
    BarChart3,
    ClipboardList,
    Pencil,
    RefreshCw,
    Mic,
    Eye,
    Archive,
    Tag,
    CalendarDays,
    Clock3,
    User,
    Hash,
    Video,
} from "lucide-react";

function SceneVideoPreview({ scene, onClose }) {
    const [activeTab, setActiveTab] = useState("details");
    const [isPlaying, setIsPlaying] = useState(false);

    /* =========================================
       EMPTY STATE
    ========================================= */

    if (!scene) {
        return (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="max-w-xs text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">
                        <Video
                            size={22}
                            strokeWidth={1.7}
                            className="text-violet-500"
                        />
                    </div>

                    <h3 className="mt-3 text-sm font-semibold text-slate-800">
                        Select a Scene / Video
                    </h3>

                    <p className="mt-1.5 text-xs leading-5 text-slate-400">
                        Select a scene from the table to view its preview, details,
                        linked quiz, and analytics.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* =========================================
          HEADER
      ========================================= */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-violet-500">
                        Scene {scene.sceneNo}
                    </p>

                    <h2 className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                        {scene.title}
                    </h2>
                </div>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-md
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
            "
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* =========================================
          VIDEO PREVIEW
      ========================================= */}
            <div className="p-3">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-900">
                    <img
                        src={scene.thumbnail}
                        alt={scene.title}
                        className={`
              h-full
              w-full
              object-cover
              transition
              ${isPlaying ? "opacity-70" : "opacity-80"}
            `}
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Center Play Button */}
                    <button
                        type="button"
                        onClick={() => setIsPlaying((previous) => !previous)}
                        className="
              absolute
              left-1/2
              top-1/2
              flex
              h-11
              w-11
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white/95
              text-violet-600
              shadow-lg
              transition
              hover:scale-105
            "
                    >
                        {isPlaying ? (
                            <Pause size={17} fill="currentColor" />
                        ) : (
                            <Play size={17} fill="currentColor" className="ml-0.5" />
                        )}
                    </button>

                    {/* Video Controls */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6">
                        <button
                            type="button"
                            className="text-white"
                            onClick={() => setIsPlaying((previous) => !previous)}
                        >
                            {isPlaying ? (
                                <Pause size={14} fill="currentColor" />
                            ) : (
                                <Play size={14} fill="currentColor" />
                            )}
                        </button>

                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
                            <div className="h-full w-[35%] rounded-full bg-white" />
                        </div>

                        <span className="text-[9px] text-white">
                            00:35 / {scene.duration}
                        </span>

                        <button type="button" className="text-white">
                            <Volume2 size={14} />
                        </button>

                        <button type="button" className="text-white">
                            <Maximize size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* =========================================
          TABS
      ========================================= */}
            <div className="border-b border-slate-100 px-3">
                <div className="flex items-center gap-4">
                    <PreviewTab
                        active={activeTab === "details"}
                        icon={<FileText size={14} />}
                        label="Details"
                        onClick={() => setActiveTab("details")}
                    />

                    <PreviewTab
                        active={activeTab === "quiz"}
                        icon={<ClipboardList size={14} />}
                        label="Linked Quiz"
                        onClick={() => setActiveTab("quiz")}
                    />

                    <PreviewTab
                        active={activeTab === "analytics"}
                        icon={<BarChart3 size={14} />}
                        label="Analytics"
                        onClick={() => setActiveTab("analytics")}
                    />
                </div>
            </div>

            {/* =========================================
          CONTENT
      ========================================= */}
            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === "details" && <DetailsTab scene={scene} />}

                {activeTab === "quiz" && <QuizTab scene={scene} />}

                {activeTab === "analytics" && <AnalyticsTab scene={scene} />}
            </div>

            {/* =========================================
          QUICK ACTIONS
      ========================================= */}
            <QuickActions />
        </div>
    );
}

/* =========================================
   TABS
========================================= */

function PreviewTab({ active, icon, label, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        relative
        flex
        items-center
        gap-1.5
        py-2.5
        text-[11px]
        font-medium
        transition
        ${active
                    ? "text-violet-600"
                    : "text-slate-400 hover:text-slate-600"
                }
      `}
        >
            {icon}

            <span>{label}</span>

            {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-violet-600" />
            )}
        </button>
    );
}

/* =========================================
   DETAILS TAB
========================================= */

function DetailsTab({ scene }) {
    return (
        <div className="space-y-4">
            {/* Description */}
            <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Description
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                    {scene.description}
                </p>
            </div>

            {/* Information */}
            <div>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Scene Information
                </p>

                <div className="overflow-hidden rounded-lg border border-slate-100">
                    <InfoRow
                        icon={<Hash size={13} />}
                        label="Scene Number"
                        value={scene.sceneNo}
                    />

                    <InfoRow
                        icon={<Video size={13} />}
                        label="Type"
                        value={scene.type}
                    />

                    <InfoRow
                        icon={<Clock3 size={13} />}
                        label="Duration"
                        value={scene.duration}
                    />

                    <InfoRow
                        icon={<Eye size={13} />}
                        label="Views"
                        value={scene.views}
                    />

                    <InfoRow
                        icon={<Play size={13} />}
                        label="Completions"
                        value={scene.completions}
                    />

                    <InfoRow
                        icon={<CalendarDays size={13} />}
                        label="Last Updated"
                        value={scene.lastUpdated}
                    />
                </div>
            </div>

            {/* Status */}
            <div>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Status
                </p>

                <StatusBadge status={scene.status} />
            </div>

            {/* Quiz */}
            <div>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Linked Quiz
                </p>

                <div className="flex items-center gap-2 rounded-lg border border-violet-100 bg-violet-50/50 p-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-100">
                        <ClipboardList
                            size={14}
                            className="text-violet-600"
                        />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-violet-700">
                            {scene.quiz}
                        </p>

                        <p className="mt-0.5 text-[10px] text-violet-400">
                            Linked to this scene
                        </p>
                    </div>
                </div>
            </div>

            {/* Tags */}
            <TagsSection />
        </div>
    );
}

/* =========================================
   QUIZ TAB
========================================= */

function QuizTab({ scene }) {
    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-violet-100 bg-violet-50/50 p-3">
                <div className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                        <ClipboardList
                            size={16}
                            className="text-violet-600"
                        />
                    </div>

                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-wide text-violet-400">
                            Linked Quiz
                        </p>

                        <h3 className="mt-0.5 text-sm font-semibold text-violet-700">
                            {scene.quiz}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Questions */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        Quiz Questions
                    </p>

                    <span className="text-[10px] text-slate-400">
                        5 questions
                    </span>
                </div>

                <div className="space-y-2">
                    {[
                        "What is GERD?",
                        "Which symptoms are commonly associated?",
                        "What lifestyle factors can trigger GERD?",
                        "When should a patient consult a doctor?",
                        "Which treatment options are available?",
                    ].map((question, index) => (
                        <div
                            key={question}
                            className="flex items-center gap-2.5 rounded-lg border border-slate-100 p-2.5"
                        >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[10px] font-semibold text-slate-500">
                                {index + 1}
                            </span>

                            <p className="text-xs text-slate-600">
                                {question}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* =========================================
   ANALYTICS TAB
========================================= */

function AnalyticsTab({ scene }) {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
                <AnalyticsCard
                    label="Views"
                    value={scene.views}
                    icon={<Eye size={15} />}
                />

                <AnalyticsCard
                    label="Completions"
                    value={scene.completions}
                    icon={<Play size={15} />}
                />

                <AnalyticsCard
                    label="Completion Rate"
                    value="68.4%"
                    icon={<BarChart3 size={15} />}
                />

                <AnalyticsCard
                    label="Avg. Watch"
                    value="01:12"
                    icon={<Clock3 size={15} />}
                />
            </div>

            {/* Progress */}
            <div className="rounded-lg border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-700">
                        Completion Rate
                    </p>

                    <p className="text-xs font-semibold text-violet-600">
                        68.4%
                    </p>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[68.4%] rounded-full bg-violet-500" />
                </div>

                <p className="mt-2 text-[10px] text-slate-400">
                    Compared with the previous 7 days
                </p>
            </div>

            {/* Views */}
            <div className="rounded-lg border border-slate-100 p-3">
                <p className="text-xs font-medium text-slate-700">
                    Views this week
                </p>

                <div className="mt-4 flex h-24 items-end gap-2">
                    {[35, 52, 44, 68, 58, 78, 92].map(
                        (height, index) => (
                            <div
                                key={index}
                                className="flex flex-1 flex-col items-center gap-1"
                            >
                                <div
                                    className="w-full rounded-t bg-violet-200"
                                    style={{ height: `${height}%` }}
                                />

                                <span className="text-[8px] text-slate-400">
                                    {["M", "T", "W", "T", "F", "S", "S"][index]}
                                </span>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

/* =========================================
   INFO ROW
========================================= */

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5 last:border-b-0">
            <div className="flex items-center gap-2">
                <span className="text-slate-400">{icon}</span>

                <span className="text-[11px] text-slate-500">
                    {label}
                </span>
            </div>

            <span className="max-w-[55%] truncate text-[11px] font-medium text-slate-700">
                {value}
            </span>
        </div>
    );
}

/* =========================================
   STATUS BADGE
========================================= */

function StatusBadge({ status }) {
    const styles = {
        Published:
            "border-emerald-200 bg-emerald-50 text-emerald-600",
        Draft: "border-orange-200 bg-orange-50 text-orange-600",
        Archived:
            "border-slate-200 bg-slate-50 text-slate-500",
    };

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
        ${styles[status] || styles.Archived}
      `}
        >
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}

/* =========================================
   TAGS
========================================= */

function TagsSection() {
    const tags = ["GERD", "Introduction", "Awareness"];

    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Tags
                </p>

                <button
                    type="button"
                    className="text-[10px] font-medium text-violet-600 hover:text-violet-700"
                >
                    + Add Tag
                </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="
              inline-flex
              items-center
              gap-1
              rounded-md
              border
              border-slate-200
              bg-slate-50
              px-2
              py-1
              text-[10px]
              text-slate-600
            "
                    >
                        <Tag size={10} />
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* =========================================
   ANALYTICS CARD
========================================= */

function AnalyticsCard({ label, value, icon }) {
    return (
        <div className="rounded-lg border border-slate-100 p-2.5">
            <div className="flex items-center gap-1.5 text-slate-400">
                {icon}

                <span className="text-[10px]">{label}</span>
            </div>

            <p className="mt-1 text-sm font-semibold text-slate-800">
                {value}
            </p>
        </div>
    );
}

/* =========================================
   QUICK ACTIONS
========================================= */

function QuickActions() {
    return (
        <div className="border-t border-slate-100 bg-slate-50/50 p-3">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Quick Actions
            </p>

            <div className="grid grid-cols-2 gap-1.5">
                <QuickAction
                    icon={<Pencil size={13} />}
                    label="Edit Scene"
                />

                <QuickAction
                    icon={<RefreshCw size={13} />}
                    label="Replace Video"
                />

                <QuickAction
                    icon={<Mic size={13} />}
                    label="Manage Voiceover"
                />

                <QuickAction
                    icon={<Eye size={13} />}
                    label="Preview"
                />

                <button
                    type="button"
                    className="
            col-span-2
            flex
            h-8
            items-center
            justify-center
            gap-1.5
            rounded-lg
            border
            border-red-200
            bg-white
            text-[10px]
            font-medium
            text-red-500
            transition
            hover:bg-red-50
          "
                >
                    <Archive size={13} />
                    Archive Scene
                </button>
            </div>
        </div>
    );
}

/* =========================================
   QUICK ACTION BUTTON
========================================= */

function QuickAction({ icon, label }) {
    return (
        <button
            type="button"
            className="
        flex
        h-8
        items-center
        justify-center
        gap-1.5
        rounded-lg
        border
        border-slate-200
        bg-white
        px-2
        text-[10px]
        font-medium
        text-slate-600
        transition
        hover:border-violet-200
        hover:bg-violet-50
        hover:text-violet-600
      "
        >
            {icon}
            {label}
        </button>
    );
}

export default SceneVideoPreview;