import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import React from "react";
import { Link } from "react-router-dom";
import { PageTransition } from "../components";

export function NotFoundPage() {
  return (
    <PageTransition>
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Typography level="h1">Page not found</Typography>
        <Typography gutterBottom>
          The page you are looking for doesn't exist.
        </Typography>
        <Button component={Link} to="/">
          Go Home
        </Button>
      </Box>
    </PageTransition>
  );
}
