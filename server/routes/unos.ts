import express, { Request, Response } from "express";
import { PlayerService, UnoService } from "../services";
import { getServerSocket } from "../services/socket";

export const unosRouter = express.Router();

unosRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "id is missing" });

  const uno = await UnoService.findById(id);

  return res.json(uno);
});

unosRouter.post("/", async (req: Request, res: Response) => {
  const playerId = req.cookies.playerId;
  if (!playerId) {
    return res.json(null);
  }
  const uno = await UnoService.create(playerId);

  return res.json(uno);
});

unosRouter.post("/:id/join", async (req: Request, res: Response) => {
  const id = req.params.id;
  const io = getServerSocket();

  const playerId = req.cookies.playerId;
  if (!playerId) {
    return res.json(null);
  }

  if (!id) return res.status(400).json({ message: "id is missing" });

  const uno = await UnoService.join(id, playerId);
  const player = await PlayerService.findById(playerId);

  io.emit(`player-joined_${id}`, player);

  return res.json(uno);
});
