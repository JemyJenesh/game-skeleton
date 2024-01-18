import { IconButton, Stack } from "@mui/joy";
import React, { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { Navigate, useParams } from "react-router-dom";
import { clientSocket, queryClient } from "../../App";
import { PageTransition } from "../../components";
import { usePlayer } from "../../hooks";
import { PlusIcon } from "../../icons";
import { Uno, getUno, joinUno } from "../../utils/api";
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
  const { player } = usePlayer();

  useEffect(() => {
    clientSocket.on(`player-joined_${id}`, (newPlayer) => {
      const queryKey = ["unos", id];
      const prevUno = queryClient.getQueryData(queryKey) as Uno;

      if (prevUno) {
        queryClient.setQueryData(queryKey, {
          ...prevUno,
          players: [...prevUno.players, newPlayer],
        });
      }
    });
  }, [id]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error! Something went wrong!</p>;
  if (!data) return <Navigate to="/" />;

  const { players = [] } = data;
  const playerCount = players.length;
  const isJoinVisible =
    playerCount < 5 && !players.find((p) => p._id === player?._id);

  return (
    <PageTransition>
      <Stack
        sx={{ p: 3, justifyContent: "center", alignItems: "center" }}
        gap={3}
        direction={"row"}
      >
        {players.map((player) => (
          <PlayerCard key={player._id} player={player} />
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
