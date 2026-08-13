import React from "react";
import * as XLSX from "xlsx";
import { FaUsers, FaChartBar } from "react-icons/fa";
import { MdCampaign, MdPeopleAlt } from "react-icons/md";
import { IoQrCodeSharp } from "react-icons/io5";

function ClientsUpperSection({ data }) {
  // const stats = [
  //   {
  //     title: "Total Clients",
  //     value: "18",
  //     sub: [
  //       { text: "Active: ", color: "text-gray-500" },
  //       { text: "16", color: "text-green-600" },
  //       { text: " | Inactive: ", color: "text-gray-500" },
  //       { text: "2", color: "text-red-500" },
  //     ],
  //     icon: <FaUsers />,
  //     bg: "bg-purple-100",
  //     iconColor: "text-purple-600",
  //   },
  //   {
  //     title: "Total Campaigns",
  //     value: "42",
  //     sub: [
  //       { text: "Active: ", color: "text-gray-500" },
  //       { text: "38", color: "text-green-600" },
  //       { text: " | Completed: ", color: "text-gray-500" },
  //       { text: "4", color: "text-gray-800" },
  //     ],
  //     icon: <MdCampaign />,
  //     bg: "bg-blue-100",
  //     iconColor: "text-blue-600",
  //   },
  //   {
  //     title: "Total Doctors",
  //     value: "1,248",
  //     sub: [
  //       { text: "Active: ", color: "text-gray-500" },
  //       { text: "1,102", color: "text-green-600" },
  //       { text: " | Inactive: ", color: "text-gray-500" },
  //       { text: "146", color: "text-red-500" },
  //     ],
  //     icon: <MdPeopleAlt />,
  //     bg: "bg-green-100",
  //     iconColor: "text-green-600",
  //   },
  //   {
  //     title: "Total QR Scans",
  //     value: "58,732",
  //     sub: [
  //       { text: "↑ 18.6%", color: "text-green-600" },
  //       { text: " vs last 7 days", color: "text-gray-500" },
  //     ],
  //     icon: <IoQrCodeSharp />,
  //     bg: "bg-orange-100",
  //     iconColor: "text-orange-600",
  //   },
  //   {
  //     title: "Total Quiz Attempts",
  //     value: "84,215",
  //     sub: [
  //       { text: "↑ 15.3%", color: "text-green-600" },
  //       { text: " vs last 7 days", color: "text-gray-500" },
  //     ],
  //     icon: <FaChartBar />,
  //     bg: "bg-purple-100",
  //     iconColor: "text-purple-600",
  //   },
  // ];

  const stats = [
    {
      title: "Total Clients",
      value: data?.totalClients?.count ?? 0,
      sub: [
        { text: "Active: ", color: "text-gray-500" },
        {
          text: data?.totalClients?.activeClients ?? 0,
          color: "text-green-600",
        },
        { text: " | Inactive: ", color: "text-gray-500" },
        {
          text: data?.totalClients?.inactiveClients ?? 0,
          color: "text-red-500",
        },
      ],
      icon: <FaUsers />,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },

    {
      title: "Total Campaigns",
      value: data?.totalCampaigns?.totalCampaigns ?? 0,
      sub: [
        { text: "Active: ", color: "text-gray-500" },
        {
          text: data?.totalCampaigns?.activeCampaigns ?? 0,
          color: "text-green-600",
        },
        { text: " | Inactive: ", color: "text-gray-500" },
        {
          text: data?.totalCampaigns?.InActiveCampaigns ?? 0,
          color: "text-red-500",
        },
      ],
      icon: <MdCampaign />,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },

    {
      title: "Total Doctors",
      value: data?.totalDoctors?.totalDoctors ?? 0,
      sub: [
        { text: "Active: ", color: "text-gray-500" },
        {
          text: data?.totalDoctors?.activeDoctors ?? 0,
          color: "text-green-600",
        },
        { text: " | Inactive: ", color: "text-gray-500" },
        {
          text: data?.totalDoctors?.InActiveDoctors ?? 0,
          color: "text-red-500",
        },
      ],
      icon: <MdPeopleAlt />,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },

    {
  title: "Total QR Scans",
  value:
    data?.clientTable?.reduce(
      (sum, client) => sum + (client.totalScans || 0),
      0
    ) ?? 0,
  sub: [{ text: "Total Scans", color: "text-gray-500" }],
  icon: <IoQrCodeSharp />,
  bg: "bg-orange-100",
  iconColor: "text-orange-600",
},

    {
      title: "Total Quiz Attempts",
      value: "-",
      sub: [{ text: "Coming Soon", color: "text-gray-500" }],
      icon: <FaChartBar />,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];
  const exportToExcel = () => {
    const clients = data?.clientTable || [];

    if (clients.length === 0) {
      alert("No client data available");
      return;
    }

    const excelData = clients.map((client) => ({
      "Client ID": client.clientId,
      "Company Name": client.companyName,
      "Brand Name": client.brandName,
      "Primary Contact": client.primaryContact,
      Email: client.email,
      Phone: client.phone,
      City: client.city,
      State: client.state,
      Website: client.website,
      Status: client.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");

    XLSX.writeFile(
      workbook,
      `Clients_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };
  return (
    <div className="flex flex-col gap-6 ">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center">
        {/* Left */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Clients</h1>
          <p className="text-sm text-gray-500">Dashboard &gt; Clients</p>
        </div>

        {/* Right */}
        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            Export Clients (Excel)
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
            + Add New Client
          </button>
        </div>
      </div>

      {/* 🔹 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-3"
          >
            {/* Top */}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg ${item.bg}`}
              >
                <span className={`${item.iconColor} text-lg`}>{item.icon}</span>
              </div>

              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <h2 className="text-xl font-semibold text-gray-800">
                  {item.value} 
                </h2>
              </div>
            </div>

            {/* Bottom (COLORED TEXT FIXED) */}
            <p className="text-xs">
              {item.sub.map((part, i) => (
                <span key={i} className={part.color}>
                  {part.text}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientsUpperSection;
