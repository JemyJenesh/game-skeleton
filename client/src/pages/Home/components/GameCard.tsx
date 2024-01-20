import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import * as React from "react";

export function GameCard({
  title,
  isLoading = false,
  handleClick,
}: {
  title: string;
  isLoading: boolean;
  handleClick: () => void;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        width: 250,
      }}
    >
      <CardContent>
        <Typography textAlign="center" level="title-md">
          {title}
        </Typography>
      </CardContent>
      <CardActions buttonFlex="1 0 100px">
        <Button
          variant="solid"
          color="primary"
          loading={isLoading}
          disabled={isLoading}
          onClick={handleClick}
        >
          Play
        </Button>
      </CardActions>
    </Card>
  );
}
