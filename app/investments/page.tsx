"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Investment } from "@/types/investment";
import { ArrowUpRight, Filter, Leaf, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";

const investments: Investment[] = [
  {
    id: "1",
    farmerId: "f1",
    farmerName: "John Ibrahim",
    farmName: "Green Acres Farm",
    description: "Sustainable tomato farming project with advanced irrigation",
    location: "Jos, Plateau State",
    minimumAmount: 50000,
    expectedRoi: 12,
    duration: 6,
    riskScore: 2,
    cropType: "Tomatoes",
    infrastructure: ["Irrigation System", "Greenhouse", "Storage Facility"],
    metrics: {
      cropYields: [85, 90, 92],
      revenueGrowth: [10, 15, 20],
      sustainabilityScore: 4.5,
      creditScore: 750,
      landSize: 5,
      landUtilization: 85
    },
    insuranceCoverage: true,
    totalFunding: 1000000,
    currentFunding: 750000,
    status: "active",
    startDate: "2024-04-01",
    endDate: "2024-10-01"
  }
];

function getRiskColor(score: number): string {
  if (score <= 2) return "text-green-600";
  if (score <= 3) return "text-yellow-600";
  return "text-red-600";
}

export default function InvestmentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Farm Investments</h1>
          <p className="text-muted-foreground">
            Invest in verified farms and earn competitive returns
          </p>
        </div>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by crop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              <SelectItem value="tomatoes">Tomatoes</SelectItem>
              <SelectItem value="peppers">Peppers</SelectItem>
              <SelectItem value="maize">Maize</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average ROI</p>
              <p className="text-2xl font-semibold">12.5%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Leaf className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Farms</p>
              <p className="text-2xl font-semibold">24</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-semibold">94%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investments.map((investment) => (
          <Card key={investment.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src="https://images.unsplash.com/photo-1495107334309-fcf20504a5ab"
                alt={investment.farmName}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/90 text-black">
                  {investment.cropType}
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{investment.farmName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {investment.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    {investment.expectedRoi}% ROI
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {investment.duration} months
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span>
                      {Math.round((investment.currentFunding / investment.totalFunding) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(investment.currentFunding / investment.totalFunding) * 100}
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Minimum</p>
                    <p className="font-medium">
                      ₦{investment.minimumAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Risk Score</p>
                    <p className={`font-medium ${getRiskColor(investment.riskScore)}`}>
                      {investment.riskScore}/5
                    </p>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href={`/investments/${investment.id}`}>
                    View Details
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}