import "./App.css";
import DetailsPanel from "./DetailsPanel";
import { useState, useEffect, createContext, useRef } from "react";
import { RaceObj } from "./race-types";
import {
  initMapView,
  fetchAllRaces,
  getRacesLayer,
  viewGoToRace,
} from "./utils";
import MapView from "@arcgis/core/views/MapView";
import MapSpinner from "./components/MapSpinner";

export const ViewContext = createContext<MapView | undefined>(undefined);
export const RacesArrContext = createContext<RaceObj[] | undefined>(undefined);

function App() {
  const mapDiv = useRef<HTMLDivElement>(null);

  const [clickedRaceObj, setClickedRaceObj] = useState<RaceObj>();
  const [view, setView] = useState<MapView>();
  const [racesArr, setRacesArr] = useState<RaceObj[] | undefined>();
  const oidRef = useRef<number>();
  const geometryRef = useRef<__esri.Geometry>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onMapClick = (view: MapView, races: RaceObj[]): void => {
    view.on("click", async (event) => {
      if (isLoading) return;
      const response: __esri.HitTestResult = await view.hitTest(event);

      if (response.results.length > 1) {
        const { graphic } = response.results[0] as __esri.GraphicHit;
        const hitOid = graphic.attributes.OBJECTID;
        if (hitOid === oidRef.current) {
          await view.goTo({ geometry: geometryRef.current });
          return;
        }
        setIsLoading(true);
        oidRef.current = hitOid;
        const foundRace = races.find((race) => race.OBJECTID === hitOid);
        if (!foundRace) {
          setIsLoading(false);
          throw new Error("Problem with finding matching race");
        }
        await viewGoToRace(view, foundRace.geometry);
        setClickedRaceObj(foundRace);
        geometryRef.current = foundRace.geometry;
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    try {
      const newView = initMapView(mapDiv);
      newView.when(async function () {
        setView(newView);
        const racesLayer = getRacesLayer(newView);
        if (!racesLayer) throw new Error("Problem with getting races layer");
        const racesArr = await fetchAllRaces(racesLayer);
        setRacesArr(racesArr);
        onMapClick(newView, racesArr);
      });
    } catch (err) {
      setIsLoading(false);
      if (err instanceof Error) {
        console.error(err.message);
        return;
      }
      console.error("Unexpected error", err);
    }
    return () => {
      view?.destroy();
    };
  }, []);

  return (
    <div className="flex h-screen bg-black">
      <div className="h-screen w-screen p-0 m-0" ref={mapDiv}></div>
      {clickedRaceObj && (
        <RacesArrContext.Provider value={racesArr}>
          <ViewContext.Provider value={view}>
            <DetailsPanel
              selectedRaceObj={clickedRaceObj}
              setSelectedRaceObj={setClickedRaceObj}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
          </ViewContext.Provider>
        </RacesArrContext.Provider>
      )}
      <MapSpinner isLoading={isLoading} />
    </div>
  );
}

export default App;
