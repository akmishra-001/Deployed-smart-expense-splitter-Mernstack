const express = require('express');
const router = express.Router();
const { 
  addExpense, 
  getGroupExpenses, 
  updateExpense, 
  deleteExpense 
} = require('../controllers/expenseController.js');

// Middleware import (Handle both default and named exports)
const authModule = require('../middleware/authMiddleware.js');
const authMiddleware = typeof authModule === 'function' ? authModule : (authModule.authMiddleware || authModule.protect);

// POST: Naya expense add karne ke liye
router.post('/', authMiddleware, addExpense);

// GET: Group ke expenses fetch karne ke liye
router.get('/:groupId', authMiddleware, getGroupExpenses);
router.get('/group/:groupId', authMiddleware, getGroupExpenses);

// PUT & DELETE: Expense update aur delete karne ke liye
router.put('/:expenseId', authMiddleware, updateExpense);
router.delete('/:expenseId', authMiddleware, deleteExpense);

module.exports = router;