export * from "./avatars";
export * from "./router";

export function wordsLoader() {
  return fetch("https://random-word-api.herokuapp.com/word?number=200");
}
