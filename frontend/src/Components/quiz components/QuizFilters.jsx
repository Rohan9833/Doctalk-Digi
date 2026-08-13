import React, { useEffect, useState } from "react";

function QuizFilters({
  data,
  search,
  setSearch,
  therapyArea,
  setTherapyArea,
  client,
  setClient,
  status,
  setStatus,
  setPage,
}) {
  // ==============================
  // LOCAL SEARCH INPUT
  // ==============================

  const [searchInput, setSearchInput] = useState(search || "");

  // ==============================
  // DEBOUNCE
  // ==============================

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Debounced search:", searchInput);

      setSearch(searchInput.trim());
      setPage(1);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput, setSearch, setPage]);

  // ==============================
  // DROPDOWN DATA
  // ==============================

  const therapyAreas =
    data?.therapyAreaForDropdown || [];

  const clients =
    data?.clientForDropdown || [];

  const statuses =
    data?.statusForDropdown || [];

  // ==============================
  // RESET
  // ==============================

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");

    setTherapyArea("All");
    setClient("All");
    setStatus("All");

    setPage(1);
  };

  const hasFilters =
    searchInput.trim() !== "" ||
    therapyArea !== "All" ||
    client !== "All" ||
    status !== "All";

  // ==============================
  // UI
  // ==============================

  return (
    <div className="mb-5">
      <div className="flex flex-wrap gap-3">

        {/* ================= SEARCH ================= */}

        <input
          type="text"
          placeholder="Search quizzes..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          className="
            w-[300px]
            h-12
            px-4
            border
            border-gray-300
            rounded-xl
            bg-white
            outline-none
            focus:border-indigo-500
            text-sm
          "
        />

        {/* ================= THERAPY AREA ================= */}

        <select
          value={therapyArea}
          onChange={(e) => {
            setTherapyArea(e.target.value);
            setPage(1);
          }}
          className="
            h-12
            px-4
            border
            border-gray-300
            rounded-xl
            bg-white
            outline-none
            text-sm
            min-w-[190px]
          "
        >
          <option value="All">
            Therapy Area: All
          </option>

          {therapyAreas.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {item._id}
            </option>
          ))}
        </select>

        {/* ================= CLIENT ================= */}

        <select
          value={client}
          onChange={(e) => {
            setClient(e.target.value);
            setPage(1);
          }}
          className="
            h-12
            px-4
            border
            border-gray-300
            rounded-xl
            bg-white
            outline-none
            text-sm
            min-w-[160px]
          "
        >
          <option value="All">
            Client: All
          </option>

          {clients.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {item._id}
            </option>
          ))}
        </select>

        {/* ================= STATUS ================= */}

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="
            h-12
            px-4
            border
            border-gray-300
            rounded-xl
            bg-white
            outline-none
            text-sm
            min-w-[140px]
          "
        >
          <option value="All">
            Status: All
          </option>

          {statuses.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {item._id}
            </option>
          ))}
        </select>

        {/* ================= RESET ================= */}

        <button
          onClick={resetFilters}
          className="
            h-12
            px-5
            rounded-xl
            border
            border-indigo-300
            text-indigo-600
            hover:bg-indigo-50
            text-sm
            transition
          "
        >
          {hasFilters ? "Reset Filters" : "Filters"}
        </button>

      </div>
    </div>
  );
}

export default QuizFilters;