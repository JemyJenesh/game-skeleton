import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import React from "react";

export function NotFoundPage() {
  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      <Typography level="h1">Page not found</Typography>
      <Typography>The page you are looking for doesn't exist.</Typography>
    </Box>
  );
}
