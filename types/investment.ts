export interface FarmMetrics {
  cropYields: number[];
  revenueGrowth: number[];
  sustainabilityScore: number;
  creditScore: number;
  landSize: number;
  landUtilization: number;
}

export interface Investment {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  description: string;
  location: string;
  minimumAmount: number;
  expectedRoi: number;
  duration: number;
  riskScore: number;
  cropType: string;
  infrastructure: string[];
  metrics: FarmMetrics;
  insuranceCoverage: boolean;
  totalFunding: number;
  currentFunding: number;
  status: 'active' | 'funded' | 'completed';
  startDate: string;
  endDate: string;
}

export interface InvestmentTransaction {
  id: string;
  investmentId: string;
  investorId: string;
  amount: number;
  date: string;
  type: 'investment' | 'withdrawal' | 'profit';
  status: 'pending' | 'completed' | 'failed';
}