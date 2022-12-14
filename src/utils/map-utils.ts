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

type onRaceMapClickHandlerFnType = (
  view: __esri.MapView,
  response: __esri.HitTestResult,
  oidRef: RefObject<number | undefined>,
  geometryRef: RefObject<__esri.Geometry | undefined>,
  races: RaceObj[],
  setIsLoading: (isLoading: boolean) => void,
  setClickedRaceObj: (raceObj: RaceObj) => void
) => Promise<[number, __esri.Geometry] | void>;

export const initMapView = (mapDiv: HTMLDivElement): __esri.MapView => {
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
    container: mapDiv,
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
  raceGeometry: __esri.Geometry,
  animation: boolean = true,
  zoom: boolean = true
): Promise<void> => {
  const goToTarget: __esri.GoToTarget2D = {
    geometry: raceGeometry,
  };
  if (zoom) goToTarget.zoom = GO_TO_RACE_ZOOM;
  const goToOptions = {
    duration: GO_TO_RACE_ANIMATION_DURATION,
    easing: GO_TO_RACE_ANIMATION_EASING,
  };

  return view.goTo(goToTarget, animation ? goToOptions : undefined);
};

export const onRaceClickMapHandler: onRaceMapClickHandlerFnType = async (
  view,
  response,
  oidRef,
  geometryRef,
  races,
  setIsLoading,
  setClickedRaceObj
) => {
  const { graphic } = response.results[0] as __esri.GraphicHit;
  const hitOid = graphic.attributes.OBJECTID;
  if (hitOid === oidRef.current && geometryRef.current) {
    await viewGoToRace(view, geometryRef.current, false, false);
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
