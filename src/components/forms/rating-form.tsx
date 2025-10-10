"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ReviewProductValidators } from "@/validators";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { OrderItem, Product } from "@prisma/client";
import { RatingInput } from "@/components/globals/rating-input";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import MultipleImageUpload from "@/components/globals/multiple-image-upload";

const RatingForm = ({
  selectedProduct,
  onClose,
}: {
  selectedProduct: {
    product: Product;
    orderItem: OrderItem;
  } | null;
  onClose: () => void;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof ReviewProductValidators>>({
    resolver: zodResolver(ReviewProductValidators),
    defaultValues: {
      rating: 0,
      review: "",
      images: [],
      isAnonymous: false,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof ReviewProductValidators>) {
    try {
      const response = await fetch("/api/v1/customer/product-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: values.rating,
          review: values.review,
          images: values.images || [],
          isAnonymous: values.isAnonymous ?? false,
          productId: selectedProduct?.product.id,
        }),
      });

      const res = await response.json();

      if (response.ok && res.success) {
        router.refresh();
        toast.success(res.success);
        onClose();
      } else {
        toast.error(res.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Submit review error:", error);
      toast.error("Failed to submit a review");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-start gap-2">
          <div className="relative w-40 h-24">
            <Image
              src={selectedProduct?.product.images[0] || ""}
              alt={selectedProduct?.product.name || ""}
              fill
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div>
            <p className="font-semibold text-sm line-clamp-2">
              {selectedProduct?.product.name}
            </p>
            <p className="text-sm text-muted-foreground">
              Quantity: {selectedProduct?.orderItem.quantity}
            </p>
            <p className="text-sm text-burgundy">
              Price: ₱{selectedProduct?.orderItem.price}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border-b pb-2 mt-3">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="relative flex flex-col gap-2">
                <FormControl>
                  <RatingInput {...field} />
                </FormControl>
                <p className="text-center text-sm">
                  Rate this product <span className="text-red-600">*</span>
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Write a review</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isSubmitting}
                    placeholder="Share your thoughts..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>
                  Add photos{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <MultipleImageUpload
                    maxImages={3}
                    onImageUpload={(urls: string[]) => field.onChange(urls)}
                    disabled={isSubmitting}
                    defaultValues={field.value?.map((file: File | string) =>
                      typeof file === "string"
                        ? file
                        : URL.createObjectURL(file)
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isAnonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Make review anonymous</FormLabel>
                  <FormDescription>
                    Your name will not be displayed with the review.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full mt-7" type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Submit Review
        </Button>
      </form>
    </Form>
  );
};

export default RatingForm;
