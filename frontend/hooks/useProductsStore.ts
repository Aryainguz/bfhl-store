import { Product } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductStore {
  products: Product[];
  filteredProducts: Product[];
  setProducts: (products: Product[]) => void;
  setFilteredProducts: (products: Product[]) => void;
  updateProduct: (updatedProduct: Product) => void;
  removeProduct: (id: string) => void;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      filteredProducts: [],

      setProducts: (products) => set({ products }),
      setFilteredProducts: (products) => set({ filteredProducts: products }),

      updateProduct: (updatedProduct) =>
        set((state) => ({
          products: state.products.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
          ),
        })),

      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product._id !== id),
        })),

      fetchProducts: async () => {
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
          set({
            products: data.data,
            filteredProducts: data.data,
          });
        } catch (error) {
          console.error("Failed to fetch products", error);
        }
      },
    }),
    {
      name: "product-store", // LocalStorage key
      partialize: (state) => ({
        products: state.products,
        filteredProducts: state.filteredProducts,
      }),
    }
  )
);
