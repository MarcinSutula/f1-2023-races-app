import { RaceObj } from "./race-types";
import DetailInfo from "./components/DetailInfo";
import NavigationBtns from "./components/NavigationBtns";
import PanelTitle from "./components/PanelTitle";
import PanelImage from "./PanelImage";
import EventDate from "./components/EventDate";
import RaceLocation from "./components/RaceLocation";
import CircuitDetailsBtn from "./components/CircuitDetailsBtn";
import RaceCounter from "./components/RaceCounter";

type DetailsPanelProps = {
  selectedRaceObj: RaceObj | undefined;
  setSelectedRaceObj: (raceObj: RaceObj) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
};

function DetailsPanel({
  selectedRaceObj,
  setSelectedRaceObj,
  setIsLoading,
  isLoading,
}: DetailsPanelProps) {
  const lapRecordFormatter = (lapRecordInSeconds: number): string => {
    if (!lapRecordInSeconds) return "0";

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

  return (
    <div className="w-96 border-l-2 border-solid border-black rounded-md bg-[#100636]">
      {selectedRaceObj && (
        <>
          <div className="flex justify-between align-middle mb-2">
            <RaceCounter selectedRaceOid={selectedRaceObj.OBJECTID}/>
            <NavigationBtns
              selectedRaceOid={selectedRaceObj.OBJECTID}
              setSelectedRaceObj={setSelectedRaceObj}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
          </div>
          <PanelTitle title={selectedRaceObj.name} />
          <div className="w-5/6 h-36 m-auto mt-7">
            <PanelImage attribute={selectedRaceObj.city} type="circuit" />
          </div>
          <div className="flex h-8 mt-12 justify-between mx-7">
            <EventDate
              startDate={selectedRaceObj.start_date}
              endDate={selectedRaceObj.race_date}
            />
            <PanelImage attribute={selectedRaceObj.country} type="flag" />
          </div>
          <RaceLocation
            city={selectedRaceObj.city}
            country={selectedRaceObj.country}
          />
          <DetailInfo
            label="Race Distance"
            info={selectedRaceObj.race_dist.toString()}
            measure="km"
            separatorIndex={3}
          />
          <DetailInfo
            label="Circuit Length"
            info={selectedRaceObj.circuit_length.toString()}
            measure="km"
            separatorIndex={1}
          />
          <DetailInfo
            label="Number of Laps"
            info={selectedRaceObj.laps_num.toString()}
          />
          <DetailInfo
            label="Number of DRS Zones"
            info={selectedRaceObj.drs_zones_num.toString()}
          />
          {selectedRaceObj.lap_record_owner && (
            <DetailInfo
              label="Lap Record"
              main
              info={`${selectedRaceObj.lap_record_owner} (${
                selectedRaceObj.lap_record_year
              }) ${lapRecordFormatter(selectedRaceObj.lap_record_seconds)}`}
            />
          )}
          <CircuitDetailsBtn />
        </>
      )}
    </div>
  );
}

export default DetailsPanel;
