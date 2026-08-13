import React from "react";
import { Info, CheckCircle, Upload, QrCode, Video, ClipboardCheck } from "lucide-react";

const activities = [
  {
    title: "Doctor page published",
    desc: "Dr. Sandeep Rao - Hyderabad",
    time: "2 mins ago",
    icon: <CheckCircle size={18} />,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "Excel import completed",
    desc: "120 doctors imported successfully",
    time: "15 mins ago",
    icon: <Upload size={18} />,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "QR code generated",
    desc: "Dr. Priya Shah - Pune",
    time: "32 mins ago",
    icon: <QrCode size={18} />,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
  {
    title: "Video uploaded",
    desc: "Opening scene - Dr. Amit Verma",
    time: "1 hour ago",
    icon: <Video size={18} />,
    bg: "bg-orange-100",
    color: "text-orange-600",
  },
  {
    title: "Quiz updated",
    desc: "GERD Quiz - Question 12 updated",
    time: "2 hours ago",
    icon: <ClipboardCheck size={18} />,
    bg: "bg-pink-100",
    color: "text-pink-600",
  },
];

function RecentActivityCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full h-full">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Activity
          </h2>
          <Info size={16} className="text-gray-400" />
        </div>

        <button className="text-indigo-600 text-sm font-medium hover:underline">
          View All
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-5">
        {activities.map((item, index) => (
          <div key={index} className="flex justify-between gap-10 items-center">
            
            {/* Left */}
            <div className="flex gap-3">
              
              {/* Icon */}
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-lg ${item.bg}`}
              >
                <span className={item.color}>{item.icon}</span>
              </div>

              {/* Text */}
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">
                  {item.desc}
                </p>
              </div>
            </div>

            {/* Time */}
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivityCard;