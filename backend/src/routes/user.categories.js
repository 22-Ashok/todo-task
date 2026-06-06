import express from 'express';
import { protect } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validation.js';
import { createCategorySchema } from '../schema/categorySchema.js';
import { createCategory } from '../controllers/categories/createCategories.js';


const router = express.Router();

router.post("/categories", protect, validateRequest(createCategorySchema), createCategory);


export default router;