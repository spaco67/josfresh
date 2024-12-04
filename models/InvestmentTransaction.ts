import mongoose from 'mongoose';

const InvestmentTransactionSchema = new mongoose.Schema({
  investment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    required: true,
  },
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['investment', 'return', 'refund'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentReference: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map(),
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

InvestmentTransactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const InvestmentTransaction = mongoose.models.InvestmentTransaction || 
  mongoose.model('InvestmentTransaction', InvestmentTransactionSchema);

export default InvestmentTransaction; 