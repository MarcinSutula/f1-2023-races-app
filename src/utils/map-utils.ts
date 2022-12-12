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
} from "../config";
import { RaceObj } from "../race-types";

export const initMapView = (
  mapDivRef: RefObject<HTMLDivElement>
): __esri.MapView => {
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
  view: __esri.MapView
): __esri.FeatureLayer | undefined => {
  const layers = (view.map.layers as any).items as __esri.FeatureLayer[];
  const racesLayer = layers.find((layer) =>
    process.env.REACT_APP_FEATURELAYER_URL?.includes(layer.url)
  );
  return racesLayer ? racesLayer : undefined;
};

export const viewGoToRace = (
  view: __esri.MapView,
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

export const onRaceClickMapHandler = async (
  view: __esri.MapView,
  response: __esri.HitTestResult,
  oidRef: RefObject<number | undefined>,
  geometryRef: RefObject<__esri.Geometry | undefined>,
  races: RaceObj[],
  setIsLoading: (a: boolean) => void,
  setClickedRaceObj: (a: RaceObj) => void
): Promise<[number, __esri.Geometry] | void> => {
  const { graphic } = response.results[0] as __esri.GraphicHit;
  const hitOid = graphic.attributes.OBJECTID;
  if (hitOid === oidRef.current) {
    await view.goTo({ geometry: geometryRef.current });
    return;
  }
  setIsLoading(true);
  const foundRace = races.find((race) => race.OBJECTID === hitOid);
  if (!foundRace) {
    setIsLoading(false);
    throw new Error("Problem with finding matching race");
  }
  await viewGoToRace(view, foundRace.geometry);
  setClickedRaceObj(foundRace);
  setIsLoading(false);
  return [hitOid, foundRace.geometry];
};
