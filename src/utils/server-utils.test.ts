import { largeDataRaceObj } from "../stories/testData";
import { fetchAllRaces } from "./server-utils";
import { BaseSchema } from "yup";

const originalConsoleError = console.error;
const originalyupIsValid = BaseSchema.prototype.isValid;

describe("fetchAllRaces()", () => {
  let yupIsValidSpy = jest
    .spyOn(BaseSchema.prototype, "isValid")
    .mockImplementation((racesResponse: any): Promise<boolean> => {
      const promise: Promise<boolean> = new Promise((res, rej) => {
        if (!racesResponse || racesResponse.length < 1) rej(false);
        res(true);
      });
      return promise;
    });
  let consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    yupIsValidSpy = jest
      .spyOn(BaseSchema.prototype, "isValid")
      .mockImplementation((racesResponse: object[]): Promise<boolean> => {
        const promise: Promise<boolean> = new Promise((res, rej) => {
          if (
            !racesResponse ||
            racesResponse.length < 1 ||
            racesResponse[0].hasOwnProperty("randomAtr")
          )
            rej(false);
          res(true);
        });
        return promise;
      });

    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error = originalConsoleError;
    BaseSchema.prototype.isValid = originalyupIsValid;
  });

  test("returns races response array if server response was correct", async () => {
    const layer = {
      queryFeatures: () => {
        return {
          features: [
            {
              attributes: { ...largeDataRaceObj },
              geometry: largeDataRaceObj.geometry,
            },
          ],
        };
      },
    };
    expect(await fetchAllRaces(layer as any)).toStrictEqual([largeDataRaceObj]);
    expect(yupIsValidSpy).toBeCalledTimes(1);
    expect(consoleSpy).not.toBeCalled();
  });

  test("catches and shows console error if server request and so the response were incorrect", async () => {
    const layer = {
      queryFeatures: () => {
        return {};
      },
    };

    expect(await fetchAllRaces(layer as any)).toBeUndefined();
    expect(consoleSpy).toBeCalledTimes(1);
    expect(yupIsValidSpy).not.toBeCalled();
  });

  test("catches and shows console error if server response attributes were incorrect", async () => {
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
    expect(consoleSpy).toBeCalledTimes(1);
    expect(yupIsValidSpy).toBeCalledTimes(1);
  });
});
