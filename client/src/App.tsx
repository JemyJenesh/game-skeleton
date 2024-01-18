import CssBaseline from "@mui/joy/CssBaseline";
import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import { usePlayer } from "./hooks";

export const queryClient = new QueryClient();
const wsUrl =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3001";
const socket = io(wsUrl);

export function App() {
  const { loading, fetchPlayer } = usePlayer();
  useEffect(() => {
    fetchPlayer();
    socket.emit("chat", { name: "jen" });
  }, []);

  if (loading) {
    return <p>...loading</p>;
  }

  return (
    <>
      <CssBaseline />
      <AnimatePresence mode="wait" initial={false}>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </AnimatePresence>
    </>
  );
}
