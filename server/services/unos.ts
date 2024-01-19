import {
  UNO_COLORS,
  UNO_VALUES,
  Uno,
  UnoCard,
  UnoColor,
  UnoUpdateInput,
  UnoValue,
} from "../models";

function createCard(color: UnoColor, value: UnoValue): UnoCard {
  return {
    color,
    value,
    name: `${color}_${value}`,
  };
}

function buildDeck() {
  let deck: UnoCard[] = [];

  // const actionCards: UnoValue[] = ["draw-two", "skip", "reverse"];
  for (const color of UNO_COLORS) {
    // if (color === "wild") continue;
    deck.push(createCard(color, UNO_VALUES[0]));
    for (let i = 1; i < 10; i++) {
      deck.push(createCard(color, UNO_VALUES[i]));
      deck.push(createCard(color, UNO_VALUES[i]));
    }
    // for (let action of actionCards) {
    //   deck.push(createCard(color, action));
    //   deck.push(createCard(color, action));
    // }
  }
  // for (let i = 0; i < 4; i++) {
  //   deck.push(createCard("wild", "wild"));
  //   deck.push(createCard("wild", "wild-four"));
  // }

  return deck;
}

function shuffleDeck(deck: UnoCard[]) {
  return deck.sort(() => Math.random() - 0.5);
}

export const UnoService = {
  async findById(id: string) {
    return await Uno.findById(id).populate(["players", "winner"]);
  },

  async create(playerId: string) {
    return await Uno.create({
      players: [playerId],
      deck: shuffleDeck(buildDeck()),
    });
  },

  async update(id: string, uno: UnoUpdateInput) {
    return await Uno.findByIdAndUpdate(id, uno, { new: true }).populate([
      "players",
      "winner",
    ]);
  },

  async join(id: string, playerId: string) {
    return await Uno.findByIdAndUpdate(
      id,
      {
        $push: { players: playerId },
      },
      { new: true }
    ).populate("players");
  },
};
