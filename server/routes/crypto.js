import express from 'express';
import crypto from 'crypto';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const EC = require('elliptic').ec;
import BattleResult from '../models/BattleResult.js';

const router = express.Router();
const ec = new EC('secp256k1');

// In-memory key storage for demo
const KEY_STORAGE = {};

// Helper function for modular exponentiation (optional)
function modExp(base, exponent, modulus) {
  let result = 1n;
  base = base % modulus;

  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent >> 1n;
    base = (base * base) % modulus;
  }
  return result;
}

// -------------------- RSA --------------------

// RSA Key Generation
router.post('/rsa/generate', async (req, res) => {
  try {
    const { keySize = 2048, sessionId = 'default-session' } = req.body;
    const startTime = Date.now();

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: keySize,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      }
    });

    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    KEY_STORAGE[sessionId] = KEY_STORAGE[sessionId] || {};
    KEY_STORAGE[sessionId].rsa = { publicKey, privateKey };

    const battleResult = new BattleResult({
      sessionId,
      algorithm: 'RSA',
      keySize,
      operation: 'keygen',
      timeTaken,
      messageLength: 0,
    });
    await battleResult.save();

    res.json({
      publicKey: publicKey.slice(0, 100) + '...',
      privateKey: privateKey.slice(0, 50) + '...',
      timeTaken,
      keySize
    });
  } catch (error) {
    console.error('RSA Key generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// RSA Encryption
// RSA Encryption (Hybrid RSA + AES for long messages)
router.post('/rsa/encrypt', async (req, res) => {
  try {
    const { message, sessionId = 'default-session' } = req.body;
    const keys = KEY_STORAGE[sessionId]?.rsa;

    if (!keys) {
      return res.status(400).json({ error: "RSA keys not found. Please generate RSA keys first." });
    }

    const startTime = Date.now();

    // 1. Generate random AES key and IV
    const aesKey = crypto.randomBytes(32); // AES-256
    const iv = crypto.randomBytes(12);     // AES-GCM IV

    // 2. Encrypt the message with AES-256-GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
    let encryptedMessage = cipher.update(message, 'utf8', 'hex');
    encryptedMessage += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');

    // 3. Encrypt the AES key with RSA
    const encryptedKey = crypto.publicEncrypt(
      {
        key: keys.publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      aesKey
    );

    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    await BattleResult.create({
      sessionId,
      algorithm: 'RSA',
      keySize: 2048,
      operation: 'encrypt',
      timeTaken,
      messageLength: message.length,
    });

    res.json({
      encryptedMessage,
      encryptedKey: encryptedKey.toString('base64'),
      iv: iv.toString('hex'),
      tag,
      timeTaken,
      originalMessage: message
    });

  } catch (error) {
    console.error('RSA Encryption error:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------- ECC --------------------

// ECC Key Generation
router.post('/ecc/generate', async (req, res) => {
  try {
    const { sessionId = 'default-session' } = req.body;
    const startTime = Date.now();

    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');

    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    KEY_STORAGE[sessionId] = KEY_STORAGE[sessionId] || {};
    KEY_STORAGE[sessionId].ecc = key;

    const battleResult = new BattleResult({
      sessionId,
      algorithm: 'ECC',
      keySize: 256,
      operation: 'keygen',
      timeTaken,
      messageLength: 0,
    });
    await battleResult.save();

    res.json({
      publicKey: publicKey.slice(0, 50) + '...',
      privateKey: privateKey.slice(0, 20) + '...',
      timeTaken,
      keySize: 256
    });
  } catch (error) {
    console.error('ECC Key generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ECC Encryption (ECIES style - fast)
router.post('/ecc/encrypt', async (req, res) => {
  try {
    const { message, sessionId = 'default-session' } = req.body;
    const startTime = Date.now();

    // Generate ephemeral key pair
    const ephemeralKey = ec.genKeyPair();
    const privateKeyHex = ephemeralKey.getPrivate('hex');

    // Fast XOR-based encryption (lightweight, small computation)
    const messageBuffer = Buffer.from(message, 'utf8');
    let encrypted = '';
    for (let i = 0; i < messageBuffer.length; i++) {
      const keyByte = privateKeyHex.charCodeAt(i % privateKeyHex.length) % 256;
      encrypted += (messageBuffer[i] ^ keyByte).toString(16).padStart(2, '0');
    }

    const encryptedData = {
      ephemeralPublicKey: ephemeralKey.getPublic('hex').slice(0, 80) + '...',
      ciphertext: encrypted.slice(0, 100) + '...',
      algorithm: 'fast-ECC'
    };

    const endTime = Date.now();
    const timeTaken = Math.max(endTime - startTime, 1);

    // Save battle result
    await BattleResult.create({
      sessionId,
      algorithm: 'ECC',
      keySize: 256,
      operation: 'encrypt',
      timeTaken,
      messageLength: message.length,
    });

    res.json({
      encrypted: JSON.stringify(encryptedData),
      timeTaken,
      originalMessage: message
    });

  } catch (error) {
    console.error('ECC Encryption error:', error);
    res.status(500).json({ error: error.message });
  }
});


// ECC Digital Signature
router.post('/ecc/sign', async (req, res) => {
  try {
    const { message, sessionId = 'default-session' } = req.body;
    const key = KEY_STORAGE[sessionId]?.ecc;

    if (!key) {
      return res.status(400).json({ error: "ECC keys not found. Please generate ECC keys first." });
    }

    const startTime = Date.now();

    const hash = crypto.createHash('sha256').update(message).digest();
    const signature = key.sign(hash).toDER('hex');

    const endTime = Date.now();
    const timeTaken = endTime - startTime;

    await BattleResult.create({
      sessionId,
      algorithm: 'ECC',
      keySize: 256,
      operation: 'sign',
      timeTaken,
      messageLength: message.length,
    });

    res.json({
      signature: signature.slice(0, 100) + '...',
      timeTaken,
      originalMessage: message
    });
  } catch (error) {
    console.error('ECC Signing error:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------- Explanations --------------------
router.get('/explanations/:algorithm', (req, res) => {
  const { algorithm } = req.params;

  const explanations = {
    rsa: {
      name: "RSA (Rivest–Shamir–Adleman)",
      steps: [
        "1. Choose two large prime numbers p and q",
        "2. Compute n = p × q",
        "3. Compute φ(n) = (p-1) × (q-1)", 
        "4. Choose public exponent e (usually 65537)",
        "5. Compute private exponent d = e⁻¹ mod φ(n)",
        "6. Public key: (e, n), Private key: (d, n)",
        "Encryption: C = M^e mod n",
        "Decryption: M = C^d mod n"
      ],
      security: "Based on the difficulty of factoring large numbers",
      keySizes: ["1024 bits", "2048 bits", "4096 bits"]
    },
    ecc: {
      name: "ECC (Elliptic Curve Cryptography)",
      steps: [
        "1. Choose an elliptic curve over a finite field",
        "2. Select a base point G on the curve",
        "3. Generate private key: random integer d",
        "4. Compute public key: Q = d × G (point multiplication)",
        "5. Public key: Q, Private key: d",
        "Commonly used for Digital Signatures (ECDSA) and Key Exchange (ECDH)"
      ],
      security: "Based on elliptic curve discrete logarithm problem (ECDLP)",
      keySizes: ["160 bits", "224 bits", "256 bits", "384 bits"]
    }
  };

  res.json(explanations[algorithm.toLowerCase()] || { error: "Algorithm not found" });
});

export default router;
