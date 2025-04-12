import { Category, Product } from "@/types";
import {
  Droplet,
  Dumbbell,
  Heart,
  HeartPulse,
  Leaf,
  Shield,
  Tablet,
  Thermometer,
} from "lucide-react";

export const productCategories = [
  "Fitness Supplements",
  "Wellness Essentials",
  "Personal Care",
  "Health & Wellness",
  "Nutrition",
  "Medical Devices",
  "Vitamins",
  "First Aid",
];

export const popularCategories: Category[] = [
  {
    id: "supplements",
    name: "Fitness Supplements",
    count: 124,
    icon: Dumbbell,
  },
  {
    id: "wellness",
    name: "Wellness Essentials",
    count: 84,
    icon: HeartPulse,
  },
  {
    id: "personal-care",
    name: "Personal Care",
    count: 97,
    icon: Droplet,
  },
  {
    id: "health",
    name: "Health & Wellness",
    count: 65,
    icon: Heart,
  },
  {
    id: "nutrition",
    name: "Nutrition",
    count: 78,
    icon: Leaf,
  },
  {
    id: "medical",
    name: "Medical Devices",
    count: 43,
    icon: Thermometer,
  }
];

const createProduct = (
  id: string,
  name: string,
  description: string,
  price: number,
  category: string,
  rating: number,
  imageUrl: string,
  isNew: boolean = false,
  discount: number = 0,
  stock: number = 10
): Product => ({
  id,
  name,
  description,
  price,
  category,
  rating,
  imageUrl,
  isNew,
  discount,
  stock,
});

export const featuredProducts: Product[] = [
  createProduct(
    "product-1",
    "Premium Protein Powder",
    "Boost your muscle recovery and performance with this high-quality protein powder.",
    39.99,
    "Fitness Supplements",
    4.7,
    "https://images.unsplash.com/photo-1585238342023-62dbf8e771d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    true,
    10,
    15
  ),
  createProduct(
    "product-2",
    "Digital Thermometer",
    "Accurate digital thermometer for quick temperature readings.",
    19.99,
    "Wellness Essentials",
    4.8,
    "https://images.unsplash.com/photo-1593032465178-c1b50d9d52c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    false,
    0,
    8
  ),
  createProduct(
    "product-3",
    "Soothing Muscle Ointment",
    "Relieve muscle tension and soreness with this fast-absorbing ointment.",
    9.99,
    "Personal Care",
    4.5,
    "https://images.unsplash.com/photo-1584036561596-bf91a1d19e47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    true,
    5,
    3
  ),
  createProduct(
    "product-4",
    "Electrolyte Drink Mix",
    "Replenish fluids and electrolytes with this refreshing drink mix.",
    14.99,
    "Nutrition",
    4.6,
    "https://images.unsplash.com/photo-1571019613570-5b1ebfede8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    false,
    15,
    12
  ),
  createProduct(
    "product-5",
    "Vitamin D3 Softgels",
    "Support bone health with these easy-to-swallow vitamin D3 softgels.",
    12.99,
    "Vitamins",
    4.7,
    "https://images.unsplash.com/photo-1590487980918-0ef2af03b44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    true,
    0,
    20
  ),
  createProduct(
    "product-6",
    "Herbal Tea Blend",
    "Relax and rejuvenate with this soothing herbal tea blend.",
    8.99,
    "Health & Wellness",
    4.4,
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    false,
    10,
    5
  ),
  createProduct(
    "product-7",
    "Probiotic Tablet",
    "Enhance gut health with these high-potency probiotic Tablet.",
    24.99,
    "Health & Wellness",
    4.7,
    "https://images.unsplash.com/photo-1588774069213-31b4eab7cbf7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    false,
    0,
    14
  ),
  createProduct(
    "product-8",
    "Energy Bar Pack",
    "Fuel your workouts with these nutrient-packed energy bars.",
    5.99,
    "Nutrition",
    4.5,
    "https://images.unsplash.com/photo-1542444459-db8b50f81420?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    true,
    5,
    25
  ),
  createProduct(
    "product-9",
    "Multivitamin Gummies",
    "Delicious gummies to help support your daily vitamin intake.",
    10.99,
    "Vitamins",
    4.6,
    "https://images.unsplash.com/photo-1614591689743-9ebd701c8b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    false,
    0,
    18
  ),
  createProduct(
    "product-10",
    "Joint Support Supplement",
    "Promote joint health and mobility with this natural supplement.",
    29.99,
    "Fitness Supplements",
    4.8,
    "https://images.unsplash.com/photo-1589195441575-6592c2e35dcf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    false,
    15,
    10
  ),
  createProduct(
    "product-11",
    "Immunity Booster Serum",
    "Strengthen your immune system with this advanced serum formula.",
    22.99,
    "Personal Care",
    4.7,
    "https://images.unsplash.com/photo-1598928506310-583f9b3f9e8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    false,
    0,
    12
  ),
  createProduct(
    "product-12",
    "Natural Sleep Aid",
    "Promote restful sleep with this gentle, all-natural sleep aid.",
    17.99,
    "Wellness Essentials",
    4.5,
    "https://images.unsplash.com/photo-1509223197845-458d87318791?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    true,
    0,
    6
  ),
];

export const allProducts: Product[] = [
  ...featuredProducts,
  ...Array.from({ length: 18 }, (_, i) => {
    const baseProduct = featuredProducts[i % featuredProducts.length];
    return {
      ...baseProduct,
      id: `product-${featuredProducts.length + i + 1}`,
      name: `${baseProduct.name} ${i + 1}`,
      price: Math.round(baseProduct.price * (0.8 + Math.random() * 0.4) * 100) / 100,
      isNew: Math.random() > 0.8,
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 5 : 0,
      stock: Math.floor(Math.random() * 30),
    };
  }),
];