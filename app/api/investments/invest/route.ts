import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { investmentSchema, investmentValidation } from "@/lib/models/investment";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = investmentSchema.parse(body);

    // Get the investment details
    const client = await clientPromise;
    const db = client.db("josfresh");
    const investment = await db.collection("investments").findOne({
      _id: validatedData.investmentId,
    });

    if (!investment) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }

    // Validate investment amount
    investmentValidation.validateAmount(validatedData.amount, investment.minimumAmount);

    // Create investment transaction
    await db.collection("investment_transactions").insertOne({
      investmentId: validatedData.investmentId,
      userId: session.user.id,
      amount: validatedData.amount,
      status: "completed",
      type: "investment",
      date: new Date(),
    });

    // Update investment funding
    await db.collection("investments").updateOne(
      { _id: validatedData.investmentId },
      { 
        $inc: { currentFunding: validatedData.amount },
        $set: { 
          status: investment.currentFunding + validatedData.amount >= investment.totalFunding 
            ? "funded" 
            : "active"
        }
      }
    );

    return NextResponse.json(
      { message: "Investment successful" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}