import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPayment } from "@/lib/db/payments";
import { ObjectId } from "mongodb";

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
    
    const payment = await createPayment({
      userId: new ObjectId(session.user.id),
      amount: body.amount,
      type: body.type,
      status: "pending",
      reference: "", // Will be updated with Paystack reference
      metadata: body.metadata,
    });
    
    return NextResponse.json(
      { message: "Payment initialized", payment },
      { status: 201 }
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