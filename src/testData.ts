import { RaceObj } from "./race-types";

export const testData1 = {
  OBJECTID: 10,
  name: "Circuit de Barcelona-Catalunya",
  city: "Barcelona",
  country: "Spain",
  race_date: 1685836800000,
  circuit_length: 4675,
  laps_num: 66,
  race_dist: 308424,
  lap_record_seconds: 78.14900207519531,
  drs_zones_num: 2,
  start_date: 1685664000000,
  lap_record_owner: "Max Verstappen",
  lap_record_year: 2021,
  geometry: {
    spatialReference: {
      latestWkid: 3857,
      wkid: 102100,
    },
    x: 251283.79619999975,
    y: 5096643.108199999,
  } as any,
} as RaceObj;

export const testData2 = {
  OBJECTID: 12,
  name: "Red Bull Ring",
  city: "Spielberg",
  country: "Austria",
  race_date: 1688256000000,
  circuit_length: 4318,
  laps_num: 71,
  race_dist: 306452,
  lap_record_seconds: 65.61900329589844,
  drs_zones_num: 3,
  start_date: 1688083200000,
  lap_record_owner: "Carlos Sainz",
  lap_record_year: 2020,
  geometry: {
    spatialReference: {
      latestWkid: 3857,
      wkid: 102100,
    },
    x: 1643644.2204999998,
    y: 5978080.698200002,
  } as any,
} as RaceObj;

export const testData3 = {
  OBJECTID: 24,
  name: "Las Vegas Street Circuit",
  city: "Las Vegas",
  country: "USA",
  race_date: 1700265600000,
  circuit_length: 6120,
  laps_num: 50,
  race_dist: 305775,
  lap_record_seconds: 0,
  drs_zones_num: 2,
  start_date: 1700092800000,
  lap_record_owner: null,
  lap_record_year: null,
  geometry: {
    spatialReference: {
      latestWkid: 3857,
      wkid: 102100,
    },
    x: -12828910.678599998,
    y: 4328643.891100004,
  } as any,
} as RaceObj;
