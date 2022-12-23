import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { initMapView } from "../utils/map-utils";

const MapViewContext =
  createContext<
    { view: __esri.MapView; layer: __esri.FeatureLayer } | undefined
  >(undefined);

type MapViewContextProviderProps = {
  children: ReactNode;
};

export const MapViewContextProvider = ({
  children,
}: MapViewContextProviderProps) => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [viewLayer, setViewLayer] =
    useState<{ view: __esri.MapView; layer: __esri.FeatureLayer }>();

  useEffect(() => {
    if (!mapDiv.current) throw new Error("Could not locate map div");
    const viewLayer = initMapView(mapDiv.current);
    setViewLayer(viewLayer);
  }, []);

  return (
    <MapViewContext.Provider value={viewLayer}>
      <div className="flex h-screen bg-black">
        <div className="h-screen w-screen p-0 m-0" ref={mapDiv}></div>
        {children}
      </div>
    </MapViewContext.Provider>
  );
};

export const useMapViewContext = () => useContext(MapViewContext);
