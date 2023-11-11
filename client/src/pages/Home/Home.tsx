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
      <h1>Game Skeleton</h1>

      <pre>{JSON.stringify(data)}</pre>

      <img src="/static/avatars/boys/1.png" />
    </div>
  );
}
