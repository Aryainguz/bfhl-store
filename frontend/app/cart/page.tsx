"use client";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter()

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    updateQuantity(productId, quantity);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed to checkout.",
        variant: "error",
      });
      return;
    }
    // Placeholder for checkout logic (e.g., redirect to checkout page or API call)
    // toast({
    //   title: "Checkout",
    //   description: "Proceeding to checkout (not implemented).",
    // });
    router.push("/checkout")
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Button asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item:any) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.imageUrl || "/images/placeholder.png"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <h2 className="text-lg font-medium">{item.name}</h2>
                      <p className="text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item._id,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-16"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFromCart(item._id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <Button
                className="w-full mt-6 bg-blue-500 text-white"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}