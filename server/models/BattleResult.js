import mongoose from 'mongoose';

const battleResultSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
  },
  algorithm: {
    type: String,
    enum: ['RSA', 'ECC'],
    required: true,
  },
  keySize: {
    type: Number,
    required: true,
  },
  operation: {
    type: String,
    enum: ['keygen', 'encrypt', 'decrypt', 'sign', 'verify'],
    required: true,
  },
  timeTaken: {
    type: Number,
    required: true,
  },
  messageLength: {
    type: Number,
    required: true,
  },
  success: {
    type: Boolean,
    default: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('BattleResult', battleResultSchema);