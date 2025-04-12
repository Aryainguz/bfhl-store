"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { Menu, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CartDropdown from "./cart-dropdown";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();
  const itemCount = cartItems.length;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
              <Link href="/categories" className="nav-link font-medium">
                Categories
              </Link>
              <Link href="/about" className="nav-link font-medium">
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
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">/login</Link>
                </Button>
              )}

              {!isAuthenticated && (
                <Button size="sm" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
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
            <div className="mb-4">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full"
              />
            </div>

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

            <div className="pt-4 flex space-x-3">
              {isAuthenticated ? (
                <Link href="/profile" className="w-full">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="w-1/2">
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      /login
                    </Button>
                  </Link>
                  <Link href="signup" className="w-1/2">
                    <Button
                      className="w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

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
