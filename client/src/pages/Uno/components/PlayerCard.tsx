import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import React from "react";
import { usePlayer } from "../../../hooks";
import { Player } from "../../../types";

export function PlayerCard({ player }: { player: Player }) {
  const { _id, avatar, name } = player;
  const { player: currentPlayer } = usePlayer();
  const isMe = currentPlayer?._id === _id;

  return (
    <Card
      variant={isMe ? "soft" : "outlined"}
      sx={{
        width: 200,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={avatar} />
      </Box>
      <CardContent>
        <Typography textAlign="center" level="title-md">
          {isMe ? "You" : name}
        </Typography>
      </CardContent>
    </Card>
  );
}
