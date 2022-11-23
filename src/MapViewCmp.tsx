import "./MapViewCmp.css";
import { useRef, useEffect, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import {
  CalciteShell,
  CalciteShellPanel,
} from "@esri/calcite-components-react";
import { RaceObj } from "./MapViewCcmp.types";

function MapViewCmp() {
  const mapDiv = useRef(null);
  const [clickedRaceObj, setClickedRaceObj] = useState<RaceObj | null>(null);

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
        view.hitTest(event).then(function (response: __esri.HitTestResult) {
          if (response.results.length > 1) {
            const { graphic, layer } = response.results[0] as __esri.GraphicHit;
            const oid = graphic.attributes.OBJECTID;

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
                  });
                }
              })
              .catch((err: ErrorEvent) => console.error(err));
          } else {
            setClickedRaceObj(null);
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
    <div className="mapDiv" ref={mapDiv}>
      {clickedRaceObj && (
        <CalciteShell>
          <CalciteShellPanel slot="panel-start" position="start" detached>
            {clickedRaceObj.name}
          </CalciteShellPanel>
        </CalciteShell>
      )}
    </div>
  );
}

export default MapViewCmp;

// extent: {
//   xmin: 115.244,
//   ymin: 37.849,
//   xmax: 144.968,
//   ymax: 52.387,
// },
