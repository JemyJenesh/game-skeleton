import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter, Link } from "react-router-dom";

export function App() {
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
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "*",
    element: <div>Page not found</div>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
