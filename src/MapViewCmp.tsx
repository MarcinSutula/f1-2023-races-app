import "./MapViewCmp.css";
import { useRef, useEffect, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import WebMap from "@arcgis/core/WebMap";
import Expand from "@arcgis/core/widgets/Expand";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import {
  CalciteShell,
  CalciteShellPanel,
  CalciteBlock,
  CalcitePanel,
  CalciteAction,
  CalciteCard,
  CalciteButton,
  CalciteFlow,
  CalciteLabel,
} from "@esri/calcite-components-react";
import { RaceObj } from "./MapViewCcmp.types";
import DetailsPanel from "./DetailsPanel";

function MapViewCmp() {
  const mapDiv = useRef(null);
  const oidRef = useRef(-1);
  const geometryRef = useRef<__esri.Geometry>();
  const [clickedRaceObj, setClickedRaceObj] = useState<RaceObj | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mapDiv.current) {
      const webmap = new WebMap({
        portalItem: {
          id: "69130c846b9d48e086a95b2075d561bc",
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
            (layer as __esri.FeatureLayer)
              .queryFeatures({
                where: `OBJECTID=${oid}`,
                returnGeometry: true,
                outFields: ["*"],
              })
              .then((featureSet: __esri.FeatureSet) => {
                if (featureSet.features.length > 0) {
                  const { geometry, attributes } = featureSet.features[0];
                  view.goTo({ geometry, zoom: 8 }).then((_) => {
                    setClickedRaceObj(attributes as RaceObj);
                    geometryRef.current = geometry;
                    setIsLoading(false);
                  });
                }
              })
              .catch((err: ErrorEvent) => {
                setIsLoading(false);
                console.error(err);
              });
          }
        });
      });

      return () => {
        webmap.destroy();
        view.destroy();
      };
    }
  }, []);

  return (
    <div className="flex h-screen bg-black">
      <div className="h-screen w-screen p-0 m-0" ref={mapDiv}></div>
      <DetailsPanel selectedRaceObj={clickedRaceObj} isLoading={isLoading} />
    </div>
  );
}

export default MapViewCmp;
