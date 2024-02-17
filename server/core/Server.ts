import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { createServer } from "node:http";
import path from "path";
import { router } from "../routes";

class Server {
  private static app = express();
  static http = createServer(Server.app);

  static async boot() {
    Server.setupMiddlewares();
    Server.setupRoutes();
    Server.start();
  }

  private static setupMiddlewares() {
    const middlewares = [cors(), express.json(), cookieParser()];

    if (process.env.NODE_ENV === "production") {
      Server.app.use(express.static(path.join(__dirname, "..", "public")));
    }
    middlewares.map((middleware) => Server.app.use(middleware));
    Server.app.use("/static", express.static(path.join("server", "public")));
  }

  private static setupRoutes() {
    Server.app.use("/api", router);
    Server.app.get("/healthcheck", (_, res) => res.status(200).json({}));
    if (process.env.NODE_ENV === "production") {
      Server.app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "public", "index.html"));
      });
    }
  }

  private static start() {
    const PORT = process.env.PORT || 3001;
    const MONGO_URL = process.env.MONGO_URL || "";

    mongoose.connect(MONGO_URL).then(async () => {
      console.log("Connected to mongodb");

      Server.http.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    });
  }
}

export default Server;
