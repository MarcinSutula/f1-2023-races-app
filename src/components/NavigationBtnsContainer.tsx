import { useContext, Dispatch, SetStateAction } from "react";
import { UpdateSelectedRaceContext } from "../App";
import { useMapViewContext } from "../context/MapViewContext";
import { useRacesArrContext } from "../context/RacesArrContext";
import { RaceObj } from "../race-types";
import { viewGoToGeometry } from "../utils/map-utils";
import NavBtn from "./NavBtn";

type NavigationBtnsProps = {
  clickedRaceOid: RaceObj["OBJECTID"];
  setClickedRaceObj: Dispatch<SetStateAction<RaceObj | undefined>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isCircuitGraphicVisible: boolean;
  isMapInAnimation: boolean;
};

export type NavigationMode = "back" | "next";

function NavigationBtnsContainer({
  clickedRaceOid,
  setClickedRaceObj,
  setIsLoading,
  isLoading,
  isCircuitGraphicVisible,
  isMapInAnimation,
}: NavigationBtnsProps) {
  const mapViewCtx = useMapViewContext();
  const racesArrCtx = useRacesArrContext();
  const updateSelectedRaceCtx = useContext(UpdateSelectedRaceContext);

  const isBtnDisabled = (mode: NavigationMode): boolean => {
    const isBtnDisabled =
      mode === "back"
        ? racesArrCtx?.at(0)?.OBJECTID === clickedRaceOid
        : racesArrCtx?.at(-1)?.OBJECTID === clickedRaceOid;
    return (
      isLoading || isCircuitGraphicVisible || isMapInAnimation || isBtnDisabled
    );
  };

  const navigationHandler = async (mode: NavigationMode) => {
    try {
      const isDisabled = isBtnDisabled(mode);

      if (!mapViewCtx || !racesArrCtx || isDisabled)
        throw new Error("Problem with initializing navigation");
      const { view } = mapViewCtx;
      setIsLoading(true);

      const clickedRaceIndex = racesArrCtx.findIndex(
        (race) => race.OBJECTID === clickedRaceOid
      );
      if (clickedRaceIndex === -1)
        throw new Error("Problem with finding selected race");

      const followingRaceIndex =
        mode === "next" ? clickedRaceIndex + 1 : clickedRaceIndex - 1;

      const followingRace = racesArrCtx[followingRaceIndex];
      await viewGoToGeometry(view, followingRace.geometry);
      setClickedRaceObj(followingRace);
      updateSelectedRaceCtx &&
        updateSelectedRaceCtx({
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
        disabled={isBtnDisabled("back")}
        onClickHandler={navigationHandler}
        basicColor="red"
        size={40}
      />
      <NavBtn
        mode="next"
        disabled={isBtnDisabled("next")}
        onClickHandler={navigationHandler}
        basicColor="red"
        size={40}
      />
    </div>
  );
}

export default NavigationBtnsContainer;
