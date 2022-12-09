import {
  lapRecordFormatter,
  timestampFormatter,
  lapRecordInfoFormatter,
} from "./utils";

const originalConsoleError = console.error;

////////////////lapRecordFormatter()//////////////////

type lapRecordInSeconds = number | null;
//"returns '0' if lap is 0 or null or < 0 or >= 3600 sec"
const casesReturn0WithConsoleError = [null, -1, 99999999999999999, 3600];
//"returns proper lap record format when lap is >= 60 sec and < 3600 sec"
const casesRecordOver60Under3600 = [
  70, 121.12, 242.12312321312321312313, 60, 60.99999999999999999999999999, 3599,
];
//"returns proper lap record format when lap is < 60 sec"
const casesRecordUnder60 = [
  0.1, 0.00000000000000001, 5, 5.223, 25, 42.232424234234234234234242, 59.3,
];

afterEach(() => {
  console.error = originalConsoleError;
});

describe("lapRecordFormatter()", () => {
  test.each(casesReturn0WithConsoleError)(
    "returns '0' if lap null or < 0 or >= 3600 sec and shows console error",
    (arg: lapRecordInSeconds) => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const argFormatted = lapRecordFormatter(arg);
      expect(consoleSpy).toHaveBeenCalled();
      expect(argFormatted).toBe("0");
    }
  );

  test("returns '0' if lap is 0 and does not show console error", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const lapRecordZero = lapRecordFormatter(0);
    expect(consoleSpy).not.toHaveBeenCalled();
    expect(lapRecordZero).toBe("0");
  });

  test.each(casesRecordOver60Under3600)(
    "returns proper lap record format when lap is >= 60 sec and < 3600 sec",
    (arg: lapRecordInSeconds) => {
      const regex = /^\d{1,2}:\d{2}\.\d{3}$/;
      const argFormatted = lapRecordFormatter(arg);
      expect(argFormatted).toMatch(regex);
    }
  );

  test.each(casesRecordUnder60)(
    "returns proper lap record format when lap is < 60 sec",
    (arg: lapRecordInSeconds) => {
      const regex = /^\d{2}\.\d{3}$/;
      const argFormatted = lapRecordFormatter(arg);
      expect(argFormatted).toMatch(regex);
    }
  );
});

////////////////timestampFormatter()//////////////////

type timestamp = EpochTimeStamp;
//"returns proper date format given correct timestamp" cases with 1 or 2 digit day or month formats
const casesCorrectTimestamp = [0, 1685836800000, 1700265600000];

describe("timestampFormatter()", () => {
  test.each(casesCorrectTimestamp)(
    "returns proper date format given correct timestamp",
    (arg: timestamp) => {
      const regex = /^\d{2}\.\d{2}$/;
      const argFormatted = timestampFormatter(arg);
      expect(argFormatted).toMatch(regex);
    }
  );

  test("returns 'Invalid Date' and shows console.error if given invalid timestamp", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const argFormatted = timestampFormatter(9999999999999999);
    expect(consoleSpy).toHaveBeenCalled();
    expect(argFormatted).toBe("Invalid Date");
  });
});

///////////////////////lapRecordInfoFormatter//////////////////////

describe("lapRecordInfoFormatter()", () => {
  test("returns proper lap record info format", () => {
    const regex = /^[A-Za-z]+ [A-Za-z]+ [(]\d{4}[)]/;
    const test = lapRecordInfoFormatter("Marcin Sutula", 2012, 70);

    expect(test).toMatch(regex);
  });
});
