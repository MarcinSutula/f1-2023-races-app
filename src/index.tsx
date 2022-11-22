import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MapViewCmp from "./MapViewCmp";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MapViewCmp />
  </React.StrictMode>
);
