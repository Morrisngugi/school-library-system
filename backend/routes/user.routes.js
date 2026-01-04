const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserHistory,
  getUserFines,
  updateMembershipStatus
} = require('../controllers/user.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'librarian'), getUsers)
  .post(authorize('admin', 'librarian'), createUser);

router
  .route('/:id')
  .get(authorize('admin', 'librarian'), getUser)
  .put(authorize('admin', 'librarian'), updateUser)
  .delete(authorize('admin'), deleteUser);

router.get('/:id/history', getUserHistory);
router.get('/:id/fines', getUserFines);
router.put('/:id/membership', authorize('admin', 'librarian'), updateMembershipStatus);

module.exports = router;
