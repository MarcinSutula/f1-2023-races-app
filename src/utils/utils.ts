import { RaceObj } from "../race-types";

export const fetchAllRaces = async (
  layer: __esri.FeatureLayer
): Promise<RaceObj[]> => {
  const featureSet: __esri.FeatureSet = await layer.queryFeatures({
    where: `1=1`,
    returnGeometry: true,
    outFields: ["*"],
  });
  if (!featureSet || !featureSet?.features)
    throw new Error("Problem with fetching");
  const racesArr: RaceObj[] = featureSet.features.map((feature) => {
    return { ...feature.attributes, geometry: feature.geometry };
  });
  return racesArr;
};

export const lapRecordFormatter = (
  lapRecordInSeconds: number | null
): string => {
  if (!lapRecordInSeconds) return "0";

  const lapRecordStr = lapRecordInSeconds.toFixed(3).toString();
  let [secondsStr, miliSecondsStr] = lapRecordStr.split(".");
  let minutes = 0;

  if (+secondsStr >= 60) {
    minutes = Math.floor(+secondsStr / 60);
    secondsStr = (+secondsStr - minutes * 60).toString();
  }
  if (+secondsStr < 10) {
    secondsStr = "0" + secondsStr;
  }

  return `${minutes ? minutes + ":" : ""}${secondsStr}.${miliSecondsStr}`;
};

export const timestampFormatter = (timestamp: EpochTimeStamp): string => {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${day}.${month}`;
};

export const lapRecordInfoFormatter = (
  owner: string,
  year: number,
  seconds: number
): string => {
  return `${owner} (${year}) ${lapRecordFormatter(seconds)}`;
};
