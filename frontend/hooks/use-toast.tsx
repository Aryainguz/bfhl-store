import * as React from "react";
import { toast as sonnerToast, Toaster } from "sonner";

type ToastProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning" | "info";
};


function toast({ title, description }: ToastProps): void {
  sonnerToast(title, { 
    description: description,
    duration: 3000,
    style: {
      backgroundColor: "#1e40af",
      color: "white",
    },
  });
 
}

function useToast() {
  return { toast };
}

export { useToast, toast, Toaster };