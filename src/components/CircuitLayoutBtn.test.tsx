import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CircuitLayoutBtn from "./CircuitLayoutBtn";
import { testRace1 } from "../testRacesData";
import React from "react";
import * as mapViewCtxFile from "../context/MapViewContext";
import * as serverUtils from "../utils/server-utils";
import * as mapUtils from "../utils/map-utils";
import * as graphicUtils from "../utils/graphic-utils";
import * as utils from "../utils/utils";
import { testCircuit1 } from "../testCircuitData";
import { GO_TO_CIRCUIT_ZOOM } from "../config";

describe("CircuitLayoutBtn", () => {
  const viewGraphicAddMock = jest.fn();
  const viewGraphicRemoveMock = jest.fn();
  const isCircuitGraphicVisibleMock = jest.fn();
  const viewOnRemoveMock = jest.fn();
  const viewOnMock = jest.fn().mockImplementation((_: any, callback: any) => {
    callback();
    return { remove: viewOnRemoveMock };
  });
  const eventLockerSpy = jest
    .spyOn(utils, "eventLocker")
    .mockImplementation(() => {});

  const useMapViewContextMock: any = (_: any) => ({
    view: {
      graphics: {
        remove: viewGraphicRemoveMock,
        add: viewGraphicAddMock,
      },
      ui: {
        components: ["attributes", "zoom"],
      },
      on: viewOnMock,
    },
    layer: {
      visible: true,
    },
  });

  const fakePolyline = "fakePolyline";

  jest
    .spyOn(mapViewCtxFile, "useMapViewContext")
    .mockImplementation(useMapViewContextMock);
  const fetchRelatedCircuitReturnMock: any = () =>
    Promise.resolve(testCircuit1);
  const fetchRelatedCircuitSpy = jest
    .spyOn(serverUtils, "fetchRelatedCircuit")
    .mockImplementation(fetchRelatedCircuitReturnMock);
  const viewGoToGeometrySpy = jest
    .spyOn(mapUtils, "viewGoToGeometry")
    .mockImplementation(jest.fn());
  const createCircuitPolylineSpy = jest
    .spyOn(graphicUtils, "createCircuitPolyline")
    .mockImplementation((): any => fakePolyline);
  const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(jest.fn());
  const toggleUIZoomSpy = jest
    .spyOn(utils, "toggleUIZoom")
    .mockImplementation(jest.fn());
  const toggleLayerVisibleSpy = jest.spyOn(utils, "toggleLayerVisible");
  const setIsLoadingMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("shows Circuit layout button when no circuit graphic is added", () => {
    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );

    const btnText = screen.getByRole("button").innerHTML;

    expect(btnText).toBe("Circuit layout");
  });

  test("shows Back button when a circuit graphic exists", () => {
    const useStateMock: any = (_: any) => [true, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );

    const btnText = screen.getByRole("button").innerHTML;

    expect(btnText).toBe("Back");
  });

  test("renders button disabled if isLoading is true", () => {
    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={true}
      />
    );

    const btn = screen.getByRole("button");

    expect(btn).toBeDisabled();
  });

  test("renders button disabled if isMapInAnimation is true", () => {
    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={true}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );

    const btn = screen.getByRole("button");

    expect(btn).toBeDisabled();
  });

  test("calls setIsLoading two times with true and false with not existing circuitGraphic", async () => {
    const useStateMock: any = (_: any) => [false, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );

    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(setIsLoadingMock).toBeCalledTimes(2));
    expect(setIsLoadingMock).toBeCalledWith(true);
    expect(setIsLoadingMock).lastCalledWith(false);
    //
    expect(fetchRelatedCircuitSpy).toBeCalledTimes(1);
    expect(createCircuitPolylineSpy).toBeCalledTimes(1);
    expect(viewGoToGeometrySpy).toBeCalledTimes(1);
    expect(setIsLoadingMock).toBeCalledTimes(2);
  });

  test("calls setIsLoading two times with true and false with existing circuitGraphic", async () => {
    const useStateMock: any = (_: any) => [true, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );

    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(setIsLoadingMock).toBeCalledTimes(2));
    expect(setIsLoadingMock).toBeCalledWith(true);
    expect(setIsLoadingMock).lastCalledWith(false);
  });

  test("calls setIsLoading two times with true and false if error is thrown", async () => {
    const useStateMock: any = (_: any) => [true, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);
    fetchRelatedCircuitSpy.mockImplementationOnce(() => {
      throw new Error();
    });

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );

    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(fetchRelatedCircuitSpy).toThrow());
    expect(setIsLoadingMock).toBeCalledTimes(2);
    expect(setIsLoadingMock).toBeCalledWith(true);
    expect(setIsLoadingMock).lastCalledWith(false);
  });

  test("without circuitGraphic: catches error Could not find related circuit if no circuitObj was found from fetchRelatedCircuit", async () => {
    const useStateMock: any = (_: any) => [false, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);
    fetchRelatedCircuitSpy.mockImplementationOnce(() =>
      Promise.resolve(undefined)
    );

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );

    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(fetchRelatedCircuitSpy).toBeCalledTimes(1));
    expect(consoleErrorSpy).toBeCalledWith("Could not find related circuit");
    expect(consoleErrorSpy).toBeCalledTimes(1);
  });

  test("without circuitGraphic: fetches related circuit correctly and does not throw an error", async () => {
    const useStateMock: any = (_: any) => [false, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );

    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(fetchRelatedCircuitSpy).toBeCalledTimes(1));
    expect(consoleErrorSpy).not.toBeCalled();
  });

  test("without circuitGraphic: calls toggleUIZoom", async () => {
    const useStateMock: any = (_: any) => [false, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );

    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(toggleUIZoomSpy).toBeCalledTimes(1));
  });

  test("without circuitGraphic: calls viewGoToGeometry with circuits geometry", async () => {
    const useStateMock: any = (_: any) => [false, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );

    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(viewGoToGeometrySpy).toBeCalledTimes(1));
    expect(viewGoToGeometrySpy).toBeCalledWith(
      expect.anything(),
      testCircuit1.geometry,
      true,
      GO_TO_CIRCUIT_ZOOM
    );
  });

  test("without circuitGraphic: adds polyline to map, set it in useState, calls isCircuitGraphicVisibleHandler with true", async () => {
    const setStateMock = jest.fn();
    const useStateMock: any = (_: any) => [false, setStateMock];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(viewGraphicAddMock).toBeCalledTimes(1));
    expect(viewGraphicAddMock).toBeCalledWith(fakePolyline);
    expect(setStateMock).toBeCalledTimes(1);
    expect(setStateMock).toBeCalledWith(fakePolyline);
    expect(isCircuitGraphicVisibleMock).toBeCalledTimes(1);
    expect(isCircuitGraphicVisibleMock).toBeCalledWith(true);
  });

  test("without circuitGraphic: calls toggleLayerVisible", async () => {
    const useStateMock: any = (_: any) => [false, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(toggleLayerVisibleSpy).toBeCalledTimes(1));
  });

  test("without circuitGraphic: does not call view.graphic.remove", async () => {
    const useStateMock: any = (_: any) => [false, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(viewGraphicRemoveMock).not.toBeCalled());
  });

  test("with circuitGraphic: remove polyline from map, set useState undefined, calls isCircuitGraphicVisibleHandler with false", async () => {
    const setStateMock = jest.fn();
    const stateMock = true;
    const useStateMock: any = (_: any) => [stateMock, setStateMock];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(viewGraphicRemoveMock).toBeCalledTimes(1));
    expect(viewGraphicRemoveMock).toBeCalledWith(stateMock);
    expect(setStateMock).toBeCalledTimes(1);
    expect(setStateMock).toBeCalledWith(undefined);
    expect(isCircuitGraphicVisibleMock).toBeCalledTimes(1);
    expect(isCircuitGraphicVisibleMock).toBeCalledWith(false);
  });

  test("with circuitGraphic: calls toggleUIZoom", async () => {
    const useStateMock: any = (_: any) => [true, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );

    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(toggleUIZoomSpy).toBeCalledTimes(1));
  });

  test("with circuitGraphic: calls toggleLayerVisible", async () => {
    const useStateMock: any = (_: any) => [true, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(toggleLayerVisibleSpy).toBeCalledTimes(1));
  });

  test("with circuitGraphic: calls viewGoToGeometry with races geometry", async () => {
    const useStateMock: any = (_: any) => [true, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );

    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(viewGoToGeometrySpy).toBeCalledTimes(1));
    expect(viewGoToGeometrySpy).toBeCalledWith(
      expect.anything(),
      testRace1.geometry
    );
  });

  test("with circuitGraphic: does not fetch related circuits, does not create polyline, does call view.graphics.add", async () => {
    const useStateMock: any = (_: any) => [true, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(viewGraphicAddMock).not.toBeCalled());
    expect(createCircuitPolylineSpy).not.toBeCalled();
    expect(fetchRelatedCircuitSpy).not.toBeCalled();
  });

  test("useEffect - calls view.on.remove (as cleanup) on unmount", async () => {
    const useStateMock: any = (_: any) => [true, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    const { unmount } = render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );

    unmount();

    await waitFor(() => expect(viewOnRemoveMock).toBeCalledTimes(1));
  });

  test("useEffect - calls view.on on mount with array of forbidden events and viewOnCallback", async () => {
    const eventsArr = ["click", "drag", "double-click", "mouse-wheel", "hold"];
    const useStateMock: any = (_: any) => [true, jest.fn()];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(
      <CircuitLayoutBtn
        setIsLoading={setIsLoadingMock}
        isLoading={false}
        clickedRaceObj={testRace1}
        isCircuitGraphicVisibleHandler={isCircuitGraphicVisibleMock}
        isMapInAnimation={false}
      />
    );
    await waitFor(() => expect(eventLockerSpy).toBeCalledTimes(1));
    expect(viewOnMock).toBeCalledTimes(1);
    expect(viewOnMock).toBeCalledWith(eventsArr, expect.anything());
  });
});
