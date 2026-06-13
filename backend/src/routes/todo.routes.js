import express from "express"
import { protect } from "../middleware/authenticate.js";
import { validateRequest } from "../middleware/validation.js";
import { createTodoSchema, updateTodoSchema } from "../schema/todoSchema.js";
import { createTodo } from "../controllers/todos/createTodo.js";
import { updateTodo } from "../controllers/todos/updateTodo.js";
import { deleteTodo } from "../controllers/todos/deleteTodo.js";
import { getAllTodos } from "../controllers/todos/getAllTodo.js";

const router = express.Router();


router.post("/todos", protect, validateRequest(createTodoSchema), createTodo)
router.patch("/todos/:id", protect, validateRequest(updateTodoSchema), updateTodo);
router.get("/todos", protect, getAllTodos);
router.delete("/todos/:id", protect, deleteTodo)


export default router;