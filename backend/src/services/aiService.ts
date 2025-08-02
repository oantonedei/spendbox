import OpenAI from 'openai';
import Tesseract from 'tesseract.js';
import { logger } from '../utils/logger';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
});

export interface OCRResult {
  text: string;
  confidence: number;
  extractedData: {
    amount?: number;
    merchant?: string;
    date?: string;
    items?: Array<{
      name: string;
      price: number;
    }>;
  };
}

export interface VoiceTranscriptionResult {
  text: string;
  confidence: number;
  extractedData: {
    amount?: number;
    category?: string;
    description?: string;
  };
}

export interface ExpenseCategorizationResult {
  category: string;
  confidence: number;
  suggestions: string[];
  insights: string[];
}

// Process image with OCR
export const processImageWithOCR = async (imageData: string): Promise<OCRResult> => {
  try {
    logger.info('Starting OCR processing');

    // Process with Tesseract.js
    const result = await Tesseract.recognize(
      imageData,
      'eng',
      {
        logger: m => logger.debug('Tesseract:', m)
      }
    );

    const ocrText = result.data.text;
    const confidence = result.data.confidence / 100;

    // Extract structured data using OpenAI
    const extractedData = await extractExpenseDataFromText(ocrText);

    logger.info('OCR processing completed', { confidence, extractedData });

    return {
      text: ocrText,
      confidence,
      extractedData
    };
  } catch (error) {
    logger.error('OCR processing failed:', error);
    throw new Error('Failed to process image with OCR');
  }
};

// Process voice audio
export const processVoiceTranscription = async (audioData: string): Promise<VoiceTranscriptionResult> => {
  try {
    logger.info('Starting voice transcription');

    // TODO: Implement Azure Speech Services or other voice transcription
    // For now, we'll use OpenAI's Whisper model
    const transcription = await openai.audio.transcriptions.create({
      file: Buffer.from(audioData, 'base64'),
      model: 'whisper-1',
      response_format: 'text'
    });

    const text = transcription as unknown as string;
    
    // Extract structured data from transcribed text
    const extractedData = await extractExpenseDataFromText(text);

    logger.info('Voice transcription completed', { extractedData });

    return {
      text,
      confidence: 0.9, // Placeholder confidence
      extractedData
    };
  } catch (error) {
    logger.error('Voice transcription failed:', error);
    throw new Error('Failed to process voice audio');
  }
};

// Categorize expense using AI
export const categorizeExpense = async (
  description: string,
  amount: number,
  merchant?: string
): Promise<ExpenseCategorizationResult> => {
  try {
    logger.info('Starting expense categorization');

    const prompt = `
    Categorize this expense transaction:
    Description: ${description}
    Amount: $${amount}
    ${merchant ? `Merchant: ${merchant}` : ''}

    Please categorize this into one of these categories:
    - Food & Dining
    - Transportation
    - Shopping
    - Entertainment
    - Healthcare
    - Utilities
    - Housing
    - Education
    - Travel
    - Other

    Respond with a JSON object containing:
    {
      "category": "the best category",
      "confidence": 0.95,
      "suggestions": ["alternative category 1", "alternative category 2"],
      "insights": ["helpful insight about spending pattern", "saving tip"]
    }
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that helps categorize expenses. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(response) as ExpenseCategorizationResult;

    logger.info('Expense categorization completed', result);

    return result;
  } catch (error) {
    logger.error('Expense categorization failed:', error);
    
    // Fallback categorization
    return {
      category: 'Other',
      confidence: 0.5,
      suggestions: ['Food & Dining', 'Shopping'],
      insights: ['Unable to categorize automatically. Please review and categorize manually.']
    };
  }
};

// Extract structured data from text
const extractExpenseDataFromText = async (text: string) => {
  try {
    const prompt = `
    Extract expense information from this text:
    "${text}"

    Respond with a JSON object containing:
    {
      "amount": 0.00,
      "merchant": "merchant name",
      "date": "YYYY-MM-DD",
      "items": [
        {
          "name": "item name",
          "price": 0.00
        }
      ]
    }

    If any field cannot be determined, use null.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that extracts structured expense data from text. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 200
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      return {};
    }

    return JSON.parse(response);
  } catch (error) {
    logger.error('Data extraction failed:', error);
    return {};
  }
};

// Generate spending insights
export const generateSpendingInsights = async (
  expenses: Array<{
    amount: number;
    category: string;
    description: string;
    date: string;
  }>,
  period: string
): Promise<string[]> => {
  try {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryBreakdown = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const prompt = `
    Analyze this spending data and provide 3-5 actionable insights:
    
    Period: ${period}
    Total spent: $${totalSpent}
    Number of transactions: ${expenses.length}
    Category breakdown: ${JSON.stringify(categoryBreakdown)}
    
    Recent transactions:
    ${expenses.slice(0, 10).map(exp => 
      `- $${exp.amount} on ${exp.category}: ${exp.description}`
    ).join('\n')}

    Provide insights that are:
    1. Specific and actionable
    2. Based on spending patterns
    3. Include money-saving suggestions
    4. Focus on the user's financial health

    Respond with a JSON array of insight strings.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a financial advisor AI that provides personalized spending insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      return ['Unable to generate insights at this time.'];
    }

    return JSON.parse(response) as string[];
  } catch (error) {
    logger.error('Insight generation failed:', error);
    return ['Unable to generate insights at this time.'];
  }
};

// Predict future expenses
export const predictFutureExpenses = async (
  historicalExpenses: Array<{
    amount: number;
    category: string;
    date: string;
  }>,
  months: number = 3
): Promise<{
  predictions: Record<string, number>;
  confidence: number;
}> => {
  try {
    const categoryTotals = historicalExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const avgMonthlyByCategory: Record<string, number> = {};
    const monthsOfData = Math.max(1, 
      Math.ceil((new Date().getTime() - new Date(historicalExpenses[0]?.date || Date.now()).getTime()) / (1000 * 60 * 60 * 24 * 30))
    );

    Object.entries(categoryTotals).forEach(([category, total]) => {
      avgMonthlyByCategory[category] = total / monthsOfData;
    });

    const predictions: Record<string, number> = {};
    Object.entries(avgMonthlyByCategory).forEach(([category, avgMonthly]) => {
      predictions[category] = avgMonthly * months;
    });

    return {
      predictions,
      confidence: Math.min(0.9, monthsOfData / 6) // Higher confidence with more data
    };
  } catch (error) {
    logger.error('Expense prediction failed:', error);
    return {
      predictions: {},
      confidence: 0.5
    };
  }
}; 