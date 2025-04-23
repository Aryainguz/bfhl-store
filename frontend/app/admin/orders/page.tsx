"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
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

interface Order {
  _id: string;
  email: string;
  createdAt: string;
  items: { productId: string; quantity: number; price: number }[];
  amount: number;
  currency: string;
  shippingAddress: { email: string };
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data: Order[] = await res.json();
        setOrders(data);
      } catch (err: any) {
        toast({ variant: "error", title: "Error", description: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [toast]);

  // Memoized filtered orders
  const filteredOrders = useMemo(() => {
    if (!searchEmail.trim()) return orders;
    return orders.filter((order) =>
      order.shippingAddress.email
        .toLowerCase()
        .includes(searchEmail.toLowerCase())
    );
  }, [orders, searchEmail]);

  const handleSearch = () => {
    if (!searchEmail.trim()) {
      toast({
        title: "Please enter an email address",
        description: "You must enter an email address to search for orders.",
      });
      return;
    }

    toast({
      title: `${filteredOrders.length} Orders Found`,
      description:
        filteredOrders.length > 0
          ? `Found ${filteredOrders.length} orders for "${searchEmail}"`
          : `No orders found for "${searchEmail}"`,
    });
  };

  const clearSearch = () => {
    setSearchEmail("");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-8">
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
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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

            <div className="rounded-md border overflow-auto">
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading orders...
                      </TableCell>
                    </TableRow>
                  ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((o) => (
                      <TableRow key={o._id}>
                        <TableCell className="font-medium text-blue-500">
                          <Link href={`/admin/orders/${o._id}`}>
                            {o._id}
                          </Link>
                        </TableCell>
                        <TableCell>{o.shippingAddress.email}</TableCell>
                        <TableCell>
                          {new Date(o.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{o.items.length}</TableCell>
                        <TableCell className="text-right text-green-600">
                          {o.currency} {o.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
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
