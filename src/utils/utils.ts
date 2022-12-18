import { RaceObj } from "../race-types";

export const lapRecordFormatter = (
  lapRecordInSeconds: number | null
): string => {
  if (
    !lapRecordInSeconds ||
    lapRecordInSeconds < 0 ||
    lapRecordInSeconds >= 3600
  ) {
    lapRecordInSeconds !== 0 && console.error("Invalid Lap Record");
    return "0";
  }
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
  const dateStr = date.toString();
  if (dateStr === "Invalid Date") {
    console.error(dateStr);
    return dateStr;
  }
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

export const getNextRace = (races: RaceObj[]): RaceObj | undefined => {
  const nowTimestamp = new Date().getTime();
  const lastRace = races.at(-1);
  if (lastRace && nowTimestamp > lastRace.race_date) return;

  const nextRaceTimestamp = races.reduce(
    (acc: RaceObj["race_date"], val: RaceObj) => {
      const raceToNowDiff = val.race_date - nowTimestamp;
      const prevRaceToNowDiff = acc - nowTimestamp;
      if (acc === -1) return val.race_date;
      return raceToNowDiff >= 0 && raceToNowDiff < prevRaceToNowDiff
        ? val.race_date
        : acc;
    },
    -1
  );

  const nextRace = races.find(
    (race: RaceObj) => race.race_date === nextRaceTimestamp
  );
  return nextRace;
};

export const getGeometry = (
  geometry: __esri.Geometry,
  mode: "lng,lat" | "x,y"
): [number, number] => [
  geometry.get(mode === "lng,lat" ? "longitude" : "x"),
  geometry.get(mode === "lng,lat" ? "latitude" : "y"),
];
