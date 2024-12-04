import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Wallet from '@/models/Wallet';
import { createWallet } from '@/lib/services/wallet';

async function generateWalletsForExistingUsers() {
  try {
    await dbConnect();

    // Find all users without wallets
    const users = await User.find({ wallet: { $exists: false } });
    console.log(`Found ${users.length} users without wallets`);

    for (const user of users) {
      try {
        const wallet = await createWallet(user._id.toString());
        console.log(`Created wallet for user: ${user.email}`);
      } catch (error) {
        console.error(`Failed to create wallet for user: ${user.email}`, error);
      }
    }

    console.log('Wallet generation complete');
    process.exit(0);
  } catch (error) {
    console.error('Script error:', error);
    process.exit(1);
  }
}

generateWalletsForExistingUsers(); 