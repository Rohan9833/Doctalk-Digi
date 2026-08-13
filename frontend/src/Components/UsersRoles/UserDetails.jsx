import React, { useState } from "react";
import {
  X,
  Pencil,
  LockKeyhole,
  Power,
  Trash2,
  CheckCircle2,
  ChevronDown,
  Phone,
  Building2,
} from "lucide-react";

function UserDetails({
  user = null,

  onClose = () => {},
  onEditUser = () => {},
  onResetPassword = () => {},
  onDeactivateUser = () => {},
  onDeleteUser = () => {},
}) {
  const [activeTab, setActiveTab] = useState("overview");

  // =====================================================
  // NO USER SELECTED
  // =====================================================

  if (!user) {
    return (
      <aside
        className="
          flex
          min-h-[300px]
          w-full
          items-center
          justify-center
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div className="px-5 text-center">
          <div
            className="
              mx-auto
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-slate-100
              text-slate-400
            "
          >
            <Building2 size={17} />
          </div>

          <p className="mt-2 text-xs font-medium text-slate-600">
            Select a user
          </p>

          <p className="mt-1 text-[9px] text-slate-400">
            Click on a user from the table to view their details.
          </p>
        </div>
      </aside>
    );
  }

  // =====================================================
  // TABS
  // =====================================================

  const tabs = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "access",
      label: "Access",
    },
  ];

  // =====================================================
  // USER INITIALS
  // =====================================================

  const initials =
    user.user
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <aside
      className="
        w-full
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-200
          px-3.5
          py-3
        "
      >
        <h2 className="text-xs font-semibold text-slate-800">
          User Details
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-md
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-600
          "
        >
          <X size={15} />
        </button>
      </div>

      {/* =================================================
          USER PROFILE
      ================================================= */}

      <div className="px-3.5 py-4">
        <div className="flex items-start gap-3">
          {/* AVATAR */}

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-violet-50
              text-sm
              font-semibold
              text-violet-600
            "
          >
            {initials}
          </div>

          {/* USER INFO */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-xs font-semibold text-slate-800">
                {user.user}
              </h3>

              <span
                className="
                  rounded
                  border
                  border-violet-100
                  bg-violet-50
                  px-1.5
                  py-0.5
                  text-[8px]
                  font-medium
                  text-violet-600
                "
              >
                {user.role}
              </span>
            </div>

            {/* USER ID */}

            <p className="mt-1 text-[9px] text-slate-400">
              ID: {user.userId}
            </p>
          </div>
        </div>

        {/* BUSINESS UNIT */}

        <div className="mt-3 flex items-center gap-1.5">
          <Building2
            size={11}
            className="text-slate-400"
          />

          <span className="text-[9px] text-slate-500">
            Business Unit:
          </span>

          <span className="text-[9px] font-medium text-slate-600">
            {user.businessUnit || "-"}
          </span>
        </div>
      </div>

      {/* =================================================
          TABS
      ================================================= */}

      <div className="border-b border-slate-200 px-3.5">
        <div className="flex items-center gap-4 overflow-x-auto">
          {tabs.map((tab) => {
            const active =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`
                  relative
                  shrink-0
                  pb-2.5
                  text-[9px]
                  font-medium
                  transition
                  ${
                    active
                      ? "text-violet-600"
                      : "text-slate-500 hover:text-slate-700"
                  }
                `}
              >
                {tab.label}

                {active && (
                  <span
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      h-0.5
                      rounded-full
                      bg-violet-600
                    "
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================
          TAB CONTENT
      ================================================= */}

      <div className="px-3.5 py-3.5">
        {activeTab === "overview" && (
          <OverviewTab user={user} />
        )}

        {activeTab === "access" && (
          <AccessTab user={user} />
        )}
      </div>

      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <div className="border-t border-slate-200 px-3.5 py-3.5">
        <h3 className="text-[11px] font-semibold text-slate-800">
          Quick Actions
        </h3>

        <div className="mt-2.5 grid grid-cols-2 gap-2">
          {/* EDIT */}

          <QuickAction
            icon={<Pencil size={13} />}
            label="Edit User"
            onClick={() =>
              onEditUser(user)
            }
          />

          {/* RESET PASSWORD */}

          <QuickAction
            icon={<LockKeyhole size={13} />}
            label="Reset Password"
            onClick={() =>
              onResetPassword(user)
            }
          />

          {/* DEACTIVATE */}

          <QuickAction
            icon={<Power size={13} />}
            label="Deactivate User"
            danger
            onClick={() =>
              onDeactivateUser(user)
            }
          />

          {/* DELETE */}

          <button
            type="button"
            onClick={() =>
              onDeleteUser(user)
            }
            className="
              col-span-2
              flex
              h-9
              items-center
              gap-2
              rounded-lg
              border
              border-rose-200
              bg-white
              px-3
              text-[10px]
              font-medium
              text-rose-500
              transition
              hover:bg-rose-50
            "
          >
            <Trash2 size={13} />

            <span>Delete User</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

/* =========================================================
   OVERVIEW TAB
========================================================= */

function OverviewTab({ user }) {
  return (
    <div className="space-y-3">
      <DetailRow
        label="User ID"
        value={user.userId}
      />

      <DetailRow
        label="Role"
        value={user.role}
      />

      <DetailRow
        label="Business Unit"
        value={user.businessUnit}
        icon={<Building2 size={11} />}
      />

      <DetailRow
        label="Region"
        value={user.region}
      />

      <DetailRow
        label="Zone"
        value={user.zone}
      />
    </div>
  );
}

/* =========================================================
   ACCESS TAB
========================================================= */

function AccessTab({ user }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-[10px] font-semibold text-slate-700">
          Access Information
        </h3>

        <p className="mt-0.5 text-[8px] text-slate-400">
          Organizational access associated with this user.
        </p>
      </div>

      <div
        className="
          rounded-lg
          border
          border-slate-100
          bg-slate-50/60
          p-2.5
        "
      >
        <DetailRow
          label="Role"
          value={user.role}
        />

        <div className="my-2 border-t border-slate-100" />

        <DetailRow
          label="Business Unit"
          value={user.businessUnit}
        />

        <div className="my-2 border-t border-slate-100" />

        <DetailRow
          label="Region"
          value={user.region}
        />

        <div className="my-2 border-t border-slate-100" />

        <DetailRow
          label="Zone"
          value={user.zone}
        />
      </div>

      <div
        className="
          flex
          items-center
          gap-2
          rounded-lg
          border
          border-emerald-100
          bg-emerald-50
          px-2.5
          py-2
        "
      >
        <CheckCircle2
          size={12}
          className="shrink-0 text-emerald-500"
        />

        <span className="text-[9px] text-emerald-700">
          User is assigned to the {user.role} hierarchy.
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
  icon = null,
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex shrink-0 items-center gap-1 text-[9px] text-slate-500">
        {icon}
        {label}
      </span>

      <span className="max-w-[175px] text-right text-[9px] font-medium leading-4 text-slate-600">
        {value || "-"}
      </span>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  label,
  onClick,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        h-9
        items-center
        gap-2
        rounded-lg
        border
        bg-white
        px-2.5
        text-[9px]
        font-medium
        transition
        ${
          danger
            ? "border-rose-200 text-rose-500 hover:bg-rose-50"
            : "border-slate-200 text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
        }
      `}
    >
      {icon}

      <span className="truncate">
        {label}
      </span>
    </button>
  );
}

export default UserDetails;