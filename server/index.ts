import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { createServer } from "node:http";
import path from "path";
import { Server } from "socket.io";
import { router } from "./routes";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? "" : "http://localhost:3000",
  },
});
const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL || "";

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("ping", (data) => {
    console.log(data);
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));
}

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

mongoose.connect(MONGO_URL).then(async () => {
  console.log("Connected to mongodb");

  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
