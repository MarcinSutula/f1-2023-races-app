import "./App.css";
import DetailsPanel from "./components/DetailsPanel";
import { useEffect, createContext, useRef, useState } from "react";
import { RaceObj, RaceRefObj } from "./race-types";
import {
  initMapView,
  viewGoToRace,
  changeNextRaceSymbology,
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

  const onMapClick = (view: __esri.MapView, races: RaceObj[]): void => {
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
        const nextRace = getNextRace(racesArr);
        nextRace && changeNextRaceSymbology(layer, nextRace);
        newView.when(async function () {
          if (nextRace) {
            setClickedRaceObj(nextRace);
            updateCurrentlySelectedRace({
              oid: nextRace.OBJECTID,
              geometry: nextRace.geometry,
            });
            await viewGoToRace(newView, nextRace.geometry);
          }
          setView(newView);
          setRacesArr(racesArr);

          /////test

          // const pkt1 = [
          //   racesArr[0].geometry.get("longitude"),
          //   racesArr[0].geometry.get("latitude"),
          // ];
          // const pkt2 = [
          //   racesArr[1].geometry.get("longitude"),
          //   racesArr[1].geometry.get("latitude"),
          // ];
          // const polyline = {
          //   type: "polyline",
          //   paths: [pkt1, pkt2],
          // };
          // const polyline2 = {
          //   type: "polyline", // autocasts as new Polyline()
          //   paths: [
          //     [-111.3, 52.68],
          //     [-98, 49.5],
          //   ],
          // };

          // const lineSymbol = {
          //   type: "simple-line", // autocasts as SimpleLineSymbol()
          //   color: [226, 119, 40],
          //   width: 3,
          // };

          // const lineAtt = {
          //   Name: "Keystone Pipeline",
          //   Owner: "TransCanada",
          //   Length: "3,456 km",
          // };

          // const polylineGraphic = new Graphic({
          //   // geometry: polyline as __esri.GeometryProperties,
          //   geometry: polyline as __esri.GeometryProperties,
          //   symbol: lineSymbol,
          //   attributes: lineAtt,
          //   popupTemplate: undefined,
          // });

          // newView.graphics.add(polylineGraphic);
          //// test

          onMapClick(newView, racesArr);
          setIsLoading(false);
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
