import { IconButton, Stack } from "@mui/joy";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { queryClient } from "../../App";
import { PageTransition } from "../../components";
import { PlusIcon } from "../../icons";
import { getUno, joinUno } from "../../utils/api";
import { PlayerCard } from "./components";

function useJoinUno(id: string) {
  const mutation = useMutation({
    mutationFn: joinUno,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unos", id] });
    },
  });

  return mutation;
}

export function UnoRoom() {
  const { id } = useParams();
  const { isLoading, isError, data } = useQuery({
    queryKey: ["unos", id],
    queryFn: () => getUno(id!),
  });
  const mutation = useJoinUno(id!);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error! Something went wrong!</p>;

  const { players = [] } = data!;
  const playerCount = players.length;
  const isJoinVisible = playerCount < 5;

  return (
    <PageTransition>
      <Stack
        sx={{ p: 3, justifyContent: "center", alignItems: "center" }}
        gap={3}
        direction={"row"}
      >
        {players.map((player) => (
          <PlayerCard player={player} />
        ))}
        {isJoinVisible && (
          <IconButton
            disabled={false}
            variant="outlined"
            onClick={() => mutation.mutate(id!)}
          >
            <PlusIcon size={128} />
          </IconButton>
        )}
      </Stack>
    </PageTransition>
  );
}
