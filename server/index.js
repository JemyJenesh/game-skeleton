import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.get("/api/status", (req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
