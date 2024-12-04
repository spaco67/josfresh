import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { createWallet } from '@/lib/services/wallet';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { name, email, password, role, farmDetails } = await req.json();

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user with role-specific details
    const userData = {
      name,
      email,
      password,
      role: role || 'customer',
      ...(role === 'farmer' && { farmDetails }),
    };

    // Create user
    const user = await User.create(userData);

    // Create wallet immediately after user creation
    try {
      const wallet = await createWallet(user._id.toString());
      if (!wallet) {
        // If wallet creation fails, delete the user
        await User.findByIdAndDelete(user._id);
        throw new Error('Failed to create wallet');
      }
    } catch (error) {
      // Clean up user if wallet creation fails
      await User.findByIdAndDelete(user._id);
      throw error;
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          ...(user.role === 'farmer' && { farmDetails: user.farmDetails }),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating user' },
      { status: 500 }
    );
  }
}