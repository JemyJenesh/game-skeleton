import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./src/App";

const rootElement = document.querySelector("#root");
if (!rootElement) {
  throw new Error("No root element found!");
}

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
