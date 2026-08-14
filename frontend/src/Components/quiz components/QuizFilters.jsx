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
  const [searchInput, setSearchInput] = useState(search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Debounced search:", searchInput);

      setSearch(searchInput.trim());
      setPage(1);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput, setSearch, setPage]);

  const therapyAreas = data?.therapyAreaForDropdown || [];
  const clients = data?.clientForDropdown || [];
  const statuses = data?.statusForDropdown || [];

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

  return (
    <div className="mb-5 w-full">
      <div className="flex items-center gap-2">

        {/* ================= SEARCH ================= */}

        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          className="
            w-[155px]
            h-[32px]
            px-2.5
            border
            border-gray-300
            rounded-md
            bg-white
            outline-none
            focus:border-indigo-500
            text-[11px]
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
            w-[150px]
            h-[32px]
            px-2
            border
            border-gray-300
            rounded-md
            bg-white
            outline-none
            text-[11px]
            cursor-pointer
            focus:border-indigo-500
          "
        >
          <option value="All">Therapy: All</option>

          {therapyAreas.map((item) => (
            <option key={item._id} value={item._id}>
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
            w-[125px]
            h-[32px]
            px-2
            border
            border-gray-300
            rounded-md
            bg-white
            outline-none
            text-[11px]
            cursor-pointer
            focus:border-indigo-500
          "
        >
          <option value="All">Client: All</option>

          {clients.map((item) => (
            <option key={item._id} value={item._id}>
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
            w-[115px]
            h-[32px]
            px-2
            border
            border-gray-300
            rounded-md
            bg-white
            outline-none
            text-[11px]
            cursor-pointer
            focus:border-indigo-500
          "
        >
          <option value="All">Status: All</option>

          {statuses.map((item) => (
            <option key={item._id} value={item._id}>
              {item._id}
            </option>
          ))}
        </select>

        {/* ================= RESET ================= */}

        <button
          onClick={resetFilters}
          className="
            w-[82px]
            h-[32px]
            px-2
            rounded-md
            border
            border-indigo-300
            text-indigo-600
            hover:bg-indigo-50
            text-[11px]
            font-medium
            whitespace-nowrap
          "
        >
          {hasFilters ? "Reset" : "Filters"}
        </button>

      </div>
    </div>
  );
}

export default QuizFilters;