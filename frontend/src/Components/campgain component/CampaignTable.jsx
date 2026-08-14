import React, { useEffect, useMemo, useState } from "react";
import {
  FaEye,
  FaEdit,
  FaEllipsisV,
  FaSearch,
  FaFilter,
  FaTimes,
} from "react-icons/fa";

function CampaignTable({ campaign, onSelect, onEdit }) {
  // =====================================================
  // FILTER STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [clientFilter, setClientFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [therapyFilter, setTherapyFilter] = useState("all");

  // =====================================================
  // SEARCH DEBOUNCE
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // =====================================================
  // GET UNIQUE CLIENTS
  // =====================================================

  const clients = useMemo(() => {
    const uniqueClients = new Map();

    campaign?.forEach((item) => {
      const clientId = item.client?._id;

      const clientName = item.client?.companyName || item.client?.name || "";

      if (clientId && clientName) {
        uniqueClients.set(clientId, clientName);
      }
    });

    return Array.from(uniqueClients.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [campaign]);

  // =====================================================
  // GET UNIQUE THERAPY AREAS
  // =====================================================

  const therapyAreas = useMemo(() => {
    return [
      ...new Set(campaign?.map((item) => item.therapyArea).filter(Boolean)),
    ];
  }, [campaign]);

  // =====================================================
  // FILTER CAMPAIGNS
  // =====================================================

  const filteredCampaigns = useMemo(() => {
    if (!Array.isArray(campaign)) {
      return [];
    }

    const searchValue = debouncedSearch.toLowerCase().trim();

    return campaign.filter((item) => {
      // -----------------------------------------------
      // SEARCH
      // -----------------------------------------------

      const matchesSearch =
        !searchValue ||
        item.name?.toLowerCase().includes(searchValue) ||
        item.campaignId?.toLowerCase().includes(searchValue) ||
        item.brand?.toLowerCase().includes(searchValue) ||
        item.therapyArea?.toLowerCase().includes(searchValue);

      // -----------------------------------------------
      // CLIENT
      // -----------------------------------------------

      const matchesClient =
        clientFilter === "all" || item.client?._id === clientFilter;

      // -----------------------------------------------
      // STATUS
      // -----------------------------------------------

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      // -----------------------------------------------
      // THERAPY AREA
      // -----------------------------------------------

      const matchesTherapy =
        therapyFilter === "all" || item.therapyArea === therapyFilter;

      return matchesSearch && matchesClient && matchesStatus && matchesTherapy;
    });
  }, [campaign, debouncedSearch, clientFilter, statusFilter, therapyFilter]);

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setClientFilter("all");
    setStatusFilter("all");
    setTherapyFilter("all");
  };

  // =====================================================
  // ACTIVE FILTER CHECK
  // =====================================================

  const hasActiveFilters =
    search ||
    clientFilter !== "all" ||
    statusFilter !== "all" ||
    therapyFilter !== "all";

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";

      case "paused":
        return "text-yellow-600 bg-yellow-100";

      case "archived":
        return "text-gray-600 bg-gray-100";

      case "draft":
        return "text-blue-600 bg-blue-100";

      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 mb-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-gray-800">All Campaigns</h2>

            <p className="text-xs text-gray-400 mt-1">
              Showing {filteredCampaigns.length} of {campaign?.length || 0}{" "}
              campaigns
            </p>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition"
            >
              <FaTimes size={12} />
              Clear Filters
            </button>
          )}
        </div>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="flex flex-wrap gap-3 items-center">
          {/* SEARCH */}

          <div className="relative">
            <FaSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={13}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="border border-gray-200 pl-9 pr-3 py-2 rounded-lg w-64 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
            />
          </div>

          {/* CLIENT */}

          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-600 outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">Client: All</option>

            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-600 outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">Status: All</option>

            <option value="active">Active</option>

            <option value="paused">Paused</option>

            <option value="archived">Archived</option>

            <option value="draft">Draft</option>
          </select>

          {/* THERAPY AREA */}

          <select
            value={therapyFilter}
            onChange={(e) => setTherapyFilter(e.target.value)}
            className="border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-600 outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">Therapy Area: All</option>

            {therapyAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          {/* FILTER COUNT */}

          <div className="flex items-center gap-2 text-gray-400 text-sm px-2">
            <FaFilter size={13} />

            <span>{filteredCampaigns.length} Results</span>
          </div>
        </div>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr className="text-left">
              <th className="py-3 px-4">Campaign Name</th>

              <th className="px-4">Client</th>

              <th className="px-4">Therapy Area</th>

              <th className="px-4">Doctors</th>

              <th className="px-4 w-[160px]">Completion</th>

              <th className="px-4">Status</th>

              <th className="px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((item, i) => (
                <tr
                  key={item._id || item.campaignId || i}
                  onClick={() => onSelect?.(item)}
                  className="border-b hover:bg-gray-50 cursor-pointer transition"
                >
                  {/* CAMPAIGN */}

                  <td className="py-4 px-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.name || "—"}
                      </p>

                      {item.campaignId && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.campaignId}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* CLIENT */}

                  <td className="px-4 whitespace-nowrap">
                    {item.client?.companyName || item.client?.name || "—"}
                  </td>

                  {/* THERAPY */}

                  <td className="px-4 whitespace-nowrap">
                    {item.therapyArea || "—"}
                  </td>

                  {/* DOCTORS */}

                  <td className="px-4 text-center">
                    {Array.isArray(item.doctors) ? item.doctors.length : 0}
                  </td>

                  {/* COMPLETION */}

                  <td className="px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              Math.max(Number(item.completion || 0), 0),
                              100,
                            )}%`,
                          }}
                        />
                      </div>

                      <span className="text-xs text-gray-500 w-10">
                        {item.completion || 0}%
                      </span>
                    </div>
                  </td>

                  {/* STATUS */}

                  <td className="px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs capitalize ${getStatusStyle(
                        item.status,
                      )}`}
                    >
                      {item.status || "unknown"}
                    </span>
                  </td>

                  {/* ACTIONS */}

                  <td className="px-4 align-middle">
                    <div className="flex justify-center items-center gap-1.5 h-full">
                      <button
                        type="button"
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect?.(item);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 active:scale-95"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(item);
                        }}
                        className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all duration-200 active:scale-95"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        title="More options"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95"
                      >
                        <FaEllipsisV className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaSearch className="text-gray-400" />
                    </div>

                    <p className="text-sm font-medium text-gray-600">
                      No campaigns found
                    </p>

                    <p className="text-xs text-gray-400">
                      Try changing your search or filters.
                    </p>

                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-indigo-600 hover:text-indigo-700 mt-1"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CampaignTable;
