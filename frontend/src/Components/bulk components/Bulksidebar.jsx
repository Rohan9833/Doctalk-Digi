import React from "react";
import { FaFileExcel } from "react-icons/fa";

// function BulkSidebar({ doctor }) {
//   return (
//     <div className="space-y-5">

//       {/* Upload File */}
//       <div className="bg-white p-5 rounded-xl shadow-sm">
//         <p className="text-green-600 text-sm mb-3">
//           ✔ File uploaded successfully
//         </p>

//         <div className="flex items-center gap-3 border rounded-lg p-3">
//           <FaFileExcel className="text-green-600 text-2xl" />
//           <div>
//             <p className="text-sm font-medium">doctors_bulk_upload.xlsx</p>
//             <p className="text-xs text-gray-500">15.6 KB</p>
//           </div>
//         </div>
//       </div>

//       {/* 🔥 DYNAMIC DOCTOR DETAILS */}
//       {doctor && (
//         <div className="bg-white p-5 rounded-xl shadow-sm">
//           <h3 className="text-sm font-semibold mb-3">Doctor Details</h3>

//           <p><b>Name:</b> {doctor.name}</p>
//           <p><b>Specialty:</b> {doctor.specialty}</p>
//           <p><b>Clinic:</b> {doctor.clinic}</p>
//           <p><b>City:</b> {doctor.city}</p>
//           <p><b>Mobile:</b> {doctor.mobile}</p>
//           <p><b>Email:</b> {doctor.email}</p>
//         </div>
//       )}

//     </div>
//   );
// }
function BulkSidebar({ doctor }) {
  console.log("Sidebar doctor:", doctor);

  return (
    <div className="space-y-5">

      {/* Upload File */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <p className="text-green-600 text-sm mb-3">
          ✔ File uploaded successfully
        </p>
      </div>

      {/* FIXED */}
      {doctor ? (
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Doctor Details</h3>

          <p><b>Name:</b> {doctor.name}</p>
          <p><b>Specialty:</b> {doctor.specialty}</p>
          <p><b>Clinic:</b> {doctor.clinic}</p>
          <p><b>City:</b> {doctor.city}</p>
          <p><b>Mobile:</b> {doctor.mobile}</p>
          <p><b>Email:</b> {doctor.email}</p>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-xl shadow-sm text-gray-400">
          Click a row to see details
        </div>
      )}

    </div>
  );
}

export default BulkSidebar;