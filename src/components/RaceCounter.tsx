import { RaceObj } from "../race-types";
import { useRacesArrContext } from "../context/RacesArrContext";

export type RaceCounterProps = {
  selectedRaceOid: RaceObj["OBJECTID"];
};

function RaceCounter({ selectedRaceOid }: RaceCounterProps) {
  const racesArrCtx = useRacesArrContext();
  const racesSum = racesArrCtx ? racesArrCtx.length : "";
  let raceOrdNum = racesArrCtx
    ? racesArrCtx.findIndex((race) => race.OBJECTID === selectedRaceOid) + 1
    : "";
  if (raceOrdNum && raceOrdNum < 10) {
    raceOrdNum = "0" + raceOrdNum;
  }
  const raceCounterStr = `${raceOrdNum}/${racesSum}`;

  return (
    <p className="text-[white] font-semibold text- text-3xl text-center my-4 ml-4">
      {raceCounterStr}
    </p>
  );
}

export default RaceCounter;
