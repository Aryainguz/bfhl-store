"use client";
import Footer from "@/components/footer";
import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 12.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const totalAfterDiscount = Math.max(0, total - discount);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 1) Coupon check
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      return toast({ variant: "error", title: "Enter a coupon code" });
    }
    setIsApplying(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/check`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ code: couponCode.trim(), subtotal }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setDiscount(0);
        throw new Error(data.message || "Invalid coupon");
      }
      setDiscount(data.discountAmount);
      toast({
        title: "Coupon Applied",
        description: `You saved ${formatCurrency(data.discountAmount)}!`,
      });
    } catch (err: any) {
      toast({ variant: "error", title: "Coupon Error", description: err.message });
    } finally {
      setIsApplying(false);
    }
  };

  // 2) Dummy payment & order creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        variant: "error",
        title: "Authentication Required",
        description: "Please log in to complete your order.",
      });
      return router.push("/auth/login");
    }

    for (const key of Object.keys(form) as (keyof typeof form)[]) {
      if (!form[key]) {
        return toast({
          variant: "error",
          title: "Missing Info",
          description: `Please fill in your ${key}.`,
        });
      }
    }

    setIsProcessing(true);

    const payload = {
      items: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      shipping: {
        method: shipping === 0 ? "free" : "standard",
        cost: shipping,
        address: { ...form },
      },
      coupon: couponCode.trim() || null,
      discount,
      amount: Math.round(totalAfterDiscount * 100),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Order submission failed");
      }

      clearCart();
      toast({ title: "Payment Successful", description: "Your order has been placed." });
      alert("Payment successful! Your order has been placed.");
      router.push("/products");
    } catch (err: any) {
      toast({ variant: "error", title: "Order Error", description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1>Your Cart is Empty</h1>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link href="/cart" className="text-blue-500 mb-6 flex items-center">
          <ArrowLeft className="mr-1" /> Back to Cart
        </Link>
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground mb-8">Complete your purchase</p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal & Address */}
              <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                <h2 className="text-xl font-bold">Personal & Address Details</h2>
                {[
                  { name: "fullName", label: "Full Name" },
                  { name: "email", label: "Email" },
                  { name: "phone", label: "Phone Number" },
                  { name: "address", label: "Address" },
                  { name: "city", label: "City" },
                  { name: "state", label: "State" },
                  { name: "zip", label: "ZIP / Postal Code" },
                ].map(({ name, label }) => (
                  <input
                    key={name}
                    type="text"
                    name={name}
                    placeholder={label}
                    value={(form as any)[name]}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                ))}
              </div>

              {/* Coupon */}
              <div className="bg-white rounded-lg p-6 shadow-sm flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                />
                <Button onClick={handleApplyCoupon} disabled={isApplying}>
                  {isApplying ? "Checking…" : "Apply"}
                </Button>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Payment</h2>
                <Button type="submit" disabled={isProcessing} className="w-full">
                  {isProcessing
                    ? "Processing…"
                    : `Complete Order • ${formatCurrency(totalAfterDiscount)}`}
                </Button>
              </div>
            </form>
          </div>

          <div className="hidden md:block">
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              discount={discount}
              total={total}
              totalAfterDiscount={totalAfterDiscount}
              cartItems={cartItems}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function OrderSummary({
  subtotal,
  shipping,
  tax,
  discount,
  totalAfterDiscount,
  cartItems,
}: any) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8 space-y-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-4 max-h-60 overflow-auto">
        {cartItems.map((item: any) => (
          <div key={item._id} className="flex gap-4">
            <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden">
              <img
                src={item.imageUrl || "/images/placeholder.png"}
                alt={item.name}
                className="object-cover h-full w-full"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate">{item.name}</h3>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              <p className="text-sm font-medium mt-auto">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span></div>
        <div className="flex justify-between"><span>Estimated Tax</span><span>{formatCurrency(tax)}</span></div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>
        )}
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatCurrency(totalAfterDiscount)}</span></div>
      <div className="mt-6 space-y-3 text-sm text-gray-600">
        <div className="flex items-center"><ShieldCheck className="mr-2 text-green-600" /> Secure checkout</div>
      </div>
    </div>
  );
}
