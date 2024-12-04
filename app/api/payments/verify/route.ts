import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPaymentByReference, updatePaymentStatus } from "@/lib/db/payments";
import { updateInvestmentStatus } from "@/lib/db/investments";
import { verifyPaystackPayment } from "@/lib/paystack";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { reference } = await req.json();
    
    // Get the payment details
    const payment = await getPaymentByReference(reference);
    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Verify with payment provider (implement your provider's verification)
    const paystackData = await verifyPaystackPayment(reference);
    const verified = paystackData.status === "success";

    if (verified) {
      // Update payment status
      await updatePaymentStatus(payment._id.toString(), "completed");

      // If it's an investment payment, update investment status
      if (payment.type === "investment" && payment.metadata.investmentId) {
        await updateInvestmentStatus(payment.metadata.investmentId, "active");
      }

      return NextResponse.json(
        { message: "Payment verified successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 400 }
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