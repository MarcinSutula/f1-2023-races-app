import { RaceObj } from "../race-types";
import { racesSchema } from "./racesSchema";

export const fetchAllRaces = async (layer: __esri.FeatureLayer) => {
  try {
    const featureSet: __esri.FeatureSet = await layer.queryFeatures({
      where: `1=1`,
      returnGeometry: true,
      outFields: ["*"],
      orderByFields: ["start_date ASC"],
    });
    if (!featureSet || !featureSet?.features)
      throw new Error("Problem with fetching");
    const racesResponse: RaceObj[] = featureSet.features.map((feature) => {
      if (!feature.attributes || !feature.geometry) return undefined;

      return { ...feature.attributes, geometry: feature.geometry };
    });

    const isResponseValid = await racesSchema.isValid(racesResponse, {
      stripUnknown: false,
    });

    if (!isResponseValid) {
      throw new Error("Wrong server response");
    }
    return racesResponse;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return;
    }
    console.error("Unexpected error", err);
  }
};
