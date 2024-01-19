import Axios from "axios";
import { Player } from "../types";

const axios = Axios.create({
  withCredentials: true,
});

export type Uno = {
  _id: string;
  players: Player[];
  winner: any;
  state: "waiting" | "serving" | "playing" | "over";

  createdAt: string;
  updatedAt: string;
};

export async function createUno(): Promise<Uno> {
  const res = await axios.post("/api/unos");
  return res.data;
}

export async function getUno(id: string): Promise<Uno> {
  const res = await axios.get(`/api/unos/${id}`);
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
