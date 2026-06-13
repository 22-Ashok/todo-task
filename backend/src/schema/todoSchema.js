import { z } from 'zod';


const PriorityEnum = z.enum(['low', 'medium', 'high']);

export const createTodoSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(255, 'Title cannot exceed 255 characters'),

  description: z
    .string()
    .optional(),

  category_id: z
    .number()
    .int()
    .positive()
    .optional(),

  priority: PriorityEnum.optional(),

  due_date: z
    .coerce
    .date({ invalid_type_error: "Invalid date format" })
    .optional(),
});


export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(255, 'Title cannot exceed 255 characters')
    .optional(),

  description: z
    .string()
    .optional(),

  category_id: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional(),

  priority: PriorityEnum.optional(),

  is_completed: z
    .boolean({ invalid_type_error: "is_completed must be a boolean (true/false)" })
    .optional(),

  due_date: z
    .coerce
    .date()
    .nullable() // Allows removing a due date
    .optional(),
});