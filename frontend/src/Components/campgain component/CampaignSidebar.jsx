import React from "react";

function CampaignSidebar({ campaign }) {
  if (!campaign) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-sm text-gray-500">
        Select a campaign
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm space-y-3">

      <h2 className="font-semibold">{campaign.name}</h2>

      <p><b>Client:</b> {campaign.client}</p>
      <p><b>Therapy:</b> {campaign.area}</p>
      <p><b>Doctors:</b> {campaign.doctors}</p>
      <p><b>QR Scans:</b> {campaign.scans}</p>
      <p><b>Attempts:</b> {campaign.attempts}</p>

    </div>
  );
}

export default CampaignSidebar;