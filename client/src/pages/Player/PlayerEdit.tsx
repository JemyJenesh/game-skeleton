import { Snackbar } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { radioClasses } from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import React, { useState } from "react";
import { PageTransition } from "../../components";
import { usePlayer } from "../../hooks";
import { avatars } from "../../utils";
import { PlayerAvatar } from "./components";

export function PlayerEdit() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { player, setPlayer } = usePlayer();

  const [form, setForm] = useState({
    name: player?.name ?? "",
    avatar: player?.avatar ?? "",
  });
  const isDisabled =
    !form.name ||
    !form.avatar ||
    (form.name === player?.name && form.avatar === player?.avatar);

  const handleChange = (e: any) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClick = () => {
    setLoading(true);
    fetch("/api/players", {
      method: "PUT",
      body: JSON.stringify(form),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPlayer(data);
        setOpen(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderSnackbar = () => {
    return (
      <Snackbar
        variant="soft"
        color="success"
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        Your profile is updated!
      </Snackbar>
    );
  };

  return (
    <PageTransition>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        {renderSnackbar()}
        <Stack
          sx={{ width: "100%", py: 3, boxShadow: "xs", background: "white" }}
          direction="column"
          alignItems="center"
          spacing={3}
        >
          <Typography sx={{ width: 435 }} fontSize={"1.5rem"}>
            Update your profile
          </Typography>
          <Stack spacing={1} sx={{ width: 435 }}>
            <FormLabel>Your name</FormLabel>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              autoFocus
              variant="outlined"
            />
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <FormLabel>Change your avatar</FormLabel>
          <Sheet
            variant="outlined"
            sx={{
              width: 435,
              borderRadius: "sm",
              p: 1,
            }}
          >
            <RadioGroup
              overlay
              name="avatar"
              onChange={handleChange}
              defaultValue={player?.avatar}
              sx={{
                gap: 2,
                [`& .${radioClasses.checked}`]: {
                  [`& .${radioClasses.action}`]: {
                    inset: -1,
                    border: "3px solid",
                    borderColor: "primary.500",
                  },
                },
                [`& .${radioClasses.radio}`]: {
                  display: "contents",
                  "& > svg": {
                    zIndex: 2,
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    bgcolor: "background.surface",
                    borderRadius: "50%",
                  },
                },
              }}
            >
              <Stack direction={"row"} gap={1} flexWrap="wrap">
                {avatars
                  ?.filter((a) => a.type === "boy")
                  ?.map((avatar) => (
                    <PlayerAvatar key={avatar.url} avatar={avatar} />
                  ))}
              </Stack>
              <Stack direction={"row"} gap={1} flexWrap="wrap">
                {avatars
                  ?.filter((a) => a.type === "girl")
                  ?.map((avatar) => (
                    <PlayerAvatar key={avatar.url} avatar={avatar} />
                  ))}
              </Stack>
            </RadioGroup>
          </Sheet>
        </Stack>

        <Stack
          sx={{
            width: 360,
          }}
          direction="row"
          justifyContent="flex-end"
          alignItems="flex-start"
        >
          <Button onClick={handleClick} loading={loading} disabled={isDisabled}>
            Update
          </Button>
        </Stack>
      </Box>
    </PageTransition>
  );
}
