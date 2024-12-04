import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { Wallet } from '@/models';
import { updateWalletBalance } from '@/lib/services/wallet';
import dbConnect from '@/lib/mongodb';

export async function POST(req: Request) {
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

    // Update wallet balance
    const updatedWallet = await updateWalletBalance(wallet._id.toString());

    return NextResponse.json({
      success: true,
      data: {
        wallet: updatedWallet
      }
    });
  } catch (error) {
    console.error('Error refreshing wallet:', error);
    return NextResponse.json(
      { error: 'Failed to refresh wallet' },
      { status: 500 }
    );
  }
} 