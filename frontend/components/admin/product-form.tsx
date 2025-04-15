"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Product, ProductFormData, Category } from "@/types";
import { useToast } from "@/hooks/use-toast";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(1, "Please select a category"),
  imageUrl: z.string().url("Please enter a valid URL"),
  isNew: z.boolean(),
  discount: z.coerce.number().min(0).max(100),
  stock: z.coerce.number().int().nonnegative(),
  usage: z.string().optional(),
});

type ProductFormProps = {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  categories: any;
  usageTypes?: string[];
};

export default function ProductForm({
  product,
  onSubmit,
  categories,
  usageTypes = [],
}: ProductFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl,
          isNew: product.isNew ?? false,
          discount: product.discount,
          stock: product.stock,
          usage: product.usage,
        }
      : {
          name: "",
          description: "",
          price: 0,
          category: "",
          imageUrl: "",
          isNew: false as boolean,
          discount: 0,
          stock: 0,
          usage: "",
        },
  });

  const handleSubmit = async (data: z.infer<typeof productSchema>) => {
    setIsSubmitting(true);
    try {
      onSubmit(data as ProductFormData);
      toast({
        title: product ? "Product updated" : "Product created",
        description: `${data.name} has been ${
          product ? "updated" : "created"
        } successfully.`,
      });
      if (!product) {
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was an error submitting the form. Please try again.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {usageTypes.length > 0 && (
              <FormField
                control={form.control}
                name="usage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select usage type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {usageTypes.map((usage) => (
                          <SelectItem key={usage} value={usage}>
                            {usage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="isNew"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">Mark as New</FormLabel>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("imageUrl") && (
              <div className="h-40 w-40 mx-auto overflow-hidden rounded-md border">
                <img
                  src={form.watch("imageUrl")}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/400x400/cccccc/666666?text=No+Image";
                  }}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isSubmitting
              ? "Saving..."
              : product
              ? "Update Product"
              : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
