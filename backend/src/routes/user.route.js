import express from 'express';
import { validateRequest } from '../middleware/validation.js';
import { createUserSchema, signInSchema  } from '../schema/userSchema.js';
import { signup } from '../controllers/signup.js';
import { signin } from '../controllers/signin.js';

const router = express.Router();
router.post("/sign-up", validateRequest(createUserSchema), signup);
router.post("/sign-in", validateRequest(signInSchema), signin)

export default router;