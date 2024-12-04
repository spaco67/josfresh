"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const investmentSchema = z.object({
  productId: z.string(),
  amount: z.number().min(1000),
  returnPercentage: z.number().min(1).max(100),
  duration: z.number().min(1),
  minimumAmount: z.number().min(1000),
  maximumAmount: z.number().min(1000),
  description: z.string().min(50),
  terms: z.string().min(50),
  riskLevel: z.enum(['low', 'medium', 'high']),
  paymentSchedule: z.enum(['end_of_term', 'monthly', 'quarterly']),
});

export function CreateInvestment({ product }) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      productId: product._id,
      amount: 0,
      returnPercentage: 0,
      duration: 30,
      minimumAmount: 1000,
      maximumAmount: 10000,
      description: "",
      terms: "",
      riskLevel: "medium",
      paymentSchedule: "end_of_term",
    },
  });

  async function onSubmit(values) {
    try {
      setLoading(true);
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Investment opportunity created successfully");
      form.reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields */}
      </form>
    </Form>
  );
} 