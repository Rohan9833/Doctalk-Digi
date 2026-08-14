import { useState, useEffect, useRef, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Download,
  Megaphone,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Users,
  FileCheck,
  QrCode,
  Eye,
  ClipboardList,
  BadgeCheck,
  Edit2,
  MoreVertical,
  Trash2,
  FileImage,
  Images,
} from "lucide-react";
import axios from "axios";
import ConfirmationModal from "../Confirmation Model/ConfirmationModel";
import { createPortal } from "react-dom";
import DoctorForm from "./DoctorForm";
import { showSuccess } from "../../utils/alert";

const FORM_MODE = {
  CREATE: "create",
  EDIT: "edit",
};
const TABS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  DRAFT_PAGES: "Draft Pages",
};

//Reusable Cards Component

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2">{value}</h2>
        </div>

        <div className="p-3 rounded-xl bg-violet-100">{icon}</div>
      </div>
    </div>
  );
};

export default function DoctorDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [doctors, setDoctors] = useState([]);
  const [totalpages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalQrScans, setTotalQrScans] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [status, setStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [specialties, setSpecialities] = useState([]);
  const [selectedSpecialty, setSelectedSpeciality] = useState("");
  const [skip, setSkip] = useState(0);
  const [currentTab, setCurrentTab] = useState(TABS.ACTIVE);
  const [publishedPages, setPublishedPages] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [totalStatus, setTotalStatus] = useState(null);
  const [totalVideoStatus, setTotalVideoStatus] = useState(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [previewImage, setPreviewImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [campaign, setCampaign] = useState([]);
  const [formMode, setFormMode] = useState(FORM_MODE.CREATE);
  const [editFormValue, setEditFormValue] = useState(null);
  const [isEditClicked, setIsEditClicked] = useState(false);

  const visiblePages = 4;

  const startPage = Math.max(1, page - Math.floor(visiblePages / 2));

  const endPage = Math.min(totalpages, startPage + visiblePages - 1);

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalRecords);

  const fetchDashBoardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios("api/doctors/getDoctorDashboard", {
        params: {
          page,
          limit,
          search: searchQuery,
          currentTab,
          city: selectedCity,
          status: selectedStatus,
          specialties: selectedSpecialty,
        },
      });

      console.log("Full Response:", response.data);

      if (response.status === 200) {
        setDoctors(response.data?.doctorsData);
        setTotalPages(response.data?.totalPages);
        setTotalRecords(response.data?.totalRecords);
        setCity(response.data?.cities);
        setSpecialities(response.data?.specialti);
        setStatus(response.data?.statuses);
        setPublishedPages(response.data?.stats?.publishedPages);
        setTotalDoctors(response.data?.stats?.totalDoctors);
        setTotalStatus(response.data?.stats?.status);
        setTotalVideoStatus(response.data?.stats?.videoStatuses);
      } else {
        console.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    page,
    limit,
    currentTab,
    selectedCity,
    selectedSpecialty,
    selectedStatus,
    qrGenerated,
  ]);

  useEffect(() => {
    fetchDashBoardData();
    console.log("Doctor Data: ", doctors);
  }, [fetchDashBoardData]);

  const fileref = useRef();
  const docterExcelRef = useRef();

  const stats = [
    {
      title: "Total Doctors",
      value: totalDoctors || 0,
      icon: Users,
      color: "text-violet-600",
    },

    // {
    //   title: "Published Pages",
    //   value: publishedPages || 0,
    //   icon: FileCheck,
    //   color: "text-green-600",
    // },

    {
      title: "Total Qr Codes",
      value: totalQrScans || 0,
      icon: QrCode,
      color: "text-orange-600",
    },

    // {
    //   title: "Total Page Views",
    //   value: statsData?.QuizAttempts || 0,
    //   icon: Eye,
    //   color: "text-blue-600",
    // },

    {
      title: "Quiz Attempts",
      value: statsData?.avgCompletionRate || 0,
      icon: ClipboardList,
      color: "text-blue-400",
    },

    {
      title: "Completions",
      value: statsData?.avgCompletionRate || 0,
      icon: BadgeCheck,
      color: "text-blue-400",
    },
  ];

  const doctorStatsActionBar = [
    {
      name: "All Doctors",
      url: "www.example.com",
    },

    {
      name: `Active(${totalStatus})`,
      url: "www.example.com",
      value: TABS.ACTIVE,
    },

    {
      name: `Inactive(${totalVideoStatus})`,
      url: "www.example.com",
      value: TABS.INACTIVE,
    },

    {
      name: `Draft Pages(${0})`,
      url: "www.example.com",
      value: TABS.DRAFT_PAGES,
    },
  ];

  const downloadQr = (qrCode, doctorName) => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `${doctorName}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteDoctorAction = async () => {
    if (!doctorToDelete) return;

    try {
      // 1. Send delete request to backend
      await axios.delete(`/api/doctors/${doctorToDelete}`);

      // 2. Optimistically update local state so the row disappears immediately
      setDoctors((prevDoctors) =>
        prevDoctors.filter((doc) => doc._id !== doctorToDelete),
      );
      await fetchDashBoardData();

      // 3. Clear selected doctor if the panel was open for them
      if (selectedDoctor?._id === doctorToDelete) {
        setSelectedDoctor(null);
      }

      // 4. Close the modal
      setDoctorToDelete(null);
    } catch (error) {
      console.error("Failed to delete doctor:", error);
      alert("Something went wrong while deleting. Please try again.");
    }
  };

  useEffect(() => {
    if (!showForm) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2468/api/campaigns/campaignList",
        );

        console.log("Response:", response.data);

        if (response.status === 200) {
          setCampaign(response.data?.campaignSelector);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [showForm, isEditClicked]);

  useEffect(() => {
    console.log(campaign);
    console.log("campaign", campaign);
    console.log("isArray:", Array.isArray(campaign));
  }, [campaign, showForm]);

  useEffect(() => {
    console.log("campaign state changed:", campaign);
  }, [campaign]);

  const handleAddDoctor = () => {
    setFormMode(FORM_MODE.CREATE);
    setSelectedDoctor(null);
    setShowForm(true);
    console.log("showForm", showForm);
  };

  const handleEditDoctor = (doctor) => {
    setFormMode(FORM_MODE.EDIT);
    setSelectedDoctor(doctor);
    setShowForm(true);
    console.log("showForm", showForm);
  };

  useEffect(() => {
    if (!previewImage) return;

    setOpenDropdown(false);
  }, [previewImage]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-500 mt-1 text-sm">Dashboard &gt; Doctors</p>
        </div>

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

        <div className="flex gap-2 ">
          <button
            onClick={() => fileref.current.click()}
            className="flex items-center gap-2 border border-gray-200 bg-white px-5 py-3 font-medium shadow-sm hover:bg-gray-50 hover:border-violet-300 transition-all duration-200 cursor-pointer rounded-xl"
          >
            <Download size={18} />
            <span>Import Doctors (Excel)</span>
          </button>

          <button
            onClick={() => docterExcelRef.current.click()}
            className="flex items-center gap-2 border border-gray-200 bg-white px-5 py-3 font-medium shadow-sm hover:bg-gray-50 hover:border-violet-300 transition-all duration-200 cursor-pointer rounded-xl"
          >
            <Download size={18} />
            <span>Export (Excel)</span>
          </button>

          <button
            onClick={handleAddDoctor}
            className="flex items-center gap-2 border text-white font-semibold bg-violet-600 px-5 py-3  shadow-sm hover:bg-violet-700 hover:shadow-lg hover:border-violet-300 active:scale-95 transition-all duration-200 cursor-pointer rounded-xl"
          >
            <Plus size={18} className="shrink-0" />
            <span>Add New Doctors</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;

          return (
            <StatCard
              key={s.title}
              title={s.title}
              value={s.value}
              icon={<Icon className={s.color} size={22} />}
            />
          );
        })}
      </div>

      <div className="flex flex-col xl:flex-row items-start gap-6 mt-6">
        <div className="flex-1 min-w-0 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div
            className={`
    flex gap-4
    ${
      selectedDoctor
        ? "flex-col"
        : "flex-col xl:flex-row xl:items-center xl:justify-between"
    }
  `}
          >
            <div className="flex items-center gap-1 border-b border-gray-200 pb-3">
              {doctorStatsActionBar.map((s) => {
                const isActive = currentTab === s.value;

                return (
                  <button
                    key={s.name}
                    onClick={() => setCurrentTab(s.value)}
                    className={`
          relative px-5 py-2 text-sm font-medium transition-all duration-200
          ${isActive ? "text-violet-600" : "text-gray-500 hover:text-gray-800"}
        `}
                  >
                    {s.name}

                    {isActive && (
                      <span className="absolute left-0 bottom-[-13px] h-[2px] w-full bg-violet-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex  flex-wrap items-center gap-4">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpeciality(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 outline-violet-400"
              >
                <option>All Specialities</option>

                {specialties.map((c) => (
                  <option key={c.specialty} value={c.specialty}>
                    {c.specialty}s
                  </option>
                ))}
              </select>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 outline-violet-400"
              >
                <option>All Cities</option>

                {city.map((c) => (
                  <option key={c.city} value={c.city}>
                    {c.city}s
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 outline-violet-400"
              >
                <option>All Status</option>
                {status.map((c) => (
                  <option key={c.status} value={c.status}>
                    {c.status}s
                  </option>
                ))}
              </select>

              <button className="border border-gray-200 rounded-xl px-4 py-3 outline-violet-400">
                Filter
              </button>
            </div>
          </div>

          {/* Table of Doctors */}

          {/* Table of Doctors */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="mt-5 border border-gray-100 rounded-2xl shadow-sm overflow-visible bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  {/* Table Head */}
                  <thead className="bg-gray-50/70 border-b border-gray-100 text-[11px] uppercase tracking-wider font-bold text-gray-700">
                    <tr>
                      <th className="p-4 w-12 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                        />
                      </th>
                      <th className="p-4">Doctor Name</th>
                      <th className="p-4">Specialty</th>
                      <th className="p-4">Clinic / Hospital</th>
                      <th className="p-4">City</th>
                      <th className="p-4">Page URL</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">QR Code</th>
                      <th className="p-4 text-center">Images</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                    {doctors.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-50/80 transition cursor-pointer"
                      >
                        {/* Checkbox */}
                        <td
                          className="p-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                          />
                        </td>

                        {/* Doctor Name with Avatar Placeholder */}
                        <td className="p-4 font-semibold text-gray-900 flex items-center gap-3">
                          <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-[10px] uppercase">
                            <img
                              src={
                                item?.imageFilePath
                                  ? `http://192.168.1.37:2468/${item.imageFilePath[0]?.filePath.replace(/\\/g, "/")}`
                                  : "/default-avatar.png"
                              }
                              alt={item.name}
                              className=" rounded-full object-cover border border-gray-100"
                            />
                          </div>
                          <span>{item.name || "Unknown Doctor"}</span>
                        </td>

                        {/* Specialty */}
                        <td className="p-4 text-gray-500">
                          {item.specialty || "General Physician"}
                        </td>

                        {/* Clinic */}
                        <td className="p-4 text-gray-500">
                          {item.clinic || "Clinic / Hospital"}
                        </td>

                        {/* City */}
                        <td className="p-4 text-gray-600">
                          {item.city || "N/A"}
                        </td>

                        {/* Page URL */}
                        <td className="p-4 text-violet-600 underline decoration-violet-300">
                          {item.pageUrl || `/dr/${item.slug || "name"}`}
                        </td>

                        {/* Status Badge */}
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                              item.status === "active"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-rose-50 text-rose-600"
                            }`}
                          >
                            {item.status || "inactive"}
                          </span>
                        </td>

                        {/* QR Icon Trigger */}
                        <td
                          className="p-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadQr(item.qrCode, item.name);
                            }}
                            className="p-1.5 bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition inline-flex items-center justify-center"
                          >
                            <QrCode size={14} />
                          </button>
                        </td>

                        <td
                          className="p-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-center">
                            {item?.imageFilePath?.length > 0 ? (
                              <button
                                onClick={() =>
                                  window.open(
                                    `http://localhost:2468/api/doctors/${item._id}/download-images`,
                                  )
                                }
                                className="group flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-violet-700 shadow-sm transition-all hover:border-violet-300 hover:bg-violet-100 hover:shadow-md"
                              >
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
                                  <Images size={14} />
                                </div>

                                <span className="text-sm font-semibold">
                                  {item.imageFilePath.length}
                                </span>

                                <span className="text-xs text-violet-600">
                                  {item.imageFilePath.length === 1
                                    ? "Image"
                                    : "Images"}
                                </span>

                                <Download
                                  size={14}
                                  className="transition-transform group-hover:translate-y-0.5"
                                />
                              </button>
                            ) : (
                              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
                                <Images size={14} />
                                <span className="text-sm">No Images</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Action Group */}
                        <td
                          className="p-4 text-center"
                          onClick={(e) => e.stopPropagation()} // Keeps row selection from triggering
                        >
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEditDoctor(item)}
                              className="p-1 text-gray-400 hover:text-violet-600 rounded transition"
                            >
                              <Edit2 size={14} />
                            </button>

                            <button
                              onClick={() => setDoctorToDelete(item._id)} // <-- Stage this specific ID for deletion
                              className="p-1 text-gray-400 hover:text-gray-600 rounded transition"
                            >
                              <Trash2 size={14} />
                            </button>

                            {/* REMOVED ConfirmationModal FROM HERE */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mt-6">
            {/* Left Side */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="text-sm text-gray-500">
                Showing {start} to {end} of {totalRecords} Doctors
              </p>

              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="
        border border-gray-200
        rounded-xl
        px-4 py-2
        text-sm
        bg-white
      "
              >
                {[10, 20, 30, 40].map((o) => (
                  <option key={o} value={o}>
                    {o} per page
                  </option>
                ))}
              </select>
            </div>

            {/* Right Side */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Previous */}
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="
      w-10 h-10
      flex items-center justify-center
      rounded-xl
      border border-gray-200
      bg-white
      hover:bg-gray-50
      transition-all
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
              >
                <ChevronLeft size={18} />
              </button>

              {/* Page Numbers */}
              {Array.from(
                { length: endPage - startPage + 1 },
                (_, index) => startPage + index,
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`
        w-10 h-10
        rounded-xl
        border
        text-sm
        font-medium
        transition-all
        ${
          page === pageNumber
            ? "border-violet-500 bg-violet-50 text-violet-600"
            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        }
      `}
                >
                  {pageNumber}
                </button>
              ))}

              {/* Next */}
              <button
                disabled={page === totalpages}
                onClick={() => setPage(page + 1)}
                className="
      w-10 h-10
      flex items-center justify-center
      rounded-xl
      border border-gray-200
      bg-white
      hover:bg-gray-50
      transition-all
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={Boolean(doctorToDelete)}
        onClose={() => setDoctorToDelete(null)}
        onConfirm={deleteDoctorAction}
        title="Delete This Campaign?"
        message="Are you absolutely sure? This will permanently wipe out all tracking logs, metrics, and data structures associated with this Doctor."
        confirmText="Yes, Delete it"
        cancelText="No, Keep it"
      />

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="truncate pr-4">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {previewImage.name}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {previewImage.type} • {previewImage.size}
                </p>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-sm px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors duration-150"
              >
                Close View
              </button>
            </div>
            {/* Image Body wrapper */}
            <div className="bg-slate-900 flex items-center justify-center p-2 overflow-auto flex-1">
              <img
                src={`http://192.168.1.37:2468/${previewImage.filePath.replace(/\\/g, "/")}`}
                alt="Document Verification Preview"
                className="max-w-full max-h-[60vh] object-contain rounded shadow"
              />
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <DoctorForm
          onClose={setShowForm}
          campaigns={campaign}
          mode={formMode}
          doctorData={selectedDoctor}
        />
      )}
    </div>
  );
}
