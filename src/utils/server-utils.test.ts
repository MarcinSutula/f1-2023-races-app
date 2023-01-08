import { testData1 } from "../testData";
import { fetchAllRaces } from "./server-utils";
import { BaseSchema } from "yup";

jest
  .spyOn(BaseSchema.prototype, "isValid")
  .mockImplementation((racesResponse: object[]): Promise<boolean> => {
    if (
      !racesResponse ||
      racesResponse.length < 1 ||
      racesResponse[0].hasOwnProperty("randomAtr")
    ) {
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  });

jest.spyOn(console, "error").mockImplementation(() => {});

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
              attributes: { ...testData1 },
              geometry: testData1.geometry,
            },
          ],
        };
      },
    };

    expect(await fetchAllRaces(layer as any)).toStrictEqual([testData1]);
    expect(BaseSchema.prototype.isValid).toBeCalledTimes(1);
    expect(console.error).not.toBeCalled();
  });

  test("catches and shows correct console error if server request and so the response were incorrect", async () => {
    const layer = {
      queryFeatures: () => {
        return {};
      },
    };

    expect(await fetchAllRaces(layer as any)).toBeUndefined();
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith("Problem with fetching all races");
    expect(BaseSchema.prototype.isValid).not.toBeCalled();
  });

  test("catches and shows correct console error if server response attributes were incorrect", async () => {
    const layer = {
      queryFeatures: () => {
        return {
          features: [
            {
              attributes: { randomAtr: "monument", randomAtr2: 2 },
              geometry: { randomAtr3: 15, randomAtr4: -20 },
            },
          ],
        };
      },
    };
    expect(await fetchAllRaces(layer as any)).toBeUndefined();
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith("Wrong server response (races)");
    expect(BaseSchema.prototype.isValid).toBeCalledTimes(1);
  });
});
