import "./App.css";
import DetailsPanel from "./components/DetailsPanel";
import { useEffect, createContext, useRef, useState } from "react";
import { RaceObj, RaceRefObj } from "./race-types";
import {
  initMapView,
  viewGoToRace,
  changeNextRaceSymbology,
  createPolylineBetweenRaces,
} from "./utils/map-utils";
import { fetchAllRaces } from "./utils/server-utils";
import MapSpinner from "./components/MapSpinner";
import { onRaceClickMapHandler } from "./utils/map-utils";
import { getNextRace } from "./utils/utils";

export const ViewContext = createContext<__esri.MapView | undefined>(undefined);
export const RacesArrContext = createContext<RaceObj[] | undefined>(undefined);
export const UpdateCurrentlySelectedRace =
  createContext<((raceRefObj: RaceRefObj) => void) | undefined>(undefined);

function App() {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [clickedRaceObj, setClickedRaceObj] = useState<RaceObj>();
  const [view, setView] = useState<__esri.MapView>();
  const [racesArr, setRacesArr] = useState<RaceObj[] | undefined>();
  const currentlySelectedRaceRef = useRef<RaceRefObj>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateCurrentlySelectedRace = (raceRefObj: RaceRefObj) => {
    currentlySelectedRaceRef.current = raceRefObj;
  };

  const onMapClickHandler = (view: __esri.MapView, races: RaceObj[]): void => {
    view.on("click", async (event) => {
      if (isLoading) return;
      const hitTestResponse: __esri.HitTestResult = await view.hitTest(event);

      if (hitTestResponse.results.length > 1) {
        const hitData = await onRaceClickMapHandler(
          view,
          hitTestResponse,
          currentlySelectedRaceRef,
          races,
          setIsLoading,
          setClickedRaceObj
        );
        hitData && updateCurrentlySelectedRace(hitData);
      }
    });
  };

  const onViewInstanceCreated = async (
    view: __esri.MapView,
    racesArray: RaceObj[],
    nextRace: RaceObj | undefined
  ) => {
    setView(view);
    if (nextRace) {
      setClickedRaceObj(nextRace);
      updateCurrentlySelectedRace({
        oid: nextRace.OBJECTID,
        geometry: nextRace.geometry,
      });
      await viewGoToRace(view, nextRace.geometry);
      const nextRaceIndex = racesArray.findIndex(
        (race) => race.OBJECTID === nextRace.OBJECTID
      );
      if (nextRaceIndex !== 0) {
        const line = createPolylineBetweenRaces(
          racesArray[nextRaceIndex - 1],
          nextRace
        );
        view.graphics.add(line);
      }
    }
    onMapClickHandler(view, racesArray);
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      try {
        if (!mapDiv.current) throw new Error("Could not locate map div");
        setIsLoading(true);
        const [newView, layer] = initMapView(mapDiv.current);
        const racesArr = await fetchAllRaces(layer);
        if (!racesArr) {
          setIsLoading(false);
          throw new Error("Problem with fetching races");
        }
        setRacesArr(racesArr);
        const nextRace = getNextRace(racesArr);
        nextRace && changeNextRaceSymbology(layer, nextRace);

        newView.when(function () {
          onViewInstanceCreated(newView, racesArr, nextRace);
        });
      } catch (err) {
        setIsLoading(false);
        if (err instanceof Error) {
          console.error(err.message);
          return;
        }
        console.error("Unexpected error", err);
      }
    })();

    return () => {
      view?.destroy();
    };
  }, []);

  return (
    <div className="flex h-screen bg-black">
      <div className="h-screen w-screen p-0 m-0" ref={mapDiv}></div>
      {clickedRaceObj && view && (
        <RacesArrContext.Provider value={racesArr}>
          <ViewContext.Provider value={view}>
            <UpdateCurrentlySelectedRace.Provider
              value={updateCurrentlySelectedRace}
            >
              <DetailsPanel
                clickedRaceObj={clickedRaceObj}
                setClickedRaceObj={setClickedRaceObj}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
              />
            </UpdateCurrentlySelectedRace.Provider>
          </ViewContext.Provider>
        </RacesArrContext.Provider>
      )}
      <MapSpinner isLoading={isLoading} />
    </div>
  );
}

export default App;
