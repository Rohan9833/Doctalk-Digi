import React, { useState, useEffect } from "react";
import CampaignStats from "../components/campgain component/CampaignStats";
// import CampaignFilters from "../components/campgain component/CampaignFilters";
import CampaignTable from "../components/campgain component/CampaignTable";
import QuickActions from "../components/campgain component/QuickActions";
import axios from "axios";
import CampaignForm from "../components/campgain component/CampaignForm";

const Form_State = {
  CREATE: "create",
  EDIT: "edit",
};

function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // =====================================================
  // FORM STATE
  // =====================================================

  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState(null);

  // =====================================================
  // CAMPAIGN STATE
  // =====================================================

  const [campaign, setCampaign] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // =====================================================
  // STATS
  // =====================================================

  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalQrScans, setTotalQrScans] = useState(0);
  const [totalCampaigns, setTotalCampaigns] = useState(0);

  // =====================================================
  // CLIENT
  // =====================================================

  const [client, setClient] = useState([]);

  // =====================================================
  // FETCH CLIENT DROPDOWN
  // =====================================================

  useEffect(() => {
    if (!showForm) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2468/api/clients/getClientDropdown"
        );

        console.log("Response:", response.data);

        if (response.status === 200) {
          setClient(response.data?.dropDown || []);
        }
      } catch (error) {
        console.error("Client fetch error:", error);
      }
    };

    fetchData();
  }, [showForm]);

  // =====================================================
  // FETCH CAMPAIGNS
  // =====================================================

  useEffect(() => {
    const fetchCampaign = async () => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        const response = await axios.get(
          "/api/campaigns/dashboard"
        );

        if (response.status === 200) {
          setCampaign(response.data?.campaignData || []);

          setTotalDoctors(
            response.data?.totalDoctors || 0
          );

          setTotalQrScans(
            response.data?.totalQrScans || 0
          );

          setTotalCampaigns(
            response.data?.totalCampaigns || 0
          );
        } else {
          console.log("I am not resolved");
        }
      } catch (error) {
        console.error("Campaign fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, []);

  // =====================================================
  // EXPORT ALL CAMPAIGNS
  // =====================================================

  const handleExportExcel = async () => {
    try {
      const response = await axios.get(
        "/api/campaigns/export",
        {
          responseType: "blob",
        }
      );

      // -----------------------------------------------
      // CREATE FILE BLOB
      // -----------------------------------------------

      const blob = new Blob(
        [response.data],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

      // -----------------------------------------------
      // CREATE DOWNLOAD URL
      // -----------------------------------------------

      const url = window.URL.createObjectURL(blob);

      // -----------------------------------------------
      // CREATE TEMPORARY DOWNLOAD LINK
      // -----------------------------------------------

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "all-campaigns.xlsx"
      );

      document.body.appendChild(link);

      link.click();

      // -----------------------------------------------
      // CLEANUP
      // -----------------------------------------------

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Campaign Excel export error:",
        error
      );
    }
  };

  // =====================================================
  // CREATE CAMPAIGN
  // =====================================================

  const handleAddForm = () => {
    setFormState(Form_State.CREATE);
    setSelectedCampaign(null);
    setShowForm(true);
  };

  // =====================================================
  // EDIT CAMPAIGN
  // =====================================================

  const handleEditForm = (campaign) => {
    setFormState(Form_State.EDIT);
    setSelectedCampaign(campaign);
    setShowForm(true);
  };

  // =====================================================
  // DEBUG
  // =====================================================

  useEffect(() => {
    console.log("Client:", client);
    console.log("Campaign:", campaign);
    console.log("Is Client Array:", Array.isArray(client));
  }, [client, campaign]);

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header + Stats */}

      <CampaignStats
        totalDoctors={totalDoctors}
        totalCampaigns={totalCampaigns}
        totalQrScans={totalQrScans}
        onCreateCampaign={handleAddForm}
        onExportExcel={handleExportExcel}
      />

      {/* Filters */}

      {/* <CampaignFilters /> */}

      {/* Main Section */}

      <div>
        <div className="col-span-12 lg:col-span-8 space-y-6">

          <CampaignTable
            onEdit={handleEditForm}
            campaign={campaign}
            onSelect={setSelectedCampaign}
          />

          <QuickActions />

        </div>
      </div>

      {/* Popup */}

      {showForm && (
        <CampaignForm
          client={client}
          formMode={formState}
          selectedCampaign={selectedCampaign}
          onClose={() => setShowForm(false)}
        />
      )}

    </div>
  );
}

export default Campaigns;