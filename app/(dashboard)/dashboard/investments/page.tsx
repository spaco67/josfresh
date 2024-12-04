import { InvestmentOverview } from "@/components/investment/investment-overview";
import { InvestmentList } from "@/components/investment/investment-list";
import { InvestmentStats } from "@/components/investment/investment-stats";

export default function InvestmentDashboard() {
  return (
    <div className="space-y-6">
      <InvestmentStats />
      <InvestmentOverview />
      <InvestmentList />
    </div>
  );
} 