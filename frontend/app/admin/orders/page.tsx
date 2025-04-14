"use client";
import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    email: "user@example.com",
    date: "2025-03-12",
    items: 3,
    total: 154.99,
  },
  {
    id: "ORD-002",
    email: "jane@healthcare.org",
    date: "2025-03-14",
    items: 2,
    total: 89.5,
  },
  {
    id: "ORD-003",
    email: "doctor@hospital.med",
    date: "2025-03-15",
    items: 5,
    total: 245.75,
  },
  {
    id: "ORD-004",
    email: "user@example.com",
    date: "2025-03-16",
    items: 1,
    total: 49.99,
  },
  {
    id: "ORD-005",
    email: "nurse@clinic.health",
    date: "2025-03-18",
    items: 4,
    total: 178.25,
  },
];

interface Order {
  id: string;
  email: string;
  date: string;
  status: string;
  items: number;
  total: number;
}

export default function AdminOrders() {
  const [searchEmail, setSearchEmail] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<any>(mockOrders);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchEmail.trim()) {
      setFilteredOrders(mockOrders);
      return;
    }

    const filtered = mockOrders.filter((order) =>
      order.email.toLowerCase().includes(searchEmail.toLowerCase())
    );

    setFilteredOrders(filtered);

    toast({
      title: `${filtered.length} Orders Found`,
      description:
        filtered.length > 0
          ? `Found ${filtered.length} orders for ${searchEmail}`
          : `No orders found for ${searchEmail}`,
    });
  };

  const clearSearch = () => {
    setSearchEmail("");
    setFilteredOrders(mockOrders);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">
            View and manage customer orders
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Orders by Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 items-center mb-6">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter customer email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>
              <Button onClick={handleSearch} className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button variant="outline" onClick={clearSearch}>
                Clear
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium text-blue-500">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.email}</TableCell>
                        <TableCell>{order.date}</TableCell>

                        <TableCell>{order.items}</TableCell>
                        <TableCell className="text-right text-green-500">
                          ${order.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
