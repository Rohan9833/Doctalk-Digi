import React, { useEffect, useState } from "react";
import axios from "axios";

import UsersRolesHeader from "../Components/UsersRoles/UsersRolesHeader";
import UsersRolesContent from "../Components/UsersRoles/UsersRolesContent";
import UserDetails from "../Components/UsersRoles/UserDetails";

function UsersRoles() {
  // =====================================================
  // API STATE
  // =====================================================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // USER COUNTS
  // =====================================================

  const [counts, setCounts] = useState({
    TLM: 0,
    SLM: 0,
    FLM: 0,
    MR: 0,
    total: 0,
  });

  // =====================================================
  // PAGINATION STATE
  // =====================================================

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalUsers: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [role, setRole] = useState("all");

  const [businessUnit, setBusinessUnit] =
    useState("all");

  const [region, setRegion] =
    useState("all");

  // =====================================================
  // SELECTED USER
  // =====================================================

  const [selectedUser, setSelectedUser] =
    useState(null);

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:2468/api/user/getalluser",
        {
          params: {
            page,
            limit,
          },
        }
      );

      const data = response.data;

      console.log(
        "Users API response:",
        data
      );

      // =================================================
      // USERS
      // =================================================

      setUsers(data.users || []);

      // =================================================
      // COUNTS
      // =================================================

      setCounts(
        data.counts || {
          TLM: 0,
          SLM: 0,
          FLM: 0,
          MR: 0,
          total: 0,
        }
      );

      // =================================================
      // PAGINATION
      // =================================================

      setPagination(
        data.pagination || {
          currentPage: page,
          limit,
          totalUsers: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );
    } catch (error) {
      console.error(
        "Failed to fetch users:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to fetch users"
      );

      setUsers([]);

      setCounts({
        TLM: 0,
        SLM: 0,
        FLM: 0,
        MR: 0,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH WHEN PAGE / LIMIT CHANGES
  // =====================================================

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  // =====================================================
  // PAGINATION HANDLERS
  // =====================================================

  const handlePageChange = (newPage) => {
    if (newPage < 1) {
      return;
    }

    if (
      pagination.totalPages > 0 &&
      newPage > pagination.totalPages
    ) {
      return;
    }

    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    const parsedLimit = Number(
      newLimit
    );

    if (
      ![10, 20, 50].includes(
        parsedLimit
      )
    ) {
      return;
    }

    // Reset page when limit changes
    setPage(1);

    setLimit(parsedLimit);
  };

  // =====================================================
  // HEADER ACTIONS
  // =====================================================

  const handleImportUsers = () => {
    console.log("Import users");
  };

  const handleAddUser = () => {
    console.log("Add new user");
  };

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const handleReset = () => {
    setRole("all");

    setBusinessUnit("all");

    setRegion("all");

    // Reset pagination as well
    setPage(1);

    console.log(
      "Filters reset"
    );
  };

  // =====================================================
  // USER ACTIONS
  // =====================================================

  const handleViewUser = (user) => {
    setSelectedUser({
      user: user.user,
      userId: user.userId,
      role: user.role,
      businessUnit:
        user.businessUnit,
      region: user.region,
      zone: user.zone,
    });
  };

  const handleEditUser = (user) => {
    console.log(
      "Edit user:",
      user
    );
  };

  const handleMoreActions = (user) => {
    console.log(
      "More actions:",
      user
    );
  };

  // =====================================================
  // USER DETAILS ACTIONS
  // =====================================================

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  const handleResetPassword = (
    user
  ) => {
    console.log(
      "Reset password:",
      user
    );
  };

  const handleResendInvitation = (
    user
  ) => {
    console.log(
      "Resend invitation:",
      user
    );
  };

  const handleDeactivateUser = (
    user
  ) => {
    console.log(
      "Deactivate user:",
      user
    );
  };

  const handleDeleteUser = (
    user
  ) => {
    console.log(
      "Delete user:",
      user
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen w-full bg-slate-50/30">
      <div className="w-full space-y-3 p-3 sm:p-4 lg:p-5">

        {/* =================================================
            HEADER
        ================================================= */}

        <UsersRolesHeader
          counts={counts}
          onImportUsers={
            handleImportUsers
          }
          onAddUser={
            handleAddUser
          }
        />

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              rounded-lg
              border
              border-red-200
              bg-red-50
              px-3
              py-2
              text-xs
              text-red-600
            "
          >
            {error}
          </div>
        )}

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-3
            xl:grid-cols-[minmax(0,1fr)_320px]
            2xl:grid-cols-[minmax(0,1fr)_330px]
          "
        >

          {/* =================================================
              USERS TABLE / CARDS
          ================================================= */}

          <main className="min-w-0">
            <UsersRolesContent
              data={users}
              loading={loading}


              role={role}
              setRole={setRole}

              businessUnit={
                businessUnit
              }
              setBusinessUnit={
                setBusinessUnit
              }

              region={region}
              setRegion={setRegion}


              pagination={
                pagination
              }
              onPageChange={
                handlePageChange
              }
              onLimitChange={
                handleLimitChange
              }


              onViewUser={
                handleViewUser
              }
              onEditUser={
                handleEditUser
              }
              onMoreActions={
                handleMoreActions
              }
            />
          </main>

          {/* =================================================
              USER DETAILS
          ================================================= */}

          <aside className="min-w-0">
            <UserDetails
              user={selectedUser}
              onClose={
                handleCloseDetails
              }
              onEditUser={
                handleEditUser
              }
              onResetPassword={
                handleResetPassword
              }
              onResendInvitation={
                handleResendInvitation
              }
              onDeactivateUser={
                handleDeactivateUser
              }
              onDeleteUser={
                handleDeleteUser
              }
            />
          </aside>

        </div>
      </div>
    </div>
  );
}

export default UsersRoles;