import React from "react";
import { FaSearch, FaEye, FaEdit } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
function ClientsTable({ data, onSelect }) {
  const clients = data?.clientTable || [];
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full">
      {/* 🔹 Top Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800">All Clients</h2>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 text-sm w-[280px]">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              placeholder="Search by client name..."
              className="outline-none w-full text-gray-700"
            />
          </div>

          {/* Status */}
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
            <option>Status: All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          {/* Filter */}
          <button className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[1400px] table-fixed text-sm">
          {/* Header */}
          <thead className="border-b border-gray-200 text-gray-500">
            <tr>
              <th className="w-[260px] text-left px-6 py-5 font-semibold">
                Client Name
              </th>

              <th className="w-[180px] text-left px-6 py-5 font-semibold">
                Brand / Company
              </th>

              <th className="w-[180px] text-left px-6 py-5 font-semibold">
                Primary Contact
              </th>

              <th className="w-[260px] text-left px-6 py-5 font-semibold">
                Email
              </th>

              <th className="w-[170px] text-left px-6 py-5 font-semibold">
                Phone
              </th>

              <th className="w-[100px] text-center px-6 py-5 font-semibold">
                Campaigns
              </th>

              <th className="w-[100px] text-center px-6 py-5 font-semibold">
                Doctors
              </th>

              <th className="w-[120px] text-center px-6 py-5 font-semibold">
                Status
              </th>

              <th className="w-[130px] text-center px-6 py-5 font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="text-gray-700">
            {clients.map((c, i) => (
              <tr
                key={i}
                onClick={() => onSelect(c)}
                className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-xl font-semibold flex-shrink-0">
                      {c.companyName?.slice(0, 2).toUpperCase()}
                    </div>

                    <span className="font-medium">{c.companyName}</span>
                  </div>
                </td>

                <td className="px-6 py-6">{c.brandName}</td>

                <td className="px-6 py-6">{c.primaryContact}</td>

                <td className="px-6 py-6 text-indigo-600">{c.email}</td>

                <td className="px-6 py-6 whitespace-nowrap">{c.phone}</td>

                <td className="px-6 py-6 text-center">{c.totalCampaigns}</td>

                <td className="px-6 py-6 text-center">{c.totalDoctors}</td>

                <td className="px-6 py-6 text-center">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      c.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                <td className="px-6 py-6">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("View");
                      }}
                      className="p-2 rounded hover:bg-gray-100"
                    >
                      <FaEye size={14} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Edit");
                      }}
                      className="p-2 rounded hover:bg-gray-100"
                    >
                      <FaEdit size={14} />
                    </button>

                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded hover:bg-gray-100"
                    >
                      <FiMoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Footer */}
      <div className="flex flex-wrap justify-between items-center mt-6 text-sm text-gray-500 gap-4">
        <p>Showing 1 to 8 of 18 clients</p>

        <div className="flex items-center gap-3">
          <select className="border border-gray-200 px-2 py-1 rounded">
            <option>10 per page</option>
            <option>20 per page</option>
            <option>50 per page</option>
          </select>

          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded bg-indigo-50 text-indigo-600">
              1
            </button>
            <button className="px-3 py-1 border rounded">2</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientsTable;
