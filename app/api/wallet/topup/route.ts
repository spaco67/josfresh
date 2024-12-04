import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { verifyPaystackPayment } from '@/lib/services/paystack';
import { Wallet, Transaction } from '@/models';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { amount, reference } = await req.json();

    console.log('Processing top-up request:', { amount, reference, userId: session.user.id });

    // Check for duplicate transaction
    const existingTransaction = await Transaction.findOne({ reference });
    if (existingTransaction) {
      return NextResponse.json(
        { error: 'Transaction already processed' },
        { status: 400 }
      );
    }

    // Verify Paystack payment
    const verification = await verifyPaystackPayment(reference);
    console.log('Paystack verification:', verification);

    if (!verification?.data || verification.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Get user's wallet
    const wallet = await Wallet.findOne({ user: session.user.id });
    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Start a MongoDB session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create transaction record
      const transaction = await Transaction.create([{
        wallet: wallet._id,
        type: 'credit',
        amount: Number(amount),
        description: 'Wallet Top Up via Paystack',
        reference,
        status: 'completed',
        paymentMethod: 'paystack',
        metadata: {
          provider: 'paystack',
          paymentReference: reference,
          paymentStatus: verification.data.status,
          gatewayResponse: verification.data.gateway_response,
          amount: amount,
          currency: 'NGN',
          customerEmail: session.user.email,
          customerName: session.user.name,
          timestamp: new Date().toISOString(),
        },
      }], { session });

      // Update wallet balance
      const previousBalance = wallet.balance;
      wallet.balance += Number(amount);
      wallet.transactions.push(transaction[0]._id);
      await wallet.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      console.log('Top-up successful:', {
        transactionId: transaction[0]._id,
        walletId: wallet._id,
        previousBalance,
        newBalance: wallet.balance,
        amount: Number(amount)
      });

      // Fetch updated wallet with transactions
      const updatedWallet = await Wallet.findById(wallet._id)
        .populate({
          path: 'transactions',
          options: { sort: { createdAt: -1 } }
        });

      return NextResponse.json({
        success: true,
        message: 'Wallet topped up successfully',
        data: {
          transaction: transaction[0],
          wallet: {
            _id: updatedWallet._id,
            balance: updatedWallet.balance,
            accountNumber: updatedWallet.accountNumber,
            accountName: updatedWallet.accountName,
            showBalance: updatedWallet.showBalance,
            transactions: updatedWallet.transactions,
          },
        },
      });
    } catch (error) {
      // Rollback the transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Top up error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process top up',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 