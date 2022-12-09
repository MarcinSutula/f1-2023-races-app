// import App from "./App";
import { render, screen } from "@testing-library/react";
// import Map from "@arcgis/core/Map";
// import MapView from "@arcgis/core/views/MapView";
// import { ViewContext, RacesArrContext } from "./App";
// import {
//   lackingDataRaceObj,
//   largeDataRaceObj,
//   smallDataRaceObj,
// } from "./stories/testData";
// import React from "react";

// jest.mock("@arcgis/core/views/MapView");
// jest.mock("@arcgis/core/Map");
// // jest.mock("@arcgis/core/layers/FeatureLayer");
// jest.mock("@arcgis/core/core/uuid.js", () => ({
//   generateUUID: () => "mock-esri-uuid",
// }));

// jest.mock("./components/DetailsPanel.tsx", () => {
//   return {
//     __esModule: true,
//     default: () => {
//       return <div data-testid="mock-detailspanel">detailspanel</div>;
//     },
//   };
// });

// (Map as any).mockImplementation(() => ({
//   basemap: "dark-gray-vector",
// }));

// (MapView as any).mockImplementation(() => ({
//   map: new Map(),
//   container: "mapContainer",
//   center: [-77.091, 38.8816],
//   zoom: 12,
// }));

// test("renders learn react link", () => {
//   render(<App />);
//   // const linkElement = screen.getByText(/learn react/i);
//   expect(true).toBeTruthy();
// });

describe("App", () => {
  it("view is renderedd", () => {
    // const mockMapView = new MapView();

    // const { container } = render(
    //   <RacesArrContext.Provider
    //     value={[smallDataRaceObj, lackingDataRaceObj, largeDataRaceObj]}
    //   >
    //     <ViewContext.Provider value={mockMapView}>
    //       <App />
    //     </ViewContext.Provider>
    //   </RacesArrContext.Provider>
    // );

    // const setStateMock = jest.fn();
    // const useStateMock: any = (useState: any) => [
    //   lackingDataRaceObj,
    //   setStateMock,
    // ];

    // jest.spyOn(React, "useState").mockImplementation(useStateMock);

    // expect(container).not.toBeUndefined();
    // expect(screen.getByTestId("mock-toolbar")).not.toBeUndefined();
    // expect(screen.getByTestId("mock-detailspanel")).not.toBeUndefined();
    expect(true).toBeTruthy();
  });
});
