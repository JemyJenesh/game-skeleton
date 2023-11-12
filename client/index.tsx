import "@fontsource/inter";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./src/utils";

const rootElement = document.querySelector("#root");
if (!rootElement) {
  throw new Error("No root element found!");
}

const root = ReactDOM.createRoot(rootElement);
root.render(<RouterProvider router={router} />);
