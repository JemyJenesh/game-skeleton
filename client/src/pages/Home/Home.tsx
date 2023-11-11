import Typography from "@mui/joy/Typography";
import React from "react";

export function Home() {
  const [data, setDate] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setDate(data));
  }, []);

  return (
    <div>
      <Typography level="h1">Game Skeleton</Typography>

      <pre>{JSON.stringify(data)}</pre>

      <img src="/static/avatars/boys/1.png" />
    </div>
  );
}
