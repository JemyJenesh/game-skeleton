import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import React from "react";
import { usePlayer } from "../../hooks";
import { PlayerCard } from "./components";

export function Home() {
  const { player } = usePlayer();

  return (
    <Stack sx={{ p: 3, gap: 3 }} alignItems="center">
      <Typography level="h2">Hi {player?.name}!</Typography>
      <Stack>
        <PlayerCard player={player!} />
      </Stack>
    </Stack>
  );
}
