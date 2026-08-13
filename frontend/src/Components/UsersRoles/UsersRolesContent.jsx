import React, { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

function UsersRolesContent({
  data = [],
  loading = false,

  // =====================================================
  // FILTER PROPS
  // =====================================================

  role = "all",
  setRole = () => {},

  businessUnit = "all",
  setBusinessUnit = () => {},

  region = "all",
  setRegion = () => {},

  // =====================================================
  // PAGINATION
  // =====================================================

  pagination = {},
  onPageChange = () => {},
  onLimitChange = () => {},

  // =====================================================
  // USER ACTIONS
  // =====================================================

  onViewUser = () => {},
  onEditUser = () => {},
  onMoreActions = () => {},
}) {
  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] = useState("");

  // =====================================================
  // ACTIVE TAB
  // =====================================================

  const [activeTab, setActiveTab] = useState("all");

  // =====================================================
  // FILTER PANEL
  // =====================================================

  const [showFilters, setShowFilters] =
    useState(true);

  // =====================================================
  // SELECTED USERS
  // =====================================================

  const [selectedUsers, setSelectedUsers] =
    useState([]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const currentPage =
    pagination.currentPage || 1;

  const limit =
    pagination.limit || 10;

  const totalUsers =
    pagination.totalUsers || 0;

  const totalPages =
    pagination.totalPages || 0;

  const hasNextPage =
    pagination.hasNextPage || false;

  const hasPreviousPage =
    pagination.hasPreviousPage || false;

  // =====================================================
  // CLEAR SELECTED USERS WHEN PAGE CHANGES
  // =====================================================

  useEffect(() => {
    setSelectedUsers([]);
  }, [currentPage, limit]);

  // =====================================================
  // BUSINESS UNITS
  // =====================================================

  const businessUnits = useMemo(() => {
    return [
      ...new Set(
        data
          .map(
            (user) =>
              user.businessUnit?.trim()
          )
          .filter(Boolean)
      ),
    ];
  }, [data]);

  // =====================================================
  // REGIONS
  // =====================================================

  const regions = useMemo(() => {
    return [
      ...new Set(
        data
          .map(
            (user) =>
              user.region?.trim()
          )
          .filter(Boolean)
      ),
    ];
  }, [data]);

  // =====================================================
  // TABS
  // =====================================================

  const tabs = [
    {
      id: "all",
      label: "All Users",
    },
    {
      id: "tlm",
      label: "TLM",
    },
    {
      id: "slm",
      label: "SLM",
    },
    {
      id: "flm",
      label: "FLM",
    },
    {
      id: "mr",
      label: "MR",
    },
  ];

  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return data.filter((user) => {
      // ===============================================
      // TAB FILTER
      // ===============================================

      const userRole =
        user.role?.trim().toLowerCase();

      const matchesTab =
        activeTab === "all" ||
        userRole ===
          activeTab.toLowerCase();

      // ===============================================
      // ROLE DROPDOWN
      // ===============================================

      const matchesRole =
        role === "all" ||
        userRole ===
          role.trim().toLowerCase();

      // ===============================================
      // BUSINESS UNIT
      // ===============================================

      const userBusinessUnit =
        user.businessUnit
          ?.trim()
          .toLowerCase();

      const matchesBusinessUnit =
        businessUnit === "all" ||
        userBusinessUnit ===
          businessUnit
            .trim()
            .toLowerCase();

      // ===============================================
      // REGION
      // ===============================================

      const userRegion =
        user.region
          ?.trim()
          .toLowerCase();

      const matchesRegion =
        region === "all" ||
        userRegion ===
          region
            .trim()
            .toLowerCase();

      // ===============================================
      // SEARCH
      // ===============================================

      const matchesSearch =
        !searchValue ||
        user.user
          ?.toLowerCase()
          .includes(searchValue) ||
        user.userId
          ?.toLowerCase()
          .includes(searchValue) ||
        user.role
          ?.toLowerCase()
          .includes(searchValue) ||
        user.businessUnit
          ?.toLowerCase()
          .includes(searchValue) ||
        user.region
          ?.toLowerCase()
          .includes(searchValue) ||
        user.zone
          ?.toLowerCase()
          .includes(searchValue);

      return (
        matchesTab &&
        matchesRole &&
        matchesBusinessUnit &&
        matchesRegion &&
        matchesSearch
      );
    });
  }, [
    data,
    search,
    activeTab,
    role,
    businessUnit,
    region,
  ]);

  // =====================================================
  // RESET ALL FILTERS
  // =====================================================

  const handleReset = () => {
    setSearch("");
    setActiveTab("all");
    setRole("all");
    setBusinessUnit("all");
    setRegion("all");
  };

  // =====================================================
  // CHECK WHETHER ANY FILTER IS ACTIVE
  // =====================================================

  const hasActiveFilters =
    search.trim() !== "" ||
    activeTab !== "all" ||
    role !== "all" ||
    businessUnit !== "all" ||
    region !== "all";

  // =====================================================
  // SELECT ALL
  // =====================================================

  const allSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((user) =>
      selectedUsers.includes(user.id)
    );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedUsers([]);
      return;
    }

    setSelectedUsers(
      filteredUsers.map(
        (user) => user.id
      )
    );
  };

  // =====================================================
  // SELECT USER
  // =====================================================

  const toggleUser = (id) => {
    setSelectedUsers((previous) =>
      previous.includes(id)
        ? previous.filter(
            (userId) =>
              userId !== id
          )
        : [...previous, id]
    );
  };

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  const getPageNumbers = () => {
    if (totalPages <= 1) {
      return [];
    }

    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 3) {
      return [
        1,
        2,
        3,
        4,
        "...",
        totalPages,
      ];
    }

    if (
      currentPage >=
      totalPages - 2
    ) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pageNumbers =
    getPageNumbers();

  // =====================================================
  // LOADING
  // =====================================================

  if (
    loading &&
    data.length === 0
  ) {
    return (
      <div className="w-full min-w-0">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="space-y-3 p-5">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">

      {/* =================================================
          FILTER BAR
      ================================================= */}

      <div className="mb-3 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
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
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search by name, ID or role..."
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

          {/* ROLE */}

          <FilterSelect
            value={role}
            onChange={setRole}
            options={[
              {
                value: "all",
                label: "Role: All",
              },
              {
                value: "TLM",
                label: "Role: TLM",
              },
              {
                value: "SLM",
                label: "Role: SLM",
              },
              {
                value: "FLM",
                label: "Role: FLM",
              },
              {
                value: "MR",
                label: "Role: MR",
              },
            ]}
          />

          {/* BUSINESS UNIT */}

          <FilterSelect
            value={businessUnit}
            onChange={setBusinessUnit}
            options={[
              {
                value: "all",
                label: "Business Unit: All",
              },
              ...businessUnits.map(
                (unit) => ({
                  value: unit,
                  label: unit,
                })
              ),
            ]}
          />

          {/* REGION */}

          <FilterSelect
            value={region}
            onChange={setRegion}
            options={[
              {
                value: "all",
                label: "Region: All",
              },
              ...regions.map(
                (item) => ({
                  value: item,
                  label: item,
                })
              ),
            ]}
          />

          {/* FILTER BUTTON */}

          <button
            type="button"
            onClick={() =>
              setShowFilters(
                (previous) =>
                  !previous
              )
            }
            className={`
              inline-flex
              h-8
              shrink-0
              items-center
              justify-center
              gap-1.5
              rounded-lg
              border
              px-2.5
              text-[11px]
              font-medium
              transition
              ${
                showFilters
                  ? "border-violet-200 bg-violet-50 text-violet-600"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }
            `}
          >
            <SlidersHorizontal
              size={14}
              strokeWidth={1.8}
            />

            <span>Filters</span>

            {hasActiveFilters && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[8px] font-semibold text-white">
                !
              </span>
            )}
          </button>

          {/* RESET */}

          <button
            type="button"
            onClick={handleReset}
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
            <RotateCcw
              size={13}
              strokeWidth={1.8}
            />

            <span>Reset</span>
          </button>
        </div>

        {/* =================================================
            ACTIVE FILTER SUMMARY
        ================================================= */}

        {showFilters &&
          hasActiveFilters && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-1.5">
              <span className="text-[9px] text-slate-400">
                Active:
              </span>

              {search && (
                <FilterBadge
                  label={`Search: ${search}`}
                />
              )}

              {activeTab !== "all" && (
                <FilterBadge
                  label={`Tab: ${activeTab.toUpperCase()}`}
                />
              )}

              {role !== "all" && (
                <FilterBadge
                  label={`Role: ${role}`}
                />
              )}

              {businessUnit !==
                "all" && (
                <FilterBadge
                  label={`BU: ${businessUnit}`}
                />
              )}

              {region !== "all" && (
                <FilterBadge
                  label={`Region: ${region}`}
                />
              )}
            </div>
          )}
      </div>

      {/* =================================================
          TABS
      ================================================= */}

      <div className="flex items-end justify-between gap-3">

        <div className="min-w-0 overflow-x-auto">
          <div className="flex min-w-max items-center gap-5 border-b border-slate-200">

            {tabs.map((tab) => {
              const active =
                activeTab ===
                tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      tab.id
                    )
                  }
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

        {/* DESKTOP CONTROLS */}

        <div className="hidden shrink-0 items-center gap-1.5 lg:flex">

          <button
            type="button"
            className="
              flex
              h-8
              items-center
              gap-1.5
              rounded-lg
              border
              border-slate-200
              bg-white
              px-2.5
              text-[10px]
              font-medium
              text-slate-600
              transition
              hover:bg-slate-50
            "
          >
            Bulk Actions

            <ChevronDown
              size={12}
            />
          </button>

          <button
            type="button"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              border
              border-violet-200
              bg-violet-50
              text-violet-600
            "
          >
            <div className="grid grid-cols-2 gap-0.5">
              <span className="h-1.5 w-1.5 rounded-sm bg-current" />
              <span className="h-1.5 w-1.5 rounded-sm bg-current" />
              <span className="h-1.5 w-1.5 rounded-sm bg-current" />
              <span className="h-1.5 w-1.5 rounded-sm bg-current" />
            </div>
          </button>

          <button
            type="button"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-500
            "
          >
            <div className="space-y-1">
              <span className="block h-0.5 w-3 rounded bg-current" />
              <span className="block h-0.5 w-3 rounded bg-current" />
              <span className="block h-0.5 w-3 rounded bg-current" />
            </div>
          </button>

        </div>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="mt-2.5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* DESKTOP */}

        <div className="hidden overflow-x-auto lg:block">

          <table className="w-full min-w-[850px] border-collapse">

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">

                <th className="w-10 px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      allSelected
                    }
                    onChange={
                      toggleSelectAll
                    }
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                    className="
                      h-3.5
                      w-3.5
                      cursor-pointer
                      rounded
                      border-slate-300
                      text-violet-600
                    "
                  />
                </th>

                <TableHeader>
                  User
                </TableHeader>

                <TableHeader>
                  User ID
                </TableHeader>

                <TableHeader>
                  Role
                </TableHeader>

                <TableHeader>
                  Business Unit
                </TableHeader>

                <TableHeader>
                  Region
                </TableHeader>

                <TableHeader>
                  Zone
                </TableHeader>

                <TableHeader center>
                  Actions
                </TableHeader>

              </tr>
            </thead>

            <tbody>

              {filteredUsers.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center"
                  >
                    <p className="text-xs font-medium text-slate-500">
                      No users found
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(
                  (user) => (
                    <tr
                      key={user.id}
                      onClick={() =>
                        onViewUser(
                          user
                        )
                      }
                      className="
                        cursor-pointer
                        border-b
                        border-slate-100
                        transition
                        last:border-b-0
                        hover:bg-violet-50/30
                      "
                    >

                      <td
                        className="px-3 py-3"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(
                            user.id
                          )}
                          onChange={() =>
                            toggleUser(
                              user.id
                            )
                          }
                          className="
                            h-3.5
                            w-3.5
                            cursor-pointer
                            rounded
                            border-slate-300
                            text-violet-600
                          "
                        />
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex min-w-[150px] items-center gap-2">

                          <UserAvatar
                            user={user}
                          />

                          <span className="block truncate text-[10px] font-medium text-slate-700">
                            {user.user}
                          </span>

                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <span className="whitespace-nowrap text-[9px] font-medium text-slate-600">
                          {user.userId}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <RoleBadge
                          role={
                            user.role
                          }
                        />
                      </td>

                      <td className="px-3 py-3">
                        <span className="block max-w-[130px] truncate text-[9px] text-slate-600">
                          {user.businessUnit ||
                            "-"}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <span className="text-[9px] text-slate-600">
                          {user.region ||
                            "-"}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <span className="text-[9px] text-slate-600">
                          {user.zone ||
                            "-"}
                        </span>
                      </td>

                      <td
                        className="px-3 py-3"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >
                        <div className="flex items-center justify-center gap-1">

                          <ActionButton
                            title="Edit User"
                            icon={
                              <Pencil
                                size={13}
                              />
                            }
                            onClick={() =>
                              onEditUser(
                                user
                              )
                            }
                          />

                          <ActionButton
                            title="More Actions"
                            icon={
                              <MoreVertical
                                size={13}
                              />
                            }
                            onClick={() =>
                              onMoreActions(
                                user
                              )
                            }
                          />

                        </div>
                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

        {/* MOBILE */}

        <div className="grid gap-2.5 p-2.5 lg:hidden">

          {filteredUsers.length ===
          0 ? (
            <div className="py-10 text-center">
              <p className="text-xs font-medium text-slate-500">
                No users found
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            filteredUsers.map(
              (user) => (
                <div
                  key={user.id}
                  onClick={() =>
                    onViewUser(
                      user
                    )
                  }
                  className="
                    cursor-pointer
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

                  <div className="flex items-start justify-between gap-2">

                    <div className="flex min-w-0 items-center gap-2">

                      <UserAvatar
                        user={user}
                      />

                      <div className="min-w-0">

                        <p className="truncate text-xs font-semibold text-slate-700">
                          {user.user}
                        </p>

                        <p className="mt-0.5 truncate text-[9px] text-slate-400">
                          {user.userId}
                        </p>

                      </div>

                    </div>

                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(
                        user.id
                      )}
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                      onChange={() =>
                        toggleUser(
                          user.id
                        )
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
                      "
                    />

                  </div>

                  <div className="mt-3">
                    <RoleBadge
                      role={
                        user.role
                      }
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2.5">

                    <InfoItem
                      label="Business Unit"
                      value={
                        user.businessUnit ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="Region"
                      value={
                        user.region ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="Zone"
                      value={
                        user.zone ||
                        "-"
                      }
                    />

                    <InfoItem
                      label="Role"
                      value={
                        user.role ||
                        "-"
                      }
                    />

                  </div>

                  <div
                    className="
                      mt-3
                      flex
                      justify-end
                      gap-1
                      border-t
                      border-slate-100
                      pt-2.5
                    "
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >

                    <ActionButton
                      title="View User"
                      icon={
                        <Eye size={13} />
                      }
                      onClick={() =>
                        onViewUser(
                          user
                        )
                      }
                    />

                    <ActionButton
                      title="Edit User"
                      icon={
                        <Pencil
                          size={13}
                        />
                      }
                      onClick={() =>
                        onEditUser(
                          user
                        )
                      }
                    />

                    <ActionButton
                      title="More Actions"
                      icon={
                        <MoreVertical
                          size={13}
                        />
                      }
                      onClick={() =>
                        onMoreActions(
                          user
                        )
                      }
                    />

                  </div>

                </div>
              )
            )
          )}

        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

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

          <p className="text-[10px] text-slate-500">

            Showing{" "}

            <span className="font-medium text-slate-700">
              {totalUsers === 0
                ? 0
                : (currentPage -
                    1) *
                    limit +
                  1}
            </span>

            {" "}to{" "}

            <span className="font-medium text-slate-700">
              {Math.min(
                currentPage *
                  limit,
                totalUsers
              )}
            </span>

            {" "}of{" "}

            <span className="font-medium text-slate-700">
              {totalUsers}
            </span>

            {" "}users

          </p>

          <div className="flex flex-wrap items-center gap-3">

            <div className="flex items-center gap-1">

              <PaginationButton
                disabled={
                  !hasPreviousPage
                }
                onClick={() =>
                  onPageChange(
                    currentPage - 1
                  )
                }
              >
                <ChevronLeft
                  size={13}
                />
              </PaginationButton>

              {pageNumbers.map(
                (
                  pageNumber,
                  index
                ) => {

                  if (
                    pageNumber ===
                    "..."
                  ) {
                    return (
                      <span
                        key={`dots-${index}`}
                        className="px-0.5 text-[10px] text-slate-400"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <PaginationButton
                      key={
                        pageNumber
                      }
                      active={
                        pageNumber ===
                        currentPage
                      }
                      onClick={() =>
                        onPageChange(
                          pageNumber
                        )
                      }
                    >
                      {
                        pageNumber
                      }
                    </PaginationButton>
                  );
                }
              )}

              <PaginationButton
                disabled={
                  !hasNextPage
                }
                onClick={() =>
                  onPageChange(
                    currentPage + 1
                  )
                }
              >
                <ChevronRight
                  size={13}
                />
              </PaginationButton>

            </div>

            <select
              value={limit}
              onChange={(e) =>
                onLimitChange(
                  Number(
                    e.target.value
                  )
                )
              }
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
              <option value={10}>
                10 per page
              </option>

              <option value={20}>
                20 per page
              </option>

              <option value={50}>
                50 per page
              </option>
            </select>

          </div>
        </div>

        {loading &&
          data.length > 0 && (
            <div className="border-t border-slate-100 px-3 py-2 text-center">
              <span className="text-[9px] text-slate-400">
                Loading users...
              </span>
            </div>
          )}

      </div>
    </div>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({
  value,
  onChange,
  options,
}) {
  return (
    <div className="relative min-w-0 xl:flex-1">

      <select
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="
          h-8
          w-full
          appearance-none
          rounded-lg
          border
          border-slate-200
          bg-white
          pl-2.5
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

        {options.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {option.label}
            </option>
          )
        )}

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

/* =========================================================
   FILTER BADGE
========================================================= */

function FilterBadge({ label }) {
  return (
    <span
      className="
        rounded-md
        bg-violet-50
        px-1.5
        py-0.5
        text-[8px]
        font-medium
        text-violet-600
      "
    >
      {label}
    </span>
  );
}

/* =========================================================
   TABLE HEADER
========================================================= */

function TableHeader({
  children,
  center = false,
}) {
  return (
    <th
      className={`
        px-3
        py-3
        text-[9px]
        font-semibold
        uppercase
        tracking-wide
        text-slate-500
        ${
          center
            ? "text-center"
            : "text-left"
        }
      `}
    >
      {children}
    </th>
  );
}

/* =========================================================
   USER AVATAR
========================================================= */

function UserAvatar({ user }) {
  const name =
    user?.user || "";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) => part[0]
    )
    .join("")
    .toUpperCase();

  const avatarColors = {
    TLM:
      "bg-violet-100 text-violet-600",

    SLM:
      "bg-blue-100 text-blue-600",

    FLM:
      "bg-orange-100 text-orange-600",

    MR:
      "bg-emerald-100 text-emerald-600",
  };

  return (
    <div
      className={`
        flex
        h-8
        w-8
        shrink-0
        items-center
        justify-center
        rounded-full
        text-[9px]
        font-semibold
        ${
          avatarColors[
            user?.role
          ] ||
          "bg-slate-100 text-slate-500"
        }
      `}
    >
      {initials || "U"}
    </div>
  );
}

/* =========================================================
   ROLE BADGE
========================================================= */

function RoleBadge({ role }) {
  const styles = {
    TLM:
      "border-violet-100 bg-violet-50 text-violet-600",

    SLM:
      "border-blue-100 bg-blue-50 text-blue-600",

    FLM:
      "border-orange-100 bg-orange-50 text-orange-600",

    MR:
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
        ${
          styles[role] ||
          "border-slate-100 bg-slate-50 text-slate-500"
        }
      `}
    >
      {role || "-"}
    </span>
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
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
}) {
  return (
    <div className="min-w-0">

      <p className="text-[8px] uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[10px] font-medium text-slate-600">
        {value || "-"}
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
  disabled = false,
  onClick = () => {},
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
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
            : disabled
            ? "cursor-not-allowed border border-transparent text-slate-300"
            : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50"
        }
      `}
    >
      {children}
    </button>
  );
}

export default UsersRolesContent;