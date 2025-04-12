import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency:"INR",
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function calculateDiscountedPrice(price: number, discountPercentage: number): number {
  return price * (1 - discountPercentage / 100);
}

export function getStockStatus(stock: number): "Out of Stock" | "Low Stock" | "In Stock" {
  if (stock <= 0) return "Out of Stock";
  if (stock < 10) return "Low Stock";
  return "In Stock";
}

export function getStockStatusColor(stock: number): string {
  if (stock <= 0) return "text-red-500";
  if (stock < 10) return "text-amber-500";
  return "text-green-600";
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
}
