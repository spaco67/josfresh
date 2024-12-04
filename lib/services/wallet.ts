import { User, Wallet, Transaction } from '@/models';
import mongoose, { Types } from 'mongoose';

export async function createWallet(userId: string) {
  try {
    // Check if wallet already exists
    const existingWallet = await Wallet.findOne({ user: userId });
    if (existingWallet) {
      return existingWallet;
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create new wallet
    const wallet = new Wallet({
      user: new Types.ObjectId(userId),
      accountName: user.name.toUpperCase(),
    });

    // Save wallet
    await wallet.save();

    // Update user with wallet reference
    user.wallet = wallet._id;
    await user.save();

    return wallet;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
}

export async function getWalletByUserId(userId: string) {
  try {
    // Ensure Transaction model is loaded before populating
    await Transaction;
    
    const wallet = await Wallet.findOne({ user: userId })
      .populate({
        path: 'transactions',
        options: { sort: { createdAt: -1 } }
      });
    
    if (!wallet) return null;

    return {
      _id: wallet._id,
      balance: wallet.balance,
      accountNumber: wallet.accountNumber,
      accountName: wallet.accountName,
      showBalance: wallet.showBalance,
      transactions: wallet.transactions || [],
    };
  } catch (error) {
    console.error('Error fetching wallet:', error);
    throw error;
  }
}

export async function toggleWalletVisibility(userId: string) {
  try {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) throw new Error('Wallet not found');

    // Toggle the showBalance field
    wallet.showBalance = !wallet.showBalance;
    await wallet.save();

    // Return the updated wallet with necessary fields
    return {
      _id: wallet._id,
      balance: wallet.balance,
      accountNumber: wallet.accountNumber,
      accountName: wallet.accountName,
      showBalance: wallet.showBalance,
      transactions: wallet.transactions,
    };
  } catch (error) {
    console.error('Error toggling wallet visibility:', error);
    throw error;
  }
}

export async function updateWalletBalance(
  walletId: string,
  amount: number,
  type: 'credit' | 'debit'
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const wallet = await Wallet.findById(walletId).session(session);
    if (!wallet) throw new Error('Wallet not found');

    if (type === 'debit') {
      if (wallet.balance < amount) {
        throw new Error('Insufficient funds');
      }
      wallet.balance -= amount;
    } else {
      wallet.balance += amount;
    }

    await wallet.save({ session });
    await session.commitTransaction();
    return wallet;
  } catch (error) {
    await session.abortTransaction();
    console.error('Error updating wallet balance:', error);
    throw error;
  } finally {
    session.endSession();
  }
} 