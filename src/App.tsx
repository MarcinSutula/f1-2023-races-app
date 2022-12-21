import "./App.css";
import DetailsPanel from "./components/DetailsPanel";
import { useEffect, createContext, useRef, useState } from "react";
import { RaceObj, RaceRefObj } from "./race-types";
import {
  viewGoToRace,
  changeNextRaceSymbology,
  createPolylineBetweenRaces,
} from "./utils/map-utils";
import { fetchAllRaces } from "./utils/server-utils";
import MapSpinner from "./components/MapSpinner";
import { onRaceClickMapHandler } from "./utils/map-utils";
import { getNextRace } from "./utils/utils";
import { useMapViewContext } from "./context/MapViewContext";

export const RacesArrContext = createContext<RaceObj[] | undefined>(undefined);
export const UpdateCurrentlySelectedRace =
  createContext<((raceRefObj: RaceRefObj) => void) | undefined>(undefined);

function App() {
  const [clickedRaceObj, setClickedRaceObj] = useState<RaceObj>();
  const [racesArr, setRacesArr] = useState<RaceObj[] | undefined>();
  const currentlySelectedRaceRef = useRef<RaceRefObj>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mapViewCtx = useMapViewContext();
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
        if (!mapViewCtx) return;
        const { view, layer } = mapViewCtx;
        setIsLoading(true);
        const racesArr = await fetchAllRaces(layer);
        if (!racesArr) {
          setIsLoading(false);
          throw new Error("Problem with fetching races");
        }
        setRacesArr(racesArr);
        const nextRace = getNextRace(racesArr);
        nextRace && changeNextRaceSymbology(mapViewCtx.layer, nextRace);

        view.when(function () {
          onViewInstanceCreated(view, racesArr, nextRace);
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
      mapViewCtx?.view.destroy();
    };
  }, [mapViewCtx]);

  return (
    <>
      {clickedRaceObj && mapViewCtx?.view && (
        <RacesArrContext.Provider value={racesArr}>
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
        </RacesArrContext.Provider>
      )}
      <MapSpinner isLoading={isLoading} />
    </>
  );
}

export default App;
