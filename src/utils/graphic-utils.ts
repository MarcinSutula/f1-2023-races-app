import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { DEFAULT_RACE_SIZE, NEXT_RACE_SIZE } from "../config";
import { RaceObj } from "../race-types";
import { getGeometry } from "./utils";

export const changeRacesSymbology = (
  layer: FeatureLayer,
  nextRace: RaceObj
): void => {
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
    maxSize: NEXT_RACE_SIZE,
    minDataValue: 0,
    minSize: DEFAULT_RACE_SIZE,
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
  });

  return polylineGraphic;
};

export const createCircuitPolyline = (
  circuitGeometry: __esri.Geometry
): Graphic => {
  const lineSymbol = {
    type: "simple-line",
    color: "red",
    width: 5,
  };

  const newCircuitGraphic = new Graphic({
    geometry: circuitGeometry,
    symbol: lineSymbol,
  });
  return newCircuitGraphic;
};
