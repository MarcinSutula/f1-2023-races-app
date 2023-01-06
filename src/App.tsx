import "./App.css";
import DetailsPanel from "./components/DetailsPanel";
import { useEffect, createContext, useRef, useState } from "react";
import { RaceObj, RaceRefObj } from "./race-types";
import { changeRacesSymbology, onViewInstanceCreated } from "./utils/map-utils";
import MapSpinner from "./components/MapSpinner";
import { onRaceClickMapHandler } from "./utils/map-utils";
import { getNextRace } from "./utils/utils";
import { useMapViewContext } from "./context/MapViewContext";
import { useRacesArrContext } from "./context/RacesArrContext";

export const UpdateSelectedRaceContext =
  createContext<((raceRefObj: RaceRefObj) => void) | undefined>(undefined);

function App() {
  const [clickedRaceObj, setClickedRaceObj] = useState<RaceObj>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const selectedRaceRef = useRef<RaceRefObj>();
  const mapViewCtx = useMapViewContext();
  const racesArrCtx = useRacesArrContext();

  const updateSelectedRace = (raceRefObj: RaceRefObj) => {
    selectedRaceRef.current = raceRefObj;
  };

  const onMapClickHandler = (view: __esri.MapView, races: RaceObj[]): void => {
    view.on("click", async (event) => {
      if (isLoading) return;
      const hitTestResponse: __esri.HitTestResult = await view.hitTest(event);

      if (hitTestResponse.results.length > 1) {
        const hitData = await onRaceClickMapHandler(
          view,
          hitTestResponse,
          selectedRaceRef,
          races,
          setIsLoading,
          setClickedRaceObj
        );
        hitData && updateSelectedRace(hitData);
      }
    });
  };

  useEffect(() => {
    (async () => {
      try {
        if (!mapViewCtx || !racesArrCtx) return;
        const { view } = mapViewCtx;
        setIsLoading(true);
        const nextRace = getNextRace(racesArrCtx);
        nextRace && changeRacesSymbology(mapViewCtx.layer, nextRace);

        view.when(() =>
          onViewInstanceCreated(
            view,
            racesArrCtx,
            nextRace,
            setClickedRaceObj,
            setIsLoading,
            updateSelectedRace,
            () => onMapClickHandler(view, racesArrCtx)
          )
        );
      } catch (err) {
        setIsLoading(false);
        if (err instanceof Error) {
          console.error(err.message);
          return;
        }
        console.error("Unexpected error", err);
      }
    })();

    return () => mapViewCtx?.view.destroy();
  }, [racesArrCtx]);

  return (
    <>
      {clickedRaceObj && mapViewCtx?.view && racesArrCtx && (
        <UpdateSelectedRaceContext.Provider value={updateSelectedRace}>
          <DetailsPanel
            clickedRaceObj={clickedRaceObj}
            setClickedRaceObj={setClickedRaceObj}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        </UpdateSelectedRaceContext.Provider>
      )}
      <MapSpinner isLoading={isLoading} />
    </>
  );
}

export default App;
