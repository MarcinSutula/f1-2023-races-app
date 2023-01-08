export type RaceObj = {
  OBJECTID: number;
  geometry: __esri.Geometry;
  name: string;
  city: string;
  country: string;
  race_date: EpochTimeStamp;
  circuit_length: number;
  laps_num: number;
  race_dist: number;
  lap_record_seconds: number | null;
  drs_zones_num: number;
  start_date: EpochTimeStamp;
  lap_record_owner: string | null;
  lap_record_year: number | null;
  rel_id: number;
};

export type RaceRefObj = {
  oid: RaceObj["OBJECTID"];
  geometry: RaceObj["geometry"];
};

export type CircuitObj = {
  geometry: __esri.Geometry;
  attributes: object;
};
