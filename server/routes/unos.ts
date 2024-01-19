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

unosRouter.put("/:id/draw", async (req: Request, res: Response) => {
  const id = req.params.id;
  const io = getServerSocket();
  const playerId = req.cookies.playerId;
  if (!playerId) {
    return res.json(null);
  }
  if (!id) return res.status(400).json({ message: "id is missing" });

  const uno = await UnoService.findById(id);
  if (!uno) return res.status(404).end();

  const { deck = [], players = [], hands = [] } = uno;
  if (deck.length) {
    const card = deck.pop()!;
    const playerIndex = players.findIndex((p) => p._id.toString() === playerId);
    const playerHand = [...hands[playerIndex], card];
    const newHands = hands.map((hand, i) =>
      i === playerIndex ? playerHand : hand
    );
    const turn = (uno.turn + uno.direction + players.length) % players.length;
    const updatedUno = await UnoService.update(uno.id, {
      deck,
      hands: newHands,
      turn,
    });
    io.emit(`uno-updated_${id}`, updatedUno);

    return res.json(uno);
  }

  return res.json(null);
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
