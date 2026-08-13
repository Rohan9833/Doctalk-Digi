import React from "react";
import { FaTimes, FaGlobe, FaChartBar } from "react-icons/fa";
import { MdCampaign, MdPeopleAlt } from "react-icons/md";
import { IoQrCodeSharp } from "react-icons/io5";

function ClientDetails({ client }) {
  if (!client) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 text-gray-400">
        Select a client to view details
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 w-full">

      {/* 🔹 Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Client Details
        </h2>
        <FaTimes className="text-gray-400 cursor-pointer" />
      </div>

      {/* 🔹 Top Info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-lg font-bold text-lg">
          {client.companyName?.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">
            {client.companyName}
          </h3>
        </div>

        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
          {client.status}
        </span>
      </div>

      {/* 🔹 Details */}
      <div className="text-sm text-gray-600 space-y-3">

        <div className="flex justify-between">
          <span>Brand / Company</span>
          <span className="text-gray-800">{client.companyName}</span>
        </div>

        <div className="flex justify-between">
          <span>Primary Contact</span>
          <span className="text-gray-800">{client.phone}</span>
        </div>

        <div className="flex justify-between">
          <span>Email</span>
          <span className="text-indigo-600">{client.email}</span>
        </div>

        <div className="flex justify-between">
          <span>Phone</span>
          <span className="text-gray-800">{client.phone}</span>
        </div>

        <div className="flex justify-between">
          <span>Address</span>
          <span className="text-right text-gray-800 max-w-[180px]">
            301, Business Park, Andheri (E), Mumbai
          </span>
        </div>

        <div className="flex justify-between">
          <span>Country</span>
          <span className="text-gray-800">India</span>
        </div>

        <div className="flex justify-between">
          <span>Website</span>
          <span className="text-indigo-600">www.abcpharma.com</span>
        </div>

        <div className="flex justify-between">
          <span>Status</span>
          <span className="text-gray-800">{client.status}</span>
        </div>

        <div className="flex justify-between">
          <span>Created Date</span>
          <span className="text-gray-800">12 Jan 2025</span>
        </div>

        <div className="flex justify-between">
          <span>Created By</span>
          <span className="text-gray-800">Developer Admin</span>
        </div>
      </div>

      {/* 🔹 Divider */}
      <hr />

      {/* 🔹 Summary */}
      <div className="space-y-4">

        <h3 className="text-sm font-semibold text-gray-700">Summary</h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MdCampaign className="text-purple-500" />
            <span className="text-sm text-gray-600">Total Campaigns</span>
          </div>
          <span className="font-medium">{client.totalCampaigns}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MdPeopleAlt className="text-green-500" />
            <span className="text-sm text-gray-600">Total Doctors</span>
          </div>
          <span className="font-medium">{client.totalDoctors}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IoQrCodeSharp className="text-orange-500" />
            <span className="text-sm text-gray-600">Total QR Scans</span>
          </div>
          <span className="font-medium">{client.totalScans}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaChartBar className="text-indigo-500" />
            <span className="text-sm text-gray-600">Total Quiz Attempts</span>
          </div>
          <span className="font-medium">18,532</span>
        </div>

      </div>

      {/* 🔹 Button */}
      <button className="w-full border border-indigo-300 text-indigo-600 py-2 rounded-lg text-sm hover:bg-indigo-50 transition">
        View All Campaigns
      </button>

    </div>
  );
}

export default ClientDetails;