import mongoose from 'mongoose';
import Transaction from './Transaction';

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  accountNumber: {
    type: String,
    unique: true,
  },
  accountName: {
    type: String,
  },
  showBalance: {
    type: Boolean,
    default: true,
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  status: {
    type: String,
    enum: ['active', 'suspended', 'closed'],
    default: 'active',
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

// Update timestamp on save
WalletSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Generate account number and set account name before validation
WalletSchema.pre('validate', async function(next) {
  try {
    if (!this.accountNumber) {
      // Generate 10-digit account number starting with 90
      const randomNum = Math.floor(Math.random() * 100000000);
      this.accountNumber = `90${randomNum.toString().padStart(8, '0')}`;
    }

    if (!this.accountName && this.user) {
      const user = await mongoose.model('User').findById(this.user);
      if (user) {
        this.accountName = user.name.toUpperCase();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Add method to credit wallet
WalletSchema.methods.credit = async function(amount: number, description: string, reference: string, metadata = {}) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create transaction with session
    const transaction = await Transaction.create([{
      wallet: this._id,
      type: 'credit',
      amount,
      description,
      reference,
      status: 'completed',
      paymentMethod: 'paystack',
      metadata: new Map(Object.entries(metadata))
    }], { session });

    // Update wallet balance
    this.balance += amount;
    this.transactions.push(transaction[0]._id);
    await this.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    return transaction[0];
  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
};

// Add method to debit wallet
WalletSchema.methods.debit = async function(amount: number, description: string, reference: string, metadata = {}) {
  if (this.balance < amount) {
    throw new Error('Insufficient funds');
  }

  const transaction = await mongoose.model('Transaction').create({
    wallet: this._id,
    type: 'debit',
    amount,
    description,
    reference,
    status: 'completed',
    paymentMethod: 'system',
    metadata
  });

  this.balance -= amount;
  this.transactions.push(transaction._id);
  await this.save();

  return transaction;
};

const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema);
export default Wallet; 