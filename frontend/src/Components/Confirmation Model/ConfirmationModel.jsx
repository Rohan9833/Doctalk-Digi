import React from "react";
import { AlertTriangle, X } from "lucide-react";

function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to perform this action? This step cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel"
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden transform transition-all border border-gray-100">
        
        {/* Header Close Button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Section */}
        <div className="px-6 pb-6 text-center sm:text-left sm:flex sm:items-start sm:gap-4">
          
          {/* Warning Icon Backdrop */}
          <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>

          <div className="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200 outline-none"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-xl hover:bg-amber-700 active:bg-amber-800 shadow-sm shadow-amber-100 transition-colors focus:ring-2 focus:ring-amber-200 outline-none"
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmationModal;