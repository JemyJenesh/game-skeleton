import express, { Request, Response } from "express";
import Socket from "../core/Socket";
import { UnoCard } from "../models";
import { PlayerRepository } from "../repositories/PlayerRepository";
import { UnoService, shuffleDeck } from "../services";

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
  const io = Socket.io;

  const playerId = req.cookies.playerId;
  if (!playerId) {
    return res.json(null);
  }

  if (!id) return res.status(400).json({ message: "id is missing" });

  const uno = await UnoService.join(id, playerId);
  const player = await PlayerRepository.findById(playerId);

  io.emit(`player-joined_${id}`, player);

  return res.json(uno);
});

unosRouter.put("/:id/serve", async (req: Request, res: Response) => {
  const id = req.params.id;
  const io = Socket.io;

  if (!id) return res.status(400).json({ message: "id is missing" });
  const uno = await UnoService.update(id, { state: "serving" });
  io.emit(`uno-serve_${id}`);

  return res.json(uno);
});

unosRouter.put("/:id/draw", async (req: Request, res: Response) => {
  const id = req.params.id;
  const io = Socket.io;
  const playerId = req.cookies.playerId;
  if (!playerId) {
    return res.json(null);
  }
  if (!id) return res.status(400).json({ message: "id is missing" });

  const uno = await UnoService.findById(id);
  if (!uno) return res.status(404).end();

  let { deck = [], pile = [], players = [], hands = [], turn } = uno;
  const playerIndex = players.findIndex((p) => p._id.toString() === playerId);

  if (playerIndex !== turn) {
    return res.json(uno);
  }

  const topPileCard = pile[pile.length - 1];
  const card = deck.pop()!;
  const isValidCard =
    topPileCard.color === card.color || topPileCard.value === card.value;
  if (!deck.length) {
    const newPileCard = pile.pop()!;
    deck = shuffleDeck(pile);
    pile = [newPileCard];
  }

  const playerHand = [...hands[playerIndex], card];
  const newHands = hands.map((hand, i) =>
    i === playerIndex ? playerHand : hand
  );
  const newTurn = (uno.turn + uno.direction + players.length) % players.length;
  const updatedUno = await UnoService.update(uno.id, {
    deck,
    hands: newHands,
    turn: isValidCard ? turn : newTurn,
    pile,
  });
  io.emit(`uno-updated_${id}`, updatedUno);

  return res.json(uno);
});

type UnoCardWithId = UnoCard & { _id: string };

unosRouter.put("/:id/discard", async (req: Request, res: Response) => {
  const id = req.params.id;
  const discardedCard: UnoCardWithId = req.body.card;
  const io = Socket.io;
  const playerId = req.cookies.playerId;
  if (!playerId) return res.json(null);
  if (!id) return res.status(400).json({ message: "id is missing" });
  const uno = await UnoService.findById(id);
  if (!uno) return res.status(404).end();

  const {
    deck = [],
    pile = [],
    players = [],
    hands = [],
    turn,
    direction,
  } = uno;
  const playerIndex = players.findIndex((p) => p._id.toString() === playerId);
  if (playerIndex !== turn) return res.json(uno);

  let newTurn = (turn + direction + players.length) % players.length;
  let newDirection = direction;
  let newDeck = [...deck];
  const playerHand = hands[playerIndex]?.filter(
    (card) => (card as UnoCardWithId)._id.toString() !== discardedCard._id
  );
  const won = playerHand.length === 0;
  let newHands = hands.map((hand, i) =>
    i === playerIndex ? playerHand : hand
  );
  let newPile = [...pile, discardedCard];
  if (discardedCard.value === "reverse") {
    newDirection = direction === 1 ? -1 : 1;
    newTurn = (turn + newDirection + players.length) % players.length;
  } else if (discardedCard.value === "skip") {
    newTurn = (newTurn + newDirection + players.length) % players.length;
  } else if (discardedCard.value === "draw-two") {
    if (newDeck.length <= 2) {
      const newPileCard = pile.pop()!;
      newDeck = shuffleDeck([...pile, ...newDeck]);
      newPile = [newPileCard];
    }
    newHands = newHands.map((hand, i) =>
      i === newTurn ? [...hand, ...newDeck.slice(-2)] : hand
    );
    newDeck = newDeck.slice(0, -2);
    newTurn = (newTurn + newDirection + players.length) % players.length;
  }

  const updatedUno = await UnoService.update(id, {
    pile: newPile,
    deck: newDeck,
    hands: newHands,
    turn: newTurn,
    direction: newDirection,
    winner: won ? playerId : uno.winner,
    state: won ? "over" : uno.state,
  });
  io.emit(`uno-updated_${id}`, updatedUno);
  return res.json(updatedUno);
});

unosRouter.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const io = Socket.io;

  if (!id || !body)
    return res.status(400).json({ message: "id or body missing" });
  const uno = await UnoService.update(id, body);
  io.emit(`uno-updated_${id}`, uno);

  return res.json(uno);
});
