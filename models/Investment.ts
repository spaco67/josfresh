import mongoose from 'mongoose';

const InvestmentSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  returnAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  duration: {
    type: Number, // in days
    required: true,
    min: 1,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['open', 'pending', 'active', 'completed', 'rejected', 'disputed', 'cancelled'],
    default: 'open',
  },
  description: {
    type: String,
    required: true,
  },
  terms: {
    type: String,
    required: true,
  },
  minimumAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  maximumAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  returnPercentage: {
    type: Number,
    required: true,
    min: 0,
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  tags: [{
    type: String,
  }],
  metrics: {
    totalInvestors: {
      type: Number,
      default: 0,
    },
    amountRaised: {
      type: Number,
      default: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
  },
  paymentSchedule: {
    type: String,
    enum: ['end_of_term', 'monthly', 'quarterly'],
    required: true,
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

// Update timestamps pre-save
InvestmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Investment = mongoose.models.Investment || mongoose.model('Investment', InvestmentSchema);
export default Investment; 