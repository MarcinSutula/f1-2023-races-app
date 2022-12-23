import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { RefObject,  Dispatch, SetStateAction } from "react";
import {
  GO_TO_RACE_ANIMATION_DURATION,
  GO_TO_RACE_ANIMATION_EASING,
  GO_TO_RACE_ZOOM,
  MAX_SCALE,
  MIN_SCALE,
} from "../config";
import { RaceObj, RaceRefObj } from "../race-types";
import { getGeometry } from "./utils";

type OnRaceMapClickHandlerFnType = (
  view: __esri.MapView,
  hitTestResponse: __esri.HitTestResult,
  currentlySelectedRaceRef: RefObject<RaceRefObj | undefined>,
  races: RaceObj[],
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setClickedRaceObj: Dispatch<SetStateAction<RaceObj | undefined>>
) => Promise<RaceRefObj | void>;

type ViewGoToRaceFnType = (
  view: __esri.MapView,
  raceGeometry: __esri.Geometry,
  animation?: boolean,
  zoom?: boolean
) => Promise<void>;

export const initMapView = (
  mapDiv: HTMLDivElement
): { view: MapView; layer: FeatureLayer } => {
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

  return { view: newView, layer };
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

export const viewGoToRace: ViewGoToRaceFnType = (
  view,
  raceGeometry,
  animation = true,
  zoom = true
) => {
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

export const onRaceClickMapHandler: OnRaceMapClickHandlerFnType = async (
  view,
  hitTestResponse,
  currentlySelectedRaceRef,
  races,
  setIsLoading,
  setClickedRaceObj
) => {
  const { graphic } = hitTestResponse.results[0] as __esri.GraphicHit;
  const hitOid = graphic.attributes?.OBJECTID;

  if (!hitOid) {
    return;
  } else if (
    currentlySelectedRaceRef.current &&
    hitOid === currentlySelectedRaceRef.current.oid
  ) {
    await viewGoToRace(
      view,
      currentlySelectedRaceRef.current.geometry,
      false,
      false
    );
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
  return { oid: hitOid, geometry: foundRace.geometry };
};

export const changeNextRaceSymbology = (
  layer: FeatureLayer,
  nextRace: RaceObj
) => {
  const arcadeExpression = `
  var RaceOid = $feature.OBJECTID;
  when(
    RaceOid == ${nextRace.OBJECTID}, 1,
    0
  );
  `;

  const sizeVisualVariable = {
    type: "size",
    valueExpression: arcadeExpression,
    valueExpressionTitle: "Size Value",
    legendOptions: {
      showLegend: false,
    },
    maxDataValue: 1,
    maxSize: "46px",
    minDataValue: 0,
    minSize: "26px",
  };

  const opacityVisualVariable = {
    type: "opacity",
    valueExpression: arcadeExpression,
    valueExpressionTitle: "Opacity Value",
    legendOptions: {
      showLegend: false,
    },
    stops: [
      { value: 0, opacity: 0.7, label: "Not a next race" },
      { value: 1, opacity: 1, label: "Next race" },
    ],
  };

  (layer.renderer as any).visualVariables = [
    sizeVisualVariable,
    opacityVisualVariable,
  ];
};

export const createPolylineBetweenRaces = (
  previousRace: RaceObj,
  nextRace: RaceObj
): Graphic => {
  const startPoint = getGeometry(previousRace.geometry, "lng,lat");
  const endPoint = getGeometry(nextRace.geometry, "lng,lat");

  const polyline = {
    type: "polyline",
    paths: [startPoint, endPoint],
  };

  const lineSymbol = {
    type: "simple-line",
    style: "short-dot",
    cap: "round",
    color: [255, 255, 255, 0.5],
    width: 2,
  };

  const polylineGraphic = new Graphic({
    geometry: polyline as __esri.GeometryProperties,
    symbol: lineSymbol,
    popupTemplate: undefined,
  });

  return polylineGraphic;
};

// export const calculatePointAlongLine = (start: any, end: any, ratio: any) => {
//   const geoDistance = geodesicUtils.geodesicDistance(
//     new Point(webMercatorUtils.webMercatorToGeographic(start)),
//     new Point(webMercatorUtils.webMercatorToGeographic(end)),
//     "meters"
//   );
//   if (!geoDistance || !geoDistance.azimuth || !geoDistance.distance) return;
//   const pointFromDistance = geodesicUtils.pointFromDistance(
//     new Point(start),
//     geoDistance.distance * ratio,
//     geoDistance.azimuth
//   );
//   return [pointFromDistance, geoDistance.azimuth];
// };
