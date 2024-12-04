import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Order, Product, Wallet, Transaction, User } from '@/models';
import dbConnect from '@/lib/mongodb';
import { updateWalletBalance } from '@/lib/services/wallet';
import mongoose from 'mongoose';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

function verifyPaystackSignature(req: Request): boolean {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');
  return hash === req.headers.get('x-paystack-signature');
}

export async function POST(req: Request) {
  try {
    if (!verifyPaystackSignature(req)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    await dbConnect();
    const event = await req.json();

    if (event.event === 'charge.success') {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const { reference, metadata } = event.data;
        const { orderId } = metadata;

        // Get order with buyer and seller details
        const order = await Order.findById(orderId)
          .populate('buyer')
          .populate('seller')
          .session(session);
        
        if (!order) throw new Error('Order not found');

        // Get buyer and seller wallets
        const buyerWallet = await Wallet.findOne({ user: order.buyer._id }).session(session);
        const sellerWallet = await Wallet.findOne({ user: order.seller._id }).session(session);

        if (!buyerWallet || !sellerWallet) {
          throw new Error('Wallet not found');
        }

        // Update order status
        order.status = 'paid';
        await order.save({ session });

        // Update product stock
        const product = await Product.findById(order.product).session(session);
        if (!product) throw new Error('Product not found');

        product.stock -= order.quantity;
        await product.save({ session });

        // Create debit transaction for buyer
        await Transaction.create([{
          wallet: buyerWallet._id,
          type: 'debit',
          amount: order.totalAmount,
          description: `Payment for order #${order._id}`,
          reference: `${reference}_BUYER`,
          status: 'completed',
          paymentMethod: 'paystack',
          metadata: { orderId, productId: product._id }
        }], { session });

        // Create credit transaction for seller
        await Transaction.create([{
          wallet: sellerWallet._id,
          type: 'credit',
          amount: order.totalAmount,
          description: `Payment received for order #${order._id}`,
          reference: `${reference}_SELLER`,
          status: 'completed',
          paymentMethod: 'paystack',
          metadata: { orderId, productId: product._id }
        }], { session });

        // Update buyer's wallet balance (debit)
        await updateWalletBalance(buyerWallet._id, order.totalAmount, 'debit');

        // Update seller's wallet balance (credit)
        await updateWalletBalance(sellerWallet._id, order.totalAmount, 'credit');

        await session.commitTransaction();

        console.log('Payment processed successfully:', {
          orderId,
          amount: order.totalAmount,
          buyer: order.buyer._id,
          seller: order.seller._id
        });
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 