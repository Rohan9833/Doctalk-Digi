import React from "react";
import AnalyticsHeader from "../Components/Analytics/AnalyticsHeader";
import AnalyticsDashboard from "../Components/Analytics/AnalyticsDashboard";
import AnalyticsInsights from "../Components/Analytics/AnalyticsInsights";

function Analytics() {
  return (
    <div className="space-y-3 p-4 sm:p-5">
      <AnalyticsHeader />

      <AnalyticsDashboard />

      <AnalyticsInsights />
    </div>
  );
}

export default Analytics;