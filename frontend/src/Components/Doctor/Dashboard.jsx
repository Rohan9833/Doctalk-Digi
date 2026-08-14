import { useState, useEffect, useRef, useCallback } from "react";

import {
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  QrCode,
  ClipboardList,
  BadgeCheck,
  Trophy,
  Edit2,
  Trash2,
  Images,
} from "lucide-react";

import axios from "axios";

import ConfirmationModal from "../Confirmation Model/ConfirmationModel";
import DoctorForm from "./DoctorForm";

const FORM_MODE = {
  CREATE: "create",
  EDIT: "edit",
};

const TABS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  DRAFT_PAGES: "Draft Pages",
};

// =====================================================
// REUSABLE STAT CARD
// =====================================================

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className="p-3 rounded-xl bg-violet-100">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function DoctorDashboard() {
  // =====================================================
  // EXISTING DASHBOARD DATA
  // =====================================================

  const [statsData, setStatsData] = useState(null);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [doctors, setDoctors] = useState([]);

  const [totalpages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);

  const [totalRecords, setTotalRecords] = useState(0);

  // =====================================================
  // QR COUNT
  // =====================================================

  const [totalQrScans, setTotalQrScans] = useState(0);

  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  const [searchQuery, setSearchQuery] = useState("");

  const [city, setCity] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");

  const [status, setStatus] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("");

  const [specialties, setSpecialities] = useState([]);

  const [selectedSpecialty, setSelectedSpeciality] =
    useState("");

  const [skip, setSkip] = useState(0);

  const [currentTab, setCurrentTab] =
    useState(TABS.ACTIVE);

  // =====================================================
  // EXISTING DOCTOR STATS
  // =====================================================

  const [publishedPages, setPublishedPages] =
    useState(0);

  const [totalDoctors, setTotalDoctors] =
    useState(0);

  const [totalStatus, setTotalStatus] =
    useState(null);

  const [totalVideoStatus, setTotalVideoStatus] =
    useState(null);

  // =====================================================
  // NEW QUIZ DASHBOARD STATS
  // =====================================================

  const [quizStarts, setQuizStarts] =
    useState(0);

  const [quizCompletions, setQuizCompletions] =
    useState(0);

  const [avgQuizScore, setAvgQuizScore] =
    useState(0);

  // =====================================================
  // OTHER EXISTING STATES
  // =====================================================

  const [selectedDoctor, setSelectedDoctor] =
    useState(null);

  const [isPanelOpen, setIsPanelOpen] =
    useState(false);

  const [qrGenerated, setQrGenerated] =
    useState(false);

  const [doctorToDelete, setDoctorToDelete] =
    useState(null);

  const [openDropdown, setOpenDropdown] =
    useState(false);

  const [dropdownPosition, setDropdownPosition] =
    useState({
      top: 0,
      left: 0,
    });

  const [previewImage, setPreviewImage] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [campaign, setCampaign] =
    useState([]);

  const [formMode, setFormMode] =
    useState(FORM_MODE.CREATE);

  const [editFormValue, setEditFormValue] =
    useState(null);

  const [isEditClicked, setIsEditClicked] =
    useState(false);

  // =====================================================
  // PAGINATION
  // =====================================================

  const visiblePages = 4;

  const startPage = Math.max(
    1,
    page - Math.floor(visiblePages / 2)
  );

  const endPage = Math.min(
    totalpages,
    startPage + visiblePages - 1
  );

  const start =
    totalRecords === 0
      ? 0
      : (page - 1) * limit + 1;

  const end = Math.min(
    page * limit,
    totalRecords
  );

  // =====================================================
  // DOCTOR DASHBOARD API
  // =====================================================

  const fetchDashBoardData = useCallback(
    async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "/api/doctors/getDoctorDashboard",
          {
            params: {
              page,
              limit,
              search: searchQuery,
              currentTab,
              city: selectedCity,
              status: selectedStatus,
              specialties: selectedSpecialty,
            },
          }
        );

        console.log(
          "Doctor Dashboard Response:",
          response.data
        );

        if (response.status === 200) {
          setDoctors(
            response.data?.doctorsData || []
          );

          setTotalPages(
            response.data?.totalPages || 0
          );

          setTotalRecords(
            response.data?.totalRecords || 0
          );

          setCity(
            response.data?.cities || []
          );

          setSpecialities(
            response.data?.specialti || []
          );

          setStatus(
            response.data?.statuses || []
          );

          setPublishedPages(
            response.data?.stats
              ?.publishedPages || 0
          );

          setTotalDoctors(
            response.data?.stats
              ?.totalDoctors || 0
          );

          setTotalStatus(
            response.data?.stats
              ?.status || 0
          );

          setTotalVideoStatus(
            response.data?.stats
              ?.videoStatuses || 0
          );
        }
      } catch (error) {
        console.error(
          "Doctor Dashboard Error:",
          error.response?.data ||
            error.message
        );
      } finally {
        setLoading(false);
      }
    },
    [
      searchQuery,
      page,
      limit,
      currentTab,
      selectedCity,
      selectedSpecialty,
      selectedStatus,
      qrGenerated,
    ]
  );

  // =====================================================
  // FETCH DOCTOR DASHBOARD
  // =====================================================

  useEffect(() => {
    fetchDashBoardData();
  }, [fetchDashBoardData]);

  // =====================================================
  // QR DASHBOARD API
  // =====================================================

  useEffect(() => {
    const fetchQrDashboard = async () => {
      try {
        const response = await axios.get(
          "/api/qrcode/dashboard"
        );

        console.log(
          "QR Dashboard Response:",
          response.data
        );

        if (
          response.status === 200 &&
          response.data?.success
        ) {
          const totalQr =
            response.data?.data
              ?.totalQRCodes || 0;

          setTotalQrScans(totalQr);
        }
      } catch (error) {
        console.error(
          "QR Dashboard Error:",
          error.response?.data ||
            error.message
        );

        setTotalQrScans(0);
      }
    };

    fetchQrDashboard();
  }, []);

  // =====================================================
  // QUIZ / CAMPAIGN DASHBOARD API
  // =====================================================
  // Gets:
  // quizStarts
  // quizCompletions
  // avgQuizScore
  // =====================================================

  useEffect(() => {
    const fetchQuizDashboard = async () => {
      try {
        const response = await axios.get(
          "/api/campaigns/dashboard"
        );

        console.log(
          "Quiz Dashboard Response:",
          response.data
        );

        if (
          response.status === 200 &&
          response.data?.success
        ) {
          const data =
            response.data?.data || {};

          setStatsData(data);

          setQuizStarts(
            data?.quizStarts || 0
          );

          setQuizCompletions(
            data?.quizCompletions || 0
          );

          setAvgQuizScore(
            data?.avgQuizScore || 0
          );
        }
      } catch (error) {
        console.error(
          "Quiz Dashboard Error:",
          error.response?.data ||
            error.message
        );

        setStatsData(null);

        setQuizStarts(0);

        setQuizCompletions(0);

        setAvgQuizScore(0);
      }
    };

    fetchQuizDashboard();
  }, []);

  // =====================================================
  // REFS
  // =====================================================

  const fileref = useRef();

  const docterExcelRef = useRef();

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    // ===================================================
    // EXISTING CARD
    // ===================================================

    {
      title: "Total Doctors",

      value: totalDoctors || 0,

      icon: (
        <Users
          className="text-violet-600"
          size={22}
        />
      ),
    },

    // ===================================================
    // EXISTING CARD
    // ===================================================

    {
      title: "Total Qr Codes",

      value: totalQrScans || 0,

      icon: (
        <QrCode
          className="text-orange-600"
          size={22}
        />
      ),
    },

    // ===================================================
    // NEW CARD
    // ===================================================

    {
      title: "Quiz Starts",

      value: quizStarts || 0,

      icon: (
        <ClipboardList
          className="text-blue-500"
          size={22}
        />
      ),
    },

    // ===================================================
    // NEW CARD
    // ===================================================

    {
      title: "Quiz Completions",

      value: quizCompletions || 0,

      icon: (
        <BadgeCheck
          className="text-green-500"
          size={22}
        />
      ),
    },

    // ===================================================
    // NEW CARD
    // ===================================================

    {
      title: "Avg. Quiz Score",

      value: `${avgQuizScore || 0}%`,

      icon: (
        <Trophy
          className="text-yellow-500"
          size={22}
        />
      ),
    },
  ];

  // =====================================================
  // DOCTOR ACTION TABS
  // =====================================================

  const doctorStatsActionBar = [
    {
      name: "All Doctors",

      value: TABS.ACTIVE,
    },

    {
      name: `Active(${totalStatus || 0})`,

      value: TABS.ACTIVE,
    },

    {
      name: `Inactive(${
        totalVideoStatus || 0
      })`,

      value: TABS.INACTIVE,
    },

    {
      name: `Draft Pages(${0})`,

      value: TABS.DRAFT_PAGES,
    },
  ];

  // =====================================================
  // DOWNLOAD QR
  // =====================================================

  const downloadQr = (
    qrCode,
    doctorName
  ) => {
    const link =
      document.createElement("a");

    link.href = qrCode;

    link.download = `${doctorName}-qr.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // =====================================================
  // DELETE DOCTOR
  // =====================================================

  const deleteDoctorAction = async () => {
    if (!doctorToDelete) return;

    try {
      await axios.delete(
        `/api/doctors/${doctorToDelete}`
      );

      setDoctors((prevDoctors) =>
        prevDoctors.filter(
          (doc) =>
            doc._id !== doctorToDelete
        )
      );

      await fetchDashBoardData();

      if (
        selectedDoctor?._id ===
        doctorToDelete
      ) {
        setSelectedDoctor(null);
      }

      setDoctorToDelete(null);
    } catch (error) {
      console.error(
        "Failed to delete doctor:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );
    }
  };

  // =====================================================
  // CAMPAIGN LIST
  // =====================================================

  useEffect(() => {
    if (!showForm) return;

    const fetchData = async () => {
      try {
        const response =
          await axios.get(
            "/api/campaigns/campaignList"
          );

        console.log(
          "Campaign Response:",
          response.data
        );

        if (response.status === 200) {
          setCampaign(
            response.data
              ?.campaignSelector || []
          );
        }
      } catch (error) {
        console.error(
          "Campaign API Error:",
          error
        );
      }
    };

    fetchData();
  }, [showForm]);

  // =====================================================
  // ADD DOCTOR
  // =====================================================

  const handleAddDoctor = () => {
    setFormMode(
      FORM_MODE.CREATE
    );

    setSelectedDoctor(null);

    setShowForm(true);
  };

  // =====================================================
  // EDIT DOCTOR
  // =====================================================

  const handleEditDoctor = (
    doctor
  ) => {
    setFormMode(
      FORM_MODE.EDIT
    );

    setSelectedDoctor(
      doctor
    );

    setShowForm(true);
  };

  // =====================================================
  // PREVIEW IMAGE
  // =====================================================

  useEffect(() => {
    if (!previewImage) return;

    setOpenDropdown(false);
  }, [previewImage]);

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Doctors
          </h1>

          <p className="text-gray-500 mt-1 text-sm">
            Dashboard &gt; Doctors
          </p>
        </div>

        {/* =================================================
            IMPORT / EXPORT
        ================================================= */}

        <div className="flex gap-2">

          <input
            type="file"
            accept=".xlsx, .xls"
            ref={fileref}
            className="hidden"
          />

          <input
            type="file"
            accept=".xlsx, .xls"
            ref={docterExcelRef}
            className="hidden"
          />

          <button
            onClick={() =>
              fileref.current?.click()
            }
            className="
              flex
              items-center
              gap-2
              border
              border-gray-200
              bg-white
              px-5
              py-3
              font-medium
              shadow-sm
              hover:bg-gray-50
              hover:border-violet-300
              transition-all
              duration-200
              cursor-pointer
              rounded-xl
            "
          >
            <Download size={18} />

            <span>
              Import Doctors (Excel)
            </span>
          </button>

          <button
            onClick={() =>
              docterExcelRef.current?.click()
            }
            className="
              flex
              items-center
              gap-2
              border
              border-gray-200
              bg-white
              px-5
              py-3
              font-medium
              shadow-sm
              hover:bg-gray-50
              hover:border-violet-300
              transition-all
              duration-200
              cursor-pointer
              rounded-xl
            "
          >
            <Download size={18} />

            <span>
              Export (Excel)
            </span>
          </button>

          <button
            onClick={handleAddDoctor}
            className="
              flex
              items-center
              gap-2
              border
              text-white
              font-semibold
              bg-violet-600
              px-5
              py-3
              shadow-sm
              hover:bg-violet-700
              hover:shadow-lg
              active:scale-95
              transition-all
              duration-200
              cursor-pointer
              rounded-xl
            "
          >
            <Plus
              size={18}
              className="shrink-0"
            />

            <span>
              Add New Doctors
            </span>
          </button>

        </div>
      </div>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {stats.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            icon={s.icon}
          />
        ))}

      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="flex flex-col xl:flex-row items-start gap-6 mt-6">

        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <div className="flex-1 min-w-0 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

          {/* =================================================
              TABS
          ================================================= */}

          <div className="flex items-center gap-1 border-b border-gray-200 pb-3">

            {doctorStatsActionBar.map(
              (s, index) => {

                const isActive =
                  currentTab ===
                  s.value;

                return (
                  <button
                    key={`${s.name}-${index}`}
                    onClick={() =>
                      setCurrentTab(
                        s.value
                      )
                    }
                    className={`
                      relative
                      px-5
                      py-2
                      text-sm
                      font-medium
                      transition-all
                      duration-200

                      ${
                        isActive
                          ? "text-violet-600"
                          : "text-gray-500 hover:text-gray-800"
                      }
                    `}
                  >
                    {s.name}

                    {isActive && (
                      <span
                        className="
                          absolute
                          left-0
                          bottom-[-13px]
                          h-[2px]
                          w-full
                          bg-violet-600
                          rounded-full
                        "
                      />
                    )}
                  </button>
                );
              }
            )}

          </div>

          {/* =================================================
              DOCTOR TABLE
          ================================================= */}

          <div className="mt-5">

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="loader"></div>
              </div>
            ) : (
              <div className="border border-gray-100 rounded-2xl shadow-sm overflow-visible bg-white">

                <div className="overflow-x-auto">

                  <table className="w-full text-left border-collapse min-w-[900px]">

                    <thead className="bg-gray-50/70 border-b border-gray-100 text-[11px] uppercase tracking-wider font-bold text-gray-700">

                      <tr>

                        <th className="p-4 w-12 text-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                          />
                        </th>

                        <th className="p-4">
                          Doctor Name
                        </th>

                        <th className="p-4">
                          Specialty
                        </th>

                        <th className="p-4">
                          Clinic / Hospital
                        </th>

                        <th className="p-4">
                          City
                        </th>

                        <th className="p-4">
                          Page URL
                        </th>

                        <th className="p-4">
                          Status
                        </th>

                        <th className="p-4 text-center">
                          QR Code
                        </th>

                        <th className="p-4 text-center">
                          Images
                        </th>

                        <th className="p-4 text-center">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {doctors?.map(
                        (item, index) => (
                          <tr
                            key={
                              item._id ||
                              index
                            }
                            className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                            onClick={() =>
                              setSelectedDoctor(
                                item
                              )
                            }
                          >

                            <td className="p-4 text-center">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                              />
                            </td>

                            <td className="p-4 font-medium">
                              {item.name ||
                                "N/A"}
                            </td>

                            <td className="p-4">
                              {item.specialty ||
                                item.specialties ||
                                "N/A"}
                            </td>

                            <td className="p-4">
                              {item.clinic ||
                                item.hospital ||
                                item.clinicName ||
                                "N/A"}
                            </td>

                            <td className="p-4">
                              {item.city ||
                                "N/A"}
                            </td>

                            <td className="p-4 text-violet-600 underline decoration-violet-300">
                              {item.pageUrl ||
                                `/dr/${
                                  item.slug ||
                                  "name"
                                }`}
                            </td>

                            <td className="p-4">

                              <span
                                className={`
                                  px-2.5
                                  py-0.5
                                  rounded-md
                                  text-[10px]
                                  font-bold
                                  tracking-wide
                                  uppercase

                                  ${
                                    item.status ===
                                    "active"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-rose-50 text-rose-600"
                                  }
                                `}
                              >
                                {item.status ||
                                  "inactive"}
                              </span>

                            </td>

                            <td
                              className="p-4 text-center"
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                            >

                              {item.qrCode && (
                                <button
                                  onClick={() =>
                                    downloadQr(
                                      item.qrCode,
                                      item.name
                                    )
                                  }
                                  className="
                                    p-1.5
                                    bg-violet-50
                                    text-violet-600
                                    rounded-lg
                                    hover:bg-violet-100
                                    transition
                                    inline-flex
                                    items-center
                                    justify-center
                                  "
                                >
                                  <QrCode
                                    size={14}
                                  />
                                </button>
                              )}

                            </td>

                            <td
                              className="p-4 text-center"
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                            >

                              {item
                                ?.imageFilePath
                                ?.length >
                              0 ? (
                                <button
                                  onClick={() =>
                                    window.open(
                                      `/api/doctors/${item._id}/download-images`
                                    )
                                  }
                                  className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-violet-200
                                    bg-violet-50
                                    px-3
                                    py-2
                                    text-violet-700
                                    hover:bg-violet-100
                                  "
                                >
                                  <Images
                                    size={14}
                                  />

                                  <span className="text-xs">
                                    Images
                                  </span>
                                </button>
                              ) : (
                                <span className="text-xs text-gray-400">
                                  None
                                </span>
                              )}

                            </td>

                            <td
                              className="p-4 text-center"
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                            >

                              <div className="flex justify-center gap-2">

                                <button
                                  onClick={() =>
                                    handleEditDoctor(
                                      item
                                    )
                                  }
                                  className="
                                    p-2
                                    text-violet-600
                                    bg-violet-50
                                    rounded-lg
                                    hover:bg-violet-100
                                  "
                                >
                                  <Edit2
                                    size={15}
                                  />
                                </button>

                                <button
                                  onClick={() =>
                                    setDoctorToDelete(
                                      item._id
                                    )
                                  }
                                  className="
                                    p-2
                                    text-red-600
                                    bg-red-50
                                    rounded-lg
                                    hover:bg-red-100
                                  "
                                >
                                  <Trash2
                                    size={15}
                                  />
                                </button>

                              </div>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>
            )}

          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-5">

            <div className="flex items-center gap-4">

              <p className="text-sm text-gray-500">
                Showing {start} to {end} of{" "}
                {totalRecords} Doctors
              </p>

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(
                    Number(
                      e.target.value
                    )
                  );

                  setPage(1);
                }}
                className="
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-2
                  text-sm
                  bg-white
                "
              >
                {[10, 20, 30, 40].map(
                  (o) => (
                    <option
                      key={o}
                      value={o}
                    >
                      {o} per page
                    </option>
                  )
                )}
              </select>

            </div>

            <div className="flex flex-wrap items-center gap-2">

              <button
                disabled={page === 1}
                onClick={() =>
                  setPage(page - 1)
                }
                className="
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  hover:bg-gray-50
                  transition-all
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <ChevronLeft
                  size={18}
                />
              </button>

              {Array.from(
                {
                  length:
                    Math.max(
                      0,
                      endPage -
                        startPage +
                        1
                    ),
                },
                (_, index) =>
                  startPage + index
              ).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() =>
                      setPage(
                        pageNumber
                      )
                    }
                    className={`
                      w-10
                      h-10
                      rounded-xl
                      border
                      text-sm
                      font-medium
                      transition-all

                      ${
                        page ===
                        pageNumber
                          ? "border-violet-500 bg-violet-50 text-violet-600"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                disabled={
                  page === totalpages ||
                  totalpages === 0
                }
                onClick={() =>
                  setPage(page + 1)
                }
                className="
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  hover:bg-gray-50
                  transition-all
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <ChevronRight
                  size={18}
                />
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      <ConfirmationModal
        isOpen={Boolean(
          doctorToDelete
        )}
        onClose={() =>
          setDoctorToDelete(null)
        }
        onConfirm={
          deleteDoctorAction
        }
        title="Delete This Doctor?"
        message="Are you absolutely sure? This will permanently wipe out all tracking logs, metrics, and data structures associated with this Doctor."
        confirmText="Yes, Delete it"
        cancelText="No, Keep it"
      />

      {/* =================================================
          DOCTOR FORM
      ================================================= */}

      {showForm && (
        <DoctorForm
          formMode={formMode}
          selectedDoctor={
            selectedDoctor
          }
          campaign={campaign}
          onClose={() => {
            setShowForm(false);
            setSelectedDoctor(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setSelectedDoctor(null);
            fetchDashBoardData();
          }}
        />
      )}

    </div>
  );
}