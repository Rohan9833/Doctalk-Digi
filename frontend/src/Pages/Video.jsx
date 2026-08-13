import React, { useState } from "react";

import SceneVideoHeader from "../Components/Video components/SceneVideoHeader";
import SceneVideoTable from "../Components/Video components/SceneVideoTable";
import SceneVideoPreview from "../Components/Video components/SceneVideoPreview";

function ScenesVideos() {
  const [selectedScene, setSelectedScene] = useState(null);

  return (
    <div className="space-y-3.5 p-4 sm:p-5">
      <SceneVideoHeader />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_330px]">
        {/* TABLE */}
        <SceneVideoTable
          onSelectScene={setSelectedScene}
        />

        {/* PREVIEW */}
        <SceneVideoPreview
          scene={selectedScene}
          onClose={() => setSelectedScene(null)}
        />
      </div>
    </div>
  );
}

export default ScenesVideos;