import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useMapViewContext } from "../context/MapViewContext";
import { RaceObj, CircuitObj } from "../race-types";
import { viewGoToGeometry } from "../utils/map-utils";
import { createCircuitPolyline } from "../utils/graphic-utils";
import { toggleUIZoom, toggleLayerVisible, eventLocker } from "../utils/utils";
import { fetchRelatedCircuit } from "../utils/server-utils";
import { GO_TO_CIRCUIT_ZOOM } from "../config";

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
  const [circuitGraphic, setCircuitGraphic] = useState<__esri.Graphic>();
  const mapView = useMapViewContext();

  const isBtnDisabled = isLoading || isMapInAnimation;

  const onCircuitLayoutBtnClickHandler = async () => {
    try {
      if (!mapView || !mapView.view || !mapView.layer) return;
      const { view, layer } = mapView;
      setIsLoading(true);
      if (!circuitGraphic) {
        const circuitObj: CircuitObj | undefined = await fetchRelatedCircuit(
          layer,
          clickedRaceObj.rel_id
        );

        if (!circuitObj) throw new Error("Could not find related circuit");
        const circuitPolyline = createCircuitPolyline(circuitObj.geometry);

        toggleUIZoom(view);
        await viewGoToGeometry(
          view,
          circuitObj.geometry,
          true,
          GO_TO_CIRCUIT_ZOOM
        );
        toggleLayerVisible(layer);
        view.graphics.add(circuitPolyline);

        setCircuitGraphic(circuitPolyline);
        isCircuitGraphicVisibleHandler(true);
      } else {
        view.graphics.remove(circuitGraphic);
        await viewGoToGeometry(mapView.view, clickedRaceObj.geometry);
        toggleLayerVisible(layer);
        toggleUIZoom(view);

        setCircuitGraphic(undefined);
        isCircuitGraphicVisibleHandler(false);
      }
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

  useEffect(() => {
    if (!mapView || !mapView.view) return;
    const vieweventLocker = mapView.view.on(
      [
        "click",
        "drag",
        "double-click",
        "mouse-wheel",
        "hold",
        "key-down",
      ] as any,
      eventLocker.bind("", !!circuitGraphic)
    );
    return () => vieweventLocker.remove();
  });

  return (
    <div className="text-center">
      <button
        disabled={isBtnDisabled}
        onClick={onCircuitLayoutBtnClickHandler}
        className="bg-btnFadedRed h-14 text-center text-3xl w-5/6 text-textFadedWhite font-bold mt-4"
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
