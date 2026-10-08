const Expense = require('../models/Expense.js');
const Group = require('../models/Group.js');

// @desc    Calculate balances & simplified settlements for a group
// @route   GET /api/balances/:groupId
// @access  Private
const getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate('members', 'name email');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const expenses = await Expense.find({ groupId });

    // Net balance mapping for each member
    const balances = {};
    group.members.forEach((m) => {
      balances[m._id.toString()] = 0;
    });

    // Calculate paid (+) vs split (-)
    expenses.forEach((exp) => {
      const payerId = exp.paidBy.toString();
      const splitList = exp.splitBetween && exp.splitBetween.length > 0 ? exp.splitBetween : group.members;
      const splitCount = splitList.length;

      if (splitCount > 0) {
        const amountPerPerson = exp.amount / splitCount;

        if (balances[payerId] !== undefined) {
          balances[payerId] += exp.amount;
        }

        splitList.forEach((mId) => {
          const memberStr = mId.toString();
          if (balances[memberStr] !== undefined) {
            balances[memberStr] -= amountPerPerson;
          }
        });
      }
    });

    // Generate simplified debt transfers (Who owes Whom)
    const debtors = [];
    const creditors = [];

    const memberMap = {};
    group.members.forEach((m) => {
      memberMap[m._id.toString()] = m.name || m.email;
    });

    Object.entries(balances).forEach(([memberId, netBalance]) => {
      const roundedVal = Math.round(netBalance * 100) / 100;
      if (roundedVal < -0.01) {
        debtors.push({ id: memberId, name: memberMap[memberId] || 'User', amount: -roundedVal });
      } else if (roundedVal > 0.01) {
        creditors.push({ id: memberId, name: memberMap[memberId] || 'User', amount: roundedVal });
      }
    });

    const settlements = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debt = debtors[i];
      const cred = creditors[j];

      const minAmount = Math.min(debt.amount, cred.amount);
      settlements.push({
        from: debt.id,
        fromName: debt.name,
        to: cred.id,
        toName: cred.name,
        amount: Math.round(minAmount * 100) / 100,
      });

      debt.amount -= minAmount;
      cred.amount -= minAmount;

      if (debt.amount < 0.01) i++;
      if (cred.amount < 0.01) j++;
    }

    res.status(200).json({
      success: true,
      balances,
      settlements,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Settle amount between two members
// @route   POST /api/balances/settle
// @access  Private
const recordSettlement = async (req, res) => {
  try {
    const { groupId, from, to, amount } = req.body;

    if (!groupId || !to || !amount) {
      return res.status(400).json({ message: 'Please provide groupId, recipient and amount' });
    }

    const payer = from || req.user._id;

    const settlementExpense = await Expense.create({
      groupId,
      description: 'Settlement Payment',
      amount: Number(amount),
      paidBy: payer,
      splitBetween: [to],
    });

    res.status(201).json({
      success: true,
      message: 'Settlement recorded successfully',
      data: settlementExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGroupBalances,
  recordSettlement,
};