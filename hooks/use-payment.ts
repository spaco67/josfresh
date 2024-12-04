import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import PaystackPop from '@paystack/inline-js';
import { getPaystackConfig } from "@/lib/paystack";

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const initiatePayment = async (amount: number, type: "investment" | "purchase", metadata: any) => {
    try {
      setIsLoading(true);

      if (!session?.user?.email) {
        throw new Error("Please login to make a payment");
      }

      // Create payment record first
      const paymentResponse = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          type,
          metadata,
          status: "pending"
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Failed to initialize payment");
      }

      const { payment } = await paymentResponse.json();
      
      // Initialize Paystack payment
      const paystack = new PaystackPop();
      const config = getPaystackConfig(
        amount,
        session.user.email,
        { ...metadata, type, paymentId: payment.id },
        async (response) => {
          if (response.status === "success") {
            await verifyPayment(response.reference);
            toast({
              title: "Payment successful",
              description: "Your transaction has been processed",
            });
          }
        },
        () => {
          toast({
            title: "Payment cancelled",
            description: "You cancelled the payment",
            variant: "destructive",
          });
        }
      );

      paystack.newTransaction(config);
      return true;
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    const response = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    });

    if (!response.ok) {
      throw new Error("Payment verification failed");
    }

    return response.json();
  };

  return {
    initiatePayment,
    verifyPayment,
    isLoading,
  };
}