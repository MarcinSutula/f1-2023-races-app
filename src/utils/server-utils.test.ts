import { largeDataRaceObj } from "../testData";
import { fetchAllRaces } from "./server-utils";
import { BaseSchema } from "yup";

const originalConsoleError = console.error;
const originalYupIsValid = BaseSchema.prototype.isValid;
let yupIsValidSpy: jest.SpyInstance;
let consoleErrorSpy: jest.SpyInstance;

const generateYupIsValidSpy = () =>
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

const generateConsoleErrorSpy = () =>
  jest.spyOn(console, "error").mockImplementation((message) => message);

beforeEach(() => {
  yupIsValidSpy = generateYupIsValidSpy();
  consoleErrorSpy = generateConsoleErrorSpy();
});
afterEach(() => {
  console.error = originalConsoleError;
  BaseSchema.prototype.isValid = originalYupIsValid;
});

describe("fetchAllRaces()", () => {
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
    expect(consoleErrorSpy).toBeCalledWith("Problem with fetching");
    expect(yupIsValidSpy).not.toBeCalled();
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
    expect(consoleErrorSpy).toBeCalledTimes(1);
    expect(consoleErrorSpy).toBeCalledWith("Wrong server response");
    expect(yupIsValidSpy).toBeCalledTimes(1);
  });
});
