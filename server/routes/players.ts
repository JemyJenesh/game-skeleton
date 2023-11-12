import express, { Request, Response } from "express";
import { PlayerInput } from "../models";
import { PlayerService } from "../services";

export const playersRouter = express.Router();

playersRouter.get("/me", async (req: Request, res: Response) => {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.json(null);
  }

  const player = await PlayerService.findById(userId);

  return res.json(player);
});

playersRouter.post("/", async (req: Request, res: Response) => {
  const playerInput: PlayerInput = req.body;
  const player = await PlayerService.create(playerInput);
  res.cookie("userId", player.id, {
    httpOnly: true,
    maxAge: 400 * 24 * 3600 * 1000, //100 days
  });

  return res.json(player);
});
