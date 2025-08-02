import express from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import { protect, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { CustomError } from '../middleware/errorHandler';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, asyncHandler(async (req: AuthRequest, res) => {
  const user = await User.findById(req.user!._id);
  
  res.json({
    success: true,
    data: user
  });
}));

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
router.put('/preferences', protect, [
  body('currency').optional().isLength({ min: 3, max: 3 }),
  body('timezone').optional().notEmpty(),
  body('notifications.email').optional().isBoolean(),
  body('notifications.push').optional().isBoolean(),
  body('notifications.sms').optional().isBoolean(),
  body('categories').optional().isArray()
], asyncHandler(async (req: AuthRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { currency, timezone, notifications, categories } = req.body;
  const updateFields: any = {};

  if (currency) updateFields['preferences.currency'] = currency;
  if (timezone) updateFields['preferences.timezone'] = timezone;
  if (notifications) {
    Object.entries(notifications).forEach(([key, value]) => {
      updateFields[`preferences.notifications.${key}`] = value;
    });
  }
  if (categories) updateFields['preferences.categories'] = categories;

  const user = await User.findByIdAndUpdate(
    req.user!._id,
    updateFields,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: user
  });
}));

// @desc    Get user subscription info
// @route   GET /api/users/subscription
// @access  Private
router.get('/subscription', protect, asyncHandler(async (req: AuthRequest, res) => {
  const user = await User.findById(req.user!._id).select('subscription');
  
  res.json({
    success: true,
    data: user?.subscription
  });
}));

// @desc    Upgrade to premium
// @route   POST /api/users/upgrade
// @access  Private
router.post('/upgrade', protect, asyncHandler(async (req: AuthRequest, res) => {
  const user = await User.findById(req.user!._id);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (user.subscription.plan === 'premium') {
    throw new CustomError('User is already on premium plan', 400);
  }

  // TODO: Integrate with payment processor (Stripe, etc.)
  // For now, just update the subscription
  user.subscription.plan = 'premium';
  user.subscription.transactionLimit = 999999; // Unlimited
  user.subscription.startDate = new Date();
  user.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await user.save();

  res.json({
    success: true,
    data: user.subscription,
    message: 'Successfully upgraded to premium'
  });
}));

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, asyncHandler(async (req: AuthRequest, res) => {
  const user = await User.findById(req.user!._id);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  // TODO: Add more comprehensive statistics
  const stats = {
    totalExpenses: 0, // Will be calculated from expenses
    averageExpense: 0,
    mostUsedCategory: '',
    subscriptionUsage: {
      used: user.subscription.usedTransactions,
      limit: user.subscription.transactionLimit,
      percentage: (user.subscription.usedTransactions / user.subscription.transactionLimit) * 100
    },
    accountAge: Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))
  };

  res.json({
    success: true,
    data: stats
  });
}));

export default router; 