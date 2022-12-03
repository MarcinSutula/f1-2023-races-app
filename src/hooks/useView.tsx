import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { RefObject, useState } from "react";

type UseViewReturn = [
  MapView | undefined,
  (mapDivRef: RefObject<HTMLDivElement>) => MapView
];

export function useView(): UseViewReturn {
  const [view, setView] = useState<MapView>();

  const layer = new FeatureLayer({
    url: process.env.REACT_APP_FEATURELAYER_URL,
  });

  const webmap = new WebMap({
    portalItem: {
      id: process.env.REACT_APP_BASEMAP_ID,
    },
    layers: [layer],
  });

  const setNewMapView = (mapDivRef: RefObject<HTMLDivElement>): MapView => {
    const newView = new MapView({
      container: mapDivRef.current as HTMLDivElement,
      map: webmap,
      zoom: 2,
      constraints: {
        minScale: 81277252,
        maxScale: 1500,
        rotationEnabled: false,
      },
      popup: undefined,
    });

    setView(newView);
    return newView;
  };

  return [view, setNewMapView];
}
