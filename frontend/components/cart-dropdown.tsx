import { X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface CartDropdownProps {
  onClose: () => void;
}

export default function CartDropdown({ onClose }: CartDropdownProps) {
  const { cartItems, removeFromCart, getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();

  return (
    <div className="absolute right-0 mt-2 w-80 bg-card rounded-md shadow-lg z-10 border overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Your Cart ({cartItems.length})</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Separator className="my-2" />
        
        {cartItems.length === 0 ? (
          <div className="py-8 text-center">
            <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto space-y-3 my-2">
              {cartItems.map((item,index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="h-12 w-12 overflow-hidden rounded-md bg-muted">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} x {formatCurrency(  item.discount > 0
      ? item.price * (1 - item.discount / 100)
      : item.price)}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => removeFromCart(item._id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Separator className="my-3" />
            
            <div className="py-2 flex justify-between">
              <span className="font-medium">Total:</span>
              <span className="font-bold">{formatCurrency(totalPrice)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClose}
                className="w-full"
                asChild
              >
                <Link href="/cart">View Cart</Link>
              </Button>
              <Button 
                size="sm" 
                className="w-full"
                asChild
              >
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
