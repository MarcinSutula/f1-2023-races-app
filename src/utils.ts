import { RaceObj } from "./race-types";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { RefObject } from "react";

export const fetchAllRaces = async (
  layer: __esri.FeatureLayer
): Promise<RaceObj[]> => {
  const featureSet: __esri.FeatureSet = await layer.queryFeatures({
    where: `1=1`,
    returnGeometry: true,
    outFields: ["*"],
  });
  if (!featureSet || !featureSet?.features)
    throw new Error("Problem with fetching");
  const racesArr: RaceObj[] = featureSet.features.map((feature) => {
    return { ...feature.attributes, geometry: feature.geometry };
  });
  return racesArr;
};

export const createNewMapView = (
  mapDivRef: RefObject<HTMLDivElement>
): MapView => {
  const layer = new FeatureLayer({
    url: process.env.REACT_APP_FEATURELAYER_URL,
  });

  const webmap = new WebMap({
    portalItem: {
      id: process.env.REACT_APP_BASEMAP_ID,
    },
    layers: [layer],
  });
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

  return newView;
};

export const getRacesLayer = (
  view: MapView
): __esri.FeatureLayer | undefined => {
  const layers = (view.map.layers as any).items as __esri.FeatureLayer[];
  const racesLayer = layers.find((layer) =>
    process.env.REACT_APP_FEATURELAYER_URL?.includes(layer.url)
  );
  return racesLayer ? racesLayer : undefined;
};
