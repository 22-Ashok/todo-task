import express from 'express';
import { validateRequest } from '../middleware/validation.js';
import { createUserSchema, signInSchema  } from '../schema/userSchema.js';
import { signup } from '../controllers/auth/signup.js';
import { signin } from '../controllers/auth/signin.js';

const router = express.Router();
router.post("/register", validateRequest(createUserSchema), signup);
router.post("/login", validateRequest(signInSchema), signin)

export default router;