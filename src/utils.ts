import { RaceObj } from "./race-types";

export const fetchAllRaces = async (
  layer: __esri.FeatureLayer
): Promise<RaceObj[]> => {
  const featureSet: __esri.FeatureSet = await layer.queryFeatures({
    where: `1=1`,
    returnGeometry: true,
    outFields: ["*"],
  });
  const racesArr: RaceObj[] = featureSet.features.map((feature) => {
    return { ...feature.attributes, geometry: feature.geometry };
  });
  return racesArr;
};
