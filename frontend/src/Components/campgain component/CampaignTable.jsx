import React from "react";
import { FaEye, FaEdit, FaEllipsisV } from "react-icons/fa";

const Form_Mode = {
  CREATE: "create",
  EDIT: "edit",
};

function CampaignTable({ campaign, onSelect, onEdit }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="font-semibold mb-4">All Campaigns</h2>

      {/* 🔥 SCROLL WRAPPER */}
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm">
          {/* HEADER */}
          <thead className="text-gray-500 border-b">
            <tr className="text-left">
              <th className="py-3 px-4">Campaign Name</th>
              <th className="px-4">Client</th>
              <th className="px-4">Therapy Area</th>
              <th className="px-4">Doctors</th>
              {/* <th className="px-4">QR Scans</th>
              <th className="px-4">Attempts</th> */}
              <th className="px-4 w-[160px]">Completion</th>
              <th className="px-4">Status</th>
              <th className="px-4 text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {campaign?.map((item, i) => (
              <tr
                key={i}
                onClick={() => onSelect(item)}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-4 px-4 whitespace-nowrap">{item.name}</td>

                <td className="px-4 whitespace-nowrap">
                  {item.client?.companyName || ""}
                </td>

                <td className="px-4 whitespace-nowrap">{item.therapyArea}</td>

                <td className="px-4 text-center">{item.doctors.length || 0}</td>

                {/* <td className="px-4 text-center">{item.scans}</td>

                <td className="px-4 text-center">{item.attempts}</td> */}

                {/* 🔥 PROGRESS */}
                <td className="px-4">
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${item.completion}%` }}
                    ></div>
                  </div>
                </td>

                {/* STATUS */}
                <td className="px-4">
                  <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">
                    {item.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-4 align-middle">
                  <div className="flex justify-center items-center gap-1.5 h-full">
                    {/* View Button */}
                    <button
                      title="View"
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl transition-all duration-200 active:scale-95"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>

                    {/* Edit Button */}
                    <button
                      title="Edit"
                      className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl transition-all duration-200 active:scale-95"
                      onClick={() => onEdit(item)}
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>

                    {/* More Options Button */}
                    <button
                      title="More options"
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 active:scale-95"
                    >
                      <FaEllipsisV className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CampaignTable;
