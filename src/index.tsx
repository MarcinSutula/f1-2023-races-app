import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MapViewContextProvider } from "./context/MapViewContext";
import { RacesArrContextProvider } from "./context/RacesArrContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MapViewContextProvider>
      <RacesArrContextProvider>
        <App />
      </RacesArrContextProvider>
    </MapViewContextProvider>
  </React.StrictMode>
);
