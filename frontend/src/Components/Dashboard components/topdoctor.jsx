// import React from "react";
// import { Info } from "lucide-react";

// const doctors = [
//   {
//     name: "Dr. Manohar Lele",
//     city: "Mumbai, MH",
//     score: 82.4,
//     img: "https://randomuser.me/api/portraits/men/32.jpg",
//   },
//   {
//     name: "Dr. Priya Shah",
//     city: "Pune, MH",
//     score: 78.6,
//     img: "https://randomuser.me/api/portraits/women/44.jpg",
//   },
//   {
//     name: "Dr. Amit Verma",
//     city: "Nagpur, MH",
//     score: 76.1,
//     img: "https://randomuser.me/api/portraits/men/45.jpg",
//   },
//   {
//     name: "Dr. Neha Iyer",
//     city: "Bengaluru, KA",
//     score: 74.3,
//     img: "https://randomuser.me/api/portraits/women/65.jpg",
//   },
//   {
//     name: "Dr. Rajesh Gupta",
//     city: "Delhi, DL",
//     score: 72.8,
//     img: "https://randomuser.me/api/portraits/men/50.jpg",
//   },
// ];

// function TopDoctorsCard() {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-2 w-full   ">

//       {/* Header */}
//       <div className="flex items-center gap-2 ">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">
//           Top Performing Doctors
//         </h2>
//         <Info size={16} className="text-gray-400" />
//       </div>

//       {/* Table Header */}
//       <div className="flex justify-between text-sm text-gray-500 mb-1 ">
//         <span>Doctor</span>
//         <span>Avg. Score</span>
//       </div>
//       <hr className=" mb-1 text-gray-600"></hr>

//       {/* List */}
//       <div className="space-y-1">
//         {doctors.map((doc, index) => (
//           <div key={index} className="flex justify-around gap-1   items-center">

//             {/* Left */}
//             <div className="flex items-center gap-3">
//               <img
//                 src={doc.img}
//                 alt={doc.name}
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//               <div>
//                 <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
//                   {doc.name}
//                 </p>
//                 <p className="text-xs text-gray-500">{doc.city}</p>
//               </div>
//             </div>

//             {/* Right */}
//             <div className="flex items-center gap-3 ">

//               {/* Progress Bar */}
//               <div className="w-10 bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-green-500 h-1.5 rounded-full"
//                   style={{ width: `${doc.score}%` }}
//                 />
//               </div>

//               {/* Score */}
//               <span className="text-sm text-gray-700 w-12 text-right">
//                 {doc.score}%
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Button */}
//      <div className=" flex justify-center">
//          <button className="mt-2  border border-indigo-300 text-indigo-600 px-3 py-2 rounded-lg text-sm hover:bg-indigo-50 transition">
//         View All Doctors
//       </button>
//      </div>
//     </div>
//   );
// }

// export default TopDoctorsCard;
import React from "react";
import { Info } from "lucide-react";

function TopDoctorsCard({ data }) {

  const doctors = data?.topPerformingDoctors || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-2 w-full">

      {/* Header */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Top Performing Doctors
        </h2>

        <Info size={16} className="text-gray-400" />
      </div>

      {/* Table Header */}
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>Doctor</span>
        <span>Avg. Score</span>
      </div>

      <hr className="mb-1 text-gray-600" />

      {/* List */}
      <div className="space-y-2">
        {doctors.length > 0 ? (
          doctors.map((doc) => (
            <div
              key={doc._id}
              className="flex justify-between items-center"
            >

              {/* Left */}
              <div className="flex items-center gap-3">

                {/* Doctor Initial */}
                <div
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-indigo-100
                    text-indigo-600
                    flex
                    items-center
                    justify-center
                    font-semibold
                    text-sm
                  "
                >
                  {doc.name
                    ?.split(" ")
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
                    {doc.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {doc.city}, {doc.state}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">

                {/* Progress Bar */}
                <div className="w-12 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${doc.performanceScore}%`,
                    }}
                  />
                </div>

                {/* Score */}
                <span className="text-sm text-gray-700 w-12 text-right">
                  {doc.performanceScore}%
                </span>

              </div>

            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 py-4 text-center">
            No doctors found
          </p>
        )}
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <button className="mt-2 border border-indigo-300 text-indigo-600 px-3 py-2 rounded-lg text-sm hover:bg-indigo-50 transition">
          View All Doctors
        </button>
      </div>

    </div>
  );
}

export default TopDoctorsCard;