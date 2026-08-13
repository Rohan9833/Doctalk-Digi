import React from "react";

function BulkStats() {
  const stats = [
    { title: "Total Rows", value: "150", color: "bg-purple-50" },
    { title: "Valid Rows", value: "142", color: "bg-green-50" },
    { title: "Rows with Errors", value: "6", color: "bg-orange-50" },
    { title: "Duplicate Doctors", value: "2", color: "bg-blue-50" },
    { title: "Empty Rows", value: "0", color: "bg-gray-50" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((item, i) => (
        <div key={i} className={`${item.color} p-4 rounded-xl border`}>
          <p className="text-sm text-gray-500">{item.title}</p>
          <h2 className="text-xl font-semibold text-gray-800">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default BulkStats;