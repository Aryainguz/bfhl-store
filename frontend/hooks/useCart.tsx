"use client"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addToCart: (product: Product) => {
        const { cartItems } = get();
        const existingItem = cartItems.find((item) => item._id === product._id);
        
        if (existingItem) {
          // If product already in cart, update quantity
          set({
            cartItems: cartItems.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // If product not in cart, add it
          set({
            cartItems: [...cartItems, { ...product, quantity: 1 }],
          });
        }
      },
      
      removeFromCart: (productId: string) => {
        const { cartItems } = get();
        set({
          cartItems: cartItems.filter((item) => item._id !== productId),
        });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        const { cartItems } = get();
        set({
          cartItems: cartItems.map((item) =>
            item._id === productId ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => {
        set({ cartItems: [] });
      },
      
      getTotalPrice: () => {
        const { cartItems } = get();
        return cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);

export const useCart = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const cartStore = useCartStore();
  
  const addToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart.",
      });
      router.push("/login");
      return;
    }
    
    cartStore.addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const removeFromCart = (productId: string) => {
    // Find the product name before removing it from cart
    const item = cartStore.cartItems.find(item => item._id === productId);
    const productName = item ? item.name : "Item";
    
    cartStore.removeFromCart(productId);
    toast({
      title: "Item Removed",
      description: `${productName} has been removed from your cart.`,
    });
  };
  
  return {
    ...cartStore,
    addToCart,
    removeFromCart,
  };
};
