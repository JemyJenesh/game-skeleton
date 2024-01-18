import Axios from "axios";

const axios = Axios.create({
  withCredentials: true,
});

type Uno = {
  host: string;
  players: string[];
  winner: any;
  state: string;
  history: any[];
  createdAt: string;
  updatedAt: string;
  _id: string;
  __v: number;
};

export async function createUno(): Promise<Uno> {
  const res = await axios.post("/api/unos");
  return res.data;
}
