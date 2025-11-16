import { CARD_RANKS, CARD_SUITS, PlayingCard } from "./types";
import { shuffleDeck } from "./utils";


export const createStandardDeck = (): PlayingCard[] => {
  const ranks = CARD_RANKS;
  const suits = CARD_SUITS;
  
  const deck: PlayingCard[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  
  return deck;
};


export const createShuffledDeck = (): PlayingCard[] => {
  const deck = createStandardDeck();
  return shuffleDeck(deck);
};
