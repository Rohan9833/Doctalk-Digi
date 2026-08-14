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

              <th className="text-left font-medium py-3 px-5 w-[220px] min-w-[220px]">
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

                  <td className="py-3 px-5 font-medium text-gray-800">
                    {quiz.quizName || "-"}
                  </td>

                  {/* Therapy Area */}

                  <td className="py-3 px-5 text-gray-700">
                    {quiz.therapyArea || "-"}
                  </td>

                  {/* Client */}

                  <td className="py-3 px-5 text-gray-700">
                    {quiz.client || "-"}
                  </td>

                  {/* Questions */}

                  <td className="py-3 px-5 text-gray-700">
                    {quiz.question ?? 0}
                  </td>

                  {/* Version */}

                  <td className="py-3 px-5 text-gray-700">
                    {quiz.version || "-"}
                  </td>

                  {/* Status */}

                  <td className="py-3 px-5">

                    <span
                      className={`
                        inline-flex
                        px-2.5
                        py-0.5
                        rounded-md
                        text-xs
                        font-medium
                        ${
                          quiz.status === "active"
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

                  <td className="py-3 px-5 text-gray-700 whitespace-nowrap">
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
                    py-8
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
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
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