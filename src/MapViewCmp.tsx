import "./MapViewCmp.css";
import { useRef, useEffect } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Geometry from "@arcgis/core/geometry/Geometry";

function App() {
  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {
      const webmap = new WebMap({
        portalItem: {
          id: "69130c846b9d48e086a95b2075d561bc",
        },
      });
      // const x = 60;
      // const y = 60;

      const view = new MapView({
        container: mapDiv.current,
        map: webmap,
        zoom: 2,
        constraints: {
          minScale: 81277252,
          maxScale: 1500,
          rotationEnabled: false,
          // geometry: {
          //   type: "extent",
          //   xmin: -x,
          //   ymin: -y,
          //   xmax: x,
          //   ymax: y,
          // } as any,
        },
      });
    }
  }, []);

  return <div className="mapDiv" ref={mapDiv}></div>;
}

export default App;

// extent: {
//   xmin: 115.244,
//   ymin: 37.849,
//   xmax: 144.968,
//   ymax: 52.387,
// },
