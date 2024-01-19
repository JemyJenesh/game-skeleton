import Axios from "axios";
import { Player } from "../types";

const axios = Axios.create({
  withCredentials: true,
});

export const UNO_COLORS = [
  "red",
  "yellow",
  "blue",
  "green",
  // "wild"
] as const;
export const UNO_VALUES = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  // "draw-two",
  // "skip",
  // "reverse",
  // "wild",
  // "wild-four",
] as const;

export type UnoColor = (typeof UNO_COLORS)[number];
export type UnoValue = (typeof UNO_VALUES)[number];
export type UnoCard = {
  _id: string;
  color: UnoColor;
  value: UnoValue;
  name: string;
};
export type Uno = {
  _id: string;
  deck: UnoCard[];
  pile: UnoCard[];
  hands: UnoCard[][];
  turn: number;
  direction: -1 | 1;
  state: "waiting" | "serving" | "playing" | "over";
  winner: Player | null;
  players: Player[];
};

export async function createUno(): Promise<Uno> {
  const res = await axios.post("/api/unos");
  return res.data;
}

export async function getUno(id: string): Promise<Uno> {
  const res = await axios.get(`/api/unos/${id}`);
  return res.data;
}

export async function updateUno({
  id,
  uno,
}: {
  id: string;
  uno: Partial<Uno>;
}): Promise<Uno> {
  const res = await axios.put(`/api/unos/${id}`, uno);
  return res.data;
}

export async function joinUno(id: string): Promise<Uno> {
  const res = await axios.post(`/api/unos/${id}/join`);
  return res.data;
}

export async function serveCard(id: string): Promise<Uno> {
  const res = await axios.put(`/api/unos/${id}/serve`);
  return res.data;
}
