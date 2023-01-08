import { testData1, testData2 } from "../testData";
import * as utils from "./utils";
import {
  changeRacesSymbology,
  createPolylineBetweenRaces,
} from "./graphic-utils";

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

describe("createPolylineBetweenRaces()", () => {
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
