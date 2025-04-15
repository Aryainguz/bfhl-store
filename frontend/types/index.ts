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
    id: string;
    rating: number;
  }
  
  export interface Category {
    
    id: string;
    name: string;
    count: number;
    icon: React.ElementType;
  }
  