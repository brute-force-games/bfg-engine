import { z } from "zod";


export const CARD_SUIT_CLUBS = '♣️' as const;
export const CARD_SUIT_DIAMONDS = '♦️' as const;
export const CARD_SUIT_HEARTS = '♥️' as const;
export const CARD_SUIT_SPADES = '♠️' as const;
export const CARD_SUITS = [
  CARD_SUIT_CLUBS,
  CARD_SUIT_DIAMONDS,
  CARD_SUIT_HEARTS,
  CARD_SUIT_SPADES,
] as const;


export const CARD_RANK_ACE = 'A' as const;
export const CARD_RANK_2 = '2' as const;
export const CARD_RANK_3 = '3' as const;
export const CARD_RANK_4 = '4' as const;
export const CARD_RANK_5 = '5' as const;
export const CARD_RANK_6 = '6' as const;
export const CARD_RANK_7 = '7' as const;
export const CARD_RANK_8 = '8' as const;
export const CARD_RANK_9 = '9' as const;
export const CARD_RANK_10 = '10' as const;
export const CARD_RANK_JACK = 'J' as const;
export const CARD_RANK_QUEEN = 'Q' as const;
export const CARD_RANK_KING = 'K' as const;
export const CARD_RANKS = [
  CARD_RANK_ACE,
  CARD_RANK_2,
  CARD_RANK_3,
  CARD_RANK_4,
  CARD_RANK_5,
  CARD_RANK_6,
  CARD_RANK_7,
  CARD_RANK_8,
  CARD_RANK_9,
  CARD_RANK_10,
  CARD_RANK_JACK,
  CARD_RANK_QUEEN,
  CARD_RANK_KING,
] as const;


// Card ranks for standard playing cards
export const CardRankSchema = z.enum(CARD_RANKS);
export type CardRank = z.infer<typeof CardRankSchema>;

// Card suits for standard playing cards
export const CardSuitSchema = z.enum(CARD_SUITS);
export type CardSuit = z.infer<typeof CardSuitSchema>;

// A playing card
export const PlayingCardSchema = z.object({
  rank: CardRankSchema,
  suit: CardSuitSchema,
});

export type PlayingCard = z.infer<typeof PlayingCardSchema>;

export const PlayingCardIdSchema = z.string().brand('PlayingCardId');
export type PlayingCardId = z.infer<typeof PlayingCardIdSchema>;


// Create a playing card ID from a playing card
export const createCardId = (card: PlayingCard): PlayingCardId => {
  return `${card.rank}${card.suit}` as PlayingCardId;
};

export const parseCardId = (cardId: PlayingCardId): PlayingCard => {
  const rank = cardId.slice(0, -1);
  const suit = cardId.slice(-1);
  return {
    rank: rank as CardRank,
    suit: suit as CardSuit,
  };
};
