import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { wordsLoader } from ".";
import { App } from "../App";
import { PlayerProvider } from "../hooks";
import {
  Home,
  NotFoundPage,
  PlayerCreate,
  PlayerEdit,
  PlayerView,
  TypingPractice,
  UnoRoom,
} from "../pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PlayerProvider>
        <App />
      </PlayerProvider>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/players/create",
        element: <PlayerCreate />,
      },
      {
        path: "/players/edit",
        element: <PlayerEdit />,
      },
      {
        path: "/players/me",
        element: <PlayerView />,
      },

      {
        path: "/typing",
        loader: wordsLoader,
        element: <TypingPractice />,
      },
      {
        path: "/uno/:id/room",
        element: <UnoRoom />,
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
