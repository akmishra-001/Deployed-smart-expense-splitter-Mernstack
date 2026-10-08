const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createGroup,
  joinGroup,
  getUserGroups,
  getGroupById,
} = require('../controllers/groupController');

const protect = authMiddleware.protect || authMiddleware;

// Get all groups for logged in user
router.get('/', protect, getUserGroups);

// Join group using invite code
router.post('/join', protect, joinGroup);

// Get single group details by ID
router.get('/:id', protect, getGroupById);

// Create new group (isise inviteCode automatic handled controller se chalega)
router.post('/', protect, createGroup);

module.exports = router;