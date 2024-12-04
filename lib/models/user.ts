import { z } from "zod";

export const baseUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const customerSchema = baseUserSchema.extend({
  role: z.literal("customer"),
});

export const investorSchema = baseUserSchema.extend({
  role: z.literal("investor"),
  phone: z.string().min(11, "Invalid phone number"),
  investmentPreferences: z.object({
    riskTolerance: z.enum(["low", "medium", "high"]),
    preferredDuration: z.array(z.number()),
    minimumROI: z.number(),
  }).optional(),
});

export const farmerSchema = baseUserSchema.extend({
  role: z.literal("farmer"),
  farmName: z.string().min(2, "Farm name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  state: z.string().min(1, "State is required"),
  lga: z.string().min(1, "LGA is required"),
  phone: z.string().min(11, "Invalid phone number"),
  description: z.string().min(20, "Description must be at least 20 characters"),
});