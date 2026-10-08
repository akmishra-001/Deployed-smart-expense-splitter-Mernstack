const Group = require('../models/Group');
const crypto = require('crypto');

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
const createGroup = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const group = await Group.create({
      name,
      description: description || '',
      createdBy: req.user._id,
      members: [req.user._id],
      inviteCode,
    });

    res.status(201).json({
      success: true,
      group,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join a group using invite code
// @route   POST /api/groups/join
// @access  Private
const joinGroup = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ message: 'Invite code is required' });
    }

    const group = await Group.findOne({ inviteCode: inviteCode.toUpperCase() });

    if (!group) {
      return res.status(404).json({ message: 'Invalid invite code or group not found' });
    }

    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    group.members.push(req.user._id);
    await group.save();

    res.status(200).json({
      success: true,
      message: 'Successfully joined the group',
      group,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's groups
// @route   GET /api/groups
// @access  Private
const getUserGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single group details by ID
// @route   GET /api/groups/:id
// @access  Private
const getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGroup,
  joinGroup,
  getUserGroups,
  getGroupById,
};