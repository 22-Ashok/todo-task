import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .min(1, "Category name cannot be empty")
    .max(100, "Category name cannot exceed 100 characters"), 
});