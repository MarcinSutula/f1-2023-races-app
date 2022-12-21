import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MapViewContextProvider } from "./context/MapViewContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MapViewContextProvider>
      <App />
    </MapViewContextProvider>
  </React.StrictMode>
);
