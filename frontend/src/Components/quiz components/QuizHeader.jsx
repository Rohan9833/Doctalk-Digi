import React from "react";
import * as XLSX from "xlsx";
function QuizHeader({ data, setShowForm }) {
  console.log("QuizHeader Rendered");
  const exportToExcel = ({data}) => {
    console.log("excel function hit hua hain")

    const quizzes = data?.quizTable || [];

    if (quizzes.length === 0) {
      alert("No quiz data available");
      return;
    }

    const excelData = quizzes.map((quiz) => ({
      "Quiz ID": quiz.quizId,
      "Quiz Name": quiz.quizName,
      "Therapy Area": quiz.therapyArea,
      Client: quiz.client,
      Questions: quiz.question,
      Version: quiz.version,
      Status: quiz.status,
      "Linked Campaign": quiz.linkedCampaign,
      "Last Updated": new Date(quiz.lastUpdatedAt).toLocaleString("en-IN"),
      Description: quiz.description,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Quizzes");

    XLSX.writeFile(
      workbook,
      `Quizzes_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Quizzes</h1>
        <p className="text-sm text-gray-500">Dashboard &gt; Quizzes</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={exportToExcel}
          className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
        >
          Export (Excel)
        </button>
        <button  onClick={() => {
          console.log("clicked");
          setShowForm(true)
        }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
          + Add New Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizHeader;
