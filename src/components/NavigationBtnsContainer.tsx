import { useContext } from "react";
import { RacesArrContext, ViewContext } from "../App";
import { RaceObj } from "../race-types";
import { viewGoToRace } from "../utils/map-utils";
import NavBtn from "./NavBtn";

type NavigationBtnsProps = {
  selectedRaceOid: RaceObj["OBJECTID"];
  setSelectedRaceObj: (raceObj: RaceObj) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
};

export type NavigationMode = "back" | "next";

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

  const navigationHandler = async (mode: NavigationMode) => {
    try {
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
    <div className="m-2 p-2">
      <NavBtn
        mode="back"
        disabled={isLoading || isBackBtnDisabled}
        onClickHandler={navigationHandler}
        basicColor="red"
        size={40}
      />
      <NavBtn
        mode="next"
        disabled={isLoading || isNextBtnDisabled}
        onClickHandler={navigationHandler}
        basicColor="red"
        size={40}
      />
    </div>
  );
}

export default NavigationBtns;
