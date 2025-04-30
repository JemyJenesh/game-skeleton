import AddIcon from "@mui/icons-material/Add";
import { Button, Stack, Tooltip, Typography } from "@mui/joy";
import Avatar from "@mui/joy/Avatar";
import AvatarGroup from "@mui/joy/AvatarGroup";
import { useBingo } from "client/api/bingos/getBingo";
import useBingoSocket from "client/hooks/useBingoSocket";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CopyButton, PageTransition } from "../../components";
import { usePlayer } from "../../hooks";

export function BingoRoom() {
  const { id = "" } = useParams();
  const { player } = usePlayer();
  const navigate = useNavigate();
  const socket = useBingoSocket({ id });
  const { isLoading, isError, data } = useBingo({ bingoId: id });

  const joinGame = () => {
    socket.joinGame();
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Something went wrong!</p>;

  const { players = [] } = data;
  const isHost = players[0]?._id === player?._id;
  const isPlayer = !!players.find((p) => p._id === player?._id);

  return (
    <PageTransition>
      <Stack p={3} gap={8} alignItems={"center"}>
        <Typography level="h3">Waiting for players...</Typography>
        <Stack gap={3} direction={"row"}>
          <AvatarGroup sx={{ "--Avatar-size": "100px" }}>
            {players.map((p) => (
              <Tooltip
                key={`${p._id}`}
                title={p._id === player?._id ? "You" : p?.name}
                arrow
                open
                placement="bottom"
              >
                <Avatar alt={p.name} src={p.avatar} />
              </Tooltip>
            ))}
          </AvatarGroup>
        </Stack>
        <Stack direction={"row"} gap={3}>
          <CopyButton text={window.location.href}>Copy Link</CopyButton>

          {isHost ? (
            <Button>Start Game</Button>
          ) : (
            <Button
              startDecorator={<AddIcon />}
              onClick={joinGame}
              disabled={isPlayer}
            >
              Join
            </Button>
          )}
        </Stack>
      </Stack>
    </PageTransition>
  );
}
