import { shuffleArray } from "../mechanics/utils";
import { PlayingCard } from "./types";


export const shuffleDeck = (deck: PlayingCard[]): PlayingCard[] => {
  return shuffleArray(deck);
};
