import { create } from "zustand";
import { Player } from "../types";
import { Uno, UnoCard, updateUno } from "./api";

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawCards(deck: UnoCard[], n: number) {
  if (!deck.length) throw "The deck is empty";
  if (deck.length < n) throw `The deck has less ${n} cards`;

  const drawnCards: UnoCard[] = [];
  while (n > 0) {
    drawnCards.push(deck.pop()!);
    n--;
  }
  return drawnCards;
}

type UnoGameState = {
  _id: string;
  deck: UnoCard[];
  pile: UnoCard[];
  hands: UnoCard[][];
  turn: number;
  direction: 1 | -1;
  state: "waiting" | "serving" | "playing" | "over";
  winner: Player | null;
  players: Player[];

  serveIndex: number;

  init: (uno: Uno) => void;
  updateUno: (uno: Uno) => void;
  serve: () => void;
  saveServe: () => void;
  // discard: (card: UnoCard) => void;
  // drawCard: () => void;
  // nextPlayer: () => void;
};

export const useUnoGameStore = create<UnoGameState>()((set, get) => ({
  _id: "",
  deck: [],
  pile: [],
  hands: [],
  turn: 0,
  direction: 1,
  winner: null,
  players: [],
  state: "waiting",
  serveIndex: 0,

  init: (uno) =>
    set((state) => {
      const deck = uno.deck.slice(0, -1);
      const pile = uno.deck[uno.deck.length - 1]!;

      return {
        ...state,
        ...uno,
        deck,
        pile: [pile],
      };
    }),

  updateUno: (uno) =>
    set((state) => {
      return {
        ...state,
        ...uno,
      };
    }),

  serve: () =>
    set((state) => {
      const hands = state.hands.length ? [...state.hands] : [];
      hands[state.serveIndex] = hands[state.serveIndex]?.length
        ? [...hands[state.serveIndex], ...drawCards(state.deck, 1)]
        : drawCards(state.deck, 1);

      return {
        hands,
        serveIndex:
          (state.serveIndex + state.direction + state.players.length) %
          state.players.length,
      };
    }),

  saveServe: () => {
    updateUno({
      id: get()._id,
      uno: {
        deck: get().deck,
        pile: get().pile,
        hands: get().hands,
        state: "playing",
      },
    });
  },

  //   discard: (card: UnoCard) =>
  //     set((state) => {
  //       if (
  //         card.color === state.currentColor ||
  //         card.value === state.currentValue
  //       ) {
  //         const newPlayerHand = state.playerHands[state.playerIndex].filter(
  //           (c) => c.id != card.id
  //         );
  //         const playerHands = state.playerHands.map((hand, i) =>
  //           i === state.playerIndex ? hand.filter((c) => c.id != card.id) : hand
  //         );
  //         const gameOver = newPlayerHand.length === 0;

  //         if (gameOver) {
  //           return {
  //             gameState: "over",
  //             winner: state.playerIndex,
  //             playerHands: [...playerHands],
  //           };
  //         }

  //         return {
  //           playerHands: [...playerHands],
  //           currentColor: card.color,
  //           currentValue: card.value,
  //           // playerIndex:
  //           //   (state.playerIndex + state.gameDirection) % state.players.length,
  //           discardPile: [...state.discardPile, card],
  //         };
  //       }

  //       return state;
  //     }),

  //   drawCard: () =>
  //     set((state) => {
  //       let playerHand = state.playerHands[state.playerIndex];
  //       const canDraw = !playerHand.find(
  //         (card) =>
  //           card.color === state.currentColor || card.value === state.currentValue
  //       );
  //       console.log(canDraw);
  //       if (canDraw) {
  //         return {
  //           playerHands: [
  //             ...state.playerHands.map((hand, i) =>
  //               i === state.playerIndex
  //                 ? [...hand, ...drawCards(state.deck, 1)]
  //                 : hand
  //             ),
  //           ],
  //           // playerIndex:
  //           //   (state.playerIndex + state.gameDirection) % state.players.length,
  //         };
  //       }
  //       return state;
  //     }),

  //   nextPlayer: () =>
  //     set((state) => {
  //       return {
  //         playerIndex:
  //           (state.playerIndex + state.gameDirection) % state.players.length,
  //       };
  //     }),
}));
