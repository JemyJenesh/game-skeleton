import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/joy";
import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { clientSocket, queryClient } from "../../App";
import { PageTransition } from "../../components";
import { usePlayer } from "../../hooks";
import { useUno } from "../../hooks/uno";
import { PlusIcon } from "../../icons";
import { Uno, joinUno, serveCard } from "../../utils/api";
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

function useServeUno(id: string) {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: serveCard,
    onSuccess: () => {
      navigate(`/unos/${id}`);
    },
  });

  return mutation;
}

export function UnoRoom() {
  const { id } = useParams();
  const { isLoading, isError, data } = useUno();
  const joinMutation = useJoinUno(id!);
  const serveMutation = useServeUno(id!);
  const { player } = usePlayer();
  const navigate = useNavigate();

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
    clientSocket.on(`uno-serve_${id}`, () => {
      navigate(`/unos/${id}`);
    });
  }, [id]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error! Something went wrong!</p>;

  const { players = [], state } = data!;
  const isInGame = players.find((p) => p._id === player?._id);
  if (isInGame && (state === "playing" || state === "serving"))
    return <Navigate to={`/unos/${id}`} />;

  const playerCount = players.length;
  const isJoinVisible =
    playerCount < 5 && !players.find((p) => p._id === player?._id);
  const showStart = players[0]?._id === player?._id;
  const canStart = players.length > 1;

  if (state === "over")
    return (
      <Typography level="h3" textAlign={"center"} mt={2}>
        Uno is over
      </Typography>
    );
  if (state === "serving" || state === "playing")
    return (
      <Typography level="h3" textAlign={"center"} mt={2}>
        Uno already started
      </Typography>
    );

  return (
    <PageTransition>
      <Stack p={3} gap={3} alignItems={"center"}>
        <Typography level="h3">Waiting for players...</Typography>
        <Stack gap={3} direction={"row"}>
          {players.map((player) => (
            <PlayerCard key={player._id} player={player} />
          ))}
          {isJoinVisible && (
            <Tooltip title="Join Game">
              <IconButton
                disabled={false}
                variant="outlined"
                onClick={() => joinMutation.mutate(id!)}
              >
                <PlusIcon size={128} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
        <Stack direction={"row"} gap={3}>
          <Button
            variant="soft"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            Share Link
          </Button>
          {showStart && (
            <Button
              disabled={!canStart}
              onClick={() => serveMutation.mutate(id!)}
            >
              Start Game
            </Button>
          )}
        </Stack>
      </Stack>
    </PageTransition>
  );
}
