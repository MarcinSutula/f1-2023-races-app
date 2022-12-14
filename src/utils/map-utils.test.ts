import { initMapView, onRaceClickMapHandler } from "./map-utils";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import {
  lackingDataRaceObj,
  largeDataRaceObj,
  smallDataRaceObj,
} from "../testData";

const goToMock = jest.fn();

jest.mock("@arcgis/core/views/MapView", () =>
  jest.fn().mockImplementation(() => {
    return { goTo: goToMock };
  })
);
jest.mock("@arcgis/core/WebMap");
jest.mock("@arcgis/core/layers/FeatureLayer", () =>
  jest.fn().mockImplementation(() => {
    return {
      properties: jest.fn(),
    };
  })
);

describe("initMapView()", () => {
  test("initializes view and renders map with layer", () => {
    const container = document.createElement("div");
    initMapView(container);
    expect(FeatureLayer).toBeCalled();
    expect(WebMap).toBeCalled();
    expect(MapView).toBeCalled();
  });
});

describe("onRaceMapClickHandler()", () => {
  const container = document.createElement("div");
  const view = initMapView(container);
  const response: any = {
    results: [
      {
        graphic: {
          attributes: {
            OBJECTID: largeDataRaceObj.OBJECTID,
          },
        },
      },
    ],
  };

  const races = [largeDataRaceObj, lackingDataRaceObj, smallDataRaceObj];

  const oidRef: {
    current: number | undefined;
  } = {
    current: undefined,
  };
  const geometryRef: {
    current: __esri.Geometry | undefined;
  } = {
    current: undefined,
  };

  let setIsLoading: jest.Mock;
  let setClickedRaceObj: jest.Mock;

  beforeEach(() => {
    oidRef.current = undefined;
    geometryRef.current = undefined;
    setIsLoading = jest.fn();
    setClickedRaceObj = jest.fn();
    response.results[0].graphic.attributes.OBJECTID = largeDataRaceObj.OBJECTID;
  });

  test("switches between loading states having selected a different or new race", async () => {
    await onRaceClickMapHandler(
      view,
      response,
      oidRef,
      geometryRef,
      races,
      setIsLoading,
      setClickedRaceObj
    );
    expect(setIsLoading).toBeCalledWith(true);
    expect(setIsLoading).lastCalledWith(false);
  });

  test("switches between loading states and throws an error not having found a race in all races", async () => {
    response.results[0].graphic.attributes.OBJECTID = -1;

    await expect(async () => {
      await onRaceClickMapHandler(
        view,
        response,
        oidRef,
        geometryRef,
        races,
        setIsLoading,
        setClickedRaceObj
      );
    }).rejects.toThrow();
    expect(setIsLoading).toBeCalledWith(true);
    expect(setIsLoading).lastCalledWith(false);
  });

  test("does not switch between loading states having selected the same race", async () => {
    oidRef.current = largeDataRaceObj.OBJECTID;
    geometryRef.current = largeDataRaceObj.geometry;

    await onRaceClickMapHandler(
      view,
      response,
      oidRef,
      geometryRef,
      races,
      setIsLoading,
      setClickedRaceObj
    );
    expect(setIsLoading).not.toBeCalled();
  });

  test("goes to a race on map and selects it with callback, not having selected anything before", async () => {
    await onRaceClickMapHandler(
      view,
      response,
      oidRef,
      geometryRef,
      races,
      setIsLoading,
      setClickedRaceObj
    );

    expect(goToMock).toBeCalled();
    expect(setClickedRaceObj).lastCalledWith(largeDataRaceObj);
  });

  test("goes to a race on map and selects it with callback, having selected some other race before", async () => {
    oidRef.current = smallDataRaceObj.OBJECTID;
    geometryRef.current = smallDataRaceObj.geometry;
    await onRaceClickMapHandler(
      view,
      response,
      oidRef,
      geometryRef,
      races,
      setIsLoading,
      setClickedRaceObj
    );

    expect(goToMock).toBeCalled();
    expect(setClickedRaceObj).lastCalledWith(largeDataRaceObj);
  });

  test("goes to same race on map and does not select it with callback", async () => {
    oidRef.current = largeDataRaceObj.OBJECTID;
    geometryRef.current = largeDataRaceObj.geometry;
    await onRaceClickMapHandler(
      view,
      response,
      oidRef,
      geometryRef,
      races,
      setIsLoading,
      setClickedRaceObj
    );

    expect(goToMock).toBeCalled();
    expect(setClickedRaceObj).not.toBeCalled();
  });

  test("returns hit objectid and geometry if clicked new or different race", async () => {
    const clickedRace = await onRaceClickMapHandler(
      view,
      response,
      oidRef,
      geometryRef,
      races,
      setIsLoading,
      setClickedRaceObj
    );

    expect(clickedRace).toStrictEqual([
      largeDataRaceObj.OBJECTID,
      largeDataRaceObj.geometry,
    ]);
  });

  test("returns undefined if clicked same race", async () => {
    oidRef.current = largeDataRaceObj.OBJECTID;
    geometryRef.current = largeDataRaceObj.geometry;
    const clickedRace = await onRaceClickMapHandler(
      view,
      response,
      oidRef,
      geometryRef,
      races,
      setIsLoading,
      setClickedRaceObj
    );

    expect(clickedRace).toBeUndefined();
  });
});
