import BingoRepository from "server/repositories/BingoRepository";
import { PlayerRepository } from "server/repositories/PlayerRepository";
import { Bingo } from "typings/Bingo";
import { BingoPlayer, Player } from "typings/Player";
import { v4 as uuidv4 } from "uuid";

export function generateWholeNumbersInRange(a: number, b: number) {
  if (a > b) {
    throw new Error("Invalid range: 'a' should be less than or equal to 'b'");
  }

  const result = [];
  for (let i = a; i <= b; i++) {
    result.push(i);
  }

  return result;
}

export function generateBoard(free: boolean = true) {
  let ranges: [start: number, end: number, letter: string][] = [
    [1, 15, "b"],
    [16, 30, "i"],
    [31, 45, "n"],
    [46, 60, "g"],
    [61, 75, "o"],
  ];

  let cells: string[] = [];
  for (const range of ranges) {
    const [start, end, alphabet] = range;
    let nums = generateWholeNumbersInRange(start, end).map((a) => alphabet + a);
    const shuffled = nums.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 5);

    cells = [...cells, ...selected];
  }

  if (free) {
    cells[12] = "free";
  }

  let markers = cells.map((a) => (a !== "free" ? false : true));

  return { cells, markers };
}

export function pickBingoNumber(exclude: string[] = []) {
  const nums = [
    "b1",
    "b2",
    "b3",
    "b4",
    "b5",
    "b6",
    "b7",
    "b8",
    "b9",
    "b10",
    "b11",
    "b12",
    "b13",
    "b14",
    "b15",
    "i16",
    "i17",
    "i18",
    "i19",
    "i20",
    "i21",
    "i22",
    "i23",
    "i24",
    "i25",
    "i26",
    "i27",
    "i28",
    "i29",
    "i30",
    "n31",
    "n32",
    "n33",
    "n34",
    "n35",
    "n36",
    "n37",
    "n38",
    "n39",
    "n40",
    "n41",
    "n42",
    "n43",
    "n44",
    "n45",
    "g46",
    "g47",
    "g48",
    "g49",
    "g50",
    "g51",
    "g52",
    "g53",
    "g54",
    "g55",
    "g56",
    "g57",
    "g58",
    "g59",
    "g60",
    "o61",
    "o62",
    "o63",
    "o64",
    "o65",
    "o66",
    "o67",
    "o68",
    "o69",
    "o70",
    "o71",
    "o72",
    "o73",
    "o74",
    "o75",
  ];
  const newNums = nums.filter((item) => !exclude.includes(item));

  return newNums[Math.floor(Math.random() * newNums.length)];
}

export function checkForBingo(board: boolean[], pattern?: number[]): boolean {
  let isBingo = false;

  let winningCases = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];

  if (pattern) {
    winningCases = [pattern];
  }

  for (const cases of winningCases) {
    const isAllMarked = !cases.some((index) => !board[index]);

    if (isAllMarked) {
      isBingo = true;
    }
  }

  return isBingo;
}

class BingoService {
  async create(playerId: string) {
    const player = await PlayerRepository.findById(playerId);
    if (!player) return;

    const bingoPlayer: BingoPlayer = {
      ...player,
      board: generateBoard(true),
    };
    const bingo: Bingo = {
      _id: uuidv4().toString(),
      history: [],
      players: [bingoPlayer],
      state: "waiting",
      winner: null,
    };
    BingoRepository.set(bingo._id, bingo);
    return bingo;
  }

  async findById(id: string) {
    return await BingoRepository.findById(id);
  }

  async addPlayer(id: string, player: Player) {
    const bingo = await this.findById(id);
    if (!bingo) return;
    if (!!bingo?.players.find((p) => p._id === player._id)) return;

    const bingoPlayer: BingoPlayer = {
      ...player,
      board: generateBoard(true),
    };
    bingo.players = [...bingo.players, bingoPlayer];

    await BingoRepository.set(id, bingo);

    return bingo;
  }
}

export default new BingoService();
