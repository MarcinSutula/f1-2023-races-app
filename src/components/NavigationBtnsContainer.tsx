import { useContext } from "react";
import { RacesArrContext, UpdateCurrentlySelectedRace } from "../App";
import { useMapViewContext } from "../context/MapViewContext";
import { RaceObj } from "../race-types";
import { viewGoToRace } from "../utils/map-utils";
import NavBtn from "./NavBtn";

type NavigationBtnsProps = {
  clickedRaceOid: RaceObj["OBJECTID"];
  setClickedRaceObj: (raceObj: RaceObj) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
};

export type NavigationMode = "back" | "next";

function NavigationBtnsContainer({
  clickedRaceOid,
  setClickedRaceObj,
  setIsLoading,
  isLoading,
}: NavigationBtnsProps) {
  const mapViewCtx = useMapViewContext();
  const racesArrCtx = useContext(RacesArrContext);
  const updateCurrentlySelectedRaceCtx = useContext(
    UpdateCurrentlySelectedRace
  );

  const isBackBtnDisabled = racesArrCtx?.at(0)?.OBJECTID === clickedRaceOid;
  const isNextBtnDisabled = racesArrCtx?.at(-1)?.OBJECTID === clickedRaceOid;

  const navigationHandler = async (mode: NavigationMode) => {
    try {
      const isDisabled =
        mode === "next" ? isNextBtnDisabled : isBackBtnDisabled;

      if (!mapViewCtx || !racesArrCtx || isDisabled)
        throw new Error("Problem with initializing navigation");
      const { view } = mapViewCtx;
      setIsLoading(true);

      const clickedRaceIndex = racesArrCtx.findIndex(
        (race) => race.OBJECTID === clickedRaceOid
      );
      if (clickedRaceIndex === -1) {
        setIsLoading(false);
        throw new Error("Problem with finding selected race");
      }
      const followingRaceIndex =
        mode === "next" ? clickedRaceIndex + 1 : clickedRaceIndex - 1;

      const followingRace = racesArrCtx[followingRaceIndex];
      await viewGoToRace(view, followingRace.geometry);
      setClickedRaceObj(followingRace);
      updateCurrentlySelectedRaceCtx &&
        updateCurrentlySelectedRaceCtx({
          oid: followingRace.OBJECTID,
          geometry: followingRace.geometry,
        });
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

export default NavigationBtnsContainer;
