import { RaceObj } from "../race-types";

type EventDateProps = {
  startDate: RaceObj["start_date"];
  endDate: RaceObj["race_date"];
};

function EventDate({ startDate, endDate }: EventDateProps) {
  const timestampFormatter = (timestamp: EpochTimeStamp): string => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}.${month}`;
  };

  const formattedStartDate = timestampFormatter(startDate);
  const formattedEndDate = timestampFormatter(endDate);
  const eventDate = `${formattedStartDate}-${formattedEndDate}`;

  return <p className="text-white text-center text-2xl">{eventDate}</p>;
}

export default EventDate;
