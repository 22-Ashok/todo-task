import express from "express"
import { protect } from "../middleware/authenticate.js";
import { validateRequest } from "../middleware/validation.js";
import { createTodoSchema } from "../schema/todoSchema.js";
import { createTodo } from "../controllers/todos/createTodo.js";

const router = express.Router();


router.post("/todos", protect, validateRequest(createTodoSchema), createTodo)


export default router;