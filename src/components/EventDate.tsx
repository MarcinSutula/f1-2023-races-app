import { RaceObj } from "../race-types";
import { timestampFormatter } from "../utils";

type EventDateProps = {
  startDate: RaceObj["start_date"];
  endDate: RaceObj["race_date"];
};

function EventDate({ startDate, endDate }: EventDateProps) {
  const formattedStartDate = timestampFormatter(startDate);
  const formattedEndDate = timestampFormatter(endDate);
  const eventDate = `${formattedStartDate}-${formattedEndDate}`;

  return <p className="text-white text-center text-2xl">{eventDate}</p>;
}

export default EventDate;
