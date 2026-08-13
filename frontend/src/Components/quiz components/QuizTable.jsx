// import React from "react";
// import { FaEye, FaEdit, FaEllipsisV } from "react-icons/fa";

// // const data = [
// //   {
// //     name: "GERD Awareness Quiz",
// //     area: "Gastroenterology",
// //     client: "ABC Pharma Ltd.",
// //     questions: 15,
// //     version: "v2.1",
// //     status: "Active",
// //     campaign: "GERD Awareness Campaign",
// //     updated: "18 May 2025\n11:32 AM",
// //   },
// //   {
// //     name: "Diabetes Lifestyle Quiz",
// //     area: "Endocrinology",
// //     client: "XYZ Pharma",
// //     questions: 12,
// //     version: "v1.3",
// //     status: "Active",
// //     campaign: "Diabetes Care Initiative",
// //     updated: "16 May 2025\n04:20 PM",
// //   },
// //   {
// //     name: "Hypertension Awareness Quiz",
// //     area: "Cardiology",
// //     client: "CardioCare",
// //     questions: 14,
// //     version: "v1.2",
// //     status: "Active",
// //     campaign: "BP Control Campaign",
// //     updated: "15 May 2025\n09:15 AM",
// //   },
// //   {
// //     name: "Asthma Control Quiz",
// //     area: "Respiratory",
// //     client: "AstraMed",
// //     questions: 10,
// //     version: "v1.1",
// //     status: "Active",
// //     campaign: "Breathe Better Campaign",
// //     updated: "14 May 2025\n02:45 PM",
// //   },
// //   {
// //     name: "Migraine Screening Quiz",
// //     area: "Neurology",
// //     client: "NeuroLife",
// //     questions: 10,
// //     version: "v1.0",
// //     status: "Draft",
// //     campaign: "-",
// //     updated: "10 May 2025\n01:10 PM",
// //   },
// // ];

// function CampaignTable({ data, onSelect }) {

// const quizzes = data?.quizTable || [];
//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-4">
//       {/* 🔹 TABLE WRAPPER */}
//       <div className="overflow-x-auto">
//         <table className="min-w-[1000px] w-full text-sm">
//           {/* HEADER */}
//           <thead className="text-gray-500 border-b">
//             <tr className="text-left">
//               <th className="py-3 px-4">Quiz Name</th>
//               <th className="px-4">Therapy Area</th>
//               <th className="px-4">Client</th>
//               <th className="px-4">Questions</th>
//               <th className="px-4">Version</th>
//               <th className="px-4">Status</th>
//               <th className="px-4">Linked Campaign</th>
//               <th className="px-4">Last Updated</th>
//               <th className="px-4 text-center">Actions</th>
//             </tr>
//           </thead>

//           {/* BODY */}
//           <tbody>
//             {quizzes.map((item, i) => (
//               <tr
//                 key={i}
//                 onClick={() => onSelect(item)}
//                 className="border-b hover:bg-gray-50 cursor-pointer transition"
//               >
//                 <td className="py-4 px-4 font-medium text-gray-800 whitespace-nowrap">
//                   {item.quizName}
//                 </td>

//                 <td className="px-4 whitespace-nowrap">{item.therapyArea}</td>

//                 <td className="px-4 whitespace-nowrap">{item.client}</td>

//                 <td className="px-4">{item.question}</td>

//                 <td className="px-4">{item.version}</td>

//                 {/* STATUS */}
//                 <td className="px-4">
//                   <span
//                     className={`px-2 py-1 rounded-md text-xs font-medium ${
//                       item.status === "active"
//                         ? "bg-green-100 text-green-600"
//                         : item.status === "draft"
//                           ? "bg-purple-100 text-purple-600"
//                           : "bg-gray-200 text-gray-600"
//                     }`}
//                   >
//                     {item.status}
//                   </span>
//                 </td>

//                 <td className="px-4 whitespace-nowrap">
//                   {item.linkedCampaign}
//                 </td>

//                 <td className="px-4 text-gray-500 text-xs whitespace-pre-line">
//                   {new Date(item.lastUpdatedAt).toLocaleString("en-IN", {
//                     dateStyle: "medium",
//                     timeStyle: "short",
//                   })}
//                 </td>

//                 {/* ACTIONS */}
//                 <td className="px-4">
//                   <div className="flex justify-center items-center gap-3">
//                     <button className="p-2 rounded-md border hover:bg-gray-100">
//                       <FaEye className="text-gray-600" />
//                     </button>

//                     <button className="p-2 rounded-md border hover:bg-gray-100">
//                       <FaEdit className="text-gray-600" />
//                     </button>

//                     <button className="p-2 rounded-md border hover:bg-gray-100">
//                       <FaEllipsisV className="text-gray-600" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* 🔹 FOOTER / PAGINATION */}
//       <div className="flex justify-between items-center mt-4 text-sm">
//         <p className="text-gray-500">Showing 1 to 5 of 28 quizzes</p>

//         <div className="flex items-center gap-3">
//           <select className="border px-3 py-1 rounded-lg text-sm">
//             <option>10 per page</option>
//             <option>20 per page</option>
//           </select>

//           <div className="flex gap-2">
//             <button className="w-8 h-8 border rounded-md">1</button>
//             <button className="w-8 h-8 border rounded-md text-gray-500">
//               2
//             </button>
//             <button className="w-8 h-8 border rounded-md text-gray-500">
//               3
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CampaignTable;


import React from "react";

function QuizTable({
  data,
  onSelect,

  page,
  setPage,

  limit,
  setLimit,
}) {
  const quizzes = data?.quizTable || [];

  const totalQuizzes =
    data?.totalQuizzes || 0;

  const totalPages =
    data?.totalPages || 1;

  // ==========================================
  // PAGE RANGE
  // ==========================================

  const startItem =
    totalQuizzes === 0
      ? 0
      : (page - 1) * limit + 1;

  const endItem =
    Math.min(page * limit, totalQuizzes);

  // ==========================================
  // LIMIT CHANGE
  // ==========================================

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">

      {/* ================= TABLE ================= */}

      <div className="overflow-x-auto scrollbar-hide">

        <table className="w-full min-w-[950px]">

          <thead>

            <tr className="border-b border-gray-100 text-sm text-gray-500">

              <th className="text-left font-medium py-3 px-5">
                Quiz Name
              </th>

              <th className="text-left font-medium py-3 px-5">
                Therapy Area
              </th>

              <th className="text-left font-medium py-3 px-5">
                Client
              </th>

              <th className="text-left font-medium py-3 px-5">
                Questions
              </th>

              <th className="text-left font-medium py-3 px-5">
                Version
              </th>

              <th className="text-left font-medium py-3 px-5">
                Status
              </th>

              <th className="text-left font-medium py-3 px-5">
                Linked Campaign
              </th>

            </tr>

          </thead>

          <tbody>

            {quizzes.length > 0 ? (

              quizzes.map((quiz) => (

                <tr
                  key={quiz._id || quiz.quizId}
                  onClick={() => onSelect?.(quiz)}
                  className="
                    border-b
                    border-gray-100
                    last:border-0
                    hover:bg-gray-50
                    cursor-pointer
                    transition
                  "
                >

                  {/* Quiz Name */}

                  <td className="py-5 px-5 font-medium text-gray-800">

                    {quiz.quizName || "-"}

                  </td>

                  {/* Therapy Area */}

                  <td className="py-5 px-5 text-gray-700">

                    {quiz.therapyArea || "-"}

                  </td>

                  {/* Client */}

                  <td className="py-5 px-5 text-gray-700">

                    {quiz.client || "-"}

                  </td>

                  {/* Questions */}

                  <td className="py-5 px-5 text-gray-700">

                    {quiz.question ?? 0}

                  </td>

                  {/* Version */}

                  <td className="py-5 px-5 text-gray-700">

                    {quiz.version || "-"}

                  </td>

                  {/* Status */}

                  <td className="py-5 px-5">

                    <span
                      className={`
                        inline-flex
                        px-3
                        py-1
                        rounded-lg
                        text-xs
                        font-medium
                        ${quiz.status === "active"
                          ? "bg-green-100 text-green-600"
                          : quiz.status === "draft"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-gray-100 text-gray-600"
                        }
                      `}
                    >
                      {quiz.status || "-"}
                    </span>

                  </td>

                  {/* Campaign */}

                  <td className="py-5 px-5 text-gray-700 whitespace-nowrap">

                    {quiz.linkedCampaign || "-"}

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={7}
                  className="
                    text-center
                    py-10
                    text-gray-500
                  "
                >
                  No quizzes found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* ================= FOOTER ================= */}

      <div className="flex flex-wrap justify-between items-center gap-4 mt-5">

        {/* Showing */}

        <p className="text-sm text-gray-500">

          Showing{" "}
          <span className="font-medium text-gray-700">
            {startItem}
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-700">
            {endItem}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700">
            {totalQuizzes}
          </span>{" "}
          quizzes

        </p>

        {/* Pagination */}

        <div className="flex items-center gap-2">

          {/* Per Page */}

          <select
            value={limit}
            onChange={handleLimitChange}
            className="
              h-10
              px-3
              border
              border-gray-300
              rounded-lg
              bg-white
              text-sm
              outline-none
            "
          >

            <option value={5}>
              5 per page
            </option>

            <option value={10}>
              10 per page
            </option>

            <option value={20}>
              20 per page
            </option>

            <option value={50}>
              50 per page
            </option>

          </select>

          {/* Previous */}

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="
              w-10
              h-10
              rounded-lg
              border
              border-gray-300
              bg-white
              text-sm
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:bg-gray-50
            "
          >
            ←
          </button>

          {/* Current Page */}

          <button
            className="
              w-10
              h-10
              rounded-lg
              border
              border-indigo-500
              bg-indigo-50
              text-indigo-600
              text-sm
              font-medium
            "
          >
            {page}
          </button>

          {/* Next */}

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="
              w-10
              h-10
              rounded-lg
              border
              border-gray-300
              bg-white
              text-sm
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:bg-gray-50
            "
          >
            →
          </button>

        </div>

      </div>

    </div>
  );
}

export default QuizTable;