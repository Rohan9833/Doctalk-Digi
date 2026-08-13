// src/components/MR/SendConsent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SendConsent = () => {
  const location = useLocation();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    registrationNo: "",
    qualification: "",
    address: "",
    specialty: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();
    if (location.state?.selectedDoctorId) {
      handleDoctorSelect(location.state.selectedDoctorId);
    }
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("mrToken");
      const response = await axios.get("/api/mr/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(response.data.data);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    }
  };

  const handleDoctorSelect = async (doctorId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("mrToken");
      const response = await axios.get(`/api/mr/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const doctor = response.data.data;
      setSelectedDoctor(doctor);
      setFormData({
        email: doctor.email || "",
        mobile: doctor.mobile || "",
        registrationNo: doctor.registrationNo || "",
        qualification: doctor.qualification || "",
        address: doctor.address || "",
        specialty: doctor.specialty || "",
      });
    } catch (err) {
      setError("Failed to load doctor details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateDoctor = async () => {
    try {
      const token = localStorage.getItem("mrToken");
      await axios.put(`/api/mr/doctors/${selectedDoctor._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch (err) {
      setError("Failed to update doctor details");
      return false;
    }
  };

  const handleSendConsent = async () => {
    const updated = await handleUpdateDoctor();
    if (!updated) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("mrToken");
      await axios.post(
        `/api/mr/doctors/${selectedDoctor._id}/send-consent`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Consent form sent to ${formData.email}`);
      setTimeout(() => {
        setSuccess(null);
        setSelectedDoctor(null);
        setFormData({ email: "", mobile: "", registrationNo: "", qualification: "", address: "", specialty: "" });
        fetchDoctors();
      }, 500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send consent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">My Assigned Doctors</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Select a doctor and send consent form via email.</p>
        </div>
        <button className="self-start sm:self-auto flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Doctor
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">

        {/* Select Doctor + Doctor Details row */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
          {/* Doctor Dropdown */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Select Doctor</label>
            <div className="relative">
              <select
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => handleDoctorSelect(e.target.value)}
                value={selectedDoctor?._id || ""}
              >
                <option value="">-- Select a doctor --</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialty || "No specialty"}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Doctor Info (auto-filled) */}
          {selectedDoctor && (
            <div className="md:w-64 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Doctor Details{" "}
                <span className="font-normal text-gray-400 text-xs">(Auto-filled if available)</span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Specialty:</span>{" "}
                {selectedDoctor.specialty || "—"}
              </p>
              <p className="text-sm text-gray-600 mt-0.5">
                <span className="font-medium">Clinic:</span>{" "}
                {selectedDoctor.clinicName || selectedDoctor.address || "—"}
              </p>
            </div>
          )}
        </div>

        {/* Doctor Contact Details Form */}
        {selectedDoctor && (
          <>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-blue-600">Enter / Update Doctor Contact Details</h2>
            </div>

            {/* Form Grid - 1 col mobile, 3 col desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Address - full width on mobile, spans 1 col on lg */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={2}
                />
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="registrationNo"
                  value={formData.registrationNo}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Specialty <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select specialty</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Orthopedist">Orthopedist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="General Physician">General Physician</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: info text + button */}
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="flex items-start gap-1.5 text-xs text-gray-500">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                </svg>
                Please ensure email ID is correct. Consent form and related communication will be sent to this email.
              </p>
              <button
                onClick={handleSendConsent}
                disabled={loading || !formData.email}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors whitespace-nowrap w-full sm:w-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {loading ? "Sending..." : "Email Consent Form"}
              </button>
            </div>

            {/* Success/Error */}
            {success && (
              <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                <p className="font-semibold">✅ Consent Form Sent Successfully!</p>
                <p className="text-sm mt-1">The consent form has been sent to {success}</p>
                <p className="text-xs mt-1 text-green-600">
                  Doctor will receive an email with the consent form link to review and provide consent.
                </p>
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
                ❌ {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SendConsent;