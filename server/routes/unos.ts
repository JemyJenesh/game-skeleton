import express, { Request, Response } from "express";
import { PlayerService, UnoService } from "../services";
import { getServerSocket } from "../services/socket";

export const unosRouter = express.Router();

unosRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "id is missing" });

  const uno = await UnoService.findById(id);

  if (!uno) {
    return res.status(404).end();
  }

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

unosRouter.put("/:id/serve", async (req: Request, res: Response) => {
  const id = req.params.id;
  const io = getServerSocket();

  if (!id) return res.status(400).json({ message: "id is missing" });
  const uno = await UnoService.update(id, { state: "serving" });
  io.emit(`uno-serve_${id}`);

  return res.json(uno);
});

unosRouter.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const io = getServerSocket();

  if (!id || !body)
    return res.status(400).json({ message: "id or body missing" });
  const uno = await UnoService.update(id, body);
  io.emit(`uno-update_${id}`);

  return res.json(uno);
});
