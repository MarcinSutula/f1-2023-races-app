import { RaceObj } from "./race-types";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { RefObject } from "react";
import {
  GO_TO_RACE_ANIMATION_DURATION,
  GO_TO_RACE_ANIMATION_EASING,
  GO_TO_RACE_ZOOM,
  MAX_SCALE,
  MIN_SCALE,
} from "./config";

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

export const initMapView = (mapDivRef: RefObject<HTMLDivElement>): MapView => {
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
    constraints: {
      minScale: MIN_SCALE,
      maxScale: MAX_SCALE,
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

export const viewGoToRace = (
  view: MapView,
  raceGeometry: __esri.Geometry
): Promise<void> => {
  return view.goTo(
    { geometry: raceGeometry, zoom: GO_TO_RACE_ZOOM },
    {
      duration: GO_TO_RACE_ANIMATION_DURATION,
      easing: GO_TO_RACE_ANIMATION_EASING,
    }
  );
};

export const lapRecordFormatter = (
  lapRecordInSeconds: number | null
): string => {
  if (!lapRecordInSeconds) return "0";

  const lapRecordStr = lapRecordInSeconds.toFixed(3).toString();
  let [secondsStr, miliSecondsStr] = lapRecordStr.split(".");
  let minutes = 0;

  if (+secondsStr >= 60) {
    minutes = Math.floor(+secondsStr / 60);
    secondsStr = (+secondsStr - minutes * 60).toString();
  }
  if (+secondsStr < 10) {
    secondsStr = "0" + secondsStr;
  }

  return `${minutes ? minutes + ":" : ""}${secondsStr}.${miliSecondsStr}`;
};

export const timestampFormatter = (timestamp: EpochTimeStamp): string => {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${day}.${month}`;
};

export const lapRecordInfoFormatter = (
  owner: string,
  year: number,
  seconds: number
): string => {
  return `${owner} (${year}) ${lapRecordFormatter(seconds)}`;
};
