import { z } from "zod";
import { WebCryptoWallet, ExportedWallet, SignedMessage } from './web-crypto-wallet';

// Legacy SignedMove schema (for backward compatibility)
export const SignedMoveSchema = z.object({
  move: z.string(),
  signature: z.string(),
  publicKey: z.string(),
});

export type SignedMove = z.infer<typeof SignedMoveSchema>;

/**
 * Create a signed move using the Web Crypto wallet
 */
export async function createWalletSignedMove(wallet: WebCryptoWallet, moveData: any): Promise<SignedMove> {
  const moveStr = JSON.stringify(moveData);
  const signedMessage = await wallet.sign(moveStr);
  
  return {
    move: moveStr,
    signature: signedMessage.signature,
    publicKey: signedMessage.publicKey,
  };
}

/**
 * Verify a signed move
 */
export async function verifySignedMove(signedMove: SignedMove): Promise<boolean> {
  try {
    const signedMessage: SignedMessage = {
      message: signedMove.move,
      signature: signedMove.signature,
      publicKey: signedMove.publicKey,
      timestamp: Date.now(), // Not validated in this context
    };
    
    return await WebCryptoWallet.verify(signedMessage);
  } catch (error) {
    console.error('Error verifying signed move:', error);
    return false;
  }
}

/**
 * Initialize a new wallet with fresh keys
 */
export async function initializeNewWallet() {
  const wallet = await WebCryptoWallet.create();
  const exported = await wallet.export();
  const publicKeys = await wallet.exportPublicKeys();
  
  return {
    exportedWallet: exported,
    signingPublicKey: publicKeys.signingPublicKey,
    encryptionPublicKey: publicKeys.encryptionPublicKey,
  };
}

/**
 * Initialize a wallet from exported keys
 */
export async function initializeWalletFromExport(exported: ExportedWallet) {
  const wallet = await WebCryptoWallet.fromExport(exported);
  const publicKeys = await wallet.exportPublicKeys();
  
  return {
    wallet,
    exportedWallet: exported,
    signingPublicKey: publicKeys.signingPublicKey,
    encryptionPublicKey: publicKeys.encryptionPublicKey,
  };
}

// Re-export wallet types and classes
export { WebCryptoWallet } from './web-crypto-wallet';
export type { ExportedWallet, SignedMessage, EncryptedMessage } from './web-crypto-wallet';

