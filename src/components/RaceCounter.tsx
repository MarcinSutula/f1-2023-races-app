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
    <p className="text-[white] text-3xl text-center my-2 ml-4 p-2 border-2 border-solid border-[grey]">
      {raceCounterStr}
    </p>
  );
}

export default RaceCounter;
