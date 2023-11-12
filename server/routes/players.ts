import express, { Request, Response } from "express";
import { PlayerInput } from "../models";
import { PlayerService } from "../services";

export const playersRouter = express.Router();

playersRouter.get("/me", async (req: Request, res: Response) => {
  const userId = req.cookies.userId;
  if (!userId) {
    return null;
  }

  const player = await PlayerService.findById(userId);

  return res.json(player);
});

playersRouter.post("/", async (req: Request, res: Response) => {
  const playerInput: PlayerInput = req.body;
  const player = await PlayerService.create(playerInput);
  req.cookies("userId", player.id);

  return res.json(player);
});
