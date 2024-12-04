"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Filter, FileImage, FileText, Table as TableIcon } from "lucide-react";
import { useState } from "react";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const orders = [
  {
    id: "ORD001",
    customer: "Sarah James",
    date: "2024-03-20",
    total: 15000,
    status: "pending",
    items: 3,
  },
  {
    id: "ORD002",
    customer: "John Ibrahim",
    date: "2024-03-19",
    total: 8500,
    status: "processing",
    items: 2,
  },
  {
    id: "ORD003",
    customer: "Mary Johnson",
    date: "2024-03-19",
    total: 12000,
    status: "completed",
    items: 4,
  },
  {
    id: "ORD004",
    customer: "David Chen",
    date: "2024-03-18",
    total: 5000,
    status: "completed",
    items: 1,
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const handleExportPDF = async () => {
    if (!selectedOrder) return;
    const element = document.getElementById('order-details');
    if (element) {
      const canvas = await html2canvas(element);
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save(`order-${selectedOrder.id}.pdf`);
    }
  };

  const handleExportImage = async () => {
    if (!selectedOrder) return;
    const element = document.getElementById('order-details');
    if (element) {
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = `order-${selectedOrder.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orders</h2>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>{order.items} items</TableCell>
                <TableCell>₦{order.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[order.status as keyof typeof statusColors]}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          
          <div id="order-details" className="space-y-6 p-4">
            {selectedOrder && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Order Information</h4>
                    <p>Order ID: {selectedOrder.id}</p>
                    <p>Date: {new Date(selectedOrder.date).toLocaleDateString()}</p>
                    <p>Status: {selectedOrder.status}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Customer Information</h4>
                    <p>Name: {selectedOrder.customer}</p>
                    <p>Items: {selectedOrder.items}</p>
                    <p>Total: ₦{selectedOrder.total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <CSVLink
                    data={[selectedOrder]}
                    filename={`order-${selectedOrder.id}.csv`}
                    className="inline-flex"
                  >
                    <Button variant="outline" size="sm">
                      <TableIcon className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                  </CSVLink>
                  <Button variant="outline" size="sm" onClick={handleExportPDF}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportImage}>
                    <FileImage className="mr-2 h-4 w-4" />
                    Export Image
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}