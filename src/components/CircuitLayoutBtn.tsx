import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useMapViewContext } from "../context/MapViewContext";
import { RaceObj } from "../race-types";
import Graphic from "@arcgis/core/Graphic";
import {
  GO_TO_RACE_ANIMATION_DURATION,
  GO_TO_RACE_ANIMATION_EASING,
} from "../config";
import { viewGoToRace } from "../utils/map-utils";

type CircuitLayoutBtnProps = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  clickedRaceObj: RaceObj;
  isCircuitGraphicVisibleHandler: (bool: boolean) => void;
  isMapInAnimation: boolean;
};

function CircuitLayoutBtn({
  setIsLoading,
  isLoading,
  clickedRaceObj,
  isCircuitGraphicVisibleHandler,
  isMapInAnimation,
}: CircuitLayoutBtnProps) {
  const [circuitGraphic, setCircuitGraphic] = useState<any>();
  const mapView = useMapViewContext();

  const isBtnDisabled = isLoading || isMapInAnimation;

  const onCircuitLayoutBtnClickHandler = async () => {
    if (!mapView) return;
    setIsLoading(true);

    if (!circuitGraphic) {
      const circuitObj = await mapView.layer.queryRelatedFeatures({
        where: `rel_id_child=${clickedRaceObj.rel_id}`,
        relationshipId: mapView.layer.relationships[0].id,
        outFields: ["*"],
        returnGeometry: true,
      });

      const circuitGeometry =
        circuitObj[clickedRaceObj.rel_id].features[0].geometry;
      const lineSymbol = {
        type: "simple-line",
        color: "red",
        width: 5,
      };
      console.log(circuitObj);

      const newCircuitGraphic = new Graphic({
        geometry: circuitGeometry,
        symbol: lineSymbol,
      });

      const goToOptions = {
        duration: GO_TO_RACE_ANIMATION_DURATION,
        easing: GO_TO_RACE_ANIMATION_EASING,
      };
      mapView.view.ui.components = ["attribution"];
      await mapView.view.goTo(
        { geometry: circuitGeometry, zoom: 14.8 },
        goToOptions
      );
      mapView.layer.visible = false;
      mapView.view.graphics.add(newCircuitGraphic);

      console.log(mapView.view);
      setCircuitGraphic(newCircuitGraphic);
      isCircuitGraphicVisibleHandler(true);
    } else {
      mapView.view.graphics.remove(circuitGraphic);
      await viewGoToRace(mapView.view, clickedRaceObj.geometry);
      mapView.layer.visible = true;
      mapView.view.ui.components = ["attribution", "zoom"];
      setCircuitGraphic(undefined);
      isCircuitGraphicVisibleHandler(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!mapView) return;
    console.log("useffect circuit layout");
    const viewNavLockHandler = mapView.view.on(
      ["click", "drag", "double-click", "mouse-wheel", "hold"] as any,
      function (event: any) {
        circuitGraphic && event.stopPropagation();
      }
    );
    return () => viewNavLockHandler.remove();
  });

  return (
    <div className="text-center">
      <button
        disabled={isBtnDisabled}
        onClick={onCircuitLayoutBtnClickHandler}
        className="bg-btnFadedRed h-14 text-center text-3xl w-5/6 text-textFadedWhite font-bold mt-8"
        style={{
          backgroundColor: isBtnDisabled ? "" : "red",
          color: isBtnDisabled ? "" : "white",
        }}
      >
        {circuitGraphic ? "Back" : "Circuit layout"}
      </button>
    </div>
  );
}

export default CircuitLayoutBtn;
