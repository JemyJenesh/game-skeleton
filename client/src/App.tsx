import CssBaseline from "@mui/joy/CssBaseline";
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { usePlayer } from "./hooks";
import { Home, NotFoundPage, PlayerCreate, PlayerView } from "./pages";
import { PlayerEdit } from "./pages/Player/PlayerEdit";

export function App() {
  const { loading, fetchPlayer } = usePlayer();
  useEffect(() => {
    fetchPlayer();
  }, []);

  if (loading) {
    return <p>...loading</p>;
  }

  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players/create" element={<PlayerCreate />} />
        <Route path="/players/edit" element={<PlayerEdit />} />
        <Route path="/players/me" element={<PlayerView />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
