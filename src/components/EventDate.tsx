import { RaceObj } from "../race-types";
import { timestampFormatter } from "../utils/utils";

export type EventDateProps = {
  startTimestamp: RaceObj["start_date"];
  endTimestamp: RaceObj["race_date"];
};

function EventDate({ startTimestamp, endTimestamp }: EventDateProps) {
  const formattedStartDate = timestampFormatter(startTimestamp);
  const formattedEndDate = timestampFormatter(endTimestamp);
  const eventDate = `${formattedStartDate}-${formattedEndDate}`;

  return <p className="text-white text-center text-2xl">{eventDate}</p>;
}

export default EventDate;
