import "./MapViewCmp.css";
import { useRef, useEffect, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { RaceObj } from "./MapViewCcmp.types";
import { ThreeCircles } from "react-loader-spinner";

type MapViewCmpProps = {
  setClickedRaceObj: (attributes: RaceObj) => void;
};

function MapViewCmp({ setClickedRaceObj }: MapViewCmpProps) {
  const mapDiv = useRef<HTMLDivElement>(null);
  const oidRef = useRef<number>();
  const geometryRef = useRef<__esri.Geometry>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mapInit = (): [MapView, FeatureLayer] | [] => {
    if (mapDiv.current) {
      const layer = new FeatureLayer({
        url: process.env.REACT_APP_FEATURELAYER_URL,
      });

      const webmap = new WebMap({
        portalItem: {
          id: process.env.REACT_APP_BASEMAP_ID,
        },
        layers: [layer],
      });

      const view = new MapView({
        container: mapDiv.current,
        map: webmap,
        zoom: 2,
        constraints: {
          minScale: 81277252,
          maxScale: 1500,
          rotationEnabled: false,
        },
        popup: null as any,
      });

      return [view, layer];
    }
    return [];
  };

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
        if (foundRace) {
          await view.goTo({ geometry: foundRace.geometry, zoom: 8 });
          setClickedRaceObj(foundRace);
          geometryRef.current = foundRace.geometry;
          setIsLoading(false);
        } else {
          throw new Error("Problem with finding matching race");
        }
      }
    });
  };

  const fetchAllRaces = async (
    layer: __esri.FeatureLayer
  ): Promise<RaceObj[]> => {
    const featureSet: __esri.FeatureSet = await layer.queryFeatures({
      where: `1=1`,
      returnGeometry: true,
      outFields: ["*"],
    });
    const racesArr: RaceObj[] = featureSet.features.map((feature) => {
      return { ...feature.attributes, geometry: feature.geometry };
    });
    return racesArr;
  };

  useEffect(() => {
    try {
      const [view, layer] = mapInit();
      if (view && layer) {
        view.when(async function () {
          const racesArr = await fetchAllRaces(layer);
          onMapClick(view, racesArr);
        });
      }
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
