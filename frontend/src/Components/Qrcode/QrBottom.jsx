import React, { useState } from "react";
import {
  Search,
  Download,
  Users,
  FileText,
  Eye,
  Pencil,
  RefreshCcw,
  Pause,
  MoreVertical,
  ExternalLink,
  Copy,
  ChevronLeft,
  ChevronRight,
  QrCode,
} from "lucide-react";

const qrData = [
  {
    id: 1,
    doctor: "Dr. Manohar Lele - Mumbai",
    doctorName: "Dr. Manohar Lele",
    shortUrl: "/q/8F32kL",
    destination: "/dr-manohar-lele-mumbai",
    status: "Active",
    scans: "2,345",
    uniqueScans: "1,876",
    lastScanned: "2 mins ago",
    location: "Mumbai, MH",
  },
  {
    id: 2,
    doctor: "Dr. Priya Shah - Pune",
    doctorName: "Dr. Priya Shah",
    shortUrl: "/q/b7G56mN",
    destination: "/dr-priya-shah-pune",
    status: "Active",
    scans: "1,987",
    uniqueScans: "1,543",
    lastScanned: "10 mins ago",
    location: "Pune, MH",
  },
  {
    id: 3,
    doctor: "Dr. Amit Verma - Nagpur",
    doctorName: "Dr. Amit Verma",
    shortUrl: "/q/c9H78pQ",
    destination: "/dr-amit-verma-nagpur",
    status: "Active",
    scans: "1,456",
    uniqueScans: "1,102",
    lastScanned: "15 mins ago",
    location: "Nagpur, MH",
  },
  {
    id: 4,
    doctor: "Dr. Neha Iyer - Bangalore",
    doctorName: "Dr. Neha Iyer",
    shortUrl: "/q/d3K91sT",
    destination: "/dr-neha-iyer-bangalore",
    status: "Active",
    scans: "1,234",
    uniqueScans: "987",
    lastScanned: "20 mins ago",
    location: "Bengaluru, KA",
  },
  {
    id: 5,
    doctor: "Dr. Rajesh Gupta - Delhi",
    doctorName: "Dr. Rajesh Gupta",
    shortUrl: "/q/e5L23wV",
    destination: "/dr-rajesh-gupta-delhi",
    status: "Paused",
    scans: "987",
    uniqueScans: "832",
    lastScanned: "1 hour ago",
    location: "Delhi, DL",
  },
];

function QRCodeTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredData = qrData.filter(
    (item) =>
      item.doctor.toLowerCase().includes(search.toLowerCase()) ||
      item.doctorName.toLowerCase().includes(search.toLowerCase())
  );

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className=" bg-[#f8f9fc] p-3">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">

        {/* =====================================================
            MAIN TABLE
        ====================================================== */}

        <div className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)]">

          {/* ================= TABLE HEADER ================= */}

          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">

            {/* Title */}

            <h2 className="shrink-0 text-[14px] font-semibold text-[#17203a]">
              All QR Codes
            </h2>

            {/* Search */}

            <div className="relative max-w-[240px] flex-1">
              <Search
                size={14}
                className="
                  absolute
                  left-2.5
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by doctor name, QR name..."
                className="
                  h-[30px]
                  w-full
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  pl-8
                  pr-2
                  text-[10px]
                  text-gray-600
                  outline-none
                  placeholder:text-gray-400
                  focus:border-purple-400
                "
              />
            </div>

            {/* Header Actions */}

            <div className="flex shrink-0 items-center gap-2">

              <button
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-medium
                  text-gray-600
                  transition
                  hover:bg-gray-50
                "
              >
                <Download size={13} />
                Export Excel
              </button>

              <button
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-medium
                  text-gray-600
                  transition
                  hover:bg-gray-50
                "
              >
                <Download size={13} />
                Download All QR (ZIP)
              </button>

            </div>
          </div>


          {/* ================= TABLE ================= */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse">

              {/* ================= TABLE HEAD ================= */}

              <thead>
                <tr className="border-b border-gray-100 bg-[#fafbfc]">

                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600">
                    QR Name
                    <span className="ml-1 text-gray-400">⌄</span>
                  </th>

                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600">
                    Doctor Name
                  </th>

                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600">
                    Short URL
                  </th>

                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600">
                    Destination URL
                  </th>

                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600">
                    Total Scans
                  </th>

                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600">
                    Unique Scans
                  </th>

                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600">
                    Last Scanned
                  </th>

                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-600">
                    Actions
                  </th>

                </tr>
              </thead>


              {/* ================= TABLE BODY ================= */}

              <tbody>
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="
                      border-b
                      border-gray-100
                      transition
                      hover:bg-gray-50/70
                    "
                  >

                    {/* QR Name */}

                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">

                        <div
                          className="
                            flex
                            h-[32px]
                            w-[32px]
                            shrink-0
                            items-center
                            justify-center
                            rounded
                            border
                            border-gray-200
                            bg-white
                          "
                        >
                          <QrCode
                            size={24}
                            strokeWidth={1.5}
                            className="text-gray-800"
                          />
                        </div>

                        <span className="whitespace-nowrap text-[10px] font-medium text-gray-700">
                          {item.doctor}
                        </span>

                      </div>
                    </td>


                    {/* Doctor */}

                    <td className="px-3 py-2.5">
                      <span className="whitespace-nowrap text-[10px] text-gray-600">
                        {item.doctorName}
                      </span>
                    </td>


                    {/* Short URL */}

                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">

                        <span className="whitespace-nowrap text-[10px] font-medium text-indigo-500">
                          {item.shortUrl}
                        </span>

                        <button
                          onClick={() => copyUrl(item.shortUrl)}
                          className="text-gray-400 transition hover:text-indigo-500"
                          title="Copy"
                        >
                          <Copy size={11} />
                        </button>

                      </div>
                    </td>


                    {/* Destination URL */}

                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">

                        <span className="whitespace-nowrap text-[10px] font-medium text-indigo-500">
                          {item.destination}
                        </span>

                        <ExternalLink
                          size={11}
                          className="shrink-0 text-gray-400"
                        />

                      </div>
                    </td>


                    {/* Status */}

                    <td className="px-3 py-2.5">

                      {item.status === "Active" ? (
                        <span
                          className="
                            inline-flex
                            rounded-md
                            border
                            border-green-200
                            bg-green-50
                            px-2
                            py-1
                            text-[9px]
                            font-medium
                            text-green-600
                          "
                        >
                          Active
                        </span>
                      ) : (
                        <span
                          className="
                            inline-flex
                            rounded-md
                            border
                            border-orange-200
                            bg-orange-50
                            px-2
                            py-1
                            text-[9px]
                            font-medium
                            text-orange-500
                          "
                        >
                          Paused
                        </span>
                      )}

                    </td>


                    {/* Total Scans */}

                    <td className="px-3 py-2.5">
                      <span className="text-[10px] font-medium text-gray-700">
                        {item.scans}
                      </span>
                    </td>


                    {/* Unique Scans */}

                    <td className="px-3 py-2.5">
                      <span className="text-[10px] font-medium text-gray-700">
                        {item.uniqueScans}
                      </span>
                    </td>


                    {/* Last Scanned */}

                    <td className="px-3 py-2.5">
                      <div className="whitespace-nowrap">

                        <p className="text-[10px] font-medium text-gray-700">
                          {item.lastScanned}
                        </p>

                        <p className="mt-0.5 text-[9px] text-gray-400">
                          {item.location}
                        </p>

                      </div>
                    </td>


                    {/* Actions */}

                    <td className="px-3 py-2.5">

                      <div className="flex items-center gap-1">

                        {/* View */}

                        <button
                          className="
                            flex
                            h-[23px]
                            w-[23px]
                            items-center
                            justify-center
                            rounded
                            border
                            border-indigo-200
                            bg-indigo-50
                            text-indigo-500
                            transition
                            hover:bg-indigo-100
                          "
                          title="View"
                        >
                          <Eye size={12} />
                        </button>


                        {/* Edit */}

                        <button
                          className="
                            flex
                            h-[23px]
                            w-[23px]
                            items-center
                            justify-center
                            rounded
                            border
                            border-blue-200
                            bg-blue-50
                            text-blue-500
                            transition
                            hover:bg-blue-100
                          "
                          title="Edit"
                        >
                          <Pencil size={12} />
                        </button>


                        {/* Regenerate */}

                        <button
                          className="
                            flex
                            h-[23px]
                            w-[23px]
                            items-center
                            justify-center
                            rounded
                            border
                            border-orange-200
                            bg-orange-50
                            text-orange-500
                            transition
                            hover:bg-orange-100
                          "
                          title="Regenerate"
                        >
                          <RefreshCcw size={12} />
                        </button>


                        {/* Pause */}

                        <button
                          className="
                            flex
                            h-[23px]
                            w-[23px]
                            items-center
                            justify-center
                            rounded
                            border
                            border-orange-200
                            bg-orange-50
                            text-orange-500
                            transition
                            hover:bg-orange-100
                          "
                          title="Pause"
                        >
                          <Pause size={12} />
                        </button>


                        {/* More */}

                        <button
                          className="
                            flex
                            h-[23px]
                            w-[23px]
                            items-center
                            justify-center
                            rounded
                            text-gray-400
                            transition
                            hover:bg-gray-100
                            hover:text-gray-600
                          "
                        >
                          <MoreVertical size={14} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}


                {/* Empty State */}

                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      className="py-10 text-center text-[10px] text-gray-400"
                    >
                      No QR codes found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>
          </div>


          {/* ================= PAGINATION ================= */}

          <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2.5">

            {/* Left */}

            <div className="flex items-center gap-3">

              <span className="text-[10px] text-gray-500">
                Showing 1 to 10 of 256 entries
              </span>

              <select
                className="
                  h-[28px]
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  px-2
                  text-[10px]
                  text-gray-600
                  outline-none
                  focus:border-purple-400
                "
              >
                <option>10 per page</option>
                <option>20 per page</option>
                <option>50 per page</option>
              </select>

            </div>


            {/* Right */}

            <div className="flex items-center gap-1">

              <button
                className="
                  flex
                  h-[28px]
                  w-[28px]
                  items-center
                  justify-center
                  text-gray-400
                  transition
                  hover:bg-gray-50
                "
              >
                <ChevronLeft size={14} />
              </button>


              {[1, 2, 3].map((number) => (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={`
                    flex
                    h-[28px]
                    w-[28px]
                    items-center
                    justify-center
                    rounded-md
                    border
                    text-[10px]
                    font-medium
                    transition
                    ${
                      page === number
                        ? "border-purple-200 bg-purple-50 text-purple-600"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  {number}
                </button>
              ))}


              <span className="px-1 text-[10px] text-gray-400">
                ...
              </span>


              <button
                onClick={() => setPage(26)}
                className="
                  flex
                  h-[28px]
                  w-[28px]
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-gray-200
                  text-[10px]
                  font-medium
                  text-gray-600
                  transition
                  hover:bg-gray-50
                "
              >
                26
              </button>


              <button
                className="
                  flex
                  h-[28px]
                  w-[28px]
                  items-center
                  justify-center
                  text-gray-400
                  transition
                  hover:bg-gray-50
                "
              >
                <ChevronRight size={14} />
              </button>

            </div>

          </div>

        </div>


        {/* =====================================================
            RIGHT SIDEBAR
        ====================================================== */}

        <div className="flex flex-col gap-3">

          {/* ================= QUICK ACTIONS ================= */}

          <div
            className="
              rounded-lg
              border
              border-gray-200
              bg-white
              p-3
              shadow-[0_2px_8px_rgba(0,0,0,0.03)]
            "
          >

            <h2 className="text-[13px] font-semibold text-[#17203a]">
              Quick Actions
            </h2>


            <div className="mt-3 space-y-3">

              {/* Generate QR */}

              <button className="flex w-full items-center gap-2 text-left">

                <div
                  className="
                    flex
                    h-[32px]
                    w-[32px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-purple-50
                    text-purple-600
                  "
                >
                  <QrCode size={16} />
                </div>

                <div>

                  <p className="text-[10px] font-semibold text-gray-700">
                    Generate QR Code
                  </p>

                  <p className="mt-0.5 text-[9px] text-gray-400">
                    Create QR for a specific doctor
                  </p>

                </div>

              </button>


              {/* Bulk Generate */}

              <button className="flex w-full items-center gap-2 text-left">

                <div
                  className="
                    flex
                    h-[32px]
                    w-[32px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-purple-50
                    text-purple-600
                  "
                >
                  <Users size={16} />
                </div>

                <div>

                  <p className="text-[10px] font-semibold text-gray-700">
                    Bulk Generate QR
                  </p>

                  <p className="mt-0.5 text-[9px] text-gray-400">
                    Generate QR for multiple doctors
                  </p>

                </div>

              </button>


              {/* Download */}

              <button className="flex w-full items-center gap-2 text-left">

                <div
                  className="
                    flex
                    h-[32px]
                    w-[32px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-purple-50
                    text-purple-600
                  "
                >
                  <Download size={16} />
                </div>

                <div>

                  <p className="text-[10px] font-semibold text-gray-700">
                    Download All QR
                  </p>

                  <p className="mt-0.5 text-[9px] text-gray-400">
                    Download all QR codes as ZIP
                  </p>

                </div>

              </button>


              {/* Report */}

              <button className="flex w-full items-center gap-2 text-left">

                <div
                  className="
                    flex
                    h-[32px]
                    w-[32px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-purple-50
                    text-purple-600
                  "
                >
                  <FileText size={16} />
                </div>

                <div>

                  <p className="text-[10px] font-semibold text-gray-700">
                    QR Scan Report
                  </p>

                  <p className="mt-0.5 text-[9px] text-gray-400">
                    View detailed scan analytics
                  </p>

                </div>

              </button>

            </div>

          </div>


          {/* ================= QR HELP ================= */}

          <div
            className="
              rounded-lg
              border
              border-gray-200
              bg-white
              p-3
              shadow-[0_2px_8px_rgba(0,0,0,0.03)]
            "
          >

            <h2 className="text-[13px] font-semibold text-[#17203a]">
              QR Help
            </h2>

            <p className="mt-3 text-[10px] leading-[1.6] text-gray-500">
              Dynamic QR codes allow you to update the destination URL anytime
              without reprinting.
            </p>

            <button
              className="
                mt-3
                flex
                items-center
                gap-1
                text-[10px]
                font-medium
                text-purple-600
                transition
                hover:text-purple-700
              "
            >
              Learn more
              <ChevronRight size={12} />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default QRCodeTable;