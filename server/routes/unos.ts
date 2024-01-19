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

  const { deck = [], players = [], hands = [], turn } = uno;
  if (deck.length) {
    const card = deck.pop()!;
    const playerIndex = players.findIndex((p) => p._id.toString() === playerId);

    if (playerIndex !== turn) {
      return res.json(uno);
    }

    const playerHand = [...hands[playerIndex], card];
    const newHands = hands.map((hand, i) =>
      i === playerIndex ? playerHand : hand
    );
    const newTurn =
      (uno.turn + uno.direction + players.length) % players.length;
    const updatedUno = await UnoService.update(uno.id, {
      deck,
      hands: newHands,
      turn: newTurn,
    });
    io.emit(`uno-updated_${id}`, updatedUno);

    return res.json(uno);
  }

  return res.json(null);
});

unosRouter.put("/:id/discard", async (req: Request, res: Response) => {
  const id = req.params.id;
  const discardedCard = req.body.card;
  const io = getServerSocket();
  const playerId = req.cookies.playerId;
  if (!playerId) {
    return res.json(null);
  }
  if (!id) return res.status(400).json({ message: "id is missing" });

  const uno = await UnoService.findById(id);
  if (!uno) return res.status(404).end();

  const { pile = [], players = [], hands = [], turn } = uno;
  const playerIndex = players.findIndex((p) => p._id.toString() === playerId);
  if (playerIndex !== turn) {
    return res.json(uno);
  }

  const playerHand = hands[playerIndex]?.filter(
    (card) => (card as any)._id.toString() !== discardedCard._id
  );
  const won = playerHand.length === 0;
  const newHands = hands.map((hand, i) =>
    i === playerIndex ? playerHand : hand
  );
  const newTurn = (turn + uno.direction + players.length) % players.length;
  const updatedUno = await UnoService.update(id, {
    pile: [...pile, discardedCard],
    hands: newHands,
    turn: newTurn,
    winner: won ? playerId : uno.winner,
    state: won ? "over" : uno.state,
  });
  io.emit(`uno-updated_${id}`, updatedUno);

  return res.json(updatedUno);
});

unosRouter.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const io = getServerSocket();

  if (!id || !body)
    return res.status(400).json({ message: "id or body missing" });
  const uno = await UnoService.update(id, body);
  io.emit(`uno-updated_${id}`, uno);

  return res.json(uno);
});
