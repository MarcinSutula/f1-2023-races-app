
export const lapRecordFormatter = (
  lapRecordInSeconds: number | null
): string => {
  if (
    !lapRecordInSeconds ||
    lapRecordInSeconds < 0 ||
    lapRecordInSeconds >= 3600
  ) {
    lapRecordInSeconds !== 0 && console.error("Invalid Lap Record");
    return "0";
  }
  const lapRecordStr = lapRecordInSeconds.toFixed(3).toString();
  let [secondsStr, miliSecondsStr] = lapRecordStr.split(".");
  let minutes = 0;

  if (+secondsStr >= 60) {
    minutes = Math.floor(+secondsStr / 60);
    secondsStr = (+secondsStr - minutes * 60).toString();
  }
  if (+secondsStr < 10) {
    secondsStr = "0" + secondsStr;
  }

  return `${minutes ? minutes + ":" : ""}${secondsStr}.${miliSecondsStr}`;
};

export const timestampFormatter = (timestamp: EpochTimeStamp): string => {
  const date = new Date(timestamp);
  const dateStr = date.toString();
  if (dateStr === "Invalid Date") {
    console.error(dateStr);
    return dateStr;
  }
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${day}.${month}`;
};

export const lapRecordInfoFormatter = (
  owner: string,
  year: number,
  seconds: number
): string => {
  return `${owner} (${year}) ${lapRecordFormatter(seconds)}`;
};