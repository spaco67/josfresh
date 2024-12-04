import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'farmer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { status } = await req.json();

    // Verify product belongs to farmer
    const product = await Product.findOne({
      _id: params.productId,
      farmer: session.user.id
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update product status
    product.status = status;
    await product.save();

    return NextResponse.json({ message: 'Product visibility updated' });
  } catch (error) {
    console.error('Error updating product visibility:', error);
    return NextResponse.json(
      { error: 'Error updating product visibility' },
      { status: 500 }
    );
  }
} 