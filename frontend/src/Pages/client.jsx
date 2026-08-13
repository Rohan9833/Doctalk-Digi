// import React, { useState } from "react";

// import ClientStats from "../Components/client components/ClientStats";
// import ClientTable from "../Components/client components/ClientTable";
// import ClientDetails from "../Components/client components/ClientDetails"
// function Clients() {
//   const [selectedClient, setSelectedClient] = useState(null);

//   return (
//     <div className="p-4 space-y-6">
      
//       {/* Header */}


//       {/* Stats */}
//       <ClientStats />

//       {/* Main Section */}
//       <div className="grid grid-cols-12 gap-6">
        
//         {/* Table */}
//         <div className="col-span-12 lg:col-span-8">
//           <ClientTable onSelect={setSelectedClient} />
//         </div>

//         {/* Details Panel */}
//         <div className="col-span-12 lg:col-span-4">
//           <ClientDetails client={selectedClient} />
        
//         </div>

//       </div>

//     </div>
//   );
// }

// export default Clients;

import React, { useEffect, useState } from "react";
import axios from "axios";

import ClientStats from "../Components/client components/ClientStats";
import ClientTable from "../Components/client components/ClientTable";
import ClientDetails from "../Components/client components/ClientDetails";

function Clients() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientsDashboard = async () => {
      try {
        const response = await axios.get(
  "http://192.168.1.37:2468/api/clients/dashboard"
);

        console.log(response.data);

        setClientData(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientsDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading clients...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <ClientStats data={clientData} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <ClientTable
            data={clientData}
            onSelect={setSelectedClient}
          />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <ClientDetails client={selectedClient} />
        </div>
      </div>
    </div>
  );
}

export default Clients;