import { useState } from "react";
import { RaceObj } from "../MapViewCcmp.types";

// type useQueryFeaturesArgs = {
//   layer?: __esri.FeatureLayer;
// };

export function useQueryFeatures(): [
  RaceObj[] | undefined,
  (layer: __esri.FeatureLayer) => void
] {
  const [races, setRaces] = useState<RaceObj[] | undefined>(undefined);

  function queryAllFeatures(layer: __esri.FeatureLayer): void {
    layer
      .queryFeatures({
        where: "1=1",
        returnGeometry: true,
        outFields: ["*"],
      })
      .then((featureSet: __esri.FeatureSet) => {
        const racesArr = featureSet.features.map((feature) => {
          const raceObj = {
            ...feature.attributes,
          };
          raceObj.geometry = feature.geometry;
          return raceObj;
        });
        setRaces(racesArr);
      });
  }

  return [races, queryAllFeatures];
}
