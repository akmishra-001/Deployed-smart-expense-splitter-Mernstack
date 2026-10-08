const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Handle both default export and named export for middleware
const protect = authMiddleware.protect || authMiddleware;

// Get function references
const getBalancesHandler = balanceController.getGroupBalances || balanceController.getBalances;
const settleHandler = balanceController.recordSettlement || balanceController.settleBalance;

// Get balances for group (Dono URL patterns support karne ke liye)
router.get('/:groupId', protect, getBalancesHandler);
router.get('/group/:groupId', protect, getBalancesHandler);

// Record settlement
router.post('/settle', protect, settleHandler);

module.exports = router;