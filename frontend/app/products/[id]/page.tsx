"use client";

import Footer from "@/components/footer";
import NavBar from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/hooks/useCart";
import { useProductStore } from "@/hooks/useProductsStore";
import { formatCurrency, getStockStatus, getStockStatusColor } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const { id }:any = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  
  // Local state for the current product and loading/error handling
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { products,fetchProducts } = useProductStore();


  // When the store's products or the `id` changes, look for the product in the store
  useEffect(() => {
    if (!id) return;
  
    const loadProduct = async () => {
      try {

       // if products is empty, fetch products
        // if (products.length === 0) {
          await fetchProducts();
        // }
        
        // First, check in store
        const found = products.find((p) => p._id === id);
  
        if (found) {
          setProduct(found);
          setLoading(false);
        } else {
          setLoading(true);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);


          if (!res.ok) {
            throw new Error("Failed to fetch product");
          }
          const data = await res.json();
          setProduct(data.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Failed to load product.");
        setLoading(false);
      }
    };
  
    loadProduct();
  }, [id, products]);
  

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">
            The product you are looking for doesn not exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate discounted price if a discount applies
  const discountedPrice =
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;
      
  const stockStatus = getStockStatus(product.stock);
  const stockStatusColor = getStockStatusColor(product.stock);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/products"
            className="flex items-center text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>
        <div className="lg:grid lg:grid-cols-2 gap-10">
          {/* Product Images */}
          <div className="mb-8 lg:mb-0">
            <div className="bg-white rounded-lg overflow-hidden border shadow-healthcare">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-auto object-cover aspect-square"
              />
            </div>
          </div>
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <Badge variant="outline" className="mr-2">
                  {product.category}
                </Badge>
                {product.isNew && <Badge className="bg-brand-600">New</Badge>}
              </div>
              <h1 className="text-3xl font-display font-bold">{product.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center text-amber-500">
                
                  <span className="ml-2 text-sm text-gray-600">
                   {
                    product.isNew ? "New Arrival" : "Best Seller"
                   }
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-brand-800">
                  {formatCurrency(discountedPrice)}
                </span>
                {product.discount > 0 && (
                  <span className="text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
                {product.discount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>
              <div className={`flex items-center mt-4 ${stockStatusColor}`}>
                {stockStatus === "In Stock" ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : stockStatus === "Low Stock" ? (
                  <Clock className="h-4 w-4 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-1" />
                )}
                <span>{stockStatus}</span>
                {stockStatus === "Low Stock" && (
                  <span className="ml-1 text-sm">(Only {product.stock} left)</span>
                )}
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-1/3">
                  <div className="relative">
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-brand-600 focus:border-brand-600 rounded-md"
                      disabled={product.stock === 0}
                    >
                      {[...Array(Math.min(10, product.stock || 1))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button
                  onClick={() => addToCart(product, quantity)}
                  disabled={product.stock === 0}
                  className="w-full sm:w-2/3 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <Tabs defaultValue="details">
                <TabsList className="w-full">
                  <TabsTrigger value="details" className="flex-1">
                    Details
                  </TabsTrigger>
                  
                  <TabsTrigger value="shipping" className="flex-1">
                    Shipping
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Category
                        </h3>
                        <p>{product.category}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Product ID</h3>
                        <p>BF-{product._id}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Formulation
                        </h3>
                        <p>Professional Grade</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Storage
                        </h3>
                        <p>Store in a cool, dry place</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="shipping" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Orders over ₹300 qualify for free shipping. Standard shipping takes 3-5 business days.
                      Express shipping (2 business days) is available for an additional fee.
                    </p>
                    <p className="text-gray-700">
                      All products are shipped in temperature-controlled packaging when necessary
                      to maintain product integrity.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}