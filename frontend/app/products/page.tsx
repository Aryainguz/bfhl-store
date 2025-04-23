import { Suspense } from 'react';
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import ClientProductGrid from '@/components/client-productsGrid';

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Browse through our extensive collection of products.
          </p>
        </div>
        <Suspense fallback={<div>Loading products...</div>}>
          <ClientProductGrid />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}