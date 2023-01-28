import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { RefObject, Dispatch, SetStateAction } from "react";
import {
  BASEMAP_ID,
  FEATURELAYER_URL,
  GO_TO_ANIMATION_DURATION,
  GO_TO_ANIMATION_EASING,
  GO_TO_RACE_ZOOM,
  MAX_SCALE,
  MIN_SCALE,
} from "../config";
import { RaceObj, RaceRefObj } from "../race-types";
import { createPolylineBetweenRaces } from "./graphic-utils";

type OnRaceMapClickHandlerFnType = (
  view: __esri.MapView,
  hitTestResponse: __esri.HitTestResult,
  currentlySelectedRaceRef: RefObject<RaceRefObj | undefined>,
  races: RaceObj[],
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setClickedRaceObj: Dispatch<SetStateAction<RaceObj | undefined>>
) => Promise<RaceRefObj | void>;

type OnViewInstanceCreatedFnType = (
  view: MapView,
  races: RaceObj[],
  nextRace: RaceObj | undefined,
  setClickedRaceObj: Dispatch<SetStateAction<RaceObj | undefined>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  updateSelectedRace: (raceRefObj: RaceRefObj) => void,
  callback: () => void
) => Promise<void>;

type viewGoToGeometryFnType = (
  view: MapView,
  raceGeometry: __esri.Geometry,
  animation?: boolean,
  zoom?: boolean | number
) => Promise<void>;

export const initMapView = (
  mapDiv: HTMLDivElement
): { view: MapView; layer: FeatureLayer } => {
  const layer = new FeatureLayer({
    url: FEATURELAYER_URL,
  });

  const webmap = new WebMap({
    portalItem: {
      id: BASEMAP_ID,
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
): FeatureLayer | undefined => {
  const layers = (view.map.layers as any).items as FeatureLayer[];
  const racesLayer = layers.find((layer) =>
    FEATURELAYER_URL.includes(layer.url)
  );
  // Just a small thing for you
  return racesLayer ?? undefined;
};

export const viewGoToGeometry: viewGoToGeometryFnType = async (
  view,
  geometry,
  animation = true,
  zoom = true
) => {
  try {
    const goToTarget: __esri.GoToTarget2D = {
      geometry,
    };
    if (zoom) {
      goToTarget.zoom = zoom === true ? GO_TO_RACE_ZOOM : zoom;
    }
    const goToOptions = {
      duration: GO_TO_ANIMATION_DURATION,
      easing: GO_TO_ANIMATION_EASING,
    };

    return await view.goTo(goToTarget, animation ? goToOptions : undefined);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return;
    }
    console.error("Unexpected error", err);
  }
};

export const onRaceClickMapHandler: OnRaceMapClickHandlerFnType = async (
  view,
  hitTestResponse,
  currentlySelectedRaceRef,
  races,
  setIsLoading,
  setClickedRaceObj
) => {
  try {
    const { graphic } = hitTestResponse.results[0] as __esri.GraphicHit;
    const hitOid = graphic.attributes?.OBJECTID;

    if (!hitOid) return;
    else if (
      currentlySelectedRaceRef.current &&
      hitOid === currentlySelectedRaceRef.current.oid
    ) {
      await viewGoToGeometry(
        view,
        currentlySelectedRaceRef.current.geometry,
        false,
        false
      );
      return;
    }
    setIsLoading(true);
    const foundRace = races.find((race) => race.OBJECTID === hitOid);
    if (!foundRace) throw new Error("Problem with finding matching race");
    await viewGoToGeometry(view, foundRace.geometry);
    setClickedRaceObj(foundRace);
    setIsLoading(false);
    return { oid: hitOid, geometry: foundRace.geometry };
  } catch (err) {
    setIsLoading(false);
    if (err instanceof Error) {
      console.error(err.message);
      return;
    }
    console.error("Unexpected error", err);
  }
};

export const onViewInstanceCreated: OnViewInstanceCreatedFnType = async (
  view,
  races,
  nextRace,
  setClickedRaceObj,
  setIsLoading,
  updateSelectedRace,
  callback
) => {
  try {
    if (nextRace) {
      setClickedRaceObj(nextRace);
      updateSelectedRace({
        oid: nextRace.OBJECTID,
        geometry: nextRace.geometry,
      });
      await viewGoToGeometry(view, nextRace.geometry);
      const nextRaceIndex = races.findIndex(
        (race) => race.OBJECTID === nextRace.OBJECTID
      );
      if (nextRaceIndex !== 0) {
        const polyline = createPolylineBetweenRaces(
          races[nextRaceIndex - 1],
          nextRace
        );
        view.graphics.add(polyline);
      }
    }
    callback();
    setIsLoading(false);
  } catch (err) {
    setIsLoading(false);
    if (err instanceof Error) {
      console.error(err.message);
      return;
    }
    console.error("Unexpected error", err);
  }
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
