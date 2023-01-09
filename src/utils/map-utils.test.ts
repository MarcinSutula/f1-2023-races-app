import * as mapUtils from "./map-utils";
import * as graphicUtils from "./graphic-utils";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { testRace1, testRace2, testRace3 } from "../testRacesData";
import { RaceRefObj } from "../race-types";
import {
  GO_TO_ANIMATION_DURATION,
  GO_TO_ANIMATION_EASING,
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
            OBJECTID: testRace1.OBJECTID,
          },
        },
      },
    ],
  };

  const races = [testRace1, testRace2, testRace3];

  const raceRefObj: { current: RaceRefObj | undefined } = {
    current: undefined,
  };

  const setIsLoading = jest.fn();
  const setClickedRaceObj = jest.fn();
  const updateSelectedRace = jest.fn();
  const callback = jest.fn();
  const polylineSpy = jest.spyOn(graphicUtils, "createPolylineBetweenRaces");

  afterEach(() => {
    raceRefObj.current = undefined;
    hitTestResponse.results[0].graphic.attributes.OBJECTID = testRace1.OBJECTID;
    jest.clearAllMocks();
  });

  test("calls callback and switches loading state when next race is defined", async () => {
    await mapUtils.onViewInstanceCreated(
      view,
      races,
      races[0],
      setClickedRaceObj,
      setIsLoading,
      updateSelectedRace,
      callback
    );

    expect(callback).toBeCalledTimes(1);
    expect(setIsLoading).toBeCalledWith(false);
  });

  test("calls callback and switches loading state when next race is undefined", async () => {
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
    await mapUtils.onViewInstanceCreated(
      view,
      races,
      races[0],
      setClickedRaceObj,
      setIsLoading,
      updateSelectedRace,
      callback
    );

    expect(polylineSpy).not.toBeCalled();
  });

  test("if next race is defined and it's NOT first race of a season (response from server is sorted), creates polyline", async () => {
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
      callback
    );

    expect(polylineSpy).toBeCalledWith(races[nextRaceIndex - 1], races[1]);
  });

  test("if next race is defined, set it as clicked, update selected race and go to it on map", async () => {
    const viewGoToGeometrySpy = jest.spyOn(mapUtils, "viewGoToGeometry");
    await mapUtils.onViewInstanceCreated(
      view,
      races,
      races[0],
      setClickedRaceObj,
      setIsLoading,
      updateSelectedRace,
      callback
    );

    expect(setClickedRaceObj).toBeCalledWith(races[0]);
    expect(updateSelectedRace).toBeCalledWith({
      oid: races[0].OBJECTID,
      geometry: races[0].geometry,
    });
    expect(viewGoToGeometrySpy).toBeCalledWith(view, races[0].geometry);
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
            OBJECTID: testRace1.OBJECTID,
          },
        },
      },
    ],
  };

  const races = [testRace1, testRace2, testRace3];

  const raceRefObj: { current: RaceRefObj | undefined } = {
    current: undefined,
  };

  const setIsLoading = jest.fn();
  const setClickedRaceObj = jest.fn();
  const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});
  const viewGoToGeometrySpy = jest.spyOn(mapUtils, "viewGoToGeometry");

  afterEach(() => {
    raceRefObj.current = undefined;
    hitTestResponse.results[0].graphic.attributes.OBJECTID = testRace1.OBJECTID;
    jest.clearAllMocks();
  });

  test("returns undefined having selected not an object", async () => {
    hitTestResponse.results[0].graphic.attributes = {};

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
  });

  test("switches between loading states having selected a different or new race and returns defined", async () => {
    await expect(
      mapUtils.onRaceClickMapHandler(
        view,
        hitTestResponse,
        raceRefObj,
        races,
        setIsLoading,
        setClickedRaceObj
      )
    ).resolves.toBeDefined();
    expect(setIsLoading).toBeCalledWith(true);
    expect(setIsLoading).lastCalledWith(false);
  });

  test("switches between loading states and throws an error not having found a race in all races and returns undefined", async () => {
    hitTestResponse.results[0].graphic.attributes.OBJECTID = -1;

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
    expect(consoleErrorSpy).toBeCalledWith(
      "Problem with finding matching race"
    );
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

  test("goes to a race on map and selects it with callback, not having selected anything before and returns defined", async () => {
    await expect(
      mapUtils.onRaceClickMapHandler(
        view,
        hitTestResponse,
        raceRefObj,
        races,
        setIsLoading,
        setClickedRaceObj
      )
    ).resolves.toBeDefined();

    expect(viewGoToGeometrySpy).toBeCalledWith(view, races[0].geometry);
    expect(setClickedRaceObj).lastCalledWith(races[0]);
  });

  test("goes to a race on map and selects it with callback, having selected some other race before and returns defined", async () => {
    raceRefObj.current = {
      oid: races[1].OBJECTID,
      geometry: races[1].geometry,
    };

    await expect(
      mapUtils.onRaceClickMapHandler(
        view,
        hitTestResponse,
        raceRefObj,
        races,
        setIsLoading,
        setClickedRaceObj
      )
    ).resolves.toBeDefined();

    expect(viewGoToGeometrySpy).toBeCalledWith(view, races[0].geometry);
    expect(setClickedRaceObj).lastCalledWith(testRace1);
  });

  test("goes to same race on map and does not select it with callback and returns undefined", async () => {
    raceRefObj.current = {
      oid: races[0].OBJECTID,
      geometry: races[0].geometry,
    };
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

    expect(viewGoToGeometrySpy).toBeCalledWith(
      view,
      raceRefObj.current.geometry,
      false,
      false
    );
    expect(setClickedRaceObj).not.toBeCalled();
  });

  test("returns correct hit objectid and geometry if clicked new or different race", async () => {
    await expect(
      mapUtils.onRaceClickMapHandler(
        view,
        hitTestResponse,
        raceRefObj,
        races,
        setIsLoading,
        setClickedRaceObj
      )
    ).resolves.toStrictEqual({
      oid: races[0].OBJECTID,
      geometry: races[0].geometry,
    });
  });
});

describe("viewGoToGeometry()", () => {
  const container = document.createElement("div");
  const { view } = mapUtils.initMapView(container);
  const raceGeometry = testRace1.geometry;
  const viewGoToSpy = jest.spyOn(view, "goTo");
  const consoleErrorSpy = jest.spyOn(console, "error");

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows an error if view.goTo throws", async () => {
    viewGoToSpy.mockImplementation(() => {
      throw new Error();
    });

    await expect(
      mapUtils.viewGoToGeometry(view, raceGeometry)
    ).resolves.toBeUndefined();

    expect(viewGoToSpy).toBeCalledTimes(1);
    expect(consoleErrorSpy).toBeCalledTimes(1);
  });

  test("sets animation as undefined on view.goTo if animation === false", async () => {
    await mapUtils.viewGoToGeometry(view, raceGeometry, false, true);

    expect(viewGoToSpy).toBeCalledWith(expect.anything(), undefined);
  });

  test("does not set zoom on view.goTo if zoom === false", async () => {
    await mapUtils.viewGoToGeometry(view, raceGeometry, true, false);

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
      duration: GO_TO_ANIMATION_DURATION,
      easing: GO_TO_ANIMATION_EASING,
    };

    await mapUtils.viewGoToGeometry(view, raceGeometry);

    expect(viewGoToSpy).toBeCalledWith(goToTarget, goToOptions);
  });
});
