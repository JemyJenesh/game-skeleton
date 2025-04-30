import AddIcon from "@mui/icons-material/Add";
import { Button, Stack, Tooltip, Typography } from "@mui/joy";
import Avatar from "@mui/joy/Avatar";
import AvatarGroup from "@mui/joy/AvatarGroup";
import React from "react";
import { useParams } from "react-router-dom";
import { CopyButton, PageTransition } from "../../components";
import { usePlayer } from "../../hooks";

export function Bingo() {
  const { id } = useParams();
  const { player } = usePlayer();

  return (
    <PageTransition>
      <Stack p={3} gap={8} alignItems={"center"}>
        <Typography level="h3">Waiting for players...</Typography>
        <Stack gap={3} direction={"row"}>
          <AvatarGroup
            sx={{ "--Avatar-size": "100px", "--AvatarGroup-gap": "-16px" }}
          >
            <Tooltip title="You" arrow open placement="bottom">
              <Avatar
                size="lg"
                alt="Remy Sharp"
                src="/static/avatars/boys/1.png"
              />
            </Tooltip>
            <Avatar
              size="lg"
              alt="Travis Howard"
              src="/static/avatars/boys/2.png"
            />
            <Avatar
              size="lg"
              alt="Cindy Baker"
              src="/static/avatars/girls/1.png"
            />
          </AvatarGroup>
        </Stack>
        <Stack direction={"row"} gap={3}>
          <CopyButton text={window.location.href}>Copy Link</CopyButton>

          <Button>Start Game</Button>

          <Button startDecorator={<AddIcon />}>Join</Button>
        </Stack>
      </Stack>
    </PageTransition>
  );
}
