import React from "react";
import {
  UserPlus,
  FileSpreadsheet,
  Plus,
  Video,
  Mic,
  QrCode,
  BarChart3,
} from "lucide-react";

const actions = [
  {
    label: "Add New Doctor",
    icon: <UserPlus size={16} />,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    label: "Bulk Upload (Excel)",
    icon: <FileSpreadsheet size={16} />,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    label: "Create New Quiz",
    icon: <Plus size={16} />,
    bg: "bg-indigo-100",
    color: "text-indigo-600",
  },
  {
    label: "Upload Video",
    icon: <Video size={16} />,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
  {
    label: "Upload Voiceover",
    icon: <Mic size={16} />,
    bg: "bg-pink-100",
    color: "text-pink-600",
  },
  {
    label: "Generate QR Codes",
    icon: <QrCode size={16} />,
    bg: "bg-indigo-100",
    color: "text-indigo-600",
  },
  {
    label: "View Reports",
    icon: <BarChart3 size={16} />,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
];

function Bottomsection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm  w-fit">
      
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Quick Actions
      </h2>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition whitespace-nowrap"
          >
            {/* Icon */}
            <span
              className={`w-6 h-6 flex items-center justify-center rounded-md ${action.bg}`}
            >
              <span className={action.color}>{action.icon}</span>
            </span>

            {/* Text */}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Bottomsection;