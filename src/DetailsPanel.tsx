import { RaceObj } from "./MapViewCcmp.types";
import { ThreeCircles } from "react-loader-spinner";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";

type DetailsPanelProps = {
  selectedRaceObj: RaceObj | null;
  isLoading: boolean;
};

function DetailsPanel({ selectedRaceObj, isLoading }: DetailsPanelProps) {
  return (
    <div className="w-80 border-l-4 border-solid border-black rounded-md bg-[#100636]">
      {!isLoading && (
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
          <h1 className="text-white text-center">
            {selectedRaceObj
              ? selectedRaceObj.name
              : "Click an object to see it's details"}
          </h1>
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
