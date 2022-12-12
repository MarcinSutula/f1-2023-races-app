import * as yup from "yup";

//may be useful later

export const createFeatureServiceSchema = (
  objectSchema: yup.AnyObjectSchema
): yup.AnyObjectSchema => {
  const fsSchema = yup
    .object({
      objectIdFieldName: yup.string().required(),
      uniqueIdField: yup.object({
        name: yup.string().required(),
        isSystemMaintained: yup.boolean().required(),
      }),
      globalIdFieldName: yup.string().nullable(),
      geometryType: yup.string().required(),
      spatialReference: yup.object({
        wkid: yup.number().required().positive(),
        latestWkid: yup.number().required().positive(),
      }),
      fields: yup.array(),
      features: yup
        .array()
        .of(
          yup.object({
            attributes: objectSchema,
            geometry: yup.object({
              x: yup.number().required().positive(),
              y: yup.number().required().positive(),
            }),
          })
        )
        .required(),
    })
    .required();

  return fsSchema;
};
