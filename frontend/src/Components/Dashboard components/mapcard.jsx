// import React from "react";
// import { Info } from "lucide-react";

// function MapCard() {
//   const cities = [
//     { name: "Mumbai, MH", scans: "12,842" },
//     { name: "Pune, MH", scans: "7,932" },
//     { name: "Nagpur, MH", scans: "5,421" },
//     { name: "Delhi, DL", scans: "4,218" },
//     { name: "Bengaluru, KA", scans: "3,987" },
//   ];

//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-2 w-full  border">

//       {/* Header */}
//       <div className="flex items-center gap-2 mb-6">
//         <h2 className="text-lg font-semibold text-gray-800">
//           QR Scans by Location
//         </h2>
//         <Info size={16} className="text-gray-400" />
//       </div>

//       {/* Content */}
//       <div className="flex gap-6">

//         {/* Map */}
//         <div className="w-1/2">
//           <img
//             src="/map.png" // 👉 apni image yaha daal (public folder me)
//             alt="India Map"
//             className=" h-60  object-contain opacity-90 "

//           />
//         </div>

//         {/* Table */}
//         <div className="w-1/2 flex flex-col justify-between font-bold">

//           <div>
//             <div className="flex justify-between text-sm  mb-3">
//               <span>Top Cities</span>
//               <span>Scans</span>
//             </div>

//             <div className="space-y-3">
//               {cities.map((city, index) => (
//                 <div
//                   key={index}
//                   className="flex justify-between text-gray-700 text-sm"
//                 >
//                   <span>{city.name}</span>
//                   <span>{city.scans}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Button */}
//           <button className="mt-6 border border-indigo-300 text-indigo-600 px-4 py-2 rounded-lg text-sm hover:bg-indigo-50 transition">
//             View All Locations
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MapCard;
import React, { useEffect } from "react";
import { Info } from "lucide-react";

import {
  MapContainer,
  GeoJSON,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import indiaStates from "../../assets/maps/india.json"


// Automatically fit the complete India map
function FitIndiaMap({ geoJsonData }) {
  const map = useMap();

  useEffect(() => {
    if (!geoJsonData) return;

    const layer = L.geoJSON(geoJsonData);

    const bounds = layer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [5, 5],
      });
    }
  }, [map, geoJsonData]);

  return null;
}


function MapCard({ data }) {
  const cities = data?.locationData?.topCities || [];
  const states = data?.locationData?.byState || [];



  // Find state data from API
  const getStateData = (stateName) => {
    return states.find(
      (state) =>
        state._id?.trim().toLowerCase() ===
        stateName?.trim().toLowerCase()
    );
  };


  return (
    <div className="bg-white rounded-2xl shadow-sm p-2 w-full border">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          QR Scans by Location
        </h2>

        <Info size={16} className="text-gray-400" />
      </div>


      {/* Content */}
      <div className="flex gap-6">

        {/* ================= MAP ================= */}
        <div className="w-1/2 h-60">

          <MapContainer
            center={[22.5937, 78.9629]}
            zoom={4}
            minZoom={3}
            maxZoom={8}
            scrollWheelZoom={false}
            zoomControl={false}
            attributionControl={false}
            className="h-full w-full rounded-lg"
          >

            {/* Automatically show complete India */}
            <FitIndiaMap geoJsonData={indiaStates} />


            {/* India States */}
            <GeoJSON
              data={indiaStates}

              style={(feature) => {
                const stateName = feature?.properties?.st_nm;

                const stateData = getStateData(stateName);

                return {
                  fillColor: stateData ? "#6366f1" : "#e5e7eb",
                  fillOpacity: stateData ? 0.8 : 0.35,
                  color: "#ffffff",
                  weight: 1,
                  opacity: 1,
                };
              }}


              onEachFeature={(feature, layer) => {
                const stateName = feature?.properties?.st_nm;

                const stateData = getStateData(stateName);

                layer.on({
                  mouseover: (event) => {
                    const currentLayer = event.target;

                    currentLayer.setStyle({
                      weight: 2,
                      fillOpacity: stateData ? 0.95 : 0.55,
                    });
                  },

                  mouseout: (event) => {
                    const currentLayer = event.target;

                    currentLayer.setStyle({
                      weight: 1,
                      fillOpacity: stateData ? 0.8 : 0.35,
                    });
                  },
                });

                layer.bindPopup(`
                        <div style="min-width: 120px;">
                          <strong>${stateName}</strong>
                          <br />
                          Scans: ${stateData?.scans || 0}
                        </div>
                      `);
              }}
            />

          </MapContainer>

        </div>


        {/* ================= TOP CITIES ================= */}
        <div className="w-1/2 flex flex-col justify-between font-bold">

          <div>

            <div className="flex justify-between text-sm mb-3">
              <span>Top Cities</span>
              <span>Scans</span>
            </div>


            <div className="space-y-3">

              {cities.length > 0 ? (

                cities.map((city, index) => (

                  <div
                    key={index}
                    className="flex justify-between text-gray-700 text-sm"
                  >

                    <span>
                      {city.city}, {city.state}
                    </span>

                    <span>
                      {city.scans.toLocaleString()}
                    </span>

                  </div>

                ))

              ) : (

                <p className="text-sm text-gray-500">
                  No location data available
                </p>

              )}

            </div>

          </div>


          {/* Button */}
          <button
            className="
              mt-6
              border
              border-indigo-300
              text-indigo-600
              px-4
              py-2
              rounded-lg
              text-sm
              hover:bg-indigo-50
              transition
            "
          >
            View All Locations
          </button>

        </div>

      </div>

    </div>
  );
}


export default MapCard;