import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import LibraryAddCheckRoundedIcon from "@mui/icons-material/LibraryAddCheckRounded";
import { Button } from "@mui/joy";
import React, { ReactNode, useState } from "react";

export function CopyButton({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const handleClick = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(text);
    const timeoutId = setTimeout(() => {
      setIsCopied(false);
      clearTimeout(timeoutId);
    }, 1000);
  };

  return (
    <Button
      variant="soft"
      startDecorator={
        isCopied ? <LibraryAddCheckRoundedIcon /> : <ContentCopyRoundedIcon />
      }
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
