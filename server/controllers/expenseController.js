const Expense = require('../models/Expense.js');
const Group = require('../models/Group.js');

// @desc    Add a new expense to a group
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
  try {
    const { groupId, description, amount, splitBetween } = req.body;

    if (!groupId || !description || !amount) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const expense = await Expense.create({
      groupId,
      description,
      amount: Number(amount),
      paidBy: req.user._id,
      splitBetween: splitBetween && splitBetween.length > 0 ? splitBetween : group.members,
    });

    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name email')
      .populate('splitBetween', 'name email');

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: populatedExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all expenses for a group
// @route   GET /api/expenses/:groupId
// @access  Private
const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ groupId })
      .populate('paidBy', 'name email')
      .populate('splitBetween', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing expense
// @route   PUT /api/expenses/:expenseId
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { description, amount, splitBetween } = req.body;

    let expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (description) expense.description = description;
    if (amount) expense.amount = amount;
    if (splitBetween) expense.splitBetween = splitBetween;

    await expense.save();

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:expenseId
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addExpense,
  getGroupExpenses,
  updateExpense,
  deleteExpense,
};