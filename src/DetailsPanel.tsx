import { RaceObj } from "./MapViewCcmp.types";
import { ThreeCircles } from "react-loader-spinner";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import DetailInfo from "./DetailInfo";

type DetailsPanelProps = {
  selectedRaceObj: RaceObj | null;
  isLoading: boolean;
};

function DetailsPanel({ selectedRaceObj, isLoading }: DetailsPanelProps) {
  const timestampFormatter = (timestamp: EpochTimeStamp): string => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}.${month}`;
  };

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

  // selectedRaceObj &&
  //   console.log(
  //     selectedRaceObj.lap_record_owner,
  //     selectedRaceObj.lap_record_year,
  //     selectedRaceObj
  //   );

  return (
    <div className="w-96 border-l-2 border-solid border-black rounded-md bg-[#100636]">
      {!isLoading && selectedRaceObj && (
        <>
          <div className="flex justify-end">
            <div className="text-white text-center m-2 p-2">
              <button>
                <AiOutlineLeft color="red" fontSize={40} />
              </button>
              <button>
                <AiOutlineRight color="red" fontSize={40} />
              </button>
            </div>
          </div>
          <p className="text-white text-center font-bold text-3xl">
            {selectedRaceObj
              ? selectedRaceObj.name
              : "Click an object to see it's details"}
          </p>
          <div className="w-5/6 h-36 m-auto mt-7">
            <img
              src={require("./images/circuits/bahrain-circuit.jpg")}
              alt="Bahrain Circuit"
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex h-8 mt-12 justify-between mx-7">
            <p className="text-white text-center text-2xl">{`${timestampFormatter(
              selectedRaceObj.start_date
            )}-${timestampFormatter(selectedRaceObj.race_date)}`}</p>
            <img
              src={require("./images/flags/bahrain-flag.png")}
              alt="Bahrain Flag"
              className="object-cover rounded-lg"
            />
          </div>
          <p className="text-white text-2xl text-center my-6">{`${selectedRaceObj.city}, ${selectedRaceObj.country}`}</p>
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

          <div className="text-center">
            <button className="bg-[red] h-14 text-center w-5/6 text-white font-bold mt-12">
              Circuit Details
            </button>
          </div>
        </>
      )}
      {isLoading && (
        <ThreeCircles
          height="100"
          width="100"
          color="#1e90ff"
          wrapperStyle={{
            position: "fixed",
            top: "50%",
            left: "45%",
            transform: "translate(-50%, -50%)",
          }}
          wrapperClass=""
          visible={true}
          ariaLabel="three-circles-rotating"
          outerCircleColor="#00008b"
          innerCircleColor=""
          middleCircleColor="red"
        />
      )}
    </div>
  );
}

export default DetailsPanel;
