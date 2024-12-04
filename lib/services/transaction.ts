import { Transaction, Wallet } from '@/models';
import mongoose from 'mongoose';

interface CreateTransactionParams {
  wallet: mongoose.Types.ObjectId;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference: string;
  paymentMethod: 'paystack' | 'transfer' | 'system';
  metadata?: Record<string, any>;
}

export async function createTransaction(params: CreateTransactionParams) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Creating transaction with params:', params);

    const {
      wallet: walletId,
      type,
      amount,
      description,
      reference,
      paymentMethod,
      metadata = {},
    } = params;

    // Find wallet and lock it for update
    const wallet = await Wallet.findById(walletId).session(session);
    if (!wallet) {
      throw new Error(`Wallet not found for ID: ${walletId}`);
    }

    console.log('Found wallet:', wallet);

    // Validate balance for debit transactions
    if (type === 'debit' && wallet.balance < amount) {
      throw new Error('Insufficient funds');
    }

    // Create transaction
    const [transaction] = await Transaction.create([{
      wallet: walletId,
      type,
      amount,
      description,
      reference,
      status: 'completed',
      paymentMethod,
      metadata: new Map(Object.entries(metadata)),
    }], { session });

    console.log('Created transaction:', transaction);

    // Update wallet balance
    const previousBalance = wallet.balance;
    if (type === 'credit') {
      wallet.balance += amount;
    } else {
      wallet.balance -= amount;
    }

    wallet.transactions.push(transaction._id);
    await wallet.save({ session });

    console.log('Updated wallet balance:', {
      walletId: wallet._id,
      previousBalance,
      newBalance: wallet.balance,
      transactionId: transaction._id,
    });

    // Commit transaction
    await session.commitTransaction();
    console.log('Transaction committed successfully');

    // Return the populated transaction
    return await Transaction.findById(transaction._id)
      .populate('wallet')
      .session(null);
  } catch (error) {
    // Rollback transaction on error
    await session.abortTransaction();
    console.error('Transaction creation failed:', error);
    throw error;
  } finally {
    session.endSession();
  }
}

export async function getWalletTransactions(walletId: string) {
  try {
    const transactions = await Transaction.find({ wallet: walletId })
      .sort({ createdAt: -1 })
      .populate('wallet')
      .lean();

    console.log(`Found ${transactions.length} transactions for wallet:`, walletId);
    return transactions;
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    throw error;
  }
} 