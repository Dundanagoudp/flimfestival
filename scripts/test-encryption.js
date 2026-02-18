/**
 * Quick test: encryption produces { content, iv } and key is loaded from .env
 * Run: node --env-file=.env scripts/test-encryption.js
 * Or: node scripts/test-encryption.js   (loads .env manually)
 */
const fs = require('fs');
const path = require('path');

// Load .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  });
}

let key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
// Fallback: load .env manually (e.g. if Node < 20.6)
if (!key && fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const line = content.split('\n').find((l) => l.includes('NEXT_PUBLIC_ENCRYPTION_KEY'));
  if (line) {
    const idx = line.indexOf('=');
    if (idx !== -1) key = line.slice(idx + 1).trim();
  }
}
if (!key || key.length !== 64) {
  console.error('FAIL: NEXT_PUBLIC_ENCRYPTION_KEY must be 64 hex chars. key length:', key?.length ?? 0);
  process.exit(1);
}

const CryptoJS = require('crypto-js');
const iv = CryptoJS.lib.WordArray.random(16);
const keyWA = CryptoJS.enc.Hex.parse(key);
const dataString = JSON.stringify({ email: 'test@example.com', password: 'secret' });
const encrypted = CryptoJS.AES.encrypt(dataString, keyWA, {
  iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
});
const payload = {
  content: encrypted.toString(),
  iv: iv.toString(CryptoJS.enc.Hex),
};

if (typeof payload.content !== 'string' || payload.content.length === 0) {
  console.error('FAIL: content missing or empty');
  process.exit(1);
}
if (typeof payload.iv !== 'string' || payload.iv.length !== 32) {
  console.error('FAIL: iv should be 32 hex chars, got', payload.iv?.length);
  process.exit(1);
}

console.log('OK Encryption test passed');
console.log('  encryptedBody shape: { content: base64, iv: hex }');
console.log('  content length:', payload.content.length);
console.log('  iv length:', payload.iv.length);
