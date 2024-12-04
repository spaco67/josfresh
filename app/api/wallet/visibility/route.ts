import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { toggleWalletVisibility } from '@/lib/services/wallet';

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedWallet = await toggleWalletVisibility(session.user.id);
    return NextResponse.json(updatedWallet);
  } catch (error) {
    console.error('Error toggling wallet visibility:', error);
    return NextResponse.json(
      { error: 'Error updating wallet' },
      { status: 500 }
    );
  }
} 