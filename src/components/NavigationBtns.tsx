import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { useContext } from "react";
import { RacesArrContext, ViewContext } from "../App";
import { RaceObj } from "../race-types";
import { viewGoToRace } from "../utils";

type NavigationBtnsProps = {
  selectedRaceOid: RaceObj["OBJECTID"];
  setSelectedRaceObj: (raceObj: RaceObj) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
};

function NavigationBtns({
  selectedRaceOid,
  setSelectedRaceObj,
  setIsLoading,
  isLoading,
}: NavigationBtnsProps) {
  const viewCtx = useContext(ViewContext);
  const racesArrCtx = useContext(RacesArrContext);

  const isBackBtnDisabled = racesArrCtx?.at(0)?.OBJECTID === selectedRaceOid;
  const isNextBtnDisabled = racesArrCtx?.at(-1)?.OBJECTID === selectedRaceOid;

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
        (race) => race.OBJECTID === selectedRaceOid
      );
      if (selectedRaceIndex === -1) {
        setIsLoading(false);
        throw new Error("Problem with finding selected race");
      }
      const followingRaceIndex =
        mode === "next" ? selectedRaceIndex + 1 : selectedRaceIndex - 1;

      const followingRace = racesArrCtx[followingRaceIndex];
      await viewGoToRace(viewCtx, followingRace.geometry);
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
  );
}

export default NavigationBtns;
