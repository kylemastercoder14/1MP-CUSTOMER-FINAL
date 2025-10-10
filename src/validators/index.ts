import { z } from "zod";

export const ReviewProductValidators = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  review: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review must be less than 500 characters"),
  images: z.array(z.string().url()).nullable(),
  isAnonymous: z.boolean().optional(),
});
