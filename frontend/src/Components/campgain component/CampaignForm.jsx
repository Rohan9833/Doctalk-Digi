import React from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import { showSuccess, showError } from "../../utils/alert";

function CampaignForm({ onClose, client, formMode, selectedCampaign }) {
  // Initialize React Hook Form
  const [isLoading, setLoading] = useState();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      clientId: "",
      therapyArea: "",
      brand: "",
      description: "",
      status: true, // true for Active, false for Inactive
    },
  });

  // Watch status to dynamically update the UI/labels of the toggle
  const currentStatus = watch("status");


  useEffect(() => {
    console.log(selectedCampaign)
    if(formMode === "edit" && selectedCampaign) {
      setValue("name", selectedCampaign.name);
      setValue("clientId", selectedCampaign?.client?._id ??  "")
      setValue("therapyArea", selectedCampaign.therapyArea)
      setValue("brand", selectedCampaign.brand)
      setValue("description", selectedCampaign.description)
      setValue("status", selectedCampaign.status)
    }
  }, [formMode, selectedCampaign, setValue])

  const onSubmit = async (data) => {
    if(isLoading) return;
    setLoading(true);
    const payload = {
      ...data,
      status: data.status ? "active" : "inactive",
    };

    if(formMode === "edit" && selectedCampaign) {
      try {
        const res = await axios.put(`http://localhost:2468/api/campaigns/${selectedCampaign._id}`, payload)
        if (res.status === 200) {
        showSuccess("Campaign edited successfully.");
        onclose();
      }
      } catch (error) {
        console.error(error);
      }finally {
        setLoading(false);
      }
    }else {
    try {
      const res = await axios.post(
        "http://localhost:2468/api/campaigns/${selectedCampaign._id}",
        payload,
      );
      if (res.status === 200) {
        showSuccess("Campaign created successfully.");
        onclose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
}
    onClose();
  };

  useEffect(() => {
    console.log("client changed:", client);
    console.log("type:", typeof client);
    console.log("isArray:", Array.isArray(client));
  }, [client]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl flex flex-col shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create Campaign
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details to launch your new campaign.
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-6 flex-1"
        >
          {/* Grid for Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaign Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Campaign Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all ${
                  errors.name
                    ? "border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-600"
                }`}
                placeholder="e.g. Q3 Product Launch"
                {...register("name", { required: "Campaign name is required" })}
              />
              {errors.name && (
                <span className="text-xs font-medium text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Client Select */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Client <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all ${
                  errors.clientId
                    ? "border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-600"
                }`}
                {...register("clientId", {
                  required: "Please select a client",
                })}
              >
                <option value="">Select Client</option>
                {Array.isArray(client)
                  ? client.map((c) => (
                      <option key={c._id.id} value={c._id.id}>
                        {c._id.name}
                      </option>
                    ))
                  : null}
              </select>
              {errors.clientId && (
                <span className="text-xs font-medium text-red-500">
                  {errors.clientId.message}
                </span>
              )}
            </div>

            {/* Brand */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all ${
                  errors.brand
                    ? "border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-600"
                }`}
                placeholder="Enter brand name"
                {...register("brand", { required: "Brand name is required" })}
              />
              {errors.brand && (
                <span className="text-xs font-medium text-red-500">
                  {errors.brand.message}
                </span>
              )}
            </div>

            {/* Therapy Area */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Therapy Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all ${
                  errors.therapyArea
                    ? "border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-600"
                }`}
                placeholder="e.g. Cardiology, Oncology"
                {...register("therapyArea", {
                  required: "Therapy area is required",
                })}
              />
              {errors.therapyArea && (
                <span className="text-xs font-medium text-red-500">
                  {errors.therapyArea.message}
                </span>
              )}
            </div>
          </div>

          {/* Description - Full Width */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all resize-none"
              placeholder="Provide a brief overview of the campaign objectives..."
              {...register("description")}
            />
          </div>

          {/* Status Toggle Switch */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-800">
                Campaign Status
              </label>
              <p className="text-xs text-gray-500">
                Determine whether this campaign is immediately visible or
                paused.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setValue("status", !currentStatus)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                currentStatus ? "bg-indigo-600" : "bg-gray-200"
              }`}
            >
              <span className="sr-only">Toggle Campaign Status</span>
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  currentStatus ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm shadow-indigo-100 text-sm"
            >
              Save Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CampaignForm;
