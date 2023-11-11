import CssBaseline from "@mui/joy/CssBaseline";
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home, NotFoundPage, PlayerCreate } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/players/create",
    element: <PlayerCreate />,
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
