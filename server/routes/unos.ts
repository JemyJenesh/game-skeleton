import express, { Request, Response } from "express";
import { UnoService } from "../services";

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
  const playerId = req.cookies.playerId;
  if (!playerId) {
    return res.json(null);
  }

  if (!id) return res.status(400).json({ message: "id is missing" });

  const uno = await UnoService.join(id, playerId);

  return res.json(uno);
});
