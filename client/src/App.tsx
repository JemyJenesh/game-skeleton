import CssBaseline from "@mui/joy/CssBaseline";
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home, NotFoundPage } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function App() {
  return (
    <CssBaseline>
      <RouterProvider router={router} />
    </CssBaseline>
  );
}
