import React from "react";
import ReportsHeader from "../Components/Reports/ReportsHeader";
import ReportsContent from "../Components/Reports/ReportsContent";
import ReportsSidebar from "../Components/Reports/ReportsSidebar";

function Reports() {
  return (
    <div className="space-y-3 p-4 sm:p-5">
      <ReportsHeader />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ReportsContent />

        <ReportsSidebar />
      </div>
    </div>
  );
}

export default Reports;