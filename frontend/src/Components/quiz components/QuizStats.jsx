// import React from "react";

// const stats = [
//   {
//     title: "Total Quizzes",
//     value: "28",
//     sub: "Active: 22 | Draft: 4 | Archived: 2",
//   },
//   {
//     title: "Total Questions",
//     value: "356",
//     sub: "Avg. Questions / Quiz: 12.7",
//   },
//   {
//     title: "Linked Campaigns",
//     value: "18",
//     sub: "Active: 15 | Completed: 3",
//   },
//   {
//     title: "Total Attempts",
//     value: "84,215",
//     sub: "↑ 15.3% vs last 7 days",
//   },
//   {
//     title: "Avg. Completion Rate",
//     value: "68.7%",
//     sub: "↑ 4.8% vs last 7 days",
//   },
// ];

// function QuizStats() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//       {stats.map((item, i) => (
//         <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
//           <p className="text-sm text-gray-500">{item.title}</p>
//           <h2 className="text-xl font-semibold text-gray-800">
//             {item.value}
//           </h2>
//           <p className="text-xs text-gray-500">{item.sub}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default QuizStats;

import React from "react";
import { FaUsers, FaQuestionCircle, FaLink, FaChartBar } from "react-icons/fa";
import { MdOutlineLeaderboard } from "react-icons/md";



function QuizStats({ data }){
  const stats = [
  {
  title: "Total Quizzes",
  value: data?.quizzesDataForStats?.totalQuizzes ?? 0,
  sub: `Active: ${
    data?.quizzesDataForStats?.totalActiveQuizzes ?? 0
  } | Draft: ${
    data?.quizzesDataForStats?.totalDraftQuizzes ?? 0
  }`,
  icon: <FaUsers />,
  bg: "bg-purple-100",
  color: "text-purple-600",
},
{
  title: "Total Questions",
  value:
    data?.quizTable?.reduce(
      (sum, quiz) => sum + (quiz.question || 0),
      0
    ) ?? 0,

  sub: `Avg. Questions / Quiz: ${
    data?.quizTable?.length
      ? (
          data.quizTable.reduce(
            (sum, quiz) => sum + quiz.question,
            0
          ) / data.quizTable.length
        ).toFixed(1)
      : 0
  }`,

  icon: <FaQuestionCircle />,
  bg: "bg-green-100",
  color: "text-green-600",
},
{
  title: "Linked Campaigns",
  value: data?.quizTable?.length ?? 0,

  sub: `Linked: ${
    data?.quizTable?.filter(
      q => q.linkedCampaign
    ).length ?? 0
  }`,

  icon: <FaLink />,
  bg: "bg-orange-100",
  color: "text-orange-600",
},
{
  title: "Total Attempts",
  value: "-",
  sub: "Coming Soon",
  icon: <FaChartBar />,
  bg: "bg-blue-100",
  color: "text-blue-600",
},
{
  title: "Avg. Completion Rate",
  value: "-",
  sub: "Coming Soon",
  icon: <MdOutlineLeaderboard />,
  bg: "bg-pink-100",
  color: "text-pink-600",
},
];
  return (
    <div className="grid grid-cols-5 gap-4">
      {stats.map((item, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow-sm flex gap-3">

          <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${item.bg}`}>
            <span className={item.color}>{item.icon}</span>
          </div>

          <div>
            <p className="text-xs text-gray-500">{item.title}</p>
            <h2 className="text-lg font-semibold">{item.value}</h2>
            <p className="text-xs text-gray-400">{item.sub}</p>
          </div>

        </div>
      ))}
    </div>
  );
}

export default QuizStats;