import "./MapViewCmp.css";
import { useRef, useEffect, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import { RaceObj } from "./race-types";
import { ThreeCircles } from "react-loader-spinner";
import { useView } from "./hooks/useView";
import { fetchAllRaces } from "./utils";

type MapViewCmpProps = {
  setClickedRaceObj: (attributes: RaceObj) => void;
};

function MapViewCmp({ setClickedRaceObj }: MapViewCmpProps) {
  const mapDiv = useRef<HTMLDivElement>(null);
  const oidRef = useRef<number>();
  const geometryRef = useRef<__esri.Geometry>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [_, setView] = useView();

  const onMapClick = (view: MapView, racesArr: RaceObj[]) => {
    view.on("click", async (event) => {
      if (isLoading) return;
      const response: __esri.HitTestResult = await view.hitTest(event);

      if (response.results.length > 1) {
        setIsLoading(true);
        const { graphic } = response.results[0] as __esri.GraphicHit;
        const hitOid = graphic.attributes.OBJECTID;
        if (hitOid === oidRef.current) {
          await view.goTo({ geometry: geometryRef.current });
          setIsLoading(false);
          return;
        }
        oidRef.current = hitOid;

        const foundRace = racesArr.find((race) => race.OBJECTID === hitOid);
        if (!foundRace) throw new Error("Problem with finding matching race");
        await view.goTo({ geometry: foundRace.geometry, zoom: 8 });
        setClickedRaceObj(foundRace);
        geometryRef.current = foundRace.geometry;
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    try {
      const newView = setView(mapDiv);
      newView.when(async function () {
        const layers = (newView.map.layers as any)
          .items as __esri.FeatureLayer[];
        const racesLayer = layers.find((layer) =>
          process.env.REACT_APP_FEATURELAYER_URL?.includes(layer.url)
        );
        if (!racesLayer) return;
        const racesArr = await fetchAllRaces(racesLayer);
        onMapClick(newView, racesArr);
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      console.error("Unexpected error", err);
    }
  }, []);

  return (
    <>
      <div className="h-screen w-screen p-0 m-0" ref={mapDiv}></div>
      {isLoading && (
        <ThreeCircles
          height="100"
          width="100"
          color="#1e90ff"
          wrapperStyle={{
            position: "fixed",
            top: "50%",
            left: "45%",
            transform: "translate(-50%, -50%)",
          }}
          wrapperClass=""
          visible={true}
          ariaLabel="three-circles-rotating"
          outerCircleColor="#00008b"
          innerCircleColor=""
          middleCircleColor="red"
        />
      )}
    </>
  );
}

export default MapViewCmp;
