import { RaceObj } from "../race-types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMapViewContext } from "./MapViewContext";
import { fetchAllRaces } from "../utils/server-utils";

const RacesArrContext = createContext<RaceObj[] | undefined>(undefined);

type RacesArrContextProviderProps = {
  children: ReactNode;
};

export const RacesArrContextProvider = ({
  children,
}: RacesArrContextProviderProps) => {
  const [racesArr, setRacesArr] = useState<RaceObj[]>();
  const mapViewCtx = useMapViewContext();

  useEffect(() => {
    (async () => {
      if (!mapViewCtx) return;
      const { layer } = mapViewCtx;
      const allRaces = await fetchAllRaces(layer);
      if (!allRaces) throw new Error("Problem with fetching races");
      setRacesArr(allRaces);
    })();
  }, [mapViewCtx]);

  return (
    <RacesArrContext.Provider value={racesArr}>
      {children}
    </RacesArrContext.Provider>
  );
};

export const useRacesArrContext = () => useContext(RacesArrContext);
