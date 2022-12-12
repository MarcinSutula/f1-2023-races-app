import "./App.css";
import DetailsPanel from "./components/DetailsPanel";
import { useEffect, createContext, useRef } from "react";
import React from "react";
import { RaceObj } from "./race-types";
import { initMapView, getRacesLayer, viewGoToRace } from "./utils/map-utils";
import { fetchAllRaces } from "./utils/server-utils";
import MapSpinner from "./components/MapSpinner";

export const ViewContext = createContext<__esri.MapView | undefined>(undefined);
export const RacesArrContext = createContext<RaceObj[] | undefined>(undefined);

function App() {
  const mapDiv = useRef<HTMLDivElement>(null);

  const [clickedRaceObj, setClickedRaceObj] = React.useState<RaceObj>();
  const [view, setView] = React.useState<__esri.MapView>();
  const [racesArr, setRacesArr] = React.useState<RaceObj[] | undefined>();
  const oidRef = useRef<number>();
  const geometryRef = useRef<__esri.Geometry>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onMapClick = (view: __esri.MapView, races: RaceObj[]): void => {
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
        if (!racesArr) return;
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
