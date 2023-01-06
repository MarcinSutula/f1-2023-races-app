import {
  initMapView,
  onRaceClickMapHandler,
  changeRacesSymbology,
  createPolylineBetweenRaces,
} from "./map-utils";
import * as utils from "./utils";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { testData3, testData1, testData2 } from "../testData";
import { RaceRefObj } from "../race-types";

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
    const viewLayer = initMapView(container);
    expect(FeatureLayer).toBeCalled();
    expect(WebMap).toBeCalled();
    expect(MapView).toBeCalled();
    expect(viewLayer).toBeDefined();
  });
});

describe("onRaceMapClickHandler()", () => {
  const container = document.createElement("div");
  const { view } = initMapView(container);
  const hitTestResponse: any = {
    results: [
      {
        graphic: {
          attributes: {
            OBJECTID: testData1.OBJECTID,
          },
        },
      },
    ],
  };

  const races = [testData1, testData3, testData2];

  const raceRefObj: { current: RaceRefObj | undefined } = {
    current: undefined,
  };

  let setIsLoading: jest.Mock;
  let setClickedRaceObj: jest.Mock;

  beforeEach(() => {
    raceRefObj.current = undefined;
    setIsLoading = jest.fn();
    setClickedRaceObj = jest.fn();
    hitTestResponse.results[0].graphic.attributes.OBJECTID = testData1.OBJECTID;
  });

  test("returns undefined having selected not an object", async () => {
    hitTestResponse.results[0].graphic.attributes = {};

    const clickedRace = await onRaceClickMapHandler(
      view,
      hitTestResponse,
      raceRefObj,
      races,
      setIsLoading,
      setClickedRaceObj
    );

    expect(clickedRace).toBeUndefined();
  });

  test("switches between loading states having selected a different or new race", async () => {
    await onRaceClickMapHandler(
      view,
      hitTestResponse,
      raceRefObj,
      races,
      setIsLoading,
      setClickedRaceObj
    );
    expect(setIsLoading).toBeCalledWith(true);
    expect(setIsLoading).lastCalledWith(false);
  });

  test("switches between loading states and throws an error not having found a race in all races", async () => {
    hitTestResponse.results[0].graphic.attributes.OBJECTID = -1;

    await expect(async () => {
      await onRaceClickMapHandler(
        view,
        hitTestResponse,
        raceRefObj,
        races,
        setIsLoading,
        setClickedRaceObj
      );
    }).rejects.toThrow();
    expect(setIsLoading).toBeCalledWith(true);
    expect(setIsLoading).lastCalledWith(false);
  });

  test("does not switch between loading states having selected the same race", async () => {
    raceRefObj.current = {
      oid: testData1.OBJECTID,
      geometry: testData1.geometry,
    };

    await onRaceClickMapHandler(
      view,
      hitTestResponse,
      raceRefObj,
      races,
      setIsLoading,
      setClickedRaceObj
    );
    expect(setIsLoading).not.toBeCalled();
  });

  test("goes to a race on map and selects it with callback, not having selected anything before", async () => {
    await onRaceClickMapHandler(
      view,
      hitTestResponse,
      raceRefObj,
      races,
      setIsLoading,
      setClickedRaceObj
    );

    expect(goToMock).toBeCalled();
    expect(setClickedRaceObj).lastCalledWith(testData1);
  });

  test("goes to a race on map and selects it with callback, having selected some other race before", async () => {
    raceRefObj.current = {
      oid: testData2.OBJECTID,
      geometry: testData2.geometry,
    };
    await onRaceClickMapHandler(
      view,
      hitTestResponse,
      raceRefObj,
      races,
      setIsLoading,
      setClickedRaceObj
    );

    expect(goToMock).toBeCalled();
    expect(setClickedRaceObj).lastCalledWith(testData1);
  });

  test("goes to same race on map and does not select it with callback", async () => {
    raceRefObj.current = {
      oid: testData1.OBJECTID,
      geometry: testData1.geometry,
    };
    await onRaceClickMapHandler(
      view,
      hitTestResponse,
      raceRefObj,
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
      hitTestResponse,
      raceRefObj,
      races,
      setIsLoading,
      setClickedRaceObj
    );

    expect(clickedRace).toStrictEqual({
      oid: testData1.OBJECTID,
      geometry: testData1.geometry,
    });
  });

  test("returns undefined if clicked same race", async () => {
    raceRefObj.current = {
      oid: testData1.OBJECTID,
      geometry: testData1.geometry,
    };
    const clickedRace = await onRaceClickMapHandler(
      view,
      hitTestResponse,
      raceRefObj,
      races,
      setIsLoading,
      setClickedRaceObj
    );

    expect(clickedRace).toBeUndefined();
  });
});

describe("changeRacesSymbology()", () => {
  test("sets Visual Variables on layers renderer", () => {
    const layer = {
      renderer: {},
    } as any;

    changeRacesSymbology(layer, testData1);
    expect(layer.renderer.visualVariables).toBeDefined();
    expect(layer.renderer.visualVariables.length).toBe(2);
  });
});

describe("createPolylineBetweenRaces", () => {
  const getGeometrySpy = jest.spyOn(utils, "getGeometry");

  test("creates a polyline between given two race objects", () => {
    const polyline = createPolylineBetweenRaces(testData1, testData2);
    expect(getGeometrySpy).toBeCalledTimes(2);
    expect(getGeometrySpy).toBeCalledWith(expect.anything(), "lng,lat");
    expect(polyline.geometry).toBeDefined();
    expect(polyline.symbol).toBeDefined();
    expect(polyline.geometry.type).toBe("polyline");
  });
});
