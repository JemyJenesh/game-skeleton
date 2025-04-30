import express, { Request, Response } from "express";
import BingoService from "server/services/bingos";

export const bingosRouter = express.Router();

bingosRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "id is missing" });

  const bingo = await BingoService.findById(id);

  if (!bingo) {
    return res.status(404).send("Sorry!");
  }

  return res.json(bingo);
});

bingosRouter.post("/", async (req: Request, res: Response) => {
  const playerId = req.cookies.playerId;
  if (!playerId) {
    return res.json(null);
  }
  const bingo = await BingoService.create(playerId);

  return res.json(bingo);
});
