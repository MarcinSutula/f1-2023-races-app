import * as yup from "yup";
import { RACES_NUM } from "../config";

export const racesSchema = yup
  .array()
  .of(
    yup
      .object({
        OBJECTID: yup.number().required().positive(),
        geometry: yup.object().required(),
        name: yup.string().required(),
        city: yup.string().required(),
        country: yup.string().required(),
        race_date: yup
          .date()
          .transform((_, val) => {
            return new Date(val);
          })
          .required(),
        circuit_length: yup.number().required().positive(),
        laps_num: yup.number().required().positive(),
        race_dist: yup.number().required().positive(),
        lap_record_seconds: yup.number().nullable().defined(),
        drs_zones_num: yup.number().required().positive(),
        start_date: yup
          .date()
          .transform((_, val) => {
            return new Date(val);
          })
          .required(),
        lap_record_owner: yup.string().nullable().defined(),
        lap_record_year: yup.number().nullable().defined(),
      })
      .required()
  )
  .length(RACES_NUM);
