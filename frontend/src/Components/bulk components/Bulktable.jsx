import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const doctors = [
  {
    name: "Dr. Manohar Lele",
    specialty: "Gastroenterologist",
    clinic: "Gastro Care Centre",
    city: "Mumbai",
    mobile: "9876543210",
    email: "manohar@gmail.com",
  },
  {
    name: "Dr. Priya Shah",
    specialty: "Endocrinologist",
    clinic: "Diabetes Care Clinic",
    city: "Pune",
    mobile: "9823456781",
    email: "priya@gmail.com",
  },
  {
    name: "Dr. Amit Verma",
    specialty: "Cardiologist",
    clinic: "Heart & Health Clinic",
    city: "Nagpur",
    mobile: "9834567890",
    email: "amit@gmail.com",
  },
];

function BulkTable({ onSelect }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* Tabs */}
      <div className="flex gap-6 text-sm border-b pb-3 mb-4">
        <span className="text-indigo-600 border-b-2 border-indigo-600 pb-2">
          Valid (142)
        </span>
        <span className="text-gray-500">All Rows (150)</span>
        <span className="text-gray-500">Errors (6)</span>
        <span className="text-gray-500">Duplicates (2)</span>
      </div>

      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="text-left py-2">Doctor Name</th>
            <th>Specialty</th>
            <th>Clinic / Hospital</th>
            <th>City</th>
            <th>Mobile</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {doctors.map((doc, i) => (
            <tr
              key={i}
              //onClick={() =>  onSelect(doc) } // 🔥 ONLY FUNCTIONALITY
              // onClick={() => onSelect({ ...doc })}
              //onClick={() => console.log("Selected doctor in table:", doc)}
              onClick={() => {
                console.log("CLICKED:", doc);
                onSelect(doc); // 💥 YE MISSING THA
              }}
              className="border-b hover:bg-gray-50 cursor-pointer"
            >
              <td className="py-3 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                {doc.name}
              </td>
              <td>{doc.specialty}</td>
              <td>{doc.clinic}</td>
              <td>{doc.city}</td>
              <td>{doc.mobile}</td>
              <td>{doc.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-center text-indigo-600 text-sm mt-4 cursor-pointer">
        View all 142 valid rows
      </p>
    </div>
  );
}

export default BulkTable;
