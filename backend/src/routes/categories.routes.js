import express from 'express';
import { protect } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validation.js';
import { createCategorySchema } from '../schema/categorySchema.js';
import { createCategory } from '../controllers/categories/createCategories.js';
import { updateCategory } from '../controllers/categories/updateCategories.js';
import { deleteCategory } from '../controllers/categories/deleteCategories.js';
import { getAllCategories } from '../controllers/categories/getCategories.js';

const router = express.Router();

router.post("/categories", protect, validateRequest(createCategorySchema), createCategory);
router.patch("/categories/:id", protect, validateRequest(createCategorySchema), updateCategory);
router.delete("/categories/:id", protect, deleteCategory);
router.get("/categories", protect, getAllCategories)

export default router;