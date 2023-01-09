import { testRace1 } from "../testRacesData";
import { fetchAllRaces, fetchRelatedCircuit } from "./server-utils";
import { BaseSchema } from "yup";
import { testCircuit1 } from "../testCircuitData";

const yupIsValidSpy = jest
  .spyOn(BaseSchema.prototype, "isValid")
  .mockImplementation((res: any): Promise<boolean> => {
    if (
      !res ||
      res[0]?.hasOwnProperty("randomAttr") ||
      res?.attributes?.hasOwnProperty("randomAttr")
    ) {
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  });

const consoleErrorSpy = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

afterEach(() => {
  jest.clearAllMocks();
});

describe("fetchAllRaces()", () => {
  test("returns races response array if server response was correct", async () => {
    const layer = {
      queryFeatures: () => {
        return {
          features: [
            {
              attributes: { ...testRace1 },
              geometry: testRace1.geometry,
            },
          ],
        };
      },
    };

    expect(await fetchAllRaces(layer as any)).toStrictEqual([testRace1]);
    expect(yupIsValidSpy).toBeCalledTimes(1);
    expect(consoleErrorSpy).not.toBeCalled();
  });

  test("catches and shows correct console error if server request and so the response were incorrect", async () => {
    const layer = {
      queryFeatures: () => {
        return {};
      },
    };

    expect(await fetchAllRaces(layer as any)).toBeUndefined();
    expect(consoleErrorSpy).toBeCalledTimes(1);
    expect(consoleErrorSpy).toBeCalledWith("Problem with fetching all races");
    expect(yupIsValidSpy).not.toBeCalled();
  });

  test("catches and shows correct console error if server response attributes were incorrect", async () => {
    const layer = {
      queryFeatures: () => {
        return {
          features: [
            {
              attributes: { randomAttr: "monument", randomAttr2: 2 },
              geometry: { randomAttr3: 15, randomAttr4: -20 },
            },
          ],
        };
      },
    };
    expect(await fetchAllRaces(layer as any)).toBeUndefined();
    expect(consoleErrorSpy).toBeCalledTimes(1);
    expect(consoleErrorSpy).toBeCalledWith("Wrong server response (races)");
    expect(yupIsValidSpy).toBeCalledTimes(1);
  });
});

describe("fetchRelatedCircuit()", () => {
  test("returns circuit response if server response was correct", async () => {
    const layer = {
      relationships: [{ name: "F1_2023_tracks", id: 0 }],
      queryRelatedFeatures: () => {
        return {
          "1": {
            features: [testCircuit1],
          },
        };
      },
    };
    expect(await fetchRelatedCircuit(layer as any, 1)).toStrictEqual(
      testCircuit1
    );
    expect(yupIsValidSpy).toBeCalledTimes(1);
    expect(consoleErrorSpy).not.toBeCalled();
  });

  test("catches and shows correct console error if server request and so the response were incorrect", async () => {
    const layer = {
      relationships: [{ name: "F1_2023_tracks", id: 0 }],
      queryRelatedFeatures: () => {
        return {};
      },
    };

    expect(await fetchRelatedCircuit(layer as any, 1)).toBeUndefined();
    expect(consoleErrorSpy).toBeCalledTimes(1);
    expect(consoleErrorSpy).toBeCalledWith(
      "Problem with fetching related circuit"
    );
    expect(yupIsValidSpy).not.toBeCalled();
  });

  test("catches and shows correct console error if server response does not pass yup validation", async () => {
    const layer = {
      relationships: [{ name: "F1_2023_tracks", id: 0 }],
      queryRelatedFeatures: () => {
        return {
          "1": {
            features: [
              {
                attributes: { randomAttr: "monument", randomAttr2: 2 },
                geometry: { randomAttr3: 15, randomAttr4: -20 },
              },
            ],
          },
        };
      },
    };
    expect(await fetchRelatedCircuit(layer as any, 1)).toBeUndefined();
    expect(consoleErrorSpy).toBeCalledTimes(1);
    expect(consoleErrorSpy).toBeCalledWith("Wrong server response (circuit)");
    expect(yupIsValidSpy).toBeCalledTimes(1);
  });

  test("catch and shows correct console error if could not find related layer", async () => {
    const layer = {
      relationships: [{ name: "random", id: 0 }],
    };

    expect(await fetchRelatedCircuit(layer as any, 1)).toBeUndefined();
    expect(consoleErrorSpy).toBeCalledTimes(1);
    expect(consoleErrorSpy).toBeCalledWith(
      "Problem with finding related layer"
    );
  });
});
