import React from "react";

function Stepper() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">

      {[
        "Upload Excel",
        "Validate Data",
        "Map Fields",
        "Preview & Confirm",
        "Import",
      ].map((step, i) => (
        <div key={i} className="flex items-center gap-2">

          <div
            className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium
            ${i === 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-600"
              }`}
          >
            {i + 1}
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium">{step}</span>
            <span className="text-xs text-gray-400">
              {i === 0 && "Upload your file"}
              {i === 1 && "Review & validate"}
              {i === 2 && "Map columns"}
              {i === 3 && "Review & confirm"}
              {i === 4 && "Import doctors"}
            </span>
          </div>

          {i !== 4 && <div className="w-10 h-[1px] bg-gray-300 mx-2" />}
        </div>
      ))}

    </div>
  );
}

export default Stepper;