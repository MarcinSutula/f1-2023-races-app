import { circuitSchema } from "./circuitSchema";
import { testCircuit1 } from "../testCircuitData";

describe("Yup Circuit Schema", () => {
  test("positively validate a test object", async () => {
    expect(await circuitSchema.isValid(testCircuit1)).toBe(true);
  });
});
