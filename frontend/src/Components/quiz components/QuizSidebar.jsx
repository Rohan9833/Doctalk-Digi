import React from "react";
import {
  FaRegEye,
  FaEdit,
  FaList,
  FaChartBar,
} from "react-icons/fa";
import { BsBarChart } from "react-icons/bs";
import { MdOutlineQuiz } from "react-icons/md";

function QuizSidebar({ quiz }) {
  console.log("dsadada", quiz);

  if (!quiz) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-sm">
        Select a quiz
      </div>
    );
  }

  // ==========================================
  // DYNAMIC STATUS
  // ==========================================

  const quizStatus = quiz.status?.toLowerCase();

  const getStatusStyle = () => {
    switch (quizStatus) {
      case "active":
        return "bg-green-100 text-green-600";

      case "draft":
        return "bg-purple-100 text-purple-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-5">

      {/* 🔹 HEADER */}

      <div className="flex items-start gap-3">

        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
          🧠
        </div>

        <div className="flex-1 min-w-0">

          <h2 className="text-[15px] font-semibold text-gray-800 leading-tight">
            {quiz.quizName || quiz.name || "-"}
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Version {quiz.version || "-"} •{" "}
            {quiz.question ?? quiz.questions ?? 0} Questions
          </p>

        </div>

        {/* ================= DYNAMIC STATUS ================= */}

        <span
          className={`
            text-[11px]
            px-2
            py-1
            rounded-md
            font-medium
            whitespace-nowrap
            ${getStatusStyle()}
          `}
        >
          {quiz.status || "-"}
        </span>

      </div>

      {/* 🔹 OVERVIEW */}

      <div>

        <p className="text-xs font-semibold text-gray-600 mb-1">
          Overview
        </p>

        <p className="text-xs text-gray-500 leading-relaxed">
          {quiz.description ||
            "A knowledge assessment quiz designed for GERD awareness and patient education."}
        </p>

      </div>

      {/* 🔹 DETAILS */}

      <div className="space-y-3 text-sm">

        <div>

          <p className="text-xs text-gray-500">
            Linked Campaign
          </p>

          <p className="text-sm text-indigo-600 font-medium cursor-pointer">
            {quiz.linkedCampaign || "-"}
          </p>

        </div>

        <div>

          <p className="text-xs text-gray-500">
            Therapy Area
          </p>

          <p className="text-sm text-gray-800">
            {quiz.therapyArea || "-"}
          </p>

        </div>

        <div>

          <p className="text-xs text-gray-500">
            Client
          </p>

          <p className="text-sm text-gray-800">
            {quiz.client || "-"}
          </p>

        </div>

      </div>

      {/* 🔹 SCORE BANDS */}

      <div>

        <p className="text-xs font-semibold text-gray-600 mb-2">
          Default Score Bands
        </p>

        <div className="space-y-2 text-xs">

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-gray-600">
              Excellent (80-100%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-gray-600">
              Good (60-79%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span className="text-gray-600">
              Average (40-59%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-gray-600">
              Needs Improvement (0-39%)
            </span>
          </div>

        </div>

      </div>

      {/* 🔹 DIVIDER */}

      <div className="border-t pt-4"></div>

      {/* 🔹 QUICK ACTIONS */}

      <div>

        <p className="text-xs font-semibold text-gray-600 mb-3">
          Quick Actions
        </p>

        <div className="space-y-3 text-sm">

          <div className="flex items-center gap-2 cursor-pointer hover:underline">
            <FaRegEye size={14} className="text-indigo-600" />
            Preview Quiz
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:underline">
            <FaEdit size={14} className="text-indigo-600" />
            Edit Quiz Details
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:underline">
            <FaList size={14} className="text-indigo-600" />
            Manage Questions ({quiz.question ?? quiz.questions ?? 0})
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:underline">
            <MdOutlineQuiz size={16} className="text-indigo-600" />
            Manage Score Bands
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:underline">
            <BsBarChart size={14} className="text-indigo-600" />
            Manage Result Pages
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:underline">
            <FaChartBar size={14} className="text-indigo-600" />
            View Quiz Analytics
          </div>

          <div className="flex items-center gap-2 text-red-500 cursor-pointer mt-3">
            🗑 Archive Quiz
          </div>

        </div>

      </div>

    </div>
  );
}

export default QuizSidebar;