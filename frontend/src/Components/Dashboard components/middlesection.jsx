// import QuizChart from "./chart";
// import MapCard from "./mapcard";
// import TopDoctor from "./topdoctor";
// import CampaignTable from "./campgaincard";
// import DeviceOverviewCard from "./dviceoverview";
// import RecentActivity from "./recentactivitcard";

// function Middlesection() {
//   return (
//     <div className="space-y-4">

//       <div className="grid grid-cols-12 gap-2 items-start">
//         <div className="col-span-5"><QuizChart /></div>
//         <div className="col-span-4"><MapCard /></div>
//         <div className="col-span-3"><TopDoctor /></div>
//       </div>

//       <div className="grid grid-cols-12 gap-4 items-start">
//         <div className="col-span-5"><CampaignTable /></div>
//         <div className="col-span-3"><DeviceOverviewCard /></div>
//         <div className="col-span-4"><RecentActivity /></div>
//       </div>

//     </div>
//   );
// }

// export default Middlesection;

import React, { useEffect, useState } from "react";
import axios from "axios";

import QuizChart from "./chart";
import MapCard from "./mapcard";
import TopDoctor from "./topdoctor";
import CampaignTable from "./campgaincard";
import DeviceOverviewCard from "./dviceoverview";
import RecentActivity from "./recentactivitcard";

function Middlesection() {
  const [middleData, setMiddleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMiddleSectionData = async () => {
      try {
        const response = await axios.get(
          "/api/analytics/adminDashboard"
        );

        console.log("Middle Section Data:", response.data);

        setMiddleData(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMiddleSectionData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* First Row */}
      <div className="grid grid-cols-12 gap-2 items-start">
        <div className="col-span-5">
          <QuizChart data={middleData} />
        </div>

        <div className="col-span-4">
          <MapCard data={middleData} />
        </div>

        <div className="col-span-3">
          <TopDoctor data={middleData} />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-5">
          <CampaignTable data={middleData} />
        </div>

        <div className="col-span-3">
          <DeviceOverviewCard data={middleData} />
        </div>

        <div className="col-span-4">
          <RecentActivity data={middleData} />
        </div>
      </div>
    </div>
  );
}

export default Middlesection;