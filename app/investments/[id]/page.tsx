"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Investment } from "@/types/investment";
import {
  BarChart,
  Calendar,
  Check,
  Info,
  Leaf,
  MapPin,
  Shield,
  Sprout,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

// This would come from your API in a real application
const investment: Investment = {
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
};

export default function InvestmentDetailsPage() {
  const [amount, setAmount] = useState(investment.minimumAmount.toString());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{investment.farmName}</h1>
                <p className="text-muted-foreground flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {investment.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {investment.expectedRoi}% ROI
                </p>
                <p className="text-sm text-muted-foreground">
                  {investment.duration} months duration
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Funding Progress</span>
                  <span>
                    ₦{investment.currentFunding.toLocaleString()} of ₦
                    {investment.totalFunding.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={(investment.currentFunding / investment.totalFunding) * 100}
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Minimum Investment</p>
                  <p className="font-semibold">
                    ₦{investment.minimumAmount.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className="font-semibold">{investment.riskScore}/5</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-semibold">
                    {new Date(investment.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-semibold">
                    {new Date(investment.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Farm Details</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </h3>
                <p>{investment.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Infrastructure
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {investment.infrastructure.map((item) => (
                    <div
                      key={item}
                      className="flex items-center p-3 bg-muted rounded-lg"
                    >
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Sprout className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Crop Yield</p>
                        <p className="font-semibold">
                          {investment.metrics.cropYields[2]}%
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Revenue Growth
                        </p>
                        <p className="font-semibold">
                          {investment.metrics.revenueGrowth[2]}%
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Leaf className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Sustainability
                        </p>
                        <p className="font-semibold">
                          {investment.metrics.sustainabilityScore}/5
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Investment Timeline</h2>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Milestone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Investment Start</TableCell>
                  <TableCell>
                    {new Date(investment.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>Initial investment period begins</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>First Harvest</TableCell>
                  <TableCell>
                    {new Date(
                      new Date(investment.startDate).setMonth(
                        new Date(investment.startDate).getMonth() + 3
                      )
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>Expected first harvest and initial returns</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Investment End</TableCell>
                  <TableCell>
                    {new Date(investment.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>Final returns distribution</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Invest Now</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">
                  Investment Amount (₦)
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={investment.minimumAmount}
                  step={1000}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expected Returns</span>
                  <span className="font-medium">
                    ₦
                    {(
                      parseInt(amount) *
                      (1 + investment.expectedRoi / 100)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{investment.duration} months</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee (2%)</span>
                  <span className="font-medium">
                    ₦{((parseInt(amount) * 0.02) || 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">Invest Now</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Investment</DialogTitle>
                    <DialogDescription>
                      Please review your investment details
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold">₦{parseInt(amount).toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Expected Returns</p>
                      <p className="font-semibold">
                        ₦
                        {(
                          parseInt(amount) *
                          (1 + investment.expectedRoi / 100)
                        ).toLocaleString()}
                      </p>
                    </div>
                    <Button className="w-full">Confirm Investment</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold">Investment Protection</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-1 text-green-600" />
                <p className="text-sm">Comprehensive crop insurance coverage</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-1 text-green-600" />
                <p className="text-sm">Regular monitoring and reporting</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-1 text-green-600" />
                <p className="text-sm">Verified and experienced farmer</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Farm Analytics</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Credit Score</span>
                <span className="font-medium">
                  {investment.metrics.creditScore}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Land Size</span>
                <span className="font-medium">
                  {investment.metrics.landSize} hectares
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Land Utilization
                </span>
                <span className="font-medium">
                  {investment.metrics.landUtilization}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}