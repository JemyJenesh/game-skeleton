import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import * as React from "react";
import { Player } from "../../../types";
import { useNavigate } from "react-router-dom";

export function PlayerCard({ player }: { player: Player }) {
  const { avatar, name } = player;
  const navigate = useNavigate();

  return (
    <Card
      variant="outlined"
      sx={{
        width: 250,
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
          {name}
        </Typography>
      </CardContent>
      <CardActions buttonFlex="1 0 100px">
        <Button
          variant="outlined"
          color="neutral"
          onClick={() => navigate("/players/me")}
        >
          View
        </Button>
        <Button
          variant="solid"
          color="primary"
          onClick={() => navigate("/players/edit")}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
}
