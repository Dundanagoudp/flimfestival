/**
 * Password Encryption Utility
 * Encrypts sensitive data using AES-256-CBC before transmission.
 * Use for login and other sensitive forms; ensure the backend expects and decrypts the payload.
 *
 * Security Note: This provides defense-in-depth alongside HTTPS.
 * The encryption key is intentionally client-side for transport encryption.
 * Backend performs final validation and bcrypt hashing.
 */

import CryptoJS from "crypto-js";

/**
 * Encrypted payload structure returned by encryptPayload
 */
export interface EncryptedPayload {
  content: string; // Base64 encoded encrypted data
  iv: string; // Hex encoded initialization vector
}

/**
 * Encrypt payload data using AES-256-CBC encryption
 *
 * @param data - Object to encrypt (e.g., {email, password, altchaPayload})
 * @returns Encrypted payload with IV
 * @throws Error if encryption fails or key is not configured
 *
 * @example
 * const encrypted = encryptPayload({
 *   email: "user@example.com",
 *   password: "secret123",
 *   altchaPayload: "captcha_data"
 * });
 * // Returns: { content: "U2FsdGVkX1+...", iv: "abc123..." }
 */
export function encryptPayload(data: unknown): EncryptedPayload {
  try {
    // Get encryption key from environment variable
    const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

    if (!encryptionKey) {
      throw new Error(
        "NEXT_PUBLIC_ENCRYPTION_KEY is not configured in environment variables"
      );
    }

    if (encryptionKey.length !== 64) {
      throw new Error(
        "Invalid encryption key length. Expected 64 hex characters (256 bits)"
      );
    }

    // Generate random 16-byte (128-bit) initialization vector
    // This ensures each encryption is unique even with same data
    const iv = CryptoJS.lib.WordArray.random(16);

    // Parse the hex encryption key to WordArray format
    const key = CryptoJS.enc.Hex.parse(encryptionKey);

    // Convert data to JSON string for encryption
    const dataString = JSON.stringify(data);

    // Encrypt using AES-256-CBC mode with PKCS7 padding
    const encrypted = CryptoJS.AES.encrypt(dataString, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Return encrypted content and IV as strings
    return {
      content: encrypted.toString(), // Base64 encoded ciphertext
      iv: iv.toString(CryptoJS.enc.Hex), // Hex encoded IV
    };
  } catch (error) {
    console.error("Encryption error:", error);

    // Throw a more user-friendly error
    if (error instanceof Error) {
      throw new Error(`Failed to encrypt payload: ${error.message}`);
    }
    throw new Error("Failed to encrypt payload due to unknown error");
  }
}

/**
 * Check if encryption is available and properly configured
 *
 * @returns true if encryption key is configured, false otherwise
 */
export function isEncryptionAvailable(): boolean {
  const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  return !!(encryptionKey && encryptionKey.length === 64);
}

/**
 * Get encryption configuration status (for debugging)
 *
 * @returns Object with encryption configuration details
 */
export function getEncryptionStatus() {
  const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

  return {
    configured: !!encryptionKey,
    keyLength: encryptionKey?.length || 0,
    validKeyLength: encryptionKey?.length === 64,
    available: isEncryptionAvailable(),
  };
}
