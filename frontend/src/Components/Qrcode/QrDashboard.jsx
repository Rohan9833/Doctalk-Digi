import React, { useEffect, useState } from "react";

import {
  QrCode,
  Download,
  Users,
  Plus,
  TrendingUp,
  RotateCcw,
  Clock,
  X,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";

import * as XLSX from "xlsx";

function QRCodeDashboard({
  data,
  loading,

  // ==========================================
  // DOCTORS
  // ==========================================

  doctors = [],
  exportDoctors = [],

  // ==========================================
  // CAMPAIGNS
  // ==========================================

  campaigns = [],

  // ==========================================
  // LOADING
  // ==========================================

  doctorsLoading = false,
  campaignsLoading = false,

  // ==========================================
  // CALLBACKS
  // ==========================================

  onSearchDoctors,
  onFetchExportDoctors,
  onGenerateQR,
}) {
  // =====================================================
  // DASHBOARD DATA
  // =====================================================

  const dashboard = data?.data || {};

  const totalQRCodes =
    dashboard.totalQRCodes || 0;

  const totalScans =
    dashboard.totalScans || 0;

  const uniqueScans =
    dashboard.uniqueScans || 0;

  const lastScan =
    dashboard.lastScan || null;

  // =====================================================
  // EXPORT STATE
  // =====================================================

  const [exporting, setExporting] =
    useState(false);

  // =====================================================
  // CREATE QR MODAL
  // =====================================================

  const [
    showGenerateModal,
    setShowGenerateModal,
  ] = useState(false);

  const [
    doctorSearch,
    setDoctorSearch,
  ] = useState("");

  const [
    selectedDoctor,
    setSelectedDoctor,
  ] = useState(null);

  const [
    selectedCampaign,
    setSelectedCampaign,
  ] = useState("");

  const [
    videoUrl,
    setVideoUrl,
  ] = useState("");

  const [
    showCampaigns,
    setShowCampaigns,
  ] = useState(false);

  // =====================================================
  // DOCTOR SEARCH
  // =====================================================

  useEffect(() => {
    if (!showGenerateModal) {
      return;
    }

    const searchValue =
      doctorSearch.trim();

    const timer = setTimeout(() => {
      onSearchDoctors?.(
        searchValue,
      );
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [
    doctorSearch,
    showGenerateModal,
    onSearchDoctors,
  ]);

  // =====================================================
  // FORMAT NUMBER
  // =====================================================

  const formatNumber = (number) => {
    return Number(
      number || 0,
    ).toLocaleString("en-IN");
  };

  // =====================================================
  // AVG SCANS
  // =====================================================

  const averageScansPerQR =
    totalQRCodes > 0
      ? (
          totalScans /
          totalQRCodes
        ).toFixed(2)
      : "0.00";

  // =====================================================
  // LAST SCAN TIME
  // =====================================================

  const getLastScanTime = () => {
    if (!lastScan?.scannedAt) {
      return "No scans yet";
    }

    const scanDate = new Date(
      lastScan.scannedAt,
    );

    const now = new Date();

    const differenceInSeconds =
      Math.floor(
        (now - scanDate) /
          1000,
      );

    if (
      differenceInSeconds <
      60
    ) {
      return `${differenceInSeconds} sec${
        differenceInSeconds !==
        1
          ? "s"
          : ""
      } ago`;
    }

    const minutes =
      Math.floor(
        differenceInSeconds /
          60,
      );

    if (minutes < 60) {
      return `${minutes} min${
        minutes !== 1
          ? "s"
          : ""
      } ago`;
    }

    const hours =
      Math.floor(
        minutes / 60,
      );

    if (hours < 24) {
      return `${hours} hour${
        hours !== 1
          ? "s"
          : ""
      } ago`;
    }

    const days =
      Math.floor(
        hours / 24,
      );

    return `${days} day${
      days !== 1
        ? "s"
        : ""
    } ago`;
  };

  // =====================================================
  // LAST SCANNED DOCTOR
  // =====================================================

  const getLastScannedDoctor =
    () => {
      const doctor =
        lastScan?.doctor;

      if (!doctor) {
        return "No scans yet";
      }

      if (doctor.city) {
        return `${doctor.name} - ${doctor.city}`;
      }

      return doctor.name;
    };

  // =====================================================
  // OPEN MODAL
  // =====================================================

  const handleOpenModal = () => {
    setShowGenerateModal(
      true,
    );

    setDoctorSearch("");

    setSelectedDoctor(null);

    setSelectedCampaign("");

    setVideoUrl("");

    setShowCampaigns(false);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    setShowGenerateModal(
      false,
    );

    setDoctorSearch("");

    setSelectedDoctor(null);

    setSelectedCampaign("");

    setVideoUrl("");

    setShowCampaigns(false);
  };

  // =====================================================
  // SELECT DOCTOR
  // =====================================================

  const handleSelectDoctor = (
    doctor,
  ) => {
    setSelectedDoctor(
      doctor,
    );

    setDoctorSearch("");
  };

  // =====================================================
  // GENERATE QR
  // =====================================================

  const handleGenerateQR =
    async () => {
      if (!selectedDoctor) {
        alert(
          "Please select a doctor.",
        );

        return;
      }

      if (!selectedCampaign) {
        alert(
          "Please select a campaign.",
        );

        return;
      }

      try {
        await onGenerateQR?.({
          doctorId:
            selectedDoctor.doctorId ||
            selectedDoctor._id,

          campaignId:
            selectedCampaign,

          videoUrl:
            videoUrl.trim() ||
            null,
        });

        handleCloseModal();
      } catch (error) {
        console.error(
          "Generate QR Error:",
          error,
        );
      }
    };

  // =====================================================
  // EXPORT DOCTORS
  // =====================================================

  const handleExportDoctors =
    async () => {
      try {
        setExporting(true);

        console.log(
          "Starting doctors Excel export...",
        );

        let allDoctors = [];

        if (
          onFetchExportDoctors
        ) {
          const fetchedDoctors =
            await onFetchExportDoctors();

          if (
            Array.isArray(
              fetchedDoctors,
            )
          ) {
            allDoctors =
              fetchedDoctors;
          }
        }

        if (
          allDoctors.length ===
            0 &&
          exportDoctors.length >
            0
        ) {
          allDoctors =
            exportDoctors;
        }

        console.log(
          "Doctors received for export:",
          allDoctors.length,
        );

        if (
          allDoctors.length ===
          0
        ) {
          alert(
            "No doctors found to export.",
          );

          return;
        }

        const excelData =
          allDoctors.map(
            (
              doctor,
              index,
            ) => {
              const campaign =
                doctor.campaign ||
                {};

              const mr =
                doctor.mr || {};

              return {
                "Sr. No.":
                  index + 1,

                "Doctor ID":
                  doctor.doctorId ||
                  doctor._id ||
                  "",

                "Doctor Name":
                  doctor.name ||
                  "",

                Specialty:
                  doctor.specialty ||
                  "",

                Clinic:
                  doctor.clinic ||
                  "",

                City:
                  doctor.city ||
                  "",

                Status:
                  doctor.status ||
                  "",

                Campaign:
                  typeof campaign ===
                  "object"
                    ? campaign.name ||
                      ""
                    : campaign ||
                      "",

                "Therapy Area":
                  typeof campaign ===
                  "object"
                    ? campaign.therapyArea ||
                      ""
                    : "",

                Brand:
                  typeof campaign ===
                  "object"
                    ? campaign.brand ||
                      ""
                    : "",

                "MR Name":
                  typeof mr ===
                  "object"
                    ? mr.mrName ||
                      ""
                    : "",

                "MR ID":
                  typeof mr ===
                  "object"
                    ? mr.mrId ||
                      ""
                    : mr || "",

                HQ:
                  typeof mr ===
                  "object"
                    ? mr.HQ ||
                      ""
                    : "",

                "Created At":
                  doctor.createdAt
                    ? new Date(
                        doctor.createdAt,
                      ).toLocaleString(
                        "en-IN",
                      )
                    : "",

                "Updated At":
                  doctor.updatedAt
                    ? new Date(
                        doctor.updatedAt,
                      ).toLocaleString(
                        "en-IN",
                      )
                    : "",
              };
            },
          );

        const worksheet =
          XLSX.utils.json_to_sheet(
            excelData,
          );

        worksheet[
          "!cols"
        ] = [
          { wch: 8 },
          { wch: 24 },
          { wch: 25 },
          { wch: 20 },
          { wch: 28 },
          { wch: 18 },
          { wch: 15 },
          { wch: 25 },
          { wch: 25 },
          { wch: 20 },
          { wch: 22 },
          { wch: 18 },
          { wch: 20 },
          { wch: 24 },
          { wch: 24 },
        ];

        const workbook =
          XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          "Doctors",
        );

        const today =
          new Date()
            .toISOString()
            .split(
              "T",
            )[0];

        XLSX.writeFile(
          workbook,
          `Doctors_Export_${today}.xlsx`,
        );
      } catch (error) {
        console.error(
          "Excel Export Error:",
          error,
        );

        alert(
          "Failed to export doctors.",
        );
      } finally {
        setExporting(false);
      }
    };

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      title:
        "Total QR Codes",
      value:
        formatNumber(
          totalQRCodes,
        ),
      icon: QrCode,
      iconBg:
        "bg-purple-100",
      iconColor:
        "text-purple-600",
      bottom:
        "Generated QR codes",
    },

    {
      title:
        "Total Scans",
      value:
        formatNumber(
          totalScans,
        ),
      icon: TrendingUp,
      iconBg:
        "bg-blue-100",
      iconColor:
        "text-blue-600",
      bottom:
        "All QR scans",
    },

    {
      title:
        "Unique Scans",
      value:
        formatNumber(
          uniqueScans,
        ),
      icon: Users,
      iconBg:
        "bg-purple-100",
      iconColor:
        "text-purple-600",
      bottom:
        "Unique visitors",
    },

    {
      title:
        "Avg. Scans / QR",
      value:
        averageScansPerQR,
      icon: RotateCcw,
      iconBg:
        "bg-red-100",
      iconColor:
        "text-red-500",
      bottom:
        "Total scans ÷ QR codes",
    },

    {
      title:
        "Last Scan",
      value:
        getLastScanTime(),
      icon: Clock,
      iconBg:
        "bg-red-100",
      iconColor:
        "text-red-500",
      bottom:
        getLastScannedDoctor(),
    },
  ];

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <>
      {/* =================================================
          DASHBOARD
      ================================================= */}

      <div className="bg-[#f8f9fc] px-4 py-4">
        {/* HEADER */}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#17203a]">
              QR Dashboard
            </h1>

            <p className="mt-1 text-[11px] text-gray-500">
              Manage QR codes,
              generate new codes
              and export doctors.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* EXPORT */}

            <button
              type="button"
              onClick={
                handleExportDoctors
              }
              disabled={
                exporting
              }
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-lg
                border
                border-gray-200
                bg-white
                px-4
                text-[12px]
                font-medium
                text-purple-600
                shadow-sm
                hover:bg-purple-50
                disabled:opacity-60
              "
            >
              <Download
                size={16}
              />

              {exporting
                ? "Exporting..."
                : "Export Doctors"}
            </button>

            {/* BULK */}

            <button
              type="button"
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-lg
                border
                border-gray-200
                bg-white
                px-4
                text-[12px]
                font-medium
                text-purple-600
                shadow-sm
                hover:bg-purple-50
              "
            >
              <Users
                size={16}
              />

              Bulk Generate QR
            </button>

            {/* GENERATE */}

            <button
              type="button"
              onClick={
                handleOpenModal
              }
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-lg
                bg-gradient-to-r
                from-purple-600
                to-violet-600
                px-4
                text-[12px]
                font-medium
                text-white
                shadow-md
                shadow-purple-200
                hover:from-purple-700
                hover:to-violet-700
              "
            >
              <Plus
                size={17}
              />

              Generate QR Code
            </button>
          </div>
        </div>

        {/* STATS */}

        <div
          className="
            grid
            min-h-[230px]
            grid-cols-2
            auto-rows-[110px]
            gap-3
          "
        >
          {stats.map(
            (
              stat,
              index,
            ) => {
              const Icon =
                stat.icon;

              return (
                <div
                  key={index}
                  className="
                    h-[110px]
                    min-h-[110px]
                    overflow-hidden
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    shadow-sm
                  "
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        ${stat.iconBg}
                        ${stat.iconColor}
                      `}
                    >
                      <Icon
                        size={19}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[11px] text-gray-500">
                        {
                          stat.title
                        }
                      </p>

                      <h2 className="mt-1 truncate text-[19px] font-semibold text-[#17203a]">
                        {
                          stat.value
                        }
                      </h2>
                    </div>
                  </div>

                  <p className="mt-5 truncate text-[11px] text-gray-500">
                    {
                      stat.bottom
                    }
                  </p>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* =================================================
          CREATE QR MODAL
      ================================================= */}

      {showGenerateModal && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            px-4
          "
        >
          {/* FIXED SIZE POPUP */}

          <div
            className="
              flex
              h-[620px]
              max-h-[90vh]
              w-[720px]
              max-w-[95vw]
              flex-col
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >
            {/* ================= HEADER ================= */}

            <div
              className="
                flex
                h-[72px]
                shrink-0
                items-center
                justify-between
                border-b
                border-gray-100
                px-6
              "
            >
              <div>
                <h2 className="text-base font-semibold text-[#17203a]">
                  Generate QR
                  Code
                </h2>

                <p className="mt-1 text-[10px] text-gray-400">
                  Select a doctor
                  and campaign.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                className="
                  rounded-lg
                  p-2
                  text-gray-400
                  hover:bg-gray-100
                "
              >
                <X
                  size={18}
                />
              </button>
            </div>

            {/* ================= BODY ================= */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                px-6
                py-5
              "
            >
              {/* DOCTOR SEARCH */}

              {!selectedDoctor && (
                <>
                  <label className="mb-2 block text-[12px] font-medium text-gray-700">
                    Search Doctor
                  </label>

                  <div className="relative">
                    <Search
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type="text"
                      value={
                        doctorSearch
                      }
                      onChange={(
                        e,
                      ) =>
                        setDoctorSearch(
                          e.target
                            .value,
                        )
                      }
                      placeholder="Search doctor..."
                      className="
                        h-10
                        w-full
                        rounded-lg
                        border
                        border-gray-200
                        pl-9
                        pr-3
                        text-[12px]
                        outline-none
                        focus:border-purple-500
                        focus:ring-2
                        focus:ring-purple-100
                      "
                    />
                  </div>

                  {/* DOCTOR LIST */}

                  <div
                    className="
                      mt-4
                      min-h-[330px]
                      max-h-[330px]
                      overflow-y-auto
                      pr-1
                    "
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {doctorsLoading ? (
                        [1, 2, 3, 4].map(
                          (
                            item,
                          ) => (
                            <div
                              key={
                                item
                              }
                              className="
                                h-[76px]
                                animate-pulse
                                rounded-xl
                                border
                                border-gray-200
                                bg-gray-50
                              "
                            />
                          ),
                        )
                      ) : doctors.length >
                        0 ? (
                        doctors.map(
                          (
                            doctor,
                          ) => (
                            <button
                              type="button"
                              key={
                                doctor._id ||
                                doctor.doctorId
                              }
                              onClick={() =>
                                handleSelectDoctor(
                                  doctor,
                                )
                              }
                              className="
                                flex
                                h-[76px]
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                p-3
                                text-left
                                transition
                                hover:border-purple-300
                                hover:bg-purple-50
                              "
                            >
                              <div
                                className="
                                  flex
                                  h-10
                                  w-10
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-purple-100
                                  text-[12px]
                                  font-semibold
                                  text-purple-600
                                "
                              >
                                {doctor.name
                                  ?.charAt(
                                    0,
                                  )
                                  ?.toUpperCase() ||
                                  "D"}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[11px] font-semibold text-gray-800">
                                  {
                                    doctor.name
                                  }
                                </p>

                                <p className="mt-1 truncate text-[10px] text-gray-400">
                                  {doctor.specialty ||
                                    "No specialty"}

                                  {doctor.city
                                    ? ` • ${doctor.city}`
                                    : ""}
                                </p>
                              </div>
                            </button>
                          ),
                        )
                      ) : (
                        <div className="col-span-2 flex h-[330px] items-center justify-center">
                          <div className="text-center">
                            <Users
                              size={
                                24
                              }
                              className="mx-auto text-gray-300"
                            />

                            <p className="mt-2 text-[12px] text-gray-500">
                              No doctors
                              found
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* SELECTED DOCTOR */}

              {selectedDoctor && (
                <>
                  <label className="mb-2 block text-[12px] font-medium text-gray-700">
                    Selected Doctor
                  </label>

                  <div className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50 p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[12px] font-semibold text-purple-600">
                        {selectedDoctor.name
                          ?.charAt(
                            0,
                          )
                          ?.toUpperCase() ||
                          "D"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-semibold text-gray-800">
                          {
                            selectedDoctor.name
                          }
                        </p>

                        <p className="truncate text-[10px] text-gray-500">
                          {selectedDoctor.specialty ||
                            "Doctor"}

                          {selectedDoctor.city
                            ? ` • ${selectedDoctor.city}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDoctor(
                          null,
                        )
                      }
                      className="text-[11px] font-medium text-purple-600"
                    >
                      Change
                    </button>
                  </div>

                  {/* CAMPAIGN */}

                  <div className="mt-5">
                    <label className="mb-2 block text-[12px] font-medium text-gray-700">
                      Campaign
                    </label>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setShowCampaigns(
                            (
                              prev,
                            ) =>
                              !prev,
                          )
                        }
                        className="
                          flex
                          h-10
                          w-full
                          items-center
                          justify-between
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          px-3
                          text-left
                          text-[12px]
                          text-gray-700
                        "
                      >
                        <span>
                          {selectedCampaign
                            ? campaigns.find(
                                (
                                  campaign,
                                ) =>
                                  campaign._id ===
                                  selectedCampaign,
                              )
                                ?.name ||
                              "Campaign selected"
                            : "Select campaign"}
                        </span>

                        <ChevronDown
                          size={
                            15
                          }
                        />
                      </button>

                      {showCampaigns && (
                        <div
                          className="
                            absolute
                            left-0
                            right-0
                            top-full
                            z-30
                            mt-1
                            max-h-48
                            overflow-y-auto
                            rounded-lg
                            border
                            border-gray-200
                            bg-white
                            p-1
                            shadow-lg
                          "
                        >
                          {campaignsLoading ? (
                            <div className="px-3 py-3 text-center text-[11px] text-gray-400">
                              Loading
                              campaigns...
                            </div>
                          ) : campaigns.length >
                            0 ? (
                            campaigns.map(
                              (
                                campaign,
                              ) => (
                                <button
                                  type="button"
                                  key={
                                    campaign._id
                                  }
                                  onClick={() => {
                                    setSelectedCampaign(
                                      campaign._id,
                                    );

                                    setShowCampaigns(
                                      false,
                                    );
                                  }}
                                  className="
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-md
                                    px-3
                                    py-2.5
                                    text-left
                                    text-[11px]
                                    hover:bg-purple-50
                                  "
                                >
                                  <span>
                                    {
                                      campaign.name
                                    }
                                  </span>

                                  {selectedCampaign ===
                                    campaign._id && (
                                    <Check
                                      size={
                                        14
                                      }
                                      className="text-purple-600"
                                    />
                                  )}
                                </button>
                              ),
                            )
                          ) : (
                            <div className="px-3 py-3 text-center text-[11px] text-gray-400">
                              No campaigns
                              found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* VIDEO URL */}

                  <div className="mt-5">
                    <label className="mb-2 block text-[12px] font-medium text-gray-700">
                      Video Link
                    </label>

                    <input
                      type="url"
                      value={
                        videoUrl
                      }
                      onChange={(
                        e,
                      ) =>
                        setVideoUrl(
                          e.target
                            .value,
                        )
                      }
                      placeholder="https://example.com/video"
                      className="
                        h-10
                        w-full
                        rounded-lg
                        border
                        border-gray-200
                        px-3
                        text-[12px]
                        outline-none
                        focus:border-purple-500
                        focus:ring-2
                        focus:ring-purple-100
                      "
                    />
                  </div>
                </>
              )}
            </div>

            {/* ================= FOOTER ================= */}

            <div
              className="
                flex
                h-[72px]
                shrink-0
                items-center
                justify-end
                gap-3
                border-t
                border-gray-100
                px-6
              "
            >
              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                className="
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-2.5
                  text-[12px]
                  font-medium
                  text-gray-600
                  hover:bg-gray-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  !selectedDoctor ||
                  !selectedCampaign
                }
                onClick={
                  handleGenerateQR
                }
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-gradient-to-r
                  from-purple-600
                  to-violet-600
                  px-5
                  py-2.5
                  text-[12px]
                  font-medium
                  text-white
                  shadow-md
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <QrCode
                  size={16}
                />

                Generate QR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QRCodeDashboard;