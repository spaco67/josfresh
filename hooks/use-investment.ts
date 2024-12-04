import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./use-auth";

export function useInvestment() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const invest = async (investmentId: string, amount: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to make an investment",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch("/api/investments/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ investmentId, amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Investment failed");
      }

      toast({
        title: "Investment successful",
        description: "Your investment has been processed",
      });

      return true;
    } catch (error) {
      toast({
        title: "Investment failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    invest,
    isLoading,
  };
}