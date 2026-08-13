


import React, { useState } from "react";
import Stepper from "../components/bulk components/stepper";
//import BulkStatCard from "../components/bulk components/BulkStatCard";
import BulkTable from "../components/bulk components/BulkTable";
import BulkSidebar from "../components/bulk components/BulkSidebar";
import { FaDownload } from "react-icons/fa";
// import BulkStats from "../components/bulk components/BulkStatCard";
import BulkStats from  "../components/bulk components/Bulkstatcard";


function BulkUpload() {

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Bulk Upload Doctors (Excel)
        </h1>
        <p className="text-sm text-gray-500">
          Dashboard &gt; Doctors &gt; Bulk Upload
        </p>
      </div>

      <Stepper />

      <div className="grid grid-cols-12 gap-6">

        {/* LEFT */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Step 2: Validate Data
              </h2>
              <p className="text-sm text-gray-500">
                We have validated your file. Please review the results below.
              </p>
            </div>

            <button className="flex items-center gap-2 text-indigo-600 text-sm border px-3 py-2 rounded-lg hover:bg-indigo-50">
              <FaDownload /> Download Error Report
            </button>
          </div>

          <BulkStats />

          <BulkTable onSelect={setSelectedDoctor} />

        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-4">
          <BulkSidebar doctor={selectedDoctor} />
        </div>

      </div>
    </div>
  );
}

 export default BulkUpload;