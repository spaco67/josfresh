import { z } from "zod";
import { ObjectId } from "mongodb";

export const investmentSchema = z.object({
  farmerId: z.instanceof(ObjectId),
  farmerName: z.string(),
  farmName: z.string(),
  description: z.string().min(20),
  location: z.string(),
  minimumAmount: z.number().min(50000),
  expectedRoi: z.number().min(8).max(15),
  duration: z.number().min(6).max(24),
  riskScore: z.number().min(1).max(5),
  cropType: z.string(),
  infrastructure: z.array(z.string()),
  metrics: z.object({
    cropYields: z.array(z.number()),
    revenueGrowth: z.array(z.number()),
    sustainabilityScore: z.number().min(0).max(5),
    creditScore: z.number().min(300).max(850),
    landSize: z.number().positive(),
    landUtilization: z.number().min(0).max(100)
  }),
  insuranceCoverage: z.boolean(),
  totalFunding: z.number().positive(),
  currentFunding: z.number().min(0),
  status: z.enum(["draft", "active", "funded", "completed", "cancelled"]),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const investmentTransactionSchema = z.object({
  investmentId: z.instanceof(ObjectId),
  investorId: z.instanceof(ObjectId),
  amount: z.number().positive(),
  type: z.enum(["investment", "withdrawal", "profit"]),
  status: z.enum(["pending", "completed", "failed"]),
  date: z.date(),
  profitPercentage: z.number().optional(),
  notes: z.string().optional()
});

export type Investment = z.infer<typeof investmentSchema>;
export type InvestmentTransaction = z.infer<typeof investmentTransactionSchema>;

export const investmentValidation = {
  validateAmount: (amount: number, minimumAmount: number) => {
    if (amount < minimumAmount) {
      throw new Error(`Minimum investment amount is ₦${minimumAmount.toLocaleString()}`);
    }
  },
  
  validateDuration: (duration: number) => {
    if (duration < 6 || duration > 24) {
      throw new Error("Investment duration must be between 6 and 24 months");
    }
  },
  
  validateRoi: (roi: number) => {
    if (roi < 8 || roi > 15) {
      throw new Error("Expected ROI must be between 8% and 15%");
    }
  }
};