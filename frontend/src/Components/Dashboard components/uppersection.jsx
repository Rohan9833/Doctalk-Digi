
import { MdOutlineCalendarMonth, MdPeopleAlt } from "react-icons/md";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa";
import { IoDocumentTextOutline, IoQrCodeSharp } from "react-icons/io5";
import { CiCircleChevRight } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Uppersection() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [statdata, setStatdata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "/api/analytics/adminDashboard"
        );

        console.log(response.data);

        setStatdata(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Top bar */}
      <div className="flex justify-between items-center">
        <div className="font-bold">
          <h1>Dashboard</h1>

          <p className="font-normal text-gray-600">
            Welcome back, here's what's happening with your platform
          </p>
        </div>

        <div className="border-2 border-gray-500 flex gap-2 items-center p-1 rounded relative">
          <MdOutlineCalendarMonth />

          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates;

              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            dateFormat="d MMMM yyyy"
            customInput={
              <button className="flex items-center gap-2 cursor-pointer">
                <span>
                  {startDate.toLocaleDateString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}

                  {" - "}

                  {endDate
                    ? endDate.toLocaleDateString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Select End Date"}
                </span>

                <FaChevronDown />
              </button>
            }
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-6 gap-4">
        {/* Total Doctors */}
        <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl">
          <div className="flex gap-2 items-center">
            <MdPeopleAlt
              size={40}
              className="bg-purple-300 rounded p-1"
            />

            <span>
              <p className="text-sm text-gray-600">
                Total Doctors
              </p>

              <h1 className="font-bold text-2xl">
                {statdata?.doctorStats?.totalDoctors ?? 0}
              </h1>
            </span>
          </div>

          <p className="text-sm">
            Active:{" "}
            <span className="text-green-500">
              {statdata?.doctorStats?.activeDoctors ?? 0}
            </span>{" "}
            Inactive:{" "}
            <span className="text-red-500">
              {statdata?.doctorStats?.inactiveDoctors ?? 0}
            </span>
          </p>
        </div>

        {/* Active Doctor Pages */}
        <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl">
          <div className="flex gap-2 items-center">
            <IoDocumentTextOutline
              size={40}
              className="bg-blue-600 rounded p-1 text-white"
            />

            <span>
              <p className="text-sm text-gray-600">
                Active Doctor Pages
              </p>

              <h1 className="font-bold text-2xl">
                {statdata?.doctorPageStats?.totalActiveDoctors ?? 0}
              </h1>
            </span>
          </div>

          <p className="text-sm">
            Published:{" "}
            <span className="text-green-500">
              {statdata?.doctorPageStats?.totalPublishedDoctors ?? 0}
            </span>{" "}
            Draft:{" "}
            <span className="text-red-500">
              {statdata?.doctorPageStats?.totalDraftDoctors ?? 0}
            </span>
          </p>
        </div>

        {/* QR Scans */}
        <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl">
          <div className="flex gap-2 items-center">
            <IoQrCodeSharp
              size={40}
              className="bg-green-500 rounded p-1 text-white"
            />

            <span>
              <p className="text-sm text-gray-600">
                Total QR Scans
              </p>

              <h1 className="font-bold text-2xl">
                {statdata?.totalScans ?? 0}
              </h1>
            </span>
          </div>

          <p className="text-sm text-gray-600">
            Scan analytics
          </p>
        </div>

        {/* Quiz Starts */}
        <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl">
          <div className="flex gap-2 items-center">
            <CiCircleChevRight
              size={40}
              className="bg-orange-400 rounded p-1 text-white"
            />

            <span>
              <p className="text-sm text-gray-600">
                Quiz Starts
              </p>

              <h1 className="font-bold text-2xl">
                {statdata?.quizStats?.starts ?? "-"}
              </h1>
            </span>
          </div>

          <p className="text-sm text-gray-600">
            Available soon
          </p>
        </div>

        {/* Quiz Completions */}
        <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl">
          <div className="flex gap-2 items-center">
            <MdPeopleAlt
              size={40}
              className="bg-purple-300 rounded p-1"
            />

            <span>
              <p className="text-sm text-gray-600">
                Quiz Completions
              </p>

              <h1 className="font-bold text-2xl">
                {statdata?.quizStats?.completions ?? "-"}
              </h1>
            </span>
          </div>

          <p className="text-sm text-gray-600">
            Available soon
          </p>
        </div>

        {/* Avg Quiz Score */}
        <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl">
          <div className="flex gap-2 items-center">
            <FaRegStar
              size={40}
              className="bg-purple-500 rounded p-1 text-white"
            />

            <span>
              <p className="text-sm text-gray-600">
                Avg. Quiz Score
              </p>

              <h1 className="font-bold text-2xl">
                {statdata?.quizStats?.averageScore ?? "-"}
              </h1>
            </span>
          </div>

          <p className="text-sm text-gray-600">
            Available soon
          </p>
        </div>
      </div>
    </div>
  );
}

export default Uppersection;

