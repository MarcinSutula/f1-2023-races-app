import MapViewCmp from "./MapViewCmp";
import DetailsPanel from "./DetailsPanel";
import { useState } from "react";
import { RaceObj } from "./MapViewCcmp.types";

function App() {
  const [clickedRaceObj, setClickedRaceObj] = useState<RaceObj>();

  return (
    <div className="flex h-screen bg-black">
      <MapViewCmp setClickedRaceObj={setClickedRaceObj} />
      {clickedRaceObj && <DetailsPanel selectedRaceObj={clickedRaceObj} />}
    </div>
  );
}

export default App;
