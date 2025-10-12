/**
 * Type definitions for Web Crypto Wallet
 */

import type { ExportedWallet, SignedMessage, EncryptedMessage } from './web-crypto-wallet';

/**
 * Interface for WebCryptoWallet class instances
 */
export interface IWebCryptoWallet {
  getSigningPublicKey(): JsonWebKey;
  getEncryptionPublicKey(): JsonWebKey;
  sign(message: string): Promise<SignedMessage>;
  encryptFor(message: string, recipientPublicKeyJwk: JsonWebKey): Promise<string>;
  decryptReceived(encryptedBase64: string): Promise<string>;
  export(): Promise<ExportedWallet>;
  exportPublicKeys(): Promise<{
    signingPublicKey: JsonWebKey;
    encryptionPublicKey: JsonWebKey;
  }>;
}

// Re-export types for convenience
export type { ExportedWallet, SignedMessage, EncryptedMessage };

