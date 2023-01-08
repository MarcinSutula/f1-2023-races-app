import * as yup from "yup";

export const circuitSchema = yup
  .object({
    geometry: yup.object().required(),
    attributes: yup.object(),
  })
  .noUnknown()
  .required();
