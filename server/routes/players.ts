import express, { Request, Response } from "express";
import { PlayerInput } from "../models";
import { PlayerService } from "../services";

export const playersRouter = express.Router();

playersRouter.get("/me", async (req: Request, res: Response) => {
  const playerId = req.cookies.playerId;
  if (!playerId) {
    return res.json(null);
  }

  const player = await PlayerService.findById(playerId);

  return res.json(player);
});

playersRouter.post("/", async (req: Request, res: Response) => {
  const playerInput: PlayerInput = req.body;
  const player = await PlayerService.create(playerInput);
  res.cookie("playerId", player.id, {
    httpOnly: true,
    maxAge: 400 * 24 * 3600 * 1000, //100 days
  });

  return res.json(player);
});

playersRouter.put("/", async (req: Request, res: Response) => {
  const playerInput: PlayerInput = req.body;
  const playerId = req.cookies.playerId;

  const player = await PlayerService.update(playerId, playerInput);

  return res.json(player);
});
