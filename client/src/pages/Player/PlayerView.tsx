import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import React from "react";
import { PageTransition } from "../../components";
import { usePlayer } from "../../hooks";

export function PlayerView() {
  const { player } = usePlayer();
  if (!player) return null;
  const { avatar, createdAt, name, played, tag, wins } = player;

  return (
    <PageTransition>
      <Box sx={{ display: "flex", justifyContent: "center", pt: 3 }}>
        <Stack sx={{ p: 2, width: 360 }} gap={3}>
          <Stack direction="row" alignItems="flex-end" gap={3}>
            <Box>
              <img src={avatar} />
            </Box>
            <Box sx={{ mb: 1 }}>
              <Stack gap={0} sx={{ pb: 1 }}>
                <Typography level="h3">{name}</Typography>
                <Chip color="primary">{tag}</Chip>
              </Stack>
              <Typography>
                Joined at{" "}
                <Typography fontWeight="bold">
                  {new Date(createdAt).toLocaleDateString()}
                </Typography>
              </Typography>
            </Box>
          </Stack>
          <Sheet variant="soft" sx={{ p: 2 }}>
            <Typography>
              <Typography fontWeight="bold">{played}</Typography> games played.
            </Typography>
            <Typography>
              <Typography fontWeight="bold">{wins}</Typography> games won.
            </Typography>
          </Sheet>
        </Stack>
      </Box>
    </PageTransition>
  );
}
