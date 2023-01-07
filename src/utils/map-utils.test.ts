import * as mapUtils from "./map-utils";
import * as utils from "./utils";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { testData1, testData2, testData3 } from "../testData";
import { RaceRefObj } from "../race-types";
import {
  GO_TO_RACE_ANIMATION_DURATION,
  GO_TO_RACE_ANIMATION_EASING,
  GO_TO_RACE_ZOOM,
} from "../config";

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
  const container = document.createElement("div");
  const viewLayer = mapUtils.initMapView(container);

  test("initializes view and renders map with layer", () => {
    expect(FeatureLayer).toBeCalled();
    expect(WebMap).toBeCalled();
    expect(MapView).toBeCalled();
    expect(viewLayer).toBeDefined();
  });
});

describe("onViewInstanceCreated()", () => {
  const container = document.createElement("div");
  const { view } = mapUtils.initMapView(container);
  (view as any).graphics = {
    add: () => {},
  };
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

  const races = [testData1, testData2, testData3];

  const raceRefObj: { current: RaceRefObj | undefined } = {
    current: undefined,
  };

  const setIsLoading = jest.fn();
  const setClickedRaceObj = jest.fn();
  const updateSelectedRace = jest.fn();

  afterEach(() => {
    raceRefObj.current = undefined;
    hitTestResponse.results[0].graphic.attributes.OBJECTID = testData1.OBJECTID;
    jest.clearAllMocks();
  });

  test("calls callback and switches loading state when next race is defined", async () => {
    const callback = jest.fn();

    await mapUtils.onViewInstanceCreated(
      view,
      races,
      races[0],
      setClickedRaceObj,
      setIsLoading,
      updateSelectedRace,
      callback
    );

    expect(callback).toBeCalled();
    expect(setIsLoading).toBeCalledWith(false);
  });

  test("calls callback and switches loading state when next race is undefined", async () => {
    const callback = jest.fn();

    await mapUtils.onViewInstanceCreated(
      view,
      races,
      undefined,
      setClickedRaceObj,
      setIsLoading,
      updateSelectedRace,
      callback
    );

    expect(callback).toBeCalled();
    expect(setIsLoading).toBeCalledWith(false);
  });

  test("if next race is defined and it's first race of a season (response from server is sorted), does not create polyline", async () => {
    const createPolylineSpy = jest.spyOn(
      mapUtils,
      "createPolylineBetweenRaces"
    );
    await mapUtils.onViewInstanceCreated(
      view,
      races,
      races[0],
      setClickedRaceObj,
      setIsLoading,
      updateSelectedRace,
      () => {}
    );

    expect(createPolylineSpy).not.toBeCalled();
  });

  test("if next race is defined and it's NOT first race of a season (response from server is sorted), creates polyline", async () => {
    const createPolylineSpy = jest.spyOn(
      mapUtils,
      "createPolylineBetweenRaces"
    );
    const nextRaceIndex = races.findIndex(
      (race) => race.OBJECTID === races[1].OBJECTID
    );
    await mapUtils.onViewInstanceCreated(
      view,
      races,
      races[1],
      setClickedRaceObj,
      setIsLoading,
      updateSelectedRace,
      () => {}
    );

    expect(createPolylineSpy).toBeCalledWith(
      races[nextRaceIndex - 1],
      races[1]
    );
  });

  test("if next race is defined, set it as clicked, update selected race and go to it on map", async () => {
    const viewGoToRaceSpy = jest.spyOn(mapUtils, "viewGoToRace");
    await mapUtils.onViewInstanceCreated(
      view,
      races,
      races[0],
      setClickedRaceObj,
      setIsLoading,
      updateSelectedRace,
      () => {}
    );

    expect(setClickedRaceObj).toBeCalledWith(races[0]);
    expect(updateSelectedRace).toBeCalledWith({
      oid: races[0].OBJECTID,
      geometry: races[0].geometry,
    });
    expect(viewGoToRaceSpy).toBeCalledWith(view, races[0].geometry);
  });
});

describe("onRaceMapClickHandler()", () => {
  const container = document.createElement("div");
  const { view } = mapUtils.initMapView(container);
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

  const setIsLoading = jest.fn();
  const setClickedRaceObj = jest.fn();

  afterEach(() => {
    raceRefObj.current = undefined;
    hitTestResponse.results[0].graphic.attributes.OBJECTID = testData1.OBJECTID;
    jest.clearAllMocks();
  });

  test("returns undefined having selected not an object", async () => {
    hitTestResponse.results[0].graphic.attributes = {};

    const clickedRace = await mapUtils.onRaceClickMapHandler(
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
    await mapUtils.onRaceClickMapHandler(
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
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    await expect(
      mapUtils.onRaceClickMapHandler(
        view,
        hitTestResponse,
        raceRefObj,
        races,
        setIsLoading,
        setClickedRaceObj
      )
    ).resolves.toBeUndefined();

    expect(consoleErrorSpy).toBeCalledTimes(1);
    expect(setIsLoading).toBeCalledWith(true);
    expect(setIsLoading).lastCalledWith(false);
  });

  test("does not switch between loading states having selected the same race", async () => {
    raceRefObj.current = {
      oid: races[0].OBJECTID,
      geometry: races[0].geometry,
    };

    await mapUtils.onRaceClickMapHandler(
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
    const viewGoToRaceSpy = jest.spyOn(mapUtils, "viewGoToRace");

    await mapUtils.onRaceClickMapHandler(
      view,
      hitTestResponse,
      raceRefObj,
      races,
      setIsLoading,
      setClickedRaceObj
    );

    expect(viewGoToRaceSpy).toBeCalledWith(view, races[0].geometry);
    expect(setClickedRaceObj).lastCalledWith(races[0]);
  });

  test("goes to a race on map and selects it with callback, having selected some other race before", async () => {
    raceRefObj.current = {
      oid: races[1].OBJECTID,
      geometry: races[1].geometry,
    };
    const viewGoToRaceSpy = jest.spyOn(mapUtils, "viewGoToRace");

    await mapUtils.onRaceClickMapHandler(
      view,
      hitTestResponse,
      raceRefObj,
      races,
      setIsLoading,
      setClickedRaceObj
    );

    expect(viewGoToRaceSpy).toBeCalledWith(view, races[0].geometry);
    expect(setClickedRaceObj).lastCalledWith(testData1);
  });

  test("goes to same race on map and does not select it with callback", async () => {
    raceRefObj.current = {
      oid: races[0].OBJECTID,
      geometry: races[0].geometry,
    };
    const viewGoToRaceSpy = jest.spyOn(mapUtils, "viewGoToRace");
    await mapUtils.onRaceClickMapHandler(
      view,
      hitTestResponse,
      raceRefObj,
      races,
      setIsLoading,
      setClickedRaceObj
    );

    expect(viewGoToRaceSpy).toBeCalledWith(
      view,
      raceRefObj.current.geometry,
      false,
      false
    );
    expect(setClickedRaceObj).not.toBeCalled();
  });

  test("returns hit objectid and geometry if clicked new or different race", async () => {
    const clickedRace = await mapUtils.onRaceClickMapHandler(
      view,
      hitTestResponse,
      raceRefObj,
      races,
      setIsLoading,
      setClickedRaceObj
    );

    expect(clickedRace).toStrictEqual({
      oid: races[0].OBJECTID,
      geometry: races[0].geometry,
    });
  });

  test("returns undefined if clicked same race", async () => {
    raceRefObj.current = {
      oid: races[0].OBJECTID,
      geometry: races[0].geometry,
    };
    const clickedRace = await mapUtils.onRaceClickMapHandler(
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

    mapUtils.changeRacesSymbology(layer, testData1);
    expect(layer.renderer.visualVariables).toBeDefined();
    expect(layer.renderer.visualVariables.length).toBe(2);
  });
});

describe("createPolylineBetweenRaces()", () => {
  const getGeometrySpy = jest.spyOn(utils, "getGeometry");

  test("creates a polyline between given two race objects", () => {
    const polyline = mapUtils.createPolylineBetweenRaces(testData1, testData2);
    expect(getGeometrySpy).toBeCalledTimes(2);
    expect(getGeometrySpy).toBeCalledWith(expect.anything(), "lng,lat");
    expect(polyline.geometry).toBeDefined();
    expect(polyline.symbol).toBeDefined();
    expect(polyline.geometry.type).toBe("polyline");
  });
});

describe("viewGoToRace()", () => {
  const container = document.createElement("div");
  const { view } = mapUtils.initMapView(container);
  const raceGeometry = testData1.geometry;
  const viewGoToSpy = jest.spyOn(view, "goTo");
  const consoleErrorSpy = jest.spyOn(console, "error");

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows an error if view.goTo receives wrong target", async () => {
    viewGoToSpy.mockImplementation(() => {
      throw new Error();
    });

    await mapUtils.viewGoToRace(view, raceGeometry);

    expect(viewGoToSpy).toBeCalled();
    expect(consoleErrorSpy).toBeCalled();
  });

  test("sets animation as undefined on view.goTo if animation === false", async () => {
    await mapUtils.viewGoToRace(view, raceGeometry, false, true);

    expect(viewGoToSpy).toBeCalledWith(expect.anything(), undefined);
  });

  test("does not set zoom on view.goTo if zoom === false", async () => {
    await mapUtils.viewGoToRace(view, raceGeometry, true, false);

    expect(viewGoToSpy).not.toBeCalledWith(
      { geometry: raceGeometry, zoom: expect.anything() },
      expect.anything()
    );
  });

  test("sets both animation and zoom if optional arguments are not given", async () => {
    const goToTarget = {
      geometry: raceGeometry,
      zoom: GO_TO_RACE_ZOOM,
    };
    const goToOptions = {
      duration: GO_TO_RACE_ANIMATION_DURATION,
      easing: GO_TO_RACE_ANIMATION_EASING,
    };

    await mapUtils.viewGoToRace(view, raceGeometry);

    expect(viewGoToSpy).toBeCalledWith(goToTarget, goToOptions);
  });
});
