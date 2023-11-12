import CssBaseline from "@mui/joy/CssBaseline";
import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
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
      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </>
  );
}
