import express from 'express';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { protect, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { CustomError } from '../middleware/errorHandler';
import { User } from '../models/User';
import { logger } from '../utils/logger';

const router = express.Router();

// Initialize Plaid client
const configuration = new Configuration({
      basePath: PlaidEnvironments[process.env['PLAID_ENV'] as keyof typeof PlaidEnvironments || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env['PLAID_CLIENT_ID'],
      'PLAID-SECRET': process.env['PLAID_SECRET'],
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// @desc    Create link token for Plaid Link
// @route   POST /api/plaid/create-link-token
// @access  Private
router.post('/create-link-token', protect, asyncHandler(async (req: AuthRequest, res) => {
  try {
    const request = {
      user: { client_user_id: req.user!._id.toString() },
      client_name: 'SpendBox',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
      account_filters: {
        depository: {
          account_subtypes: ['checking', 'savings']
        },
        credit: {
          account_subtypes: ['credit card']
        }
      }
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(request);
    
    res.json({
      success: true,
      data: {
        linkToken: createTokenResponse.data.link_token
      }
    });
  } catch (error) {
    logger.error('Error creating link token:', error);
    throw new CustomError('Failed to create link token', 500);
  }
}));

// @desc    Exchange public token for access token
// @route   POST /api/plaid/exchange-token
// @access  Private
router.post('/exchange-token', protect, asyncHandler(async (req: AuthRequest, res) => {
  const { publicToken } = req.body;

  if (!publicToken) {
    throw new CustomError('Public token is required', 400);
  }

  try {
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    // Get account information
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken
    });

    const accounts = accountsResponse.data.accounts.map(account => ({
      accountId: account.account_id,
      institutionName: account.institution_name || 'Unknown',
      accountType: account.type,
      accountName: account.name,
      mask: account.mask
    }));

    // Update user with Plaid accounts
    await User.findByIdAndUpdate(req.user!._id, {
      $push: { plaidAccounts: { $each: accounts } }
    });

    // TODO: Store access token securely (encrypted in database or secure vault)
    logger.info(`Plaid accounts linked for user ${req.user!._id}`);

    res.json({
      success: true,
      data: {
        accounts,
        message: 'Bank accounts linked successfully'
      }
    });
  } catch (error) {
    logger.error('Error exchanging public token:', error);
    throw new CustomError('Failed to link bank accounts', 500);
  }
}));

// @desc    Get linked accounts
// @route   GET /api/plaid/accounts
// @access  Private
router.get('/accounts', protect, asyncHandler(async (req: AuthRequest, res) => {
  const user = await User.findById(req.user!._id);
  
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  res.json({
    success: true,
    data: user.plaidAccounts
  });
}));

// @desc    Sync transactions from Plaid
// @route   POST /api/plaid/sync-transactions
// @access  Private
router.post('/sync-transactions', protect, asyncHandler(async (req: AuthRequest, res) => {
  // TODO: Implement transaction syncing
  // This would require storing access tokens securely and implementing webhooks
  
  res.json({
    success: true,
    message: 'Transaction sync initiated'
  });
}));

// @desc    Remove linked account
// @route   DELETE /api/plaid/accounts/:accountId
// @access  Private
router.delete('/accounts/:accountId', protect, asyncHandler(async (req: AuthRequest, res) => {
  const { accountId } = req.params;

  const user = await User.findByIdAndUpdate(
    req.user!._id,
    {
      $pull: { plaidAccounts: { accountId } }
    },
    { new: true }
  );

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  res.json({
    success: true,
    message: 'Account unlinked successfully',
    data: user.plaidAccounts
  });
}));

// @desc    Get institutions
// @route   GET /api/plaid/institutions
// @access  Private
router.get('/institutions', protect, asyncHandler(async (req: AuthRequest, res) => {
  try {
    const response = await plaidClient.institutionsGet({
      count: 100,
      offset: 0,
      country_codes: ['US']
    });

    res.json({
      success: true,
      data: response.data.institutions
    });
  } catch (error) {
    logger.error('Error fetching institutions:', error);
    throw new CustomError('Failed to fetch institutions', 500);
  }
}));

export default router; 