import { CircuitObj, RaceObj } from "../race-types";
import { circuitSchema } from "./circuitSchema";
import { racesSchema } from "./racesSchema";

export const fetchAllRaces = async (
  layer: __esri.FeatureLayer
): Promise<RaceObj[] | undefined> => {
  try {
    const featureSet: __esri.FeatureSet = await layer.queryFeatures({
      where: `1=1`,
      returnGeometry: true,
      outFields: ["*"],
      orderByFields: ["start_date ASC"],
    });
    if (!featureSet || !featureSet?.features)
      throw new Error("Problem with fetching all races");
    const racesResponse: RaceObj[] = featureSet.features.map((feature) => {
      if (!feature.attributes || !feature.geometry) return undefined;

      return { ...feature.attributes, geometry: feature.geometry };
    });

    const isResponseValid = await racesSchema.isValid(racesResponse, {
      stripUnknown: false,
    });

    if (!isResponseValid) {
      throw new Error("Wrong server response (races)");
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

export const fetchRelatedCircuit = async (
  layer: __esri.FeatureLayer,
  objRelId: RaceObj["rel_id"]
): Promise<CircuitObj | undefined> => {
  try {
    const relationship = layer.relationships.find(
      (rel) => rel.name === "F1_2023_tracks"
    );
    if (!relationship) throw new Error("Problem with finding related layer");

    const featureSet = await layer.queryRelatedFeatures({
      where: `rel_id_child=${objRelId}`,
      relationshipId: relationship.id,
      // outFields: ["*"],
      returnGeometry: true,
    });
    if (!featureSet[objRelId] || !featureSet[objRelId].features)
      throw new Error("Problem with fetching related circuit");
    const feature = (featureSet[objRelId] as __esri.FeatureSet).features[0];
    const circuitResponse: CircuitObj = {
      geometry: feature.geometry,
      attributes: { ...feature.attributes },
    };

    const isResponseValid = await circuitSchema.isValid(circuitResponse, {
      stripUnknown: false,
    });

    if (!isResponseValid) {
      throw new Error("Wrong server response (circuit)");
    }

    return circuitResponse;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return;
    }
    console.error("Unexpected error", err);
  }
};
