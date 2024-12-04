import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Investment, InvestmentTransaction } from "@/models";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [
      totalInvested,
      activeInvestments,
      returns,
      pendingReturns,
    ] = await Promise.all([
      InvestmentTransaction.aggregate([
        {
          $match: {
            investor: session.user.id,
            type: "investment",
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
      Investment.countDocuments({
        investor: session.user.id,
        status: "active",
      }),
      InvestmentTransaction.aggregate([
        {
          $match: {
            investor: session.user.id,
            type: "return",
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
      InvestmentTransaction.aggregate([
        {
          $match: {
            investor: session.user.id,
            type: "return",
            status: "pending",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalInvested: totalInvested[0]?.total || 0,
        activeInvestments,
        totalReturns: returns[0]?.total || 0,
        pendingReturns: pendingReturns[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching investment stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch investment stats" },
      { status: 500 }
    );
  }
} 