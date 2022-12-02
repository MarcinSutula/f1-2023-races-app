import "./MapViewCmp.css";
import { useRef, useEffect, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { RaceObj } from "./MapViewCcmp.types";
import { ThreeCircles } from "react-loader-spinner";
import { useQueryFeatures } from "./hooks/useQueryFeatures";

type MapViewCmpProps = {
  setClickedRaceObj: (attributes: RaceObj) => void;
};

function MapViewCmp({ setClickedRaceObj }: MapViewCmpProps) {
  const mapDiv = useRef(null);
  const oidRef = useRef(-1);
  const geometryRef = useRef<__esri.Geometry>();
  const [isLoading, setIsLoading] = useState(false);
  const [races, queryAllFeatures] = useQueryFeatures();

  console.log("Map View Cmp rerender");
  console.log("1", races);
  useEffect(() => {
    if (mapDiv.current) {
      const webmap = new WebMap({
        portalItem: {
          id: "40cb5afc6ca44c989c1dcaf5ab9dacf7",
        },
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

      view.when(function () {
        const layer = (view.map.layers as any).items[0];
        queryAllFeatures(layer as __esri.FeatureLayer);
        console.log("2", races);
      });

      view.on("click", (event) => {
        if (isLoading) return;
        view.hitTest(event).then(function (response: __esri.HitTestResult) {
          if (response.results.length > 1) {
            const { graphic, layer } = response.results[0] as __esri.GraphicHit;
            const oid = graphic.attributes.OBJECTID;
            if (oid === oidRef.current) {
              view.goTo({ geometry: geometryRef.current });
              return;
            }
            oidRef.current = oid;
            setIsLoading(true);

            // (layer as __esri.FeatureLayer)
            //   .queryFeatures({
            //     where: `OBJECTID=${oid}`,
            //     returnGeometry: true,
            //     outFields: ["*"],
            //   })
            //   .then((featureSet: __esri.FeatureSet) => {
            //     if (featureSet.features.length > 0) {
            //       const { geometry, attributes } = featureSet.features[0];
            //       view.goTo({ geometry, zoom: 8 }).then((_) => {
            //         setClickedRaceObj(attributes as RaceObj);
            //         geometryRef.current = geometry;
            //         setIsLoading(false);
            //       });
            //     }
            //   })
            //   .catch((err: ErrorEvent) => {
            //     setIsLoading(false);
            //     console.error(err);
            //   });
          }
        });
      });

      return () => {
        webmap.destroy();
        view.destroy();
      };
    }
  }, []);
  console.log("3", races);
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
