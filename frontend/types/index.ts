export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    rating: number;
    isNew?: boolean;
    discount: number;
    stock: number;
  }
  
  export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    isNew?: boolean;
    discount: number;
    stock: number;
    id: string;
    rating: number;
  }
  
  export interface Category {
    
    id: string;
    name: string;
    count: number;
    icon: React.ElementType;
  }
  
  export interface Coupon {
    id: string;
    code: string;
    discountAmount: number;
    expiresAt: Date;
    usedCount: number;
    minOrderValue?: number;
    maxUses?: number;
    createdAt: Date;
  }
  
  export interface CouponFormData {
    code: string;
    discountAmount: number;
    expiresAt: Date;
    minOrderValue?: number;
    maxUses?: number;
  }