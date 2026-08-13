import React from "react";
import {
  Users,
  ShieldCheck,
  UserPlus,
  UserX,
  KeyRound,
  Upload,
  Plus,
} from "lucide-react";

function UsersRolesHeader({
  // =====================================================
  // USER COUNTS FROM API
  // =====================================================

  counts = {
    TLM: 0,
    SLM: 0,
    FLM: 0,
    MR: 0,
    total: 0,
  },

  onImportUsers = () => {},
  onAddUser = () => {},
}) {
  // =====================================================
  // STATISTICS
  // =====================================================

  const stats = [
    {
      title: "Total Users",
      value: counts.total,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      trendText: "All users",
      trendColor: "text-slate-500",
    },

    {
      title: "TLMs",
      value: counts.TLM,
      icon: ShieldCheck,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      trendText: "Total TLMs",
      trendColor: "text-violet-600",
    },

    {
      title: "SLMs",
      value: counts.SLM,
      icon: UserPlus,
      iconBg: "bg-pink-50",
      iconColor: "text-pink-500",
      trendText: "Total SLMs",
      trendColor: "text-pink-500",
    },

    {
      title: "FLMs",
      value: counts.FLM,
      icon: UserX,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
      trendText: "Total FLMs",
      trendColor: "text-rose-500",
    },

    {
      title: "MRs",
      value: counts.MR,
      icon: KeyRound,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      trendText: "Total MRs",
      trendColor: "text-violet-600",
    },
  ];

  return (
    <div className="w-full space-y-3">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
        {/* TITLE */}

        <div>
          <h1 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            Users & Roles
          </h1>

          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>Dashboard</span>

            <span className="text-slate-300">
              ›
            </span>

            <span className="text-slate-700">
              Users & Roles
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}

        <div className="flex flex-col gap-1.5 sm:flex-row">
          {/* IMPORT USERS */}

          <button
            type="button"
            onClick={onImportUsers}
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
            <Upload
              size={14}
              strokeWidth={1.8}
            />

            <span>Import Users</span>
          </button>

          {/* ADD USER */}

          <button
            type="button"
            onClick={onAddUser}
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
            <Plus
              size={15}
              strokeWidth={2}
            />

            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* =================================================
          STATISTICS CARDS
      ================================================= */}

      <div
        className="
          grid
          grid-cols-2
          gap-2.5
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

                  <p className="mt-0.5 text-[15px] font-semibold tracking-tight text-slate-900 sm:text-base">
                    {stat.value}
                  </p>
                </div>
              </div>

              {/* CARD FOOTER */}

              <div className="mt-2 flex items-center gap-1 text-[9px]">
                <span
                  className={`font-medium ${stat.trendColor}`}
                >
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

export default UsersRolesHeader;