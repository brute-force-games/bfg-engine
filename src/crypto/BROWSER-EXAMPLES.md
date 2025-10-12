# Browser Usage Examples

All cryptographic operations run **entirely in the browser** using the Web Crypto API. No server required!

## Requirements

- Modern browser with Web Crypto API support (Chrome, Firefox, Safari, Edge)
- HTTPS or localhost (required by Web Crypto API security model)

## Quick Start in Browser Console

You can test the wallet directly in your browser console:

```javascript
// Import the wallet (if using module system)
import { WebCryptoWallet } from '@brute-force-games/bfg-engine';

// Or if already available in global scope:
const { WebCryptoWallet } = window;

// Create a new wallet
const wallet = await WebCryptoWallet.create();
console.log('✅ Wallet created!');

// Sign a message
const signed = await wallet.sign('Hello from the browser!');
console.log('📝 Signed:', signed);

// Verify the signature
const isValid = await WebCryptoWallet.verify(signed);
console.log('✓ Valid:', isValid);

// Encrypt a secret message with password
const encrypted = await WebCryptoWallet.encryptWithPassword(
  'My secret message',
  'my-password-123'
);
console.log('🔒 Encrypted:', encrypted);

// Decrypt it back
const decrypted = await WebCryptoWallet.decryptWithPassword(
  encrypted,
  'my-password-123'
);
console.log('🔓 Decrypted:', decrypted);
```

## React Component Example

```tsx
import { useState, useEffect } from 'react';
import { WebCryptoWallet, SignedMessage } from '@brute-force-games/bfg-engine';

function WalletDemo() {
  const [wallet, setWallet] = useState<WebCryptoWallet | null>(null);
  const [message, setMessage] = useState('');
  const [signed, setSigned] = useState<SignedMessage | null>(null);
  
  // Create wallet on mount
  useEffect(() => {
    WebCryptoWallet.create().then(setWallet);
  }, []);
  
  const handleSign = async () => {
    if (!wallet) return;
    const signedMsg = await wallet.sign(message);
    setSigned(signedMsg);
  };
  
  const handleVerify = async () => {
    if (!signed) return;
    const isValid = await WebCryptoWallet.verify(signed);
    alert(isValid ? '✅ Valid signature!' : '❌ Invalid signature!');
  };
  
  return (
    <div>
      <h2>Browser Wallet Demo</h2>
      <input 
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Message to sign"
      />
      <button onClick={handleSign}>Sign Message</button>
      
      {signed && (
        <div>
          <pre>{JSON.stringify(signed, null, 2)}</pre>
          <button onClick={handleVerify}>Verify Signature</button>
        </div>
      )}
    </div>
  );
}
```

## Storing Wallet in Browser Storage

```javascript
// Create and save wallet to localStorage
async function createAndSaveWallet() {
  const wallet = await WebCryptoWallet.create();
  const exported = await wallet.export();
  
  // ⚠️ WARNING: This stores private keys in localStorage!
  // Only do this for demo/dev purposes
  localStorage.setItem('my-wallet', JSON.stringify(exported));
  
  return wallet;
}

// Load wallet from localStorage
async function loadWallet() {
  const stored = localStorage.getItem('my-wallet');
  if (!stored) return null;
  
  const exported = JSON.parse(stored);
  return await WebCryptoWallet.fromExport(exported);
}

// Usage
const wallet = await loadWallet() || await createAndSaveWallet();
```

## Player Profile Integration (Browser-Side)

```typescript
import { 
  addPlayerProfile, 
  getPlayerProfile,
  getWalletFromProfile 
} from '@brute-force-games/bfg-engine';

// Create a new player profile (creates wallet automatically)
async function createProfile() {
  const profileId = await addPlayerProfile('MyHandle', 'avatar.jpg');
  console.log('Profile created with ID:', profileId);
  return profileId;
}

// Sign a message with profile's wallet
async function signWithProfile(profileId: string, message: string) {
  const profile = getPlayerProfile(profileId);
  if (!profile) throw new Error('Profile not found');
  
  const wallet = await getWalletFromProfile(profile);
  const signed = await wallet.sign(message);
  
  return signed;
}

// Share public keys with other players
function sharePublicKeys(profileId: string) {
  const profile = getPlayerProfile(profileId);
  if (!profile) return null;
  
  return {
    signingPublicKey: profile.signingPublicKey,
    encryptionPublicKey: profile.encryptionPublicKey,
  };
}
```

## Send Encrypted Message Between Players

```typescript
// Alice wants to send an encrypted message to Bob
async function aliceSendsToBob() {
  // Alice gets her profile and wallet
  const aliceProfile = getPlayerProfile('alice-profile-id');
  const aliceWallet = await getWalletFromProfile(aliceProfile);
  
  // Alice gets Bob's public encryption key
  const bobProfile = getPlayerProfile('bob-profile-id');
  const bobEncryptionKey = bobProfile.encryptionPublicKey;
  
  // Alice encrypts a message for Bob
  const encrypted = await aliceWallet.encryptFor(
    'Secret message for Bob!',
    bobEncryptionKey
  );
  
  // Send encrypted message to Bob (via P2P, etc.)
  return encrypted;
}

// Bob receives and decrypts the message
async function bobReceivesFromAlice(encryptedMessage: string) {
  // Bob gets his profile and wallet
  const bobProfile = getPlayerProfile('bob-profile-id');
  const bobWallet = await getWalletFromProfile(bobProfile);
  
  // Bob decrypts the message
  const decrypted = await bobWallet.decryptReceived(encryptedMessage);
  
  console.log('Bob received:', decrypted);
  return decrypted;
}
```

## Sign Game Moves (Browser-Side)

```typescript
import { createWalletSignedMove, verifySignedMove } from '@brute-force-games/bfg-engine';

// Player signs a game move
async function signGameMove(profileId: string, moveData: any) {
  const profile = getPlayerProfile(profileId);
  const wallet = await getWalletFromProfile(profile);
  
  const signedMove = await createWalletSignedMove(wallet, moveData);
  
  // Send signed move to other players via P2P
  return signedMove;
}

// Other player verifies the move
async function verifyPlayerMove(signedMove: SignedMove) {
  const isValid = await verifySignedMove(signedMove);
  
  if (isValid) {
    // Apply the move to the game state
    const moveData = JSON.parse(signedMove.move);
    console.log('Valid move from:', signedMove.publicKey);
    return moveData;
  } else {
    console.error('Invalid move signature!');
    return null;
  }
}
```

## Export/Import for Backup

```typescript
// Export wallet for backup (show to user to copy)
async function exportWalletForBackup(profileId: string) {
  const profile = getPlayerProfile(profileId);
  const wallet = await getWalletFromProfile(profile);
  
  const exported = await wallet.export();
  
  // Show this to user to save somewhere safe
  const backupData = JSON.stringify(exported, null, 2);
  console.log('⚠️ KEEP THIS SAFE:');
  console.log(backupData);
  
  return backupData;
}

// Import wallet from backup
async function importWalletFromBackup(backupJson: string) {
  const exported = JSON.parse(backupJson);
  const wallet = await WebCryptoWallet.fromExport(exported);
  
  console.log('✅ Wallet restored from backup');
  return wallet;
}

// Create profile from imported wallet
async function createProfileFromBackup(handle: string, backupJson: string) {
  const exported = JSON.parse(backupJson);
  
  const profileData = await createPlayerProfileFromExportedWallet(
    handle,
    exported
  );
  
  // Add to store with timestamps
  const now = Date.now();
  const profileId = createPlayerProfileId();
  
  const completeProfile: PrivatePlayerProfile = {
    id: profileId,
    ...profileData,
    createdAt: now,
    updatedAt: now,
  };
  
  playerProfileStore.setRow('playerProfiles', profileId, completeProfile);
  
  return profileId;
}
```

## Security Best Practices (Browser)

1. **HTTPS Only**: Always use HTTPS in production. Web Crypto API requires secure context.

2. **Private Key Storage**: 
   - Use IndexedDB or localStorage for convenience
   - Consider encrypting with a master password
   - Never send private keys over the network

3. **Password-Based Encryption**:
   - Use strong passwords
   - Consider key derivation for user passwords
   - PBKDF2 with 100,000 iterations is used by default

4. **Public Key Distribution**:
   - Public keys can be freely shared
   - Include in player profiles
   - Send over P2P connections

5. **Signature Verification**:
   - Always verify signatures before trusting messages
   - Check timestamps to prevent replay attacks
   - Validate message structure

## Browser Compatibility

The Web Crypto API is supported in:
- ✅ Chrome 37+
- ✅ Firefox 34+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ All modern mobile browsers

**Note**: Requires secure context (HTTPS or localhost)

## Performance Notes

- Key generation: ~100-500ms (one-time per wallet)
- Signing: ~5-20ms
- Verification: ~5-20ms
- Encryption (RSA): ~5-30ms
- Encryption (AES): ~1-5ms
- All operations are **non-blocking** (async)

## Debugging in Browser Console

```javascript
// Check if Web Crypto is available
console.log('Web Crypto available:', !!window.crypto?.subtle);

// Test basic operations
async function testWallet() {
  console.time('Create wallet');
  const wallet = await WebCryptoWallet.create();
  console.timeEnd('Create wallet');
  
  console.time('Sign message');
  const signed = await wallet.sign('test');
  console.timeEnd('Sign message');
  
  console.time('Verify signature');
  const valid = await WebCryptoWallet.verify(signed);
  console.timeEnd('Verify signature');
  
  console.log('All tests passed:', valid);
}

testWallet();
```

