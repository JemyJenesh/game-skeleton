import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Radio from "@mui/joy/Radio";
import Sheet from "@mui/joy/Sheet";
import React from "react";
import { Avatar } from "../../../utils";

export function PlayerAvatar({ avatar: { url } }: { avatar: Avatar }) {
  return (
    <Sheet
      variant="outlined"
      sx={{
        borderRadius: "100%",
        boxShadow: "sm",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Radio id={url} value={url} checkedIcon={<CheckCircleRoundedIcon />} />
      <img height={75} width={75} src={url} />
    </Sheet>
  );
}
