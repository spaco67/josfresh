import mongoose from 'mongoose';

// Define the interface for type safety
interface ITransaction {
  wallet: mongoose.Types.ObjectId;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'paystack' | 'transfer' | 'system';
  metadata: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new mongoose.Schema<ITransaction>({
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['paystack', 'transfer', 'system'],
    required: true,
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: () => new Map(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Add indexes for better query performance
TransactionSchema.index({ createdAt: -1 });
TransactionSchema.index({ wallet: 1, createdAt: -1 });

// Update timestamps
TransactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
export default Transaction; 