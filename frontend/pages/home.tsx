"use client";


import Footer from "@/components/footer";
import NavBar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useProductStore } from "@/hooks/useProductsStore";
import { popularCategories } from "@/data/mock-data";

export default function Index() {
  const { products, setProducts } = useProductStore();
  
  // Ensure that products is an array before slicing
  const displayedProducts = Array.isArray(products) ? products.slice(0, 4) : [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        console.log(data.data)
        setProducts(data.data); // Update Zustand store with fetched products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);



  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow">
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <Badge className="bg-blue-500 text-white border-none animate-fade-in">
                  Healthcare Innovation 2025
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in">
                  Discover Healthcare Excellence
                </h1>
                <p className="text-lg md:text-xl opacity-80 animate-fade-in delay-100">
                  Explore our curated selection of premium healthcare products
                  and wellness solutions.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in delay-200">
                  <Button
                    asChild
                    size="default"
                    className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg px-8 py-6 text-base font-semibold border border-transparent rounded-lg"
                  >
                    <Link href="/products">Shop Healthcare</Link>
                  </Button>

                  <div className="relative inline-flex group">
                    <div className="absolute transition-all duration-1000 opacity-70 inset-0 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
                    <Link
                      href="/dashboard"
                      className="relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                      role="button"
                    >
                      Get Started Today
                    </Link>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Healthcare Products"
                  className="rounded-lg shadow-2xl transform transition-transform hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Popular Categories</h2>
              <Link
                href="/products"
                className="text-primary flex items-center hover:underline"
              >
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popularCategories.map((category,index) => (
                <Link
                  key={index}
                  href={`/products`}
                  className="bg-card hover:bg-accent transition-colors rounded-lg p-4 text-center group"
                >
                  <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.count} products
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <Link
                href="/products"
                className="text-primary flex items-center hover:underline"
              >
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="product-grid">
              {displayedProducts.map((product,index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore our catalog and discover amazing products with fast
              shipping and excellent customer service.
            </p>
            <Button asChild size="lg">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
