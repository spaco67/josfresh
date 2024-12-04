import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { initializePayment } from '@/lib/services/paystack-split';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { productId, quantity, shippingAddress } = await req.json();

    console.log('Processing purchase:', { productId, quantity, userId: session.user.id });

    // Get product and seller details
    const product = await Product.findById(productId).populate({
      path: 'farmer',
      select: 'name email farmDetails'
    });

    if (!product) {
      console.error('Product not found:', productId);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    console.log('Found product:', {
      id: product._id,
      name: product.name,
      farmer: product.farmer?._id
    });

    // Check stock
    if (product.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    // Calculate total amount
    const totalAmount = product.price * quantity;

    // Generate unique reference
    const reference = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create order
    const order = new Order({
      buyer: session.user.id,
      seller: product.farmer._id,
      product: product._id,
      quantity,
      totalAmount,
      paymentReference: reference,
      shippingAddress,
      status: 'pending'
    });

    // Initialize payment
    const payment = await initializePayment({
      amount: totalAmount,
      email: session.user.email!,
      reference,
      metadata: {
        orderId: order._id.toString(),
        productId: product._id.toString(),
        quantity,
        farmerId: product.farmer._id.toString(),
      }
    });

    // Save order
    await order.save();

    console.log('Order created:', {
      orderId: order._id,
      reference,
      amount: totalAmount
    });

    return NextResponse.json({
      success: true,
      data: {
        authorization_url: payment.data.authorization_url,
        reference: payment.data.reference,
        orderId: order._id,
      }
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process purchase',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 