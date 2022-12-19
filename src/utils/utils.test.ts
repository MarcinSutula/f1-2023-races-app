import {
  lapRecordFormatter,
  timestampFormatter,
  lapRecordInfoFormatter,
  getNextRace,
} from "./utils";
import { testData1, testData2, testData3 } from "../testData";

const originalConsoleError = console.error;
let consoleErrorSpy: jest.SpyInstance;

const generateConsoleErrorSpy = () =>
  jest.spyOn(console, "error").mockImplementation((message) => message);

beforeEach(() => {
  consoleErrorSpy = generateConsoleErrorSpy();
});

afterEach(() => {
  console.error = originalConsoleError;
});

type lapRecordInSeconds = number | null;

describe("lapRecordFormatter()", () => {
  const casesReturn0WithConsoleError = [null, -1, 99999999999999999, 3600];
  test.each(casesReturn0WithConsoleError)(
    "returns '0' if lap null or < 0 or >= 3600 sec and shows console error",
    (arg: lapRecordInSeconds) => {
      const argFormatted = lapRecordFormatter(arg);
      expect(consoleErrorSpy).toBeCalledTimes(1);
      expect(consoleErrorSpy).toBeCalledWith("Invalid Lap Record");
      expect(argFormatted).toBe("0");
    }
  );

  test("returns '0' if lap is 0 and does not show console error", () => {
    const lapRecordZero = lapRecordFormatter(0);
    expect(consoleErrorSpy).not.toBeCalled();
    expect(lapRecordZero).toBe("0");
  });

  const casesRecordOver60Under3600 = [
    70, 121.12, 242.12312321312321312313, 60, 60.99999999999999999999999999,
    3599,
  ];

  test.each(casesRecordOver60Under3600)(
    "returns proper lap record format when lap is >= 60 sec and < 3600 sec",
    (arg: lapRecordInSeconds) => {
      const regex = /^\d{1,2}:\d{2}\.\d{3}$/;
      const argFormatted = lapRecordFormatter(arg);
      expect(argFormatted).toMatch(regex);
      expect(consoleErrorSpy).not.toBeCalled();
    }
  );

  const casesRecordUnder60 = [
    0.1, 0.00000000000000001, 5, 5.223, 25, 42.232424234234234234234242, 59.3,
  ];

  test.each(casesRecordUnder60)(
    "returns proper lap record format when lap is < 60 sec",
    (arg: lapRecordInSeconds) => {
      const regex = /^\d{2}\.\d{3}$/;
      const argFormatted = lapRecordFormatter(arg);
      expect(argFormatted).toMatch(regex);
      expect(consoleErrorSpy).not.toBeCalled();
    }
  );
});

describe("timestampFormatter()", () => {
  const casesCorrectTimestamp = [0, 1685836800000, 1700265600000];
  test.each(casesCorrectTimestamp)(
    "returns proper date format given correct timestamp",
    (arg: EpochTimeStamp) => {
      const regex = /^\d{2}\.\d{2}$/;
      const argFormatted = timestampFormatter(arg);
      expect(argFormatted).toMatch(regex);
    }
  );

  test("returns 'Invalid Date' and shows console.error if given invalid timestamp", () => {
    const argFormatted = timestampFormatter(9999999999999999);
    expect(consoleErrorSpy).toBeCalledTimes(1);
    expect(consoleErrorSpy).toBeCalledWith("Invalid Date");
    expect(argFormatted).toBe("Invalid Date");
  });
});

describe("lapRecordInfoFormatter()", () => {
  test("returns proper lap record info format", () => {
    const regex = /^[A-Za-z]+ [A-Za-z]+ [(]\d{4}[)]/;
    const testLapRecordInfo = lapRecordInfoFormatter("Elvis Presley", 2012, 70);

    expect(testLapRecordInfo).toMatch(regex);
  });
});

describe("getNextRace()", () => {
  const racesArr = [testData1, testData2, testData3];
  const RealDate = global.Date;

  afterEach(() => {
    global.Date = RealDate;
  });

  test("returns undefined if there is no next race/last race already passed", () => {
    const testRacesArr = racesArr.map((race) => {
      return {
        ...race,
        race_date: 1608332400000,
      };
    });

    const nextRace = getNextRace(testRacesArr);
    expect(nextRace).toBeUndefined();
  });

  test("returns next race in calendar - last - (testData3)", () => {
    const mockDate = new Date(1700002800000);

    jest.spyOn(global, "Date").mockImplementation((): any => mockDate);
    const nextRace = getNextRace(racesArr);
    expect(nextRace).toStrictEqual(testData3);
  });
  test("returns next race in calendar - middle - (testData2)", () => {
    const mockDate = new Date(1688076000000);

    jest.spyOn(global, "Date").mockImplementation((): any => mockDate);
    const nextRace = getNextRace(racesArr);
    expect(nextRace).toStrictEqual(testData2);
  });

  test("returns next race in calendar - first - (testData1)", () => {
    const mockDate = new Date(1685397600000);

    jest.spyOn(global, "Date").mockImplementation((): any => mockDate);
    const nextRace = getNextRace(racesArr);
    expect(nextRace).toStrictEqual(testData1);
  });
});
