"use client";
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InvestmentCalculator() {
  const [amount, setAmount] = useState("50000");
  const [duration, setDuration] = useState("6");
  const roi = 12; // 12% annual ROI

  const calculateReturns = () => {
    const investment = parseFloat(amount);
    const months = parseInt(duration);
    const annualReturn = investment * (roi / 100);
    const monthlyReturn = annualReturn / 12;
    const totalReturns = investment + (monthlyReturn * months);
    return totalReturns;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Investment Calculator</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Investment Amount (₦)</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="50000"
            step="10000"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Duration (Months)</label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
              <SelectItem value="18">18 months</SelectItem>
              <SelectItem value="24">24 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Expected Returns</span>
            <span className="font-semibold">₦{calculateReturns().toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ROI</span>
            <span className="font-semibold">{roi}% per year</span>
          </div>
        </div>
      </div>
    </Card>
  );
}