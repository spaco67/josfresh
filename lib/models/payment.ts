import { z } from "zod";
import { ObjectId } from "mongodb";

export const paymentSchema = z.object({
  userId: z.instanceof(ObjectId),
  amount: z.number().positive(),
  type: z.enum(["investment", "purchase"]),
  status: z.enum(["pending", "completed", "failed"]),
  reference: z.string(),
  metadata: z.object({
    orderId: z.string().optional(),
    investmentId: z.string().optional(),
  }),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Payment = z.infer<typeof paymentSchema>;

export const validatePayment = {
  amount: (amount: number, minimum: number) => {
    if (amount < minimum) {
      throw new Error(`Minimum amount is ₦${minimum.toLocaleString()}`);
    }
  }
};