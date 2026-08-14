import React, { useMemo, useState } from "react";
import {
  Search,
  Download,
  Users,
  FileText,
  Eye,
  Pencil,
  ExternalLink,
  Copy,
  ChevronRight,
  QrCode,
  X,
  BarChart3,
} from "lucide-react";

function QRCodeTable({
  data = [],
  loading = false,

  page = 1,
  pages = 1,
  total = 0,
  limit = 10,

  onPageChange,
  onLimitChange,

  // ==========================================
  // EDIT QR API FROM PARENT
  // ==========================================

  onEditQR,

  // ==========================================
  // EXPORT EXCEL API FROM PARENT
  // ==========================================

  onExportExcel,
}) {
  // ==========================================
  // SEARCH
  // ==========================================

  const [search, setSearch] = useState("");

  // ==========================================
  // VIEW MODAL
  // ==========================================

  const [viewQR, setViewQR] = useState(null);

  // ==========================================
  // EDIT MODAL
  // ==========================================

  const [editQR, setEditQR] = useState(null);

  const [editForm, setEditForm] = useState({
    destinationType: "video",
    destinationUrl: "",
    status: "active",
    expiresAt: "",
  });

  const [editLoading, setEditLoading] = useState(false);

  // ==========================================
  // SEARCH CURRENT API DATA
  // ==========================================

  const filteredData = useMemo(() => {
    if (!search.trim()) {
      return data;
    }

    const searchValue = search.toLowerCase().trim();

    return data.filter((item) => {
      const doctorName = item.doctor?.name || "";

      const shortUrl = item.shortUrl || "";

      const shortCode = item.shortCode || "";

      const destinationUrl = item.destinationUrl || "";

      return (
        doctorName.toLowerCase().includes(searchValue) ||
        shortUrl.toLowerCase().includes(searchValue) ||
        shortCode.toLowerCase().includes(searchValue) ||
        destinationUrl.toLowerCase().includes(searchValue)
      );
    });
  }, [data, search]);

  // ==========================================
  // COPY URL
  // ==========================================

  const copyUrl = async (url) => {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error("Copy URL Error:", error);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Never";
    }

    const scannedDate = new Date(date);

    if (Number.isNaN(scannedDate.getTime())) {
      return "Never";
    }

    return scannedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // FORMAT DATE FOR INPUT
  // ==========================================

  const formatDateForInput = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    const year = parsedDate.getFullYear();

    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");

    const day = String(parsedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==========================================
  // FORMAT NUMBER
  // ==========================================

  const formatNumber = (number) => {
    return Number(number || 0).toLocaleString("en-IN");
  };

  // ==========================================
  // GET QR ID
  // ==========================================

  const getQrId = (item) => {
    return item?._id || item?.id;
  };

  // ==========================================
  // OPEN VIEW MODAL
  // ==========================================

  const handleViewQR = (item) => {
    setViewQR(item);
  };

  // ==========================================
  // CLOSE VIEW MODAL
  // ==========================================

  const closeViewModal = () => {
    setViewQR(null);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleOpenEdit = (item) => {
    setEditQR(item);

    setEditForm({
      destinationType: item.destinationType || "video",
      destinationUrl: item.destinationUrl || "",
      status: item.status || "active",
      expiresAt: formatDateForInput(item.expiresAt),
    });
  };

  // ==========================================
  // CLOSE EDIT MODAL
  // ==========================================

  const handleCloseEdit = () => {
    if (editLoading) {
      return;
    }

    setEditQR(null);

    setEditForm({
      destinationType: "video",
      destinationUrl: "",
      status: "active",
      expiresAt: "",
    });
  };

  // ==========================================
  // HANDLE EDIT INPUT
  // ==========================================

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT EDIT
  // ==========================================

  const handleSubmitEdit = async (event) => {
    event.preventDefault();

    if (!editQR) {
      return;
    }

    const qrId = getQrId(editQR);

    if (!qrId) {
      alert("QR ID not found.");
      return;
    }

    if (!onEditQR) {
      console.error("onEditQR function was not provided.");
      return;
    }

    // ==========================================
    // VALIDATE DESTINATION URL
    // ==========================================

    if (!editForm.destinationUrl.trim()) {
      alert("Destination URL is required.");
      return;
    }

    try {
      setEditLoading(true);

      // ==========================================
      // PREPARE PAYLOAD
      // ==========================================

      const payload = {
        destinationType: editForm.destinationType,
        destinationUrl: editForm.destinationUrl.trim(),
        status: editForm.status,
        expiresAt: editForm.expiresAt ? editForm.expiresAt : null,
      };

      console.log("Edit QR Payload:", {
        qrId,
        payload,
      });

      // ==========================================
      // CALL PARENT API
      // ==========================================

      await onEditQR(qrId, payload);

      // ==========================================
      // CLOSE MODAL
      // ==========================================

      setEditQR(null);

      alert("QR code updated successfully.");
    } catch (error) {
      console.error("Edit QR Error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update QR code.",
      );
    } finally {
      setEditLoading(false);
    }
  };

  // ==========================================
  // PAGINATION CALCULATIONS
  // ==========================================

  const startEntry = total === 0 ? 0 : (page - 1) * limit + 1;

  const endEntry = Math.min(page * limit, total);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="bg-[#f8f9fc] p-3">
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
          <p className="text-[11px] text-gray-400">Loading QR codes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="bg-[#f8f9fc] p-3">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">
          {/* =====================================================
              MAIN TABLE
          ====================================================== */}

          <div className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            {/* ================= TABLE HEADER ================= */}

            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
              <h2 className="shrink-0 text-[14px] font-semibold text-[#17203a]">
                All QR Codes
              </h2>

              {/* SEARCH */}

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
                  onChange={(e) => {
                    const value = e.target.value;

                    setSearch(value);

                    if (onPageChange) {
                      onPageChange(1);
                    }
                  }}
                  placeholder="Search by doctor name, QR..."
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

              {/* HEADER ACTIONS */}

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={onExportExcel}
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
                  type="button"
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
                      QR
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
                  {filteredData.map((item) => {
                    const doctorName = item.doctor?.name || "Unknown Doctor";

                    const status = item.status || "inactive";

                    return (
                      <tr
                        key={getQrId(item)}
                        className="
                          border-b
                          border-gray-100
                          transition
                          hover:bg-gray-50/70
                        "
                      >
                        {/* QR */}

                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="
                                flex
                                h-[40px]
                                w-[40px]
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded
                                border
                                border-gray-200
                                bg-white
                              "
                            >
                              {item.qrCodeSvg ? (
                                <div
                                  className="h-[34px] w-[34px]"
                                  dangerouslySetInnerHTML={{
                                    __html: item.qrCodeSvg,
                                  }}
                                />
                              ) : (
                                <span className="text-[8px] text-gray-400">
                                  QR
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* DOCTOR */}

                        <td className="px-3 py-2.5">
                          <span className="whitespace-nowrap text-[10px] font-medium text-gray-600">
                            {doctorName}
                          </span>
                        </td>

                        {/* SHORT URL */}

                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1">
                            <span className="whitespace-nowrap text-[10px] font-medium text-indigo-500">
                              {item.shortUrl || "-"}
                            </span>

                            {item.shortUrl && (
                              <button
                                type="button"
                                onClick={() => copyUrl(item.shortUrl)}
                                className="text-gray-400 transition hover:text-indigo-500"
                                title="Copy"
                              >
                                <Copy size={11} />
                              </button>
                            )}
                          </div>
                        </td>

                        {/* DESTINATION URL */}

                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1">
                            <span className="max-w-[160px] truncate text-[10px] font-medium text-indigo-500">
                              {item.destinationUrl || "-"}
                            </span>

                            {item.destinationUrl && (
                              <ExternalLink
                                size={11}
                                className="shrink-0 text-gray-400"
                              />
                            )}
                          </div>
                        </td>

                        {/* STATUS */}

                        <td className="px-3 py-2.5">
                          {status === "active" ? (
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
                          ) : status === "expired" ? (
                            <span
                              className="
                                inline-flex
                                rounded-md
                                border
                                border-red-200
                                bg-red-50
                                px-2
                                py-1
                                text-[9px]
                                font-medium
                                text-red-500
                              "
                            >
                              Expired
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
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* TOTAL SCANS */}

                        <td className="px-3 py-2.5">
                          <span className="text-[10px] font-medium text-gray-700">
                            {formatNumber(item.totalScans)}
                          </span>
                        </td>

                        {/* UNIQUE SCANS */}

                        <td className="px-3 py-2.5">
                          <span className="text-[10px] font-medium text-gray-700">
                            {formatNumber(item.uniqueScans)}
                          </span>
                        </td>

                        {/* LAST SCANNED */}

                        <td className="px-3 py-2.5">
                          <div className="whitespace-nowrap">
                            <p className="text-[10px] font-medium text-gray-700">
                              {formatDate(item.lastScanned)}
                            </p>
                          </div>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1">
                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() => handleViewQR(item)}
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

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
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
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* EMPTY STATE */}

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

            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">{startEntry}</span>
                {" - "}
                <span className="font-medium text-gray-700">{endEntry}</span>
                {" of "}
                <span className="font-medium text-gray-700">{total}</span>
              </div>

              <div className="flex items-center gap-1">
                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => {
                    if (page > 1 && !loading) {
                      onPageChange(page - 1);
                    }
                  }}
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-gray-200
                    text-gray-600
                    transition
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  &lt;
                </button>

                {/* CURRENT PAGE */}

                <div
                  className="
                    flex
                    h-8
                    min-w-8
                    items-center
                    justify-center
                    rounded-md
                    bg-black
                    px-2
                    text-sm
                    font-medium
                    text-white
                  "
                >
                  {page}
                </div>

                {/* NEXT */}

                <button
                  type="button"
                  disabled={page >= pages || loading}
                  onClick={() => {
                    if (page < pages && !loading) {
                      onPageChange(page + 1);
                    }
                  }}
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-gray-200
                    text-gray-600
                    transition
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDEBAR
          ====================================================== */}

          <div className="flex flex-col gap-3">
            {/* QUICK ACTIONS */}

            {/* <div
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
                      Export Doctor Data
                    </p>

                    <p className="mt-0.5 text-[9px] text-gray-400">
                      Export Doctor details to Excel
                    </p>
                  </div>
                </button>
              </div>
            </div> */}


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
                type="button"
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

      {/* =====================================================
          VIEW QR MODAL
      ====================================================== */}

      {viewQR && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
          "
          onClick={closeViewModal}
        >
          <div
            className="
              w-full
              max-w-[420px]
              rounded-xl
              bg-white
              p-5
              shadow-2xl
            "
            onClick={(event) => event.stopPropagation()}
          >
            {/* HEADER */}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[#17203a]">
                  QR Code Details
                </h2>

                <p className="mt-1 text-[10px] text-gray-400">
                  View QR information
                </p>
              </div>

              <button
                type="button"
                onClick={closeViewModal}
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-md
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-gray-600
                "
              >
                <X size={16} />
              </button>
            </div>

            {/* QR IMAGE */}

            <div className="mt-5 flex justify-center">
              <div
                className="
                  flex
                  h-[150px]
                  w-[150px]
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  p-3
                "
              >
                {viewQR.qrCodeSvg ? (
                  <div
                    className="h-full w-full"
                    dangerouslySetInnerHTML={{
                      __html: viewQR.qrCodeSvg,
                    }}
                  />
                ) : (
                  <span className="text-[10px] text-gray-400">
                    QR unavailable
                  </span>
                )}
              </div>
            </div>

            {/* DETAILS */}

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-[10px] text-gray-400">Doctor</span>

                <span className="text-[10px] font-medium text-gray-700">
                  {viewQR.doctor?.name || "Unknown Doctor"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-[10px] text-gray-400">Short Code</span>

                <span className="text-[10px] font-medium text-gray-700">
                  {viewQR.shortCode || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-[10px] text-gray-400">
                  Destination Type
                </span>

                <span className="text-[10px] font-medium capitalize text-gray-700">
                  {viewQR.destinationType || "-"}
                </span>
              </div>

              <div className="border-b border-gray-100 pb-2">
                <p className="text-[10px] text-gray-400">Destination URL</p>

                <p className="mt-1 break-all text-[10px] font-medium text-indigo-500">
                  {viewQR.destinationUrl || "-"}
                </p>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-[10px] text-gray-400">Status</span>

                <span className="text-[10px] font-medium capitalize text-gray-700">
                  {viewQR.status || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400">Last Scanned</span>

                <span className="text-[10px] font-medium text-gray-700">
                  {formatDate(viewQR.lastScanned)}
                </span>
              </div>
            </div>

            {/* CLOSE */}

            <button
              type="button"
              onClick={closeViewModal}
              className="
                mt-5
                w-full
                rounded-md
                bg-[#17203a]
                px-4
                py-2
                text-[10px]
                font-medium
                text-white
                transition
                hover:bg-[#222c4d]
              "
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          EDIT QR MODAL
      ====================================================== */}

      {editQR && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
          "
          onClick={handleCloseEdit}
        >
          <div
            className="
              w-full
              max-w-[450px]
              rounded-xl
              bg-white
              p-5
              shadow-2xl
            "
            onClick={(event) => event.stopPropagation()}
          >
            {/* HEADER */}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[#17203a]">
                  Edit QR Code
                </h2>

                <p className="mt-1 text-[10px] text-gray-400">
                  Update QR destination settings
                </p>
              </div>

              <button
                type="button"
                disabled={editLoading}
                onClick={handleCloseEdit}
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-md
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-gray-600
                  disabled:opacity-40
                "
              >
                <X size={16} />
              </button>
            </div>

            {/* QR INFO */}

            <div
              className="
                mt-4
                rounded-lg
                border
                border-gray-100
                bg-gray-50
                px-3
                py-2.5
              "
            >
              <p className="text-[10px] font-medium text-gray-700">
                {editQR.doctor?.name || "Unknown Doctor"}
              </p>

              <p className="mt-1 text-[9px] text-gray-400">
                Short Code:{" "}
                <span className="font-medium text-gray-600">
                  {editQR.shortCode || "-"}
                </span>
              </p>

              <p className="mt-1 text-[9px] text-gray-400">
                QR image and short code will remain unchanged.
              </p>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmitEdit} className="mt-5 space-y-4">
              {/* DESTINATION TYPE */}

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-600">
                  Destination Type
                </label>

                <select
                  name="destinationType"
                  value={editForm.destinationType}
                  onChange={handleEditInputChange}
                  disabled={editLoading}
                  className="
                    h-9
                    w-full
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    px-3
                    text-[10px]
                    text-gray-700
                    outline-none
                    focus:border-purple-400
                    disabled:bg-gray-50
                  "
                >
                  <option value="video">Video</option>

                  <option value="quiz">Quiz</option>

                  <option value="landing_page">Landing Page</option>
                </select>
              </div>

              {/* DESTINATION URL */}

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-600">
                  Destination URL
                </label>

                <input
                  type="url"
                  name="destinationUrl"
                  value={editForm.destinationUrl}
                  onChange={handleEditInputChange}
                  disabled={editLoading}
                  placeholder="https://example.com"
                  className="
                    h-9
                    w-full
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    px-3
                    text-[10px]
                    text-gray-700
                    outline-none
                    placeholder:text-gray-400
                    focus:border-purple-400
                    disabled:bg-gray-50
                  "
                />
              </div>

              {/* STATUS */}

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-600">
                  Status
                </label>

                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditInputChange}
                  disabled={editLoading}
                  className="
                    h-9
                    w-full
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    px-3
                    text-[10px]
                    text-gray-700
                    outline-none
                    focus:border-purple-400
                    disabled:bg-gray-50
                  "
                >
                  <option value="active">Active</option>

                  <option value="inactive">Inactive</option>

                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* EXPIRY */}

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-600">
                  Expiry Date
                </label>

                <input
                  type="date"
                  name="expiresAt"
                  value={editForm.expiresAt}
                  onChange={handleEditInputChange}
                  disabled={editLoading}
                  className="
                    h-9
                    w-full
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    px-3
                    text-[10px]
                    text-gray-700
                    outline-none
                    focus:border-purple-400
                    disabled:bg-gray-50
                  "
                />
              </div>

              {/* BUTTONS */}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={editLoading}
                  onClick={handleCloseEdit}
                  className="
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-2
                    text-[10px]
                    font-medium
                    text-gray-600
                    transition
                    hover:bg-gray-50
                    disabled:opacity-40
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading}
                  className="
                    rounded-md
                    bg-[#17203a]
                    px-4
                    py-2
                    text-[10px]
                    font-medium
                    text-white
                    transition
                    hover:bg-[#222c4d]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {editLoading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default QRCodeTable;
