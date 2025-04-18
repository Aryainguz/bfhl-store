import { ShoppingCart, Heart, Star, Pill, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { useCart } from "@/hooks/useCart";
import { formatCurrency, getStockStatus, getStockStatusColor } from "@/lib/utils";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addToCart } = useCart();
  const { _id, name, description, price, imageUrl, category, rating, isNew, discount, stock } = product;

  const handleAddToCart = () => {
    addToCart(product, 1); // Assuming quantity is 1 for simplicity
  };

  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const stockStatus = getStockStatus(stock);
  const stockStatusColor = getStockStatusColor(stock);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "medications":
      case "supplements":
        return <Pill className="h-4 w-4" />;
      case "equipment":
      case "devices":
        return <Stethoscope className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-healthcare transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 sm:h-auto sm:w-48 flex-shrink-0">
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
            {isNew && (
              <Badge className="absolute top-2 left-2 bg-brand-600">New</Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                {discount}% OFF
              </Badge>
            )}
          </div>
          <div className="flex flex-col flex-1 p-4">
            <div className="mb-2 flex items-center">
              <Badge variant="outline" className="mr-2 flex items-center gap-1">
                {getCategoryIcon(category)}
                {category}
              </Badge>
              {/* <div className="flex items-center text-amber-500 ml-auto">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-sm">{rating}</span>
              </div> */}
            </div>
            <h3 className="font-semibold text-lg truncate">
              <Link href={`/products/${_id}`} className="hover:text-brand-600 transition-colors">
                {name}
              </Link>
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
            
            <div className="mt-auto">
              <div className={`text-sm ${stockStatusColor} mb-2`}>
                {stockStatus}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">{formatCurrency(discountedPrice)}</span>
                  {discount > 0 && (
                    <span className="text-muted-foreground line-through text-sm">
                      {formatCurrency(price)}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                 
                  <Button 
                    onClick={handleAddToCart} 
                    disabled={stock <= 0}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {stock <= 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-healthcare transition-all duration-300 h-full flex flex-col">
      <Link href={`/products/${_id}`} className="block overflow-hidden relative aspect-square">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {isNew && (
          <Badge className="absolute top-2 left-2 bg-brand-600">New</Badge>
        )}
        {discount > 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            {discount}% OFF
          </Badge>
        )}
      </Link>
      
      <CardContent className="p-4 flex-grow">
        <div className="mb-2 flex items-center">
          <Badge variant="outline" className="mr-2 flex items-center gap-1 text-xs">
            {getCategoryIcon(category)}
            {category}
          </Badge>
          <div className="flex items-center text-amber-500 ml-auto">
            <span className="ml-1 text-xs">

              {
                product.isNew && (
                  <span className="text-amber-500 font-bold">NEW</span>
                ) 
              }
            </span>
          </div>
        </div>
        
        <h3 className="font-semibold text-base mb-1 truncate">
          <Link href={`/products/${_id}`} className="hover:text-brand-600 transition-colors">
            {name}
          </Link>
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2 h-10">{description}</p>
        
        <div className={`text-xs ${stockStatusColor} mt-2`}>
          {stockStatus}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-lg">{formatCurrency(discountedPrice)}</span>
          {discount > 0 && (
            <span className="text-muted-foreground line-through text-sm">
              {formatCurrency(price)}
            </span>
          )}
        </div>
        
        <div className="flex space-x-1">
          
          <Button 
            size="icon" 
            className="h-11 w-11 bg-brand-600 cursor-pointer bg-blue-500 hover:bg-brand-700"
            disabled={stock <= 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
