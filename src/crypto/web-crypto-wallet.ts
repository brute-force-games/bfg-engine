/**
 * Web Crypto API Wallet Implementation
 * Simple RSA-based wallet for signing/verification and encryption/decryption
 */

// ==================== Types ====================

export interface SignedMessage {
  message: string;
  signature: string;
  publicKey: string;
  timestamp: number;
}

export interface EncryptedMessage {
  ciphertext: string;
  iv: string;
  salt: string;
}

export interface ExportedWallet {
  signingKeyPair: {
    privateKey: JsonWebKey;
    publicKey: JsonWebKey;
  };
  encryptionKeyPair: {
    privateKey: JsonWebKey;
    publicKey: JsonWebKey;
  };
}

// ==================== Key Generation ====================

/**
 * Generate RSA-PSS key pair for signing
 */
async function generateSigningKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    {
      name: 'RSA-PSS',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify']
  );
}

/**
 * Generate RSA-OAEP key pair for encryption
 */
async function generateEncryptionKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );
}

// ==================== Signing & Verification ====================

/**
 * Sign a message with a private key
 */
export async function signMessage(
  privateKey: CryptoKey,
  publicKeyJwk: JsonWebKey,
  message: string
): Promise<SignedMessage> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  const signature = await crypto.subtle.sign(
    {
      name: 'RSA-PSS',
      saltLength: 32,
    },
    privateKey,
    data
  );
  
  return {
    message,
    signature: arrayBufferToBase64(signature),
    publicKey: JSON.stringify(publicKeyJwk),
    timestamp: Date.now(),
  };
}

/**
 * Verify a signed message
 */
export async function verifySignedMessage(signedMessage: SignedMessage): Promise<boolean> {
  try {
    const publicKeyJwk = JSON.parse(signedMessage.publicKey);
    const publicKey = await crypto.subtle.importKey(
      'jwk',
      publicKeyJwk,
      {
        name: 'RSA-PSS',
        hash: 'SHA-256',
      },
      false,
      ['verify']
    );
    
    const encoder = new TextEncoder();
    const data = encoder.encode(signedMessage.message);
    const signature = base64ToArrayBuffer(signedMessage.signature);
    
    return await crypto.subtle.verify(
      {
        name: 'RSA-PSS',
        saltLength: 32,
      },
      publicKey,
      signature,
      data
    );
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}

// ==================== Encryption & Decryption ====================

/**
 * Encrypt a message using AES-GCM with a password
 */
export async function encryptMessage(message: string, password: string): Promise<EncryptedMessage> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // Generate salt
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  
  // Generate IV
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  
  // Derive key from password
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  // Encrypt
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  );
  
  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv.buffer),
    salt: arrayBufferToBase64(salt.buffer),
  };
}

/**
 * Decrypt a message using AES-GCM with a password
 */
export async function decryptMessage(encrypted: EncryptedMessage, password: string): Promise<string> {
  const encoder = new TextEncoder();
  
  // Decode encrypted data
  const ciphertext = base64ToArrayBuffer(encrypted.ciphertext);
  const iv = base64ToArrayBuffer(encrypted.iv);
  const salt = base64ToArrayBuffer(encrypted.salt);
  
  // Derive key from password
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    ciphertext
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

/**
 * Encrypt a message for a specific public key (RSA-OAEP)
 */
export async function encryptMessageForPublicKey(
  message: string,
  publicKeyJwk: JsonWebKey
): Promise<string> {
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    publicKeyJwk,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt']
  );
  
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    publicKey,
    data
  );
  
  return arrayBufferToBase64(encrypted);
}

/**
 * Decrypt a message with a private key (RSA-OAEP)
 */
export async function decryptMessageWithPrivateKey(
  encryptedBase64: string,
  privateKey: CryptoKey
): Promise<string> {
  const encrypted = base64ToArrayBuffer(encryptedBase64);
  
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP',
    },
    privateKey,
    encrypted
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

// ==================== Utility Functions ====================

/**
 * Convert ArrayBuffer to Base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// ==================== Wallet Class ====================

/**
 * Web Crypto Wallet Class
 * Implements secure cryptographic operations using browser Web Crypto API
 */
export class WebCryptoWallet {
  private signingKeyPair: CryptoKeyPair | null = null;
  private encryptionKeyPair: CryptoKeyPair | null = null;
  private signingPublicKeyJwk: JsonWebKey | null = null;
  private encryptionPublicKeyJwk: JsonWebKey | null = null;

  private constructor() {}

  /**
   * Create a new wallet with fresh key pairs
   */
  static async create(): Promise<WebCryptoWallet> {
    const wallet = new WebCryptoWallet();
    await wallet.generateKeys();
    return wallet;
  }

  /**
   * Import wallet from exported key pairs
   */
  static async fromExport(exported: ExportedWallet): Promise<WebCryptoWallet> {
    const wallet = new WebCryptoWallet();
    await wallet.importKeys(exported);
    return wallet;
  }

  /**
   * Generate new key pairs
   */
  private async generateKeys(): Promise<void> {
    this.signingKeyPair = await generateSigningKeyPair();
    this.encryptionKeyPair = await generateEncryptionKeyPair();
    
    this.signingPublicKeyJwk = await crypto.subtle.exportKey('jwk', this.signingKeyPair.publicKey);
    this.encryptionPublicKeyJwk = await crypto.subtle.exportKey('jwk', this.encryptionKeyPair.publicKey);
  }

  /**
   * Import key pairs from JWK format
   */
  private async importKeys(exported: ExportedWallet): Promise<void> {
    // Import signing keys
    const signingPrivateKey = await crypto.subtle.importKey(
      'jwk',
      exported.signingKeyPair.privateKey,
      {
        name: 'RSA-PSS',
        hash: 'SHA-256',
      },
      true,
      ['sign']
    );

    const signingPublicKey = await crypto.subtle.importKey(
      'jwk',
      exported.signingKeyPair.publicKey,
      {
        name: 'RSA-PSS',
        hash: 'SHA-256',
      },
      true,
      ['verify']
    );

    this.signingKeyPair = {
      privateKey: signingPrivateKey,
      publicKey: signingPublicKey,
    };
    this.signingPublicKeyJwk = exported.signingKeyPair.publicKey;

    // Import encryption keys
    const encryptionPrivateKey = await crypto.subtle.importKey(
      'jwk',
      exported.encryptionKeyPair.privateKey,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['decrypt']
    );

    const encryptionPublicKey = await crypto.subtle.importKey(
      'jwk',
      exported.encryptionKeyPair.publicKey,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['encrypt']
    );

    this.encryptionKeyPair = {
      privateKey: encryptionPrivateKey,
      publicKey: encryptionPublicKey,
    };
    this.encryptionPublicKeyJwk = exported.encryptionKeyPair.publicKey;
  }

  /**
   * Get the public key for signing (as JWK)
   */
  getSigningPublicKey(): JsonWebKey {
    if (!this.signingPublicKeyJwk) {
      throw new Error('Wallet not initialized');
    }
    return this.signingPublicKeyJwk;
  }

  /**
   * Get the public key for encryption (as JWK)
   */
  getEncryptionPublicKey(): JsonWebKey {
    if (!this.encryptionPublicKeyJwk) {
      throw new Error('Wallet not initialized');
    }
    return this.encryptionPublicKeyJwk;
  }

  /**
   * Sign a message
   */
  async sign(message: string): Promise<SignedMessage> {
    if (!this.signingKeyPair || !this.signingPublicKeyJwk) {
      throw new Error('Wallet not initialized');
    }
    return signMessage(
      this.signingKeyPair.privateKey,
      this.signingPublicKeyJwk,
      message
    );
  }

  /**
   * Verify a signed message (static method)
   */
  static async verify(signedMessage: SignedMessage): Promise<boolean> {
    return verifySignedMessage(signedMessage);
  }

  /**
   * Encrypt a message with password (static method)
   */
  static async encryptWithPassword(message: string, password: string): Promise<EncryptedMessage> {
    return encryptMessage(message, password);
  }

  /**
   * Decrypt a message with password (static method)
   */
  static async decryptWithPassword(encrypted: EncryptedMessage, password: string): Promise<string> {
    return decryptMessage(encrypted, password);
  }

  /**
   * Encrypt a message for a recipient's public key
   */
  async encryptFor(message: string, recipientPublicKeyJwk: JsonWebKey): Promise<string> {
    return encryptMessageForPublicKey(message, recipientPublicKeyJwk);
  }

  /**
   * Encrypt a message for a recipient's public key (static method)
   */
  static async encryptForPublicKey(message: string, recipientPublicKeyJwk: JsonWebKey): Promise<string> {
    return encryptMessageForPublicKey(message, recipientPublicKeyJwk);
  }

  /**
   * Decrypt a message sent to this wallet
   */
  async decryptReceived(encryptedBase64: string): Promise<string> {
    if (!this.encryptionKeyPair) {
      throw new Error('Wallet not initialized');
    }
    return decryptMessageWithPrivateKey(encryptedBase64, this.encryptionKeyPair.privateKey);
  }

  /**
   * Export wallet data (WARNING: Contains sensitive private keys!)
   */
  async export(): Promise<ExportedWallet> {
    if (!this.signingKeyPair || !this.encryptionKeyPair) {
      throw new Error('Wallet not initialized');
    }
    
    const signingPrivateKeyJwk = await crypto.subtle.exportKey('jwk', this.signingKeyPair.privateKey);
    const signingPublicKeyJwk = await crypto.subtle.exportKey('jwk', this.signingKeyPair.publicKey);
    const encryptionPrivateKeyJwk = await crypto.subtle.exportKey('jwk', this.encryptionKeyPair.privateKey);
    const encryptionPublicKeyJwk = await crypto.subtle.exportKey('jwk', this.encryptionKeyPair.publicKey);
    
    return {
      signingKeyPair: {
        privateKey: signingPrivateKeyJwk,
        publicKey: signingPublicKeyJwk,
      },
      encryptionKeyPair: {
        privateKey: encryptionPrivateKeyJwk,
        publicKey: encryptionPublicKeyJwk,
      },
    };
  }

  /**
   * Export only public keys (safe to share)
   */
  async exportPublicKeys(): Promise<{
    signingPublicKey: JsonWebKey;
    encryptionPublicKey: JsonWebKey;
  }> {
    if (!this.signingPublicKeyJwk || !this.encryptionPublicKeyJwk) {
      throw new Error('Wallet not initialized');
    }
    
    return {
      signingPublicKey: this.signingPublicKeyJwk,
      encryptionPublicKey: this.encryptionPublicKeyJwk,
    };
  }
}

