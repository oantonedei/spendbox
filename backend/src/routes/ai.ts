import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { CustomError } from '../middleware/errorHandler';
import { 
  categorizeExpense, 
  generateSpendingInsights, 
  predictFutureExpenses,
  processImageWithOCR,
  processVoiceTranscription
} from '../services/aiService';
import { Expense } from '../models/Expense';
import { logger } from '../utils/logger';

const router = express.Router();

// @desc    Categorize expense with AI
// @route   POST /api/ai/categorize
// @access  Private
router.post('/categorize', protect, [
  body('description').trim().notEmpty(),
  body('amount').isFloat({ min: 0 }),
  body('merchant').optional().isString()
], asyncHandler(async (req: AuthRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { description, amount, merchant } = req.body;

  const result = await categorizeExpense(description, amount, merchant);

  res.json({
    success: true,
    data: result
  });
}));

// @desc    Generate spending insights
// @route   POST /api/ai/insights
// @access  Private
router.post('/insights', protect, [
  body('period').isIn(['week', 'month', 'quarter', 'year']),
  body('expenses').optional().isArray()
], asyncHandler(async (req: AuthRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { period, expenses: providedExpenses } = req.body;

  let expenses;
  if (providedExpenses) {
    expenses = providedExpenses;
  } else {
    // Fetch expenses from database for the period
    const startDate = new Date();
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const dbExpenses = await Expense.find({
      userId: req.user!._id,
      date: { $gte: startDate }
    }).select('amount category description date');

    expenses = dbExpenses.map(exp => ({
      amount: exp.amount,
      category: exp.category,
      description: exp.description,
      date: exp.date.toISOString()
    }));
  }

  const insights = await generateSpendingInsights(expenses, period);

  res.json({
    success: true,
    data: {
      period,
      insights,
      totalExpenses: expenses.length,
      totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0)
    }
  });
}));

// @desc    Predict future expenses
// @route   POST /api/ai/predict
// @access  Private
router.post('/predict', protect, [
  body('months').optional().isInt({ min: 1, max: 12 })
], asyncHandler(async (req: AuthRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { months = 3 } = req.body;

  // Get historical expenses
  const historicalExpenses = await Expense.find({
    userId: req.user!._id
  }).select('amount category date').sort({ date: -1 }).limit(1000);

  const expenses = historicalExpenses.map(exp => ({
    amount: exp.amount,
    category: exp.category,
    date: exp.date.toISOString()
  }));

  const predictions = await predictFutureExpenses(expenses, months);

  res.json({
    success: true,
    data: {
      months,
      predictions: predictions.predictions,
      confidence: predictions.confidence,
      historicalDataPoints: expenses.length
    }
  });
}));

// @desc    Process receipt image
// @route   POST /api/ai/process-receipt
// @access  Private
router.post('/process-receipt', protect, [
  body('imageData').notEmpty()
], asyncHandler(async (req: AuthRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { imageData } = req.body;

  const result = await processImageWithOCR(imageData);

  res.json({
    success: true,
    data: result
  });
}));

// @desc    Process voice input
// @route   POST /api/ai/process-voice
// @access  Private
router.post('/process-voice', protect, [
  body('audioData').notEmpty()
], asyncHandler(async (req: AuthRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { audioData } = req.body;

  const result = await processVoiceTranscription(audioData);

  res.json({
    success: true,
    data: result
  });
}));

// @desc    Get AI suggestions for expense
// @route   POST /api/ai/suggestions
// @access  Private
router.post('/suggestions', protect, [
  body('description').trim().notEmpty(),
  body('amount').isFloat({ min: 0 })
], asyncHandler(async (req: AuthRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { description, amount } = req.body;

  // Get user's expense history for similar transactions
  const similarExpenses = await Expense.find({
    userId: req.user!._id,
    description: { $regex: description, $options: 'i' }
  }).limit(5);

  // Get AI categorization
  const categorization = await categorizeExpense(description, amount);

  // Generate suggestions based on user's history and AI
  const suggestions = {
    category: categorization.category,
    confidence: categorization.confidence,
    alternativeCategories: categorization.suggestions,
    insights: categorization.insights,
    similarTransactions: similarExpenses.map(exp => ({
      id: exp._id,
      amount: exp.amount,
      category: exp.category,
      date: exp.date
    })),
    recommendations: [
      'Consider setting up a budget for this category',
      'Review similar past transactions',
      'Add tags for better organization'
    ]
  };

  res.json({
    success: true,
    data: suggestions
  });
}));

// @desc    Get spending patterns analysis
// @route   GET /api/ai/patterns
// @access  Private
router.get('/patterns', protect, asyncHandler(async (req: AuthRequest, res) => {
  // Get user's expense data for pattern analysis
  const expenses = await Expense.find({
    userId: req.user!._id
  }).select('amount category date merchant').sort({ date: -1 }).limit(1000);

  // Analyze patterns
  const patterns = {
    topCategories: {},
    spendingTrends: {},
    merchantPatterns: {},
    dayOfWeekPatterns: {},
    monthlyPatterns: {}
  };

  // Category patterns
  expenses.forEach(exp => {
    patterns.topCategories[exp.category] = (patterns.topCategories[exp.category] || 0) + exp.amount;
  });

  // Day of week patterns
  expenses.forEach(exp => {
    const dayOfWeek = new Date(exp.date).toLocaleDateString('en-US', { weekday: 'long' });
    patterns.dayOfWeekPatterns[dayOfWeek] = (patterns.dayOfWeekPatterns[dayOfWeek] || 0) + exp.amount;
  });

  // Merchant patterns
  expenses.forEach(exp => {
    if (exp.merchant) {
      patterns.merchantPatterns[exp.merchant] = (patterns.merchantPatterns[exp.merchant] || 0) + exp.amount;
    }
  });

  // Sort patterns
  patterns.topCategories = Object.fromEntries(
    Object.entries(patterns.topCategories).sort(([,a], [,b]) => b - a).slice(0, 5)
  );

  patterns.merchantPatterns = Object.fromEntries(
    Object.entries(patterns.merchantPatterns).sort(([,a], [,b]) => b - a).slice(0, 10)
  );

  res.json({
    success: true,
    data: patterns
  });
}));

export default router; 