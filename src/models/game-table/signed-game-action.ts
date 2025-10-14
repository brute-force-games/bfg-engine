import { z } from "zod";
import { BfgGameTableActionId, BfgGameTableId } from "@bfg-engine/models/types/bfg-branded-ids";
import { GameTableActionSourceSchema, GameTableActionTypeSchema } from "./game-table-action";
import { getWalletFromProfile } from "../player-profile/private-player-profile";
import { createWalletSignedMove } from "@bfg-engine/crypto/crypto-utils";

/**
 * Signed game action - includes digital signature for player moves
 * This ensures that moves are authentic and haven't been tampered with
 */

export const SignedGameTableActionSchema = z.object({
  id: BfgGameTableActionId.idSchema,
  gameTableId: BfgGameTableId.idSchema,
  previousActionId: BfgGameTableActionId.idSchema.nullable(),
  
  source: GameTableActionSourceSchema,
  actionType: GameTableActionTypeSchema,
  
  // The actual game action data
  actionJson: z.string(),
  actionOutcomeGameStateJson: z.string(),
  
  // Digital signature for player moves (optional for host actions)
  signature: z.object({
    move: z.string(),        // JSON stringified move data
    signature: z.string(),   // Base64 encoded signature
    publicKey: z.string(),   // PEM formatted public key for verification
  }).optional(),
  
  // Player ID who made this move (for verification)
  playerId: z.string().optional(),
  
  createdAt: z.date(),
  realmId: z.string().optional(),
});

export type SignedGameTableAction = z.infer<typeof SignedGameTableActionSchema>;

/**
 * Create a signed game action from an existing game action
 */
export const createSignedGameAction = async (
  gameAction: any,
  playerProfile?: any, // Updated to accept player profile instead of privateKey
  playerId?: string
): Promise<SignedGameTableAction> => {
  let signature = undefined;
  
  // Only sign player moves, not host actions
  if (playerProfile && playerId && gameAction.source?.includes('player')) {
    
    const wallet = await getWalletFromProfile(playerProfile);
    
    // Create signature for the action
    const moveData = {
      actionType: gameAction.actionType,
      actionJson: gameAction.actionJson,
      playerId,
      gameTableId: gameAction.gameTableId,
      previousActionId: gameAction.previousActionId,
      timestamp: gameAction.createdAt,
    };
    
    const signedMove = await createWalletSignedMove(wallet, moveData);
    signature = signedMove;
  }
  
  return {
    ...gameAction,
    signature,
    playerId,
  };
};

/**
 * Verify a signed game action
 */
export const verifySignedGameAction = async (signedAction: SignedGameTableAction): Promise<boolean> => {
  // Host actions don't need signatures
  if (signedAction.source?.includes('host') || !signedAction.signature) {
    return true;
  }
  
  // Verify player actions have signatures
  if (!signedAction.signature) {
    console.error('Player action missing signature:', signedAction);
    return false;
  }
  
  try {
    const { verifySignedMove } = await import('~/crypto/crypto-utils');
    return await verifySignedMove(signedAction.signature);
  } catch (error) {
    console.error('Error verifying signed game action:', error);
    return false;
  }
};

/**
 * Schema for new signed game actions (before database storage)
 */
export const NewSignedGameTableActionSchema = SignedGameTableActionSchema.omit({
  id: true,
  gameTableId: true,
  previousActionId: true,
});

export type NewSignedGameTableAction = z.infer<typeof NewSignedGameTableActionSchema>;
