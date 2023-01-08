import { RaceObj } from "../race-types";
import DetailInfo from "./DetailInfo";
import NavigationBtnsContainer from "./NavigationBtnsContainer";
import PanelTitle from "./PanelTitle";
import PanelImage from "../PanelImage";
import EventDate from "./EventDate";
import RaceLocation from "./RaceLocation";
import CircuitLayoutBtn from "./CircuitLayoutBtn";
import RaceCounter from "./RaceCounter";
import { lapRecordInfoFormatter } from "../utils/utils";
import PanelCard from "./PanelCard";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMapViewContext } from "../context/MapViewContext";

type DetailsPanelProps = {
  clickedRaceObj: RaceObj;
  setClickedRaceObj: Dispatch<SetStateAction<RaceObj | undefined>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

function DetailsPanel({
  clickedRaceObj,
  setClickedRaceObj,
  isLoading,
  setIsLoading,
}: DetailsPanelProps) {
  const [isCircuitGraphicVisible, setIsCircuitGraphicVisible] =
    useState<boolean>(false);
  const [isMapInAnimation, setIsMapInAnimation] = useState<boolean>(false);
  const mapViewCtx = useMapViewContext();
  const isCircuitGraphicVisibleHandler = (bool: boolean): void =>
    setIsCircuitGraphicVisible(bool);

  useEffect(() => {
    if (!mapViewCtx) return;
    const watchAnimationHandler = mapViewCtx.view.watch("animation", (res) =>
      res ? setIsMapInAnimation(true) : setIsMapInAnimation(false)
    );
    return () => watchAnimationHandler.remove();
  }, [mapViewCtx]);

  return (
    <PanelCard>
      <div className="flex justify-between align-middle mb-2">
        <RaceCounter selectedRaceOid={clickedRaceObj.OBJECTID} />
        <NavigationBtnsContainer
          clickedRaceOid={clickedRaceObj.OBJECTID}
          setClickedRaceObj={setClickedRaceObj}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          isCircuitGraphicVisible={isCircuitGraphicVisible}
          isMapInAnimation={isMapInAnimation}
        />
      </div>
      <PanelTitle title={clickedRaceObj.name} />
      <div className="w-5/6 h-36 m-auto mt-7">
        <PanelImage attribute={clickedRaceObj.city} type="circuit" />
      </div>
      <div className="flex h-8 mt-12 justify-between mx-7">
        <EventDate
          startTimestamp={clickedRaceObj.start_date}
          endTimestamp={clickedRaceObj.race_date}
        />
        <PanelImage attribute={clickedRaceObj.country} type="flag" />
      </div>
      <div className="bg-primaryBgLight mx-6 my-4 py-2 rounded-lg">
        <RaceLocation
          city={clickedRaceObj.city}
          country={clickedRaceObj.country}
        />
        <DetailInfo
          label="Race Distance"
          info={clickedRaceObj.race_dist.toString()}
          measure="km"
          separatorIndex={3}
        />
        <DetailInfo
          label="Circuit Length"
          info={clickedRaceObj.circuit_length.toString()}
          measure="km"
          separatorIndex={1}
        />
        <DetailInfo
          label="Number of Laps"
          info={clickedRaceObj.laps_num.toString()}
        />
        <DetailInfo
          label="Number of DRS Zones"
          info={clickedRaceObj.drs_zones_num.toString()}
        />
      </div>
      {clickedRaceObj.lap_record_owner &&
        clickedRaceObj.lap_record_year &&
        clickedRaceObj.lap_record_seconds && (
          <DetailInfo
            label="Lap Record"
            main
            info={lapRecordInfoFormatter(
              clickedRaceObj.lap_record_owner,
              clickedRaceObj.lap_record_year,
              clickedRaceObj.lap_record_seconds
            )}
          />
        )}
      <CircuitLayoutBtn
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        clickedRaceObj={clickedRaceObj}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleHandler}
        isMapInAnimation={isMapInAnimation}
      />
    </PanelCard>
  );
}

export default DetailsPanel;
