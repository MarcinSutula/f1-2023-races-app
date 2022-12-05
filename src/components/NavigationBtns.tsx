import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { useContext } from "react";
import { RacesArrContext, ViewContext } from "../App";
import { RaceObj } from "../race-types";

type NavigationBtnsProps = {
  selectedRaceObj: RaceObj;
  setSelectedRaceObj: (raceObj: RaceObj) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
};

function NavigationBtns({
  selectedRaceObj,
  setSelectedRaceObj,
  setIsLoading,
  isLoading,
}: NavigationBtnsProps) {
  const viewCtx = useContext(ViewContext);
  const racesArrCtx = useContext(RacesArrContext);

  const isBackBtnDisabled =
    racesArrCtx?.at(0)?.OBJECTID === selectedRaceObj.OBJECTID;
  const isNextBtnDisabled =
    racesArrCtx?.at(-1)?.OBJECTID === selectedRaceObj.OBJECTID;

  const btnColorHandler = (disabled: boolean): string =>
    disabled ? "grey" : "red";

  const navigationHandler = async (mode: "next" | "back") => {
    try {
      if (isLoading) return;
      const isDisabled =
        mode === "next" ? isNextBtnDisabled : isBackBtnDisabled;

      if (!viewCtx || !racesArrCtx || isDisabled)
        throw new Error("Problem with initializing navigation");
      setIsLoading(true);

      const selectedRaceIndex = racesArrCtx.findIndex(
        (race) => race.OBJECTID === selectedRaceObj.OBJECTID
      );
      if (selectedRaceIndex === -1) {
        setIsLoading(false);
        throw new Error("Problem with finding selected race");
      }
      const followingRaceIndex =
        mode === "next" ? selectedRaceIndex + 1 : selectedRaceIndex - 1;

      const followingRace = racesArrCtx[followingRaceIndex];
      await viewCtx.goTo({ geometry: followingRace.geometry, zoom: 8 });
      setSelectedRaceObj(followingRace);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err instanceof Error) {
        console.error(err.message);
        return;
      }
      console.error("Unexpected error", err);
    }
  };

  return (
    <div className="flex justify-end">
      <div className="text-white text-center m-2 p-2">
        <button
          onClick={() => navigationHandler("back")}
          disabled={isBackBtnDisabled}
        >
          <AiOutlineLeft
            color={btnColorHandler(isBackBtnDisabled)}
            fontSize={40}
          />
        </button>
        <button
          onClick={() => navigationHandler("next")}
          disabled={isNextBtnDisabled}
        >
          <AiOutlineRight
            color={btnColorHandler(isNextBtnDisabled)}
            fontSize={40}
          />
        </button>
      </div>
    </div>
  );
}

export default NavigationBtns;
