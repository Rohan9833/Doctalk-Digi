// import React from "react";
// import { FaPlus, FaQrcode, FaUpload } from "react-icons/fa";

// function QuickActions() {
//   const actions = [
//     "Bulk Upload Doctors",
//     "Create New Quiz",
//     "Generate QR Codes",
//     "Upload Voiceovers",
//     "Upload Videos",
//   ];

//   return (
//     <div className="bg-white p-5 rounded-xl shadow-sm">
//       <h3 className="font-semibold mb-4">Quick Actions</h3>

//       <div className="grid grid-cols-5 gap-3">
//         {actions.map((a, i) => (
//           <div key={i} className="border rounded-lg p-3 text-center text-sm hover:bg-gray-50 cursor-pointer">
//             {a}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default QuickActions;

// import React from "react";
// import { FaUpload, FaPlus, FaQrcode, FaMicrophone, FaVideo } from "react-icons/fa";

// const actions = [
//   {
//     title: "Bulk Upload Doctors",
//     sub: "Import via Excel",
//     icon: <FaUpload />,
//     bg: "bg-teal-100",
//     color: "text-teal-600",
//   },
//   {
//     title: "Create New Quiz",
//     sub: "Build quiz content",
//     icon: <FaPlus />,
//     bg: "bg-blue-100",
//     color: "text-blue-600",
//   },
//   {
//     title: "Generate QR Codes",
//     sub: "Create for campaign",
//     icon: <FaQrcode />,
//     bg: "bg-indigo-100",
//     color: "text-indigo-600",
//   },
//   {
//     title: "Upload Voiceovers",
//     sub: "MP3, WAV, M4A",
//     icon: <FaMicrophone />,
//     bg: "bg-purple-100",
//     color: "text-purple-600",
//   },
//   {
//     title: "Upload Videos",
//     sub: "MP4, MOV",
//     icon: <FaVideo />,
//     bg: "bg-indigo-100",
//     color: "text-indigo-600",
//   },
// ];

// function QuickActions() {
//   return (
//     <div className="bg-white p-5 rounded-xl shadow-sm ">
      
//       {/* Title */}
//       <h2 className="text-lg font-semibold text-gray-800 mb-1">
//         Quick Actions
//       </h2>

//       {/* Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//         {actions.map((item, index) => (
//           <div
//             key={index}
//             className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow transition cursor-pointer"
//           >
            
//             {/* Icon */}
//             <div
//               className={` p-2 flex items-center justify-center rounded-lg ${item.bg}`}
//             >
//               <span className={`${item.color}`}>
//                 {item.icon}
//               </span>
//             </div>

//             {/* Text */}
//             <div>
//               <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
//                 {item.title}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {item.sub}
//               </p>
//             </div>

//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default QuickActions;

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