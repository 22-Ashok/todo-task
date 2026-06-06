import { z } from 'zod';

// 1. Schema for incoming Express requests (e.g., User Registration)
export const createUserSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name cannot be empty")
    .max(100, "Name cannot exceed 100 characters"), // Matches varchar(100)
    
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .max(255, "Email cannot exceed 255 characters"), // Matches varchar(255)
    
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"), // Added a standard secure minimum length
});


export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .max(255, "Email cannot exceed 255 characters"), 
    
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password cannot be empty"), 
});