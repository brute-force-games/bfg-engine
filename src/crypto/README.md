# Web Crypto Wallet System

This module provides a secure wallet implementation using the Web Crypto API for cryptographic operations.

## Features

- **RSA Key Pairs**: Separate key pairs for signing (RSA-PSS) and encryption (RSA-OAEP)
- **Message Signing**: Sign and verify messages with RSA-PSS
- **Encryption**: 
  - Password-based encryption with AES-GCM
  - Public key encryption with RSA-OAEP
- **Import/Export**: Easily export and import wallets in JWK format
- **No Dependencies**: Uses only Web Crypto API (built into browsers)

## Basic Usage

### Creating a New Wallet

```typescript
import { WebCryptoWallet } from '~/crypto/web-crypto-wallet';

// Create a new wallet with fresh keys
const wallet = await WebCryptoWallet.create();

// Get public keys (safe to share)
const signingPublicKey = wallet.getSigningPublicKey();
const encryptionPublicKey = wallet.getEncryptionPublicKey();
```

### Signing and Verifying Messages

```typescript
// Sign a message
const signedMessage = await wallet.sign("Hello, World!");

// Verify a signed message (static method, no wallet needed)
const isValid = await WebCryptoWallet.verify(signedMessage);
console.log('Signature valid:', isValid);
```

### Encrypting and Decrypting

#### Password-Based Encryption

```typescript
// Encrypt with password
const encrypted = await WebCryptoWallet.encryptWithPassword(
  "Secret message",
  "my-secure-password"
);

// Decrypt with password
const decrypted = await WebCryptoWallet.decryptWithPassword(
  encrypted,
  "my-secure-password"
);
```

#### Public Key Encryption

```typescript
// Encrypt for a recipient
const recipientPublicKey = recipient.getEncryptionPublicKey();
const encryptedMessage = await wallet.encryptFor(
  "Secret message",
  recipientPublicKey
);

// Recipient decrypts
const decryptedMessage = await recipient.decryptReceived(encryptedMessage);
```

### Exporting and Importing Wallets

```typescript
// Export wallet (includes private keys - keep secure!)
const exported = await wallet.export();

// Save to secure storage
localStorage.setItem('wallet', JSON.stringify(exported));

// Later, restore from storage
const storedWallet = JSON.parse(localStorage.getItem('wallet'));
const restoredWallet = await WebCryptoWallet.fromExport(storedWallet);

// Export only public keys (safe to share)
const publicKeys = await wallet.exportPublicKeys();
```

## Integration with Player Profiles

The wallet system is integrated with player profiles for identity management.

### Creating a Profile with Wallet

```typescript
import { addPlayerProfile } from '~/tb-store/player-profile-store';

// Create a new profile (automatically creates a wallet)
const profileId = await addPlayerProfile('PlayerHandle', 'avatar-url.jpg');
```

### Using a Profile's Wallet

```typescript
import { getPlayerProfile } from '~/tb-store/player-profile-store';
import { getWalletFromProfile } from '~/models/player-profile/private-player-profile';

// Get profile
const profile = getPlayerProfile(profileId);

// Get wallet instance
const wallet = await getWalletFromProfile(profile);

// Sign a message with the profile's wallet
const signed = await wallet.sign("My message");

// Public keys are already in the profile
console.log('Signing public key:', profile.signingPublicKey);
console.log('Encryption public key:', profile.encryptionPublicKey);
```

### Creating Signed Game Moves

```typescript
import { createWalletSignedMove } from '~/crypto/crypto-utils';

const moveData = {
  type: 'move',
  position: [3, 4],
  timestamp: Date.now(),
};

const signedMove = await createWalletSignedMove(wallet, moveData);

// Later, verify the move
const isValid = await verifySignedMove(signedMove);
```

## Security Considerations

1. **Private Keys**: Never expose private keys or exported wallets. Store them securely.
2. **Password Strength**: Use strong passwords for password-based encryption.
3. **Key Storage**: The player profile store uses localStorage with TinyBase persistence.
4. **HTTPS Only**: Web Crypto API requires a secure context (HTTPS or localhost).

## API Reference

### WebCryptoWallet Class

#### Static Methods

- `WebCryptoWallet.create()`: Create a new wallet with fresh keys
- `WebCryptoWallet.fromExport(exported)`: Import wallet from exported data
- `WebCryptoWallet.verify(signedMessage)`: Verify a signed message
- `WebCryptoWallet.encryptWithPassword(message, password)`: Encrypt with password
- `WebCryptoWallet.decryptWithPassword(encrypted, password)`: Decrypt with password
- `WebCryptoWallet.encryptForPublicKey(message, publicKey)`: Encrypt for public key

#### Instance Methods

- `wallet.getSigningPublicKey()`: Get signing public key (JWK)
- `wallet.getEncryptionPublicKey()`: Get encryption public key (JWK)
- `wallet.sign(message)`: Sign a message
- `wallet.encryptFor(message, recipientPublicKey)`: Encrypt for recipient
- `wallet.decryptReceived(encrypted)`: Decrypt received message
- `wallet.export()`: Export wallet (includes private keys)
- `wallet.exportPublicKeys()`: Export only public keys

### Types

```typescript
interface SignedMessage {
  message: string;
  signature: string;
  publicKey: string;  // JWK as JSON string
  timestamp: number;
}

interface EncryptedMessage {
  ciphertext: string;
  iv: string;
  salt: string;
}

interface ExportedWallet {
  signingKeyPair: {
    privateKey: JsonWebKey;
    publicKey: JsonWebKey;
  };
  encryptionKeyPair: {
    privateKey: JsonWebKey;
    publicKey: JsonWebKey;
  };
}
```

## Migration from Legacy System

If you have legacy profiles using the old BCH wallet system, they will continue to work. New profiles automatically use the Web Crypto wallet system.

Legacy profile fields:
- `walletMnemonic` (optional)
- `walletAddress` (optional)
- `walletPublicKey` (optional)

New profile fields:
- `webCryptoWallet` (required for new profiles)
- `signingPublicKey` (required for new profiles)
- `encryptionPublicKey` (required for new profiles)
- `identityType: 'webcrypto'`

