import "@fontsource/inter";
import { App } from "client/App";
import { PlayerProvider } from "client/hooks";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

const rootElement = document.querySelector("#root");
if (!rootElement) {
  throw new Error("No root element found!");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <BrowserRouter>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </BrowserRouter>
);
