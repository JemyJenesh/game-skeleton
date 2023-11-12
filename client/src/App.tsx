import CssBaseline from "@mui/joy/CssBaseline";
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, NotFoundPage, PlayerCreate } from "./pages";
import { usePlayer } from "./hooks";

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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
