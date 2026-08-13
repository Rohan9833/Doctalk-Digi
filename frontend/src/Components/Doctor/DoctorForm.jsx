import React from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { showSuccess, showError } from "../../utils/alert";

function DoctorForm({ onClose, campaigns, mode,  doctorData}) {
  console.log("DoctorForm Rendered");
  // Initialize React Hook Form with defaults
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      specialty: "",
      qualification: "",
      registrationNumber: "",
      email: "",
      mobile: "",
      clinic: "",
      address: "",
      city: "",
      state: "",
      campaignIds: [], // Array to hold multiple selected campaign IDs
      status: true,    // true for Active, false for Inactive
    },
  });


  useEffect(() => {
    if(mode === "edit" && doctorData) {
      reset({
        name: doctorData.name || "",
        specialty: doctorData.specialty || "",
        qualification: doctorData.qualification || "",
        registrationNumber: doctorData.registrationNumber || "",
        email: doctorData.email || "",
        mobile: doctorData.mobile || "",
        clinic: doctorData.clinic || "",
        address: doctorData.address || "",
        city: doctorData.city || "",
        state: doctorData.state || "",
        campaignIds: doctorData.campaignDetails?.map(c => c._id) || [],
        status: doctorData.status === "active",
      })

    }
  }, [mode, doctorData, reset])

  // Watch status to dynamically update the UI of the toggle switch
  const currentStatus = watch("status");

  // Form submission handler
  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      ...data,
      status: data.status ? "active" : "inactive",
    };

    console.log(payload)


    if(mode === "create") {

    try {
      const res = await axios.post("http://localhost:2468/api/doctors/createDoctor", payload);
      if (res.status === 201) {
        showSuccess("Doctor Created Successfully")
        reset()
        onClose(false); // Passes true back to parent to trigger data refresh if needed
      }
    } catch (error) {
      console.error("Error creating doctor:", error);
    } finally {
      setLoading(false);
    }
  }else if (mode === "edit" && doctorData) {
  try {
    const res = await axios.put(
      `http://localhost:2468/api/doctors/${doctorData._id}`,
      payload
    );

    if (res.status === 200) {
      showSuccess(res.data.message);
      onClose(false);
      reset();
    }
  } catch (error) {
    showError(error.response?.data?.message || error.message);
  } finally {
    setLoading(false);
  }
}
  }



  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl flex flex-col shadow-xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
          <div>
            <h2>
  {mode === "edit" ? "Edit Doctor" : "Add Doctor"}
</h2>
            <p className="text-sm text-gray-500 mt-1">Fill in the profile and professional credentials of the doctor.</p>
          </div>
          <button
            onClick={() => onClose(false)}
            type="button"
            className="p-2 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 flex-1">
          
          {/* Grid Layout for Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Doctor Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Doctor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all ${
                  errors.name ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-600"
                }`}
                placeholder="e.g. Dr. Jane Doe"
                {...register("name", { required: "Doctor name is required" })}
              />
              {errors.name && <span className="text-xs font-medium text-red-500">{errors.name.message}</span>}
            </div>

            {/* Specialty */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Specialty <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all ${
                  errors.specialty ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-600"
                }`}
                placeholder="e.g. Cardiologist"
                {...register("specialty", { required: "Specialty is required" })}
              />
              {errors.specialty && <span className="text-xs font-medium text-red-500">{errors.specialty.message}</span>}
            </div>

            {/* Qualification */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Qualification <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all ${
                  errors.qualification ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-600"
                }`}
                placeholder="e.g. MBBS, MD"
                {...register("qualification", { required: "Qualification is required" })}
              />
              {errors.qualification && <span className="text-xs font-medium text-red-500">{errors.qualification.message}</span>}
            </div>

            {/* Registration Number */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all ${
                  errors.registrationNumber ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-600"
                }`}
                placeholder="e.g. REG-123456"
                {...register("registrationNumber", { required: "Registration number is required" })}
              />
              {errors.registrationNumber && <span className="text-xs font-medium text-red-500">{errors.registrationNumber.message}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className={`w-full border rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all ${
                  errors.email ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-600"
                }`}
                placeholder="doctor@example.com"
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                })}
              />
              {errors.email && <span className="text-xs font-medium text-red-500">{errors.email.message}</span>}
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className={`w-full border rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all ${
                  errors.mobile ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-600"
                }`}
                placeholder="e.g. +1 234 567 8900"
                {...register("mobile", { required: "Mobile number is required" })}
              />
              {errors.mobile && <span className="text-xs font-medium text-red-500">{errors.mobile.message}</span>}
            </div>

            {/* Clinic Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Clinic / Hospital Name</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all"
                placeholder="e.g. Metro Health Clinic"
                {...register("clinic")}
              />
            </div>

            {/* City */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">City</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all"
                placeholder="e.g. New York"
                {...register("city")}
              />
            </div>

            {/* State */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">State</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all"
                placeholder="e.g. NY"
                {...register("state")}
              />
            </div>

          </div>

          {/* Campaigns Multiple Selection Container (Spans Full Width) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Assigned Campaigns <span className="text-red-500">*</span>
            </label>
            <div className={`w-full border rounded-xl p-4 bg-gray-50 max-h-48 overflow-y-auto transition-all ${
              errors.campaignIds ? "border-red-500 ring-2 ring-red-500/10" : "border-gray-200"
            }`}>
              {Array.isArray(campaigns) && campaigns.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {campaigns.map((campaign) => {
                    const id = campaign._id;
                    const name = campaign.name;
                    return (
                      <label 
                        key={id} 
                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 hover:border-indigo-500/30 hover:bg-indigo-50/10 cursor-pointer transition-all select-none group"
                      >
                        {/* Checkbox placed cleanly on the left (in front) */}
                        <input
                          type="checkbox"
                          value={id}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                          {...register("campaignIds", { required: "Please select at least one campaign" })}
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-900 truncate">
                          {name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No campaigns available.</p>
              )}
            </div>
            {errors.campaignIds && <span className="text-xs font-medium text-red-500">{errors.campaignIds.message}</span>}
          </div>

          {/* Full Address - Full Width */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Full Address</label>
            <textarea
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all resize-none"
              placeholder="Provide clinic or personal chamber address details..."
              {...register("address")}
            />
          </div>

          {/* Status Toggle Switch */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-800">Doctor Status</label>
              <p className="text-xs text-gray-500">Determine whether this profile is currently active in the directory.</p>
            </div>
            
            <button
              type="button"
              onClick={() => setValue("status", !currentStatus)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                currentStatus ? "bg-indigo-600" : "bg-gray-200"
              }`}
            >
              <span className="sr-only">Toggle Doctor Status</span>
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  currentStatus ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Form Actions Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm shadow-indigo-100 text-sm disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Doctor"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}


export default DoctorForm;