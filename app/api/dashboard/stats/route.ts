import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get basic stats
    const [products, orders] = await Promise.all([
      Product.find({ farmer: session.user.id }),
      Order.find({ 'items.product': { $in: await Product.find({ farmer: session.user.id }).distinct('_id') } })
        .populate('items.product')
    ]);

    // Calculate total revenue
    const totalRevenue = orders.reduce((acc, order) => 
      acc + order.items.reduce((sum, item) => 
        sum + (item.quantity * item.priceAtTime), 0
      ), 0
    );

    // Group products by category
    const productsByCategory = Object.entries(
      products.reduce((acc: any, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));

    // Group orders by state and LGA
    const ordersByState = Object.entries(
      orders.reduce((acc: any, order) => {
        const state = order.shippingAddress.state;
        const lga = order.shippingAddress.lga;
        
        if (!acc[state]) {
          acc[state] = { orders: 0, revenue: 0, lgas: {} };
        }
        
        acc[state].orders += 1;
        acc[state].revenue += order.totalAmount;
        
        if (!acc[state].lgas[lga]) {
          acc[state].lgas[lga] = { orders: 0, revenue: 0 };
        }
        
        acc[state].lgas[lga].orders += 1;
        acc[state].lgas[lga].revenue += order.totalAmount;
        
        return acc;
      }, {})
    ).map(([name, data]: [string, any]) => ({
      name,
      orders: data.orders,
      revenue: data.revenue,
      lgas: Object.entries(data.lgas).map(([lgaName, lgaData]: [string, any]) => ({
        name: lgaName,
        orders: lgaData.orders,
        revenue: lgaData.revenue,
      })),
    }));

    // Calculate sales trend (last 7 days)
    const salesTrend = await Order.aggregate([
      {
        $match: {
          'items.product': { 
            $in: products.map(p => p._id) 
          },
          createdAt: { 
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          amount: { $sum: "$totalAmount" }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          amount: 1
        }
      },
      { $sort: { date: 1 } }
    ]);

    return NextResponse.json({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      productsByCategory,
      ordersByState,
      salesTrend,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Error fetching dashboard stats' },
      { status: 500 }
    );
  }
} 