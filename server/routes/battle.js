import express from 'express';
import BattleResult from '../models/BattleResult.js';

const router = express.Router();

// Get all battle results
router.get('/results', async (req, res) => {
  try {
    const results = await BattleResult.find()
      .sort({ timestamp: -1 })
      .limit(50);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await BattleResult.aggregate([
      {
        $group: {
          _id: '$algorithm',
          avgKeyGenTime: { $avg: '$timeTaken' },
          avgEncryptTime: { 
            $avg: {
              $cond: [{ $eq: ['$operation', 'encrypt'] }, '$timeTaken', null]
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Compare algorithms
router.get('/compare', async (req, res) => {
  try {
    const comparison = await BattleResult.aggregate([
      {
        $group: {
          _id: { algorithm: '$algorithm', operation: '$operation' },
          avgTime: { $avg: '$timeTaken' },
          minTime: { $min: '$timeTaken' },
          maxTime: { $max: '$timeTaken' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(comparison);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await BattleResult.aggregate([
      {
        $group: {
          _id: '$algorithm',
          totalOperations: { $sum: 1 },
          averageTime: { $avg: '$timeTaken' },
          fastestTime: { $min: '$timeTaken' },
          slowestTime: { $max: '$timeTaken' }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;