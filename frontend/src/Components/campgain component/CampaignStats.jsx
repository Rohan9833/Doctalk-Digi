import React from "react";
import { FaUsers, FaUserMd } from "react-icons/fa";
import { IoQrCodeSharp } from "react-icons/io5";
import { FaChartBar } from "react-icons/fa";
import { MdOutlineLeaderboard } from "react-icons/md";
import axios from "axios";

function CampaignStats({
  onCreateCampaign,
  totalDoctors,
  totalQrScans,
  totalCampaigns,
}) {
  // =====================================================
  // EXPORT ALL CAMPAIGNS
  // =====================================================

  const handleExportExcel = async () => {
    try {
      const response = await axios.get(
        "/api/campaigns/export",
        {
          responseType: "blob",
        }
      );

      // =================================================
      // CREATE BLOB
      // =================================================

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // =================================================
      // CREATE DOWNLOAD URL
      // =================================================

      const url = window.URL.createObjectURL(blob);

      // =================================================
      // CREATE DOWNLOAD LINK
      // =================================================

      const link = document.createElement("a");

      link.href = url;

      link.download = "all-campaigns.xlsx";

      document.body.appendChild(link);

      link.click();

      // =================================================
      // CLEANUP
      // =================================================

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Campaign Excel export error:",
        error
      );
    }
  };

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      title: "Total Campaigns",
      value: totalCampaigns,
      sub: "Active: 38 | Completed: 4",
      icon: <FaUsers />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Total Doctors",
      value: totalDoctors,
      sub: "Active: 1,102",
      icon: <FaUserMd />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "QR Scans",
      value: totalQrScans,
      sub: "↑ 18.6% vs last 7 days",
      icon: <IoQrCodeSharp />,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Quiz Attempts",
      value: "84,215",
      sub: "↑ 15.3% vs last 7 days",
      icon: <FaChartBar />,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Avg. Completion",
      value: "68.7%",
      sub: "↑ 2.4% vs last 7 days",
      icon: <MdOutlineLeaderboard />,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Campaigns
          </h1>

          <p className="text-sm text-gray-500">
            Manage all therapy area campaigns, quizzes,
            doctors, and performance.
          </p>
        </div>

        <div className="flex gap-3">
          {/* =================================================
              EXPORT EXCEL
          ================================================= */}

          <button
            onClick={handleExportExcel}
            className="border px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            Export (Excel)
          </button>

          {/* =================================================
              CREATE CAMPAIGN
          ================================================= */}

          <button
            onClick={onCreateCampaign}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
          >
            + Create Campaign
          </button>
        </div>
      </div>

      {/* =================================================
          CARDS
      ================================================= */}

      <div className="grid grid-cols-6 gap-4">
        {/* =================================================
            NORMAL CARDS
        ================================================= */}

        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-sm flex gap-3 items-center"
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-lg ${item.bg}`}
            >
              <span className={item.color}>
                {item.icon}
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                {item.title}
              </p>

              <h2 className="text-lg font-semibold">
                {item.value}
              </h2>

              <p className="text-xs text-gray-400">
                {item.sub}
              </p>
            </div>
          </div>
        ))}

        {/* =================================================
            SPECIAL LAST CARD
        ================================================= */}

        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs text-gray-500">
              ↑ 2.4% vs last 7 days
            </p>
          </div>

          <div className="flex gap-2 mt-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500"></div>

            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500"></div>

            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600"></div>

            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignStats;