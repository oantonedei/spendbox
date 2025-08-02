import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  description: string;
  category: string;
  subcategory?: string;
  merchant?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  date: Date;
  paymentMethod: {
    type: 'card' | 'cash' | 'bank_transfer' | 'digital_wallet';
    accountId?: string;
    last4?: string;
  };
  receipt?: {
    imageUrl: string;
    ocrText?: string;
    confidence?: number;
  };
  voiceNote?: {
    audioUrl: string;
    transcription?: string;
    confidence?: number;
  };
  tags: string[];
  notes?: string;
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
  sharedWith: Array<{
    userId: mongoose.Types.ObjectId;
    amount: number;
    status: 'pending' | 'accepted' | 'declined';
  }>;
  aiProcessed: {
    category: string;
    confidence: number;
    suggestions: string[];
    insights: string[];
  };
  status: 'pending' | 'confirmed' | 'disputed';
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    uppercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  merchant: {
    type: String,
    trim: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  paymentMethod: {
    type: {
      type: String,
      enum: ['card', 'cash', 'bank_transfer', 'digital_wallet'],
      required: true
    },
    accountId: String,
    last4: String
  },
  receipt: {
    imageUrl: String,
    ocrText: String,
    confidence: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  voiceNote: {
    audioUrl: String,
    transcription: String,
    confidence: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    interval: {
      type: Number,
      min: 1
    },
    endDate: Date
  },
  sharedWith: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    }
  }],
  aiProcessed: {
    category: String,
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    suggestions: [String],
    insights: [String]
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'disputed'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index({ userId: 1, amount: -1 });
expenseSchema.index({ 'sharedWith.userId': 1 });
expenseSchema.index({ merchant: 1 });
expenseSchema.index({ tags: 1 });

// Virtual for formatted amount
expenseSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount);
});

// Virtual for total shared amount
expenseSchema.virtual('totalSharedAmount').get(function() {
  return this.sharedWith.reduce((total, share) => total + share.amount, 0);
});

// Ensure virtual fields are serialized
expenseSchema.set('toJSON', {
  virtuals: true
});

// Pre-save middleware to update user's transaction count
expenseSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const User = mongoose.model('User');
      await User.findByIdAndUpdate(
        this.userId,
        { $inc: { 'subscription.usedTransactions': 1 } }
      );
    } catch (error) {
      // Log error but don't fail the save
      console.error('Error updating user transaction count:', error);
    }
  }
  next();
});

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema); 