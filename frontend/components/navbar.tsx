"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Menu, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CartDropdown from "./cart-dropdown";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();
  const itemCount = cartItems.length;
  const { isAuthenticated, user,setUser,setAuthState } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Logout failed");
      }

      setUser(null);
      setAuthState(false);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "error",
      });
    }
  };

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200"
            >
              <Image
                src="/images/logo.png"
                alt="BFHL Store Logo"
                width={40}
                height={40}
                className="rounded-lg shadow-sm"
              />
              <span className="text-3xl font-bold text-primary tracking-wide">
                BFHL<span className="text-blue-500"> Store.</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link href="/products" className="nav-link font-medium">
                Products
              </Link>
              <Link href="/products" className="nav-link font-medium">
                Categories
              </Link>
              <Link href="https://www.bajajfinservhealth.in" target="_blank" className="nav-link font-medium">
                About
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
                {isCartOpen && (
                  <CartDropdown onClose={() => setIsCartOpen(false)} />
                )}
              </div>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="cursor-pointer">
                          {user?.name
                            ? user.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')
                                .toUpperCase()
                            : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>{user?.email}</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative text-primary"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/products"
              className="block px-3 py-2 text-base font-medium nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="block px-3 py-2 text-base font-medium nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Logged in as {user?.email}
                </div>
                <Button
                  className="w-full cursor-pointer"
                  variant="outline"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 text-base font-medium nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 text-base font-medium nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}

            <Link href="/cart" className="mt-4 block">
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart ({itemCount})
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}