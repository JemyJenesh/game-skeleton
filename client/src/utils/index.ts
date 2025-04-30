export * from "../routes";
export * from "./avatars";

export function wordsLoader() {
  return fetch("https://random-word-api.herokuapp.com/word?number=200");
}
