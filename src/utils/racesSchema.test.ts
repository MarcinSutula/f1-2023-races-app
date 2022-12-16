import { raceObjSchema, racesSchema } from "./racesSchema";
import { testData1 } from "../testData";
import { RACES_NUM } from "../config";

describe("Yup Race Obj Schema", () => {
  test("positively validate a test object", async () => {
    expect(await raceObjSchema.isValid(testData1)).toBe(true);
  });
});

describe("Yup Races Schema", () => {
  test("positively validate an array with config amount of Race Obj", async () => {
    const racesArr = [];

    for (let i = 0; i < RACES_NUM; i++) {
      racesArr.push(testData1);
    }
    expect(await racesSchema.isValid(racesArr)).toBe(true);
  });
});
