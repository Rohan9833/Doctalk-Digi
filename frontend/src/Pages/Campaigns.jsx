

import React, { useState } from "react";
import CampaignStats from "../components/campgain component/CampaignStats";
import CampaignFilters from "../components/campgain component/CampaignFilters";
import CampaignTable from "../components/campgain component/CampaignTable";

import QuickActions from "../components/campgain component/QuickActions";
import { useEffect } from "react";
import axios from "axios";

import CampaignForm from "../components/campgain component/CampaignForm";

const Form_State = {
  CREATE: "create",
  EDIT: "edit",
}

function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // NEW
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState(null);
  const [campaign, setCampaign] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalQrScans, setTotalQrScans] = useState(0);
  const [totalCampaigns, setTotalCampaigns] = useState(0);

   const [client, setClient] = useState ([]);
  
  
    useEffect(() => {
      if(!showForm) return;
  
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:2468/api/clients/getClientDropdown")

          console.log("Response:", response.data);
  
          if(response.status === 200) {
            setClient(response.data?.dropDown)
          }
        } catch (error) {
          console.error(error)
        }
      }
  
      fetchData();
    }, [showForm])


    useEffect(() => {
      const fetchCampaign = async () => {
        if(isLoading) return;
        setIsLoading(true);
        try {
          const response = await axios.get("/api/campaigns/dashboard")

          if(response.status === 200) {
            setCampaign(response.data?.campaignData);
            setTotalDoctors(response.data?.totalDoctors);
            setTotalQrScans(response.data?.totalQrScans);
            setTotalCampaigns(response.data?.totalCampaigns);
          }else {
            console.log("I am not resolved");
            
          }
        } catch (error) {
          console.error(error)
        }finally {
          setIsLoading(false);
        }
      }

      fetchCampaign();
    }, [])

    const handleAddForm = () => {
      setFormState(Form_State.CREATE);
      setShowForm(true);
    }

    const handleEditForm = (campaign) => {
      setFormState(Form_State.EDIT);
      setShowForm(true);
      setSelectedCampaign(campaign)
    }

    useEffect(() => {
      console.log(client)
      console.log(campaign)
      console.log("client prop:", client);
console.log("isArray:", Array.isArray(client));
    },[client, campaign])
  

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header + Stats */}
      <CampaignStats
        totalDoctors={totalDoctors}
        totalCampaigns={totalCampaigns}
        totalQrScans={totalQrScans}
        onCreateCampaign={() => setShowForm(true)}
      />

      {/* Filters */}
      <CampaignFilters />

      {/* Main Section */}
      <div className="">

        <div className="col-span-12 lg:col-span-8 space-y-6">
          <CampaignTable onEdit={handleEditForm} campaign={campaign} onSelect={setSelectedCampaign} />
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