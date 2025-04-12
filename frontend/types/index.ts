export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    rating: number;
    isNew?: boolean;
    discount: number;
    stock: number;
    usage?: string; 
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
    usage?: string; 
  }
  
  export interface Category {
    id: string;
    name: string;
    count: number;
    icon: React.ElementType;
  }
  