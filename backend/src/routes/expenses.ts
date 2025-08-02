import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { Expense, IExpense } from '../models/Expense';
import { User } from '../models/User';
import { protect, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { uploadLimiter } from '../middleware/rateLimiter';
import { CustomError } from '../middleware/errorHandler';
import { processImageWithOCR } from '../services/aiService';
import { logger } from '../utils/logger';
import moment from 'moment';

const router = express.Router();

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('minAmount').optional().isFloat({ min: 0 }),
  query('maxAmount').optional().isFloat({ min: 0 }),
  query('sortBy').optional().isIn(['date', 'amount', 'category']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], asyncHandler(async (req: AuthRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const {
    page = 1,
    limit = 20,
    category,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    sortBy = 'date',
    sortOrder = 'desc'
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const sort: any = { [sortBy as string]: sortOrder === 'desc' ? -1 : 1 };

  // Build filter
  const filter: any = { userId: req.user!._id };
  
  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate as string);
    if (endDate) filter.date.$lte = new Date(endDate as string);
  }
  if (minAmount || maxAmount) {
    filter.amount = {};
    if (minAmount) filter.amount.$gte = Number(minAmount);
    if (maxAmount) filter.amount.$lte = Number(maxAmount);
  }

  const expenses = await Expense.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .populate('sharedWith.userId', 'firstName lastName email');

  const total = await Expense.countDocuments(filter);

  res.json({
    success: true,
    data: expenses,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit))
    }
  });
}));

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req: AuthRequest, res) => {
  const expense = await Expense.findOne({
    _id: req.params.id,
    userId: req.user!._id
  }).populate('sharedWith.userId', 'firstName lastName email');

  if (!expense) {
    throw new CustomError('Expense not found', 404);
  }

  res.json({
    success: true,
    data: expense
  });
}));

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
router.post('/', protect, uploadLimiter, [
  body('amount').isFloat({ min: 0 }),
  body('description').trim().notEmpty(),
  body('category').trim().notEmpty(),
  body('date').optional().isISO8601(),
  body('paymentMethod.type').isIn(['card', 'cash', 'bank_transfer', 'digital_wallet'])
], asyncHandler(async (req: AuthRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  // Check subscription limits
  const user = await User.findById(req.user!._id);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (user.subscription.usedTransactions >= user.subscription.transactionLimit) {
    throw new CustomError('Transaction limit reached. Please upgrade to premium.', 403);
  }

  const expenseData = {
    ...req.body,
    userId: req.user!._id,
    date: req.body.date ? new Date(req.body.date) : new Date(),
    currency: req.body.currency || user.preferences.currency
  };

  const expense = await Expense.create(expenseData);

  // Emit real-time update via Socket.IO
  const { io } = require('../index');
  io.to(req.user!._id.toString()).emit('expense-added', expense);

  res.status(201).json({
    success: true,
    data: expense
  });
}));

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
router.put('/:id', protect, [
  body('amount').optional().isFloat({ min: 0 }),
  body('description').optional().trim().notEmpty(),
  body('category').optional().trim().notEmpty(),
  body('date').optional().isISO8601()
], asyncHandler(async (req: AuthRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const expense = await Expense.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user!._id
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!expense) {
    throw new CustomError('Expense not found', 404);
  }

  // Emit real-time update
  const { io } = require('../index');
  io.to(req.user!._id.toString()).emit('expense-updated', expense);

  res.json({
    success: true,
    data: expense
  });
}));

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req: AuthRequest, res) => {
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!._id
  });

  if (!expense) {
    throw new CustomError('Expense not found', 404);
  }

  // Emit real-time update
  const { io } = require('../index');
  io.to(req.user!._id.toString()).emit('expense-deleted', { id: req.params.id });

  res.json({
    success: true,
    message: 'Expense deleted successfully'
  });
}));

// @desc    Process receipt image with OCR
// @route   POST /api/expenses/process-receipt
// @access  Private
router.post('/process-receipt', protect, uploadLimiter, asyncHandler(async (req: AuthRequest, res) => {
  if (!req.body.imageData) {
    throw new CustomError('Image data is required', 400);
  }

  try {
    const ocrResult = await processImageWithOCR(req.body.imageData);
    
    res.json({
      success: true,
      data: ocrResult
    });
  } catch (error) {
    logger.error('OCR processing failed:', error);
    throw new CustomError('Failed to process receipt image', 500);
  }
}));

// @desc    Get expense analytics
// @route   GET /api/expenses/analytics
// @access  Private
router.get('/analytics', protect, [
  query('period').isIn(['day', 'week', 'month', 'year', 'custom']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], asyncHandler(async (req: AuthRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { period, startDate, endDate } = req.query;
  let dateFilter: any = {};

  // Calculate date range based on period
  if (period === 'custom') {
    if (!startDate || !endDate) {
      throw new CustomError('Start date and end date are required for custom period', 400);
    }
    dateFilter = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string)
    };
  } else {
    const now = moment();
    switch (period) {
      case 'day':
        dateFilter = {
          $gte: now.startOf('day').toDate(),
          $lte: now.endOf('day').toDate()
        };
        break;
      case 'week':
        dateFilter = {
          $gte: now.startOf('week').toDate(),
          $lte: now.endOf('week').toDate()
        };
        break;
      case 'month':
        dateFilter = {
          $gte: now.startOf('month').toDate(),
          $lte: now.endOf('month').toDate()
        };
        break;
      case 'year':
        dateFilter = {
          $gte: now.startOf('year').toDate(),
          $lte: now.endOf('year').toDate()
        };
        break;
    }
  }

  // Get expenses for the period
  const expenses = await Expense.find({
    userId: req.user!._id,
    date: dateFilter
  });

  // Calculate analytics
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;

  // Category breakdown
  const categoryBreakdown = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  // Top merchants
  const merchantBreakdown = expenses
    .filter(exp => exp.merchant)
    .reduce((acc, exp) => {
      acc[exp.merchant!] = (acc[exp.merchant!] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

  const topMerchants = Object.entries(merchantBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([merchant, amount]) => ({ merchant, amount }));

  // Daily spending trend
  const dailyTrend = expenses.reduce((acc, exp) => {
    const day = moment(exp.date).format('YYYY-MM-DD');
    acc[day] = (acc[day] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  res.json({
    success: true,
    data: {
      period,
      totalExpenses: expenses.length,
      totalAmount,
      averageAmount,
      categoryBreakdown,
      topMerchants,
      dailyTrend
    }
  });
}));

// @desc    Share expense with other users
// @route   POST /api/expenses/:id/share
// @access  Private
router.post('/:id/share', protect, [
  body('shares').isArray(),
  body('shares.*.email').isEmail(),
  body('shares.*.amount').isFloat({ min: 0 })
], asyncHandler(async (req: AuthRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const expense = await Expense.findOne({
    _id: req.params.id,
    userId: req.user!._id
  });

  if (!expense) {
    throw new CustomError('Expense not found', 404);
  }

  const { shares } = req.body;
  const sharedUsers = [];

  for (const share of shares) {
    const user = await User.findOne({ email: share.email });
    if (user) {
      sharedUsers.push({
        userId: user._id,
        amount: share.amount,
        status: 'pending'
      });
    }
  }

  expense.sharedWith = sharedUsers;
  await expense.save();

  // Emit real-time update
  const { io } = require('../index');
  io.to(req.user!._id.toString()).emit('expense-shared', expense);

  res.json({
    success: true,
    data: expense
  });
}));

// @desc    Get shared expenses
// @route   GET /api/expenses/shared
// @access  Private
router.get('/shared', protect, asyncHandler(async (req: AuthRequest, res) => {
  const sharedExpenses = await Expense.find({
    'sharedWith.userId': req.user!._id
  }).populate('userId', 'firstName lastName email');

  res.json({
    success: true,
    data: sharedExpenses
  });
}));

export default router; 