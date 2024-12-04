import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { fetchPaystackTransactions } from '@/lib/services/paystack';
import { Transaction, Wallet } from '@/models';
import dbConnect from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get user's wallet
    const wallet = await Wallet.findOne({ user: session.user.id });
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '10');

    // Fetch transactions from Paystack
    const paystackTransactions = await fetchPaystackTransactions({
      page,
      perPage,
      status: 'success', // Only fetch successful transactions
    });

    let balanceUpdateRequired = false;
    let totalSuccessfulAmount = 0;

    // Update local transaction records and calculate balance
    for (const pTx of paystackTransactions.data) {
      const existingTransaction = await Transaction.findOne({
        reference: pTx.reference,
      });

      if (!existingTransaction && pTx.status === 'success') {
        const amount = pTx.amount / 100; // Convert from kobo to naira
        totalSuccessfulAmount += amount;
        balanceUpdateRequired = true;

        // Create new transaction record
        await Transaction.create({
          wallet: wallet._id,
          type: 'credit',
          amount: amount,
          description: 'Wallet Top Up via Paystack',
          reference: pTx.reference,
          status: 'completed',
          paymentMethod: 'paystack',
          metadata: {
            provider: 'paystack',
            paymentReference: pTx.reference,
            paymentStatus: pTx.status,
            gatewayResponse: pTx.gateway_response,
            customerEmail: pTx.customer.email,
            paidAt: pTx.paid_at,
            channel: pTx.channel,
          },
          createdAt: new Date(pTx.created_at),
        });
      }
    }

    // Update wallet balance if new successful transactions were found
    if (balanceUpdateRequired) {
      // Calculate total successful transactions from our database
      const totalTransactions = await Transaction.aggregate([
        {
          $match: {
            wallet: wallet._id,
            status: 'completed',
            type: 'credit',
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      const newBalance = totalTransactions[0]?.total || 0;

      // Update wallet balance
      wallet.balance = newBalance;
      await wallet.save();

      console.log('Updated wallet balance:', {
        walletId: wallet._id,
        previousBalance: wallet.balance,
        newBalance,
        addedAmount: totalSuccessfulAmount
      });
    }

    // Fetch updated local transactions
    const localTransactions = await Transaction.find({ wallet: wallet._id })
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip((page - 1) * perPage);

    const total = await Transaction.countDocuments({ wallet: wallet._id });

    return NextResponse.json({
      success: true,
      data: {
        transactions: localTransactions,
        wallet: {
          balance: wallet.balance,
          accountNumber: wallet.accountNumber,
          accountName: wallet.accountName,
        },
        pagination: {
          total,
          page,
          perPage,
          pages: Math.ceil(total / perPage),
        }
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Error fetching transactions' },
      { status: 500 }
    );
  }
} 