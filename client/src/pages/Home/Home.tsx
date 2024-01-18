import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import React from "react";
import { UseMutationResult, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "../../components";
import { usePlayer } from "../../hooks";
import { createUno } from "../../utils/api";
import { GameCard, PlayerCard } from "./components";

function useCreateUno() {
  const navigate = useNavigate();
  const mutation: UseMutationResult = useMutation({
    mutationFn: createUno,
    onSuccess: (data) => {
      if (data._id) navigate(`/uno/${data._id}/room`);
    },
  });

  return mutation;
}

export function Home() {
  const { player } = usePlayer();
  const mutation = useCreateUno();

  return (
    <PageTransition>
      <Stack sx={{ p: 3, gap: 3 }} alignItems="center">
        <Typography level="h2">Hi {player?.name}!</Typography>
        <Stack>
          <PlayerCard player={player!} />
        </Stack>
        <Stack>
          <GameCard
            title="Uno"
            handleClick={() => mutation.mutate({})}
            isLoading={mutation.isLoading}
          />
        </Stack>
      </Stack>
    </PageTransition>
  );
}
