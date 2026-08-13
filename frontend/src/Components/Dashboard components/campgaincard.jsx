// // import React from "react";
// // import { Info } from "lucide-react";

// // const campaigns = [
// //   {
// //     name: "GERD Awareness Quiz",
// //     doctors: 428,
// //     scans: "24,683",
// //     starts: "14,325",
// //     completions: "11,231",
// //     score: "69.2%",
// //   },
// //   {
// //     name: "Diabetes Lifestyle Quiz",
// //     doctors: 312,
// //     scans: "15,842",
// //     starts: "9,876",
// //     completions: "7,452",
// //     score: "66.8%",
// //   },
// //   {
// //     name: "Hypertension Awareness",
// //     doctors: 256,
// //     scans: "9,532",
// //     starts: "5,612",
// //     completions: "4,231",
// //     score: "63.5%",
// //   },
// //   {
// //     name: "Asthma Control Quiz",
// //     doctors: 192,
// //     scans: "5,321",
// //     starts: "3,102",
// //     completions: "2,183",
// //     score: "61.3%",
// //   },
// // ];

// // function CampaignPerformanceCard() {
// //   return (
// //     <div className="bg-white rounded-2xl shadow-sm p-2 w-full h-full">

// //       {/* Header */}
// //       <div className="flex items-center gap-2 mb-6">
// //         <h2 className="text-lg font-semibold text-gray-800">
// //           Campaign Performance
// //         </h2>
// //         <Info size={16} className="text-gray-400" />
// //       </div>

// //       {/* Table Header */}
// //       <div className="grid grid-cols-8 text-sm text-gray-500 mb-4 justify-end items-center"> 
// //         <span className="col-span-2">Campaign</span>
// //         <span className="whitespace-nowrap">Doctors</span>
// //         <span className="whitespace-nowrap">QR Scans</span>
// //         <span className="whitespace-nowrap">Quiz Starts</span>
// //         <span className="whitespace-nowrap">Completions</span>
// //         <span className="whitespace-nowrap">Avg. Score</span>
// //         <span className="whitespace-nowrap">Trend</span>
// //       </div>

// //       {/* Rows */}
// //       <div className="space-y-4">
// //         {campaigns.map((item, index) => (
// //           <div
// //             key={index}
// //             className="grid grid-cols-8 items-center text-sm text-gray-700"
// //           >
// //             {/* Campaign */}
// //             <span className="col-span-2 font-medium text-gray-800">
// //               {item.name}
// //             </span>

// //             <span>{item.doctors}</span>
// //             <span>{item.scans}</span>
// //             <span>{item.starts}</span>
// //             <span>{item.completions}</span>
// //             <span>{item.score}</span>

// //             {/* Trend (fake sparkline) */}
// //             <div className="flex items-center">
// //               <svg
// //                 width="50"
// //                 height="20"
// //                 viewBox="0 0 50 20"
// //                 fill="none"
// //               >
// //                 <path
// //                   d="M2 15 C10 5, 20 18, 30 8 S45 12, 48 6"
// //                   stroke="#22c55e"
// //                   strokeWidth="2"
// //                   fill="none"
// //                 />
// //               </svg>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Button */}
// //       <button className="mt-4 border border-indigo-300 text-indigo-600 px-4 py-2 rounded-lg text-sm hover:bg-indigo-50 transition">
// //         View All Campaigns
// //       </button>
// //     </div>
// //   );
// // }

// // export default CampaignPerformanceCard;

// import React from "react";
// import { Info } from "lucide-react";

// const campaigns = [
//   {
//     name: "GERD Awareness Quiz",
//     doctors: 428,
//     scans: "24,683",
//     starts: "14,325",
//     completions: "11,231",
//     score: "69.2%",
//   },
//   {
//     name: "Diabetes Lifestyle Quiz",
//     doctors: 312,
//     scans: "15,842",
//     starts: "9,876",
//     completions: "7,452",
//     score: "66.8%",
//   },
//   {
//     name: "Hypertension Awareness",
//     doctors: 256,
//     scans: "9,532",
//     starts: "5,612",
//     completions: "4,231",
//     score: "63.5%",
//   },
//   {
//     name: "Asthma Control Quiz",
//     doctors: 192,
//     scans: "5,321",
//     starts: "3,102",
//     completions: "2,183",
//     score: "61.3%",
//   },
// ];

// function CampaignPerformanceCard() {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-5 w-full h-full">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-6">
//         <h2 className="text-lg font-semibold text-gray-800">
//           Campaign Performance
//         </h2>

//         <Info size={16} className="text-gray-400" />
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto scrollbar-hide">
//         <table className="w-full min-w-[950px]">
//           <thead>
//             <tr className="border-b border-gray-100 text-sm text-gray-500">
//               <th className="text-left font-medium py-3 pr-8">
//                 Campaign
//               </th>

//               <th className="text-left font-medium py-3 px-4">
//                 Doctors
//               </th>

//               <th className="text-left font-medium py-3 px-4 whitespace-nowrap">
//                 QR Scans
//               </th>

//               <th className="text-left font-medium py-3 px-4 whitespace-nowrap">
//                 Quiz Starts
//               </th>

//               <th className="text-left font-medium py-3 px-4 whitespace-nowrap">
//                 Completions
//               </th>

//               <th className="text-left font-medium py-3 px-4 whitespace-nowrap">
//                 Avg. Score
//               </th>

//               <th className="text-left font-medium py-3 pl-4">
//                 Trend
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {campaigns.map((item, index) => (
//               <tr
//                 key={index}
//                 className="border-b border-gray-50 last:border-0"
//               >
//                 <td className="py-5 pr-8 font-medium text-gray-800">
//                   {item.name}
//                 </td>

//                 <td className="py-5 px-4 text-gray-700">
//                   {item.doctors}
//                 </td>

//                 <td className="py-5 px-4 text-gray-700">
//                   {item.scans}
//                 </td>

//                 <td className="py-5 px-4 text-gray-700">
//                   {item.starts}
//                 </td>

//                 <td className="py-5 px-4 text-gray-700">
//                   {item.completions}
//                 </td>

//                 <td className="py-5 px-4 text-gray-700 font-medium">
//                   {item.score}
//                 </td>

//                 <td className="py-5 pl-4">
//                   <svg
//                     width="55"
//                     height="20"
//                     viewBox="0 0 55 20"
//                     fill="none"
//                   >
//                     <path
//                       d="M2 15 C10 5, 20 18, 30 8 S45 12, 53 6"
//                       stroke="#22c55e"
//                       strokeWidth="2.5"
//                       fill="none"
//                       strokeLinecap="round"
//                     />
//                   </svg>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Button */}
//       <button className="mt-6 border border-indigo-300 text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50 transition">
//         View All Campaigns
//       </button>
//     </div>
//   );
// }

// export default CampaignPerformanceCard;
import React from "react";
import { Info } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";

function CampaignPerformanceCard({ data }) {
  // Data coming from main dashboard API
  const campaignPerformance =
    data?.campaignPerformance || [];

  // Data coming from /api/campaigns/dashboard
  const [campaignData, setCampaignData] = useState([]);

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await axios.get(
          "/api/campaigns/dashboard"
        );

        console.log(
          "Campaign Dashboard:",
          response.data?.campaignData
        );

        setCampaignData(
          response.data?.campaignData || []
        );
      } catch (error) {
        console.error(
          "Campaign API Error:",
          error.response?.status,
          error.response?.data
        );
      }
    };

    fetchCampaignData();
  }, []);

  // Show first 3 campaigns initially
  const visibleCampaigns = showAll
    ? campaignData
    : campaignData.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 w-full h-full">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Campaign Performance
        </h2>

        <Info
          size={16}
          className="text-gray-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[950px]">

          <thead>
            <tr className="border-b border-gray-100 text-sm text-gray-500">

              <th className="text-left font-medium py-3 pr-8">
                Campaign
              </th>

              <th className="text-left font-medium py-3 px-4">
                Doctors
              </th>

              <th className="text-left font-medium py-3 px-4 whitespace-nowrap">
                QR Scans
              </th>

              <th className="text-left font-medium py-3 px-4 whitespace-nowrap">
                Quiz Starts
              </th>

              <th className="text-left font-medium py-3 px-4 whitespace-nowrap">
                Completions
              </th>

              <th className="text-left font-medium py-3 px-4 whitespace-nowrap">
                Avg. Score
              </th>

              <th className="text-left font-medium py-3 pl-4">
                Trend
              </th>

            </tr>
          </thead>

          <tbody>
            {visibleCampaigns.length > 0 ? (

              visibleCampaigns.map((item) => {

                // Find matching campaign performance
                const performance =
                  campaignPerformance.find(
                    (campaign) =>
                      campaign._id === item._id
                  );

                return (
                  <tr
                    key={item._id}
                    className="border-b border-gray-50 last:border-0"
                  >

                    {/* Campaign */}
                    <td className="py-5 pr-8 font-medium text-gray-800">
                      {item.name}
                    </td>

                    {/* Doctors */}
                    <td className="py-5 px-4 text-gray-700">
                      {item.doctors?.length || 0}
                    </td>

                    {/* QR Scans */}
                    <td className="py-5 px-4 text-gray-700">
                      {performance?.qrScans?.toLocaleString() ?? "-"}
                    </td>

                    {/* Quiz Starts */}
                    <td className="py-5 px-4 text-gray-500">
                      -
                    </td>

                    {/* Completions */}
                    <td className="py-5 px-4 text-gray-500">
                      {item.completions ?? "-"}
                    </td>

                    {/* Avg Score */}
                    <td className="py-5 px-4 text-gray-500 font-medium">
                      {item.avgScore ?? "-"}
                    </td>

                    {/* Trend */}
                    <td className="py-5 pl-4 text-gray-500">
                      -
                    </td>

                  </tr>
                );
              })

            ) : (

              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No campaign data available
                </td>
              </tr>

            )}
          </tbody>

        </table>
      </div>

      {/* Button */}
      {campaignData.length > 3 && (
        <button
          onClick={() =>
            setShowAll((prev) => !prev)
          }
          className="mt-6 border border-indigo-300 text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50 transition"
        >
          {showAll
            ? "Show Less"
            : "View All Campaigns"}
        </button>
      )}

    </div>
  );
}

export default CampaignPerformanceCard;