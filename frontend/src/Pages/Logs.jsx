import React, { useState } from 'react'
import LogsHeader from "../Components/Logs/LogsHeader.jsx"
import LogDetails from "../Components/Logs/LogDetails.jsx"
import LogsTable from "../Components/Logs/LogsTable.jsx"



function Logs() {
  const [selectedLog, setSelectedLog] = useState(null);

  return (
    <div className="space-y-3 p-4 sm:p-5">
      {/* HEADER */}
      <LogsHeader />

      {/* TABLE + DETAILS */}
      <div
        className="
          grid
          grid-cols-1
          gap-3
          xl:grid-cols-[minmax(0,1fr)_320px]
        "
      >
        {/* LOG TABLE */}
        <LogsTable
          onSelectLog={(log) => {
            setSelectedLog(log);
          }}
        />

        {/* LOG DETAILS */}
        <LogDetails
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      </div>
    </div>
  );
}

export default Logs;