import Radio from "@mui/joy/Radio";
import Sheet from "@mui/joy/Sheet";
import React from "react";
import { CheckCircle } from "../../../icons";
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
      <Radio id={url} value={url} checkedIcon={<CheckCircle />} />
      <img height={75} width={75} src={url} />
    </Sheet>
  );
}
