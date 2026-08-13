// import React from "react";
// import { PieChart, Pie, Cell } from "recharts";
// import { Info } from "lucide-react";

// const data = [
//   { name: "Mobile", value: 76.4, count: "20,516", color: "#4F46E5" },
//   { name: "Desktop", value: 18.7, count: "5,021", color: "#3B82F6" },
//   { name: "Tablet", value: 4.9, count: "1,306", color: "#22C55E" },
// ];

// function DeviceOverviewCard() {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-3 w-full h-full">
      
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-6">
//         <h2 className="text-lg font-semibold text-gray-800">
//           Device Overview
//         </h2>
//         <Info size={16} className="text-gray-400" />
//       </div>

//       <div className="flex items-center gap-6">
        
//         {/* Donut Chart */}
//         <div className="relative">
//           <PieChart width={180} height={180}>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               innerRadius={55}
//               outerRadius={75}
//               dataKey="value"
//               stroke="none"
//             >
//               {data.map((entry, index) => (
//                 <Cell key={index} fill={entry.color} />
//               ))}
//             </Pie>
//           </PieChart>

//           {/* Center Text */}
//           <div className="absolute inset-0 flex flex-col items-center justify-center">
//             <p className="text-xs text-gray-500">Total</p>
//             <p className="text-lg font-semibold text-gray-800">
//               26,843
//             </p>
//           </div>
//         </div>

//         {/* Legend */}
//         <div className="space-y-4">
//           {data.map((item, index) => (
//             <div key={index} className="flex items-center gap-3">
              
//               {/* Dot */}
//               <span
//                 className="w-3 h-3 rounded-full"
//                 style={{ backgroundColor: item.color }}
//               ></span>

//               {/* Text */}
//               <div className="text-sm">
//                 <p className="text-gray-700 font-medium">
//                   {item.name}
//                 </p>
//                 <p className="text-gray-500">
//                   {item.value}% ({item.count})
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Button */}
//       <button className="mt-4 border border-indigo-300 text-indigo-600 px-4 py-2 rounded-lg text-sm hover:bg-indigo-50 transition">
//         View Full Analytics
//       </button>
//     </div>
//   );
// }

// export default DeviceOverviewCard;import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { Info } from "lucide-react";

function DeviceOverviewCard({ data }) {
  const totalScans = data?.totalScans || 0;

  const colors = {
    mobile: "#4F46E5",
    desktop: "#3B82F6",
    tablet: "#22C55E",
  };

  const deviceData =
    data?.deviceBreakDown?.map((item) => ({
      name:
        item._id.charAt(0).toUpperCase() +
        item._id.slice(1),
      value: item.percentage,
      count: item.count,
      color: colors[item._id] || "#9CA3AF",
    })) || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-3 w-full h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Device Overview
        </h2>

        <Info size={16} className="text-gray-400" />
      </div>

      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative">
          <PieChart width={180} height={180}>
            <Pie
              data={deviceData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              dataKey="value"
              stroke="none"
            >
              {deviceData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              ))}
            </Pie>
          </PieChart>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-gray-500">
              Total
            </p>

            <p className="text-lg font-semibold text-gray-800">
              {totalScans.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-4">
          {deviceData.length > 0 ? (
            deviceData.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3"
              >
                {/* Dot */}
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                {/* Text */}
                <div className="text-sm">
                  <p className="text-gray-700 font-medium">
                    {item.name}
                  </p>

                  <p className="text-gray-500">
                    {item.value}% (
                    {item.count.toLocaleString()})
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No device data available
            </p>
          )}
        </div>
      </div>

      {/* Button */}
      <button className="mt-4 border border-indigo-300 text-indigo-600 px-4 py-2 rounded-lg text-sm hover:bg-indigo-50 transition">
        View Full Analytics
      </button>
    </div>
  );
}

export default DeviceOverviewCard;