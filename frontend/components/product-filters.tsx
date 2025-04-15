"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface FiltersProps {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  onFilterChange: (filters: {
    categories: string[];
    priceRange: [number, number];
    ratings: number[];
  }) => void;
}

export default function ProductFilters({
  categories,
  minPrice,
  maxPrice,
  onFilterChange,
}: FiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category);
    
    setSelectedCategories(newCategories);
    onFilterChange({
      categories: newCategories,
      priceRange,
      ratings: selectedRatings,
    });
  };

  const handlePriceChange = (value: number[]) => {
    const newPriceRange: [number, number] = [value[0], value[1]];
    setPriceRange(newPriceRange);
    onFilterChange({
      categories: selectedCategories,
      priceRange: newPriceRange,
      ratings: selectedRatings,
    });
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    const newRatings = checked
      ? [...selectedRatings, rating]
      : selectedRatings.filter((r) => r !== rating);
    
    setSelectedRatings(newRatings);
    onFilterChange({
      categories: selectedCategories,
      priceRange,
      ratings: newRatings,
    });
  };

  const generateStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["categories", "price", "rating"]}>
        <AccordionItem value="categories">
          <AccordionTrigger className="text-lg font-semibold">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category, checked === true)
                    }
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-lg text-blue-500 font-semibold">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 px-2">
              <Slider
                defaultValue={[minPrice, maxPrice]}
                min={minPrice}
                max={maxPrice}
                step={10}
                value={[priceRange[0], priceRange[1]]}
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between mt-2 text-sm">
                <span>{formatCurrency(priceRange[0])}</span>
                <span>{formatCurrency(priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger className="text-lg font-semibold">Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={selectedRatings.includes(rating)}
                    onCheckedChange={(checked) =>
                      handleRatingChange(rating, checked === true)
                    }
                  />
                  <label
                    htmlFor={`rating-${rating}`}
                    className="flex items-center space-x-2 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {generateStars(rating)}
                    <span className="ml-1">{rating === 1 ? "& up" : "& up"}</span>
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
