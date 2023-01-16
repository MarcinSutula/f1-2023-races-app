//Init Map View
export const BASEMAP_ID: string = "40e0a523b7c040abb5cd3889d55e7492";
export const FEATURELAYER_URL: string =
  "https://services.arcgis.com/zg6BBB0wvjzrRBLk/arcgis/rest/services/F1_2023_Calendar/FeatureServer/1";
export const MAX_SCALE: __esri.MapViewConstraints["maxScale"] = 3000;
export const MIN_SCALE: __esri.MapViewConstraints["minScale"] = 80000000;

//Selecting and navigating between
export const GO_TO_RACE_ZOOM: number = 7;
export const GO_TO_ANIMATION_DURATION: __esri.GoToOptions2D["duration"] = 1250;
export const GO_TO_ANIMATION_EASING: __esri.GoToOptions2D["easing"] =
  "ease-in-out";
export const GO_TO_CIRCUIT_ZOOM: number = 14;

//Server
export const RACES_NUM: number = 24;

//Races symbology
export const NEXT_RACE_SIZE: string = "46px";
export const DEFAULT_RACE_SIZE: string = "26px";

//Navigation lock events
export const NAVIGATION_LOCK_EVENTS: string[] = [
  "click",
  "drag",
  "double-click",
  "mouse-wheel",
  "hold",
  "key-down",
];
