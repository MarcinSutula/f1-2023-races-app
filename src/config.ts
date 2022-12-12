//Init Map View
export const MAX_SCALE: __esri.MapViewConstraints["maxScale"] = 3000;
export const MIN_SCALE: __esri.MapViewConstraints["minScale"] = 80000000;

//Selecting and navigating between races
export const GO_TO_RACE_ZOOM: number = 7;
export const GO_TO_RACE_ANIMATION_DURATION: __esri.GoToOptions2D["duration"] = 1250;
export const GO_TO_RACE_ANIMATION_EASING: __esri.GoToOptions2D["easing"] =
  "ease-in-out";

//Server
export const RACES_NUM: number = 24;
