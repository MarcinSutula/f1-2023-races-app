import {
  lapRecordFormatter,
  timestampFormatter,
  lapRecordInfoFormatter,
  getNextRace,
  toggleUIZoom,
  eventLocker,
} from "./utils";
import { testRace1, testRace2, testRace3 } from "../testRacesData";

const consoleErrorSpy = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

afterEach(() => {
  jest.clearAllMocks();
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
  const racesArr = [testRace1, testRace2, testRace3];

  const createNewDateMock = (mockDate: any) =>
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
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

  test("returns next race in calendar - last - (testRace3)", () => {
    const mockDate = new Date(1700002800000);
    createNewDateMock(mockDate);

    const nextRace = getNextRace(racesArr);
    expect(nextRace).toStrictEqual(testRace3);
  });
  test("returns next race in calendar - middle - (testRace2)", () => {
    const mockDate = new Date(1688076000000);
    createNewDateMock(mockDate);

    const nextRace = getNextRace(racesArr);
    expect(nextRace).toStrictEqual(testRace2);
  });

  test("returns next race in calendar - first - (testRace1)", () => {
    const mockDate = new Date(1685397600000);
    createNewDateMock(mockDate);

    const nextRace = getNextRace(racesArr);
    expect(nextRace).toStrictEqual(testRace1);
  });

  describe("toggleUIZoom()", () => {
    test("removes 'zoom' from view.ui.components array", () => {
      const cmps = ["1", "2", "3", "zoom", "4", "5", "6"];
      const cmpsWithoutZoom = ["1", "2", "3", "4", "5", "6"];
      const view: any = {
        ui: {
          components: cmps,
        },
      };
      toggleUIZoom(view);
      expect(view.ui.components).toStrictEqual(cmpsWithoutZoom);
    });

    test("adds zoom if there wasnt one", () => {
      const cmps = ["1", "2", "3", "4", "5", "6"];
      const view: any = {
        ui: {
          components: [...cmps],
        },
      };
      toggleUIZoom(view);
      expect(view.ui.components.includes("zoom")).toBe(true);
    });
  });

  describe("eventLocker()", () => {
    const stopPropagationMock = jest.fn();
    const event: any = { stopPropagation: stopPropagationMock };

    test("locks event if shouldLock is true", () => {
      const shouldLock = true;
      eventLocker(shouldLock, event);
      expect(stopPropagationMock).toBeCalledTimes(1);
    });

    test("does nothing if shouldLock is false", () => {
      const shouldLock = false;
      eventLocker(shouldLock, event);
      expect(stopPropagationMock).not.toBeCalled();
    });
  });
});
