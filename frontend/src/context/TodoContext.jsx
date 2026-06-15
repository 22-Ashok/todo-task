import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

const TodoContext = createContext(null);

const DEFAULT_CATEGORIES = [
  { id: 'c1', name: 'Engineering', description: 'Software architecture & releases', icon: 'Code', color: 'primary', status: 'High Priority' },
  { id: 'c2', name: 'Product Design', description: 'Design tokens & UI systems', icon: 'Palette', color: 'secondary', status: 'In Review' },
  { id: 'c3', name: 'Marketing', description: 'Campaigns & growth initiatives', icon: 'Megaphone', color: 'tertiary', status: 'Urgent' },
  { id: 'c4', name: 'Personal', description: 'Routine & personal life goals', icon: 'User', color: 'outline', status: 'Routine' }
];

export function TodoProvider({ children }) {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global Dialog controllers accessible by any subcomponent/sidebar
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [presetCategoryForNewTodo, setPresetCategoryForNewTodo] = useState('c1');

  // Edit Todo modal state
  const [isEditTodoOpen, setIsEditTodoOpen] = useState(false);
  const [editTodoData, setEditTodoData] = useState(null);

  // Edit Category modal state
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState(null);

  // Load initial data from database when user session is active
  useEffect(() => {
    async function loadWorkspaceData() {
      if (!user) {
        setTodos([]);
        setCategories([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [fetchedTodos, fetchedCategories] = await Promise.all([
          api.getTodos(),
          api.getCategories()
        ]);

        const rawTodos = fetchedTodos.data?.todos || fetchedTodos.todos || fetchedTodos || [];
        const rawCategories = fetchedCategories.data?.categories || fetchedCategories.categories || fetchedCategories || [];

        // Normalize ids (handling _id from Mongoose or id from standard relational DBs)
        const normalizedCats = rawCategories.map(cat => ({
          ...cat,
          id: cat.id || cat._id
        }));

        const normalizedTodos = rawTodos.map(todo => ({
          ...todo,
          id: todo.id || todo._id,
          completed: todo.is_completed,
          // Support relational joins or straight identifiers
          category: todo.category?.id || todo.category?._id || todo.category || todo.category_id,
          createdAt: todo.createdAt || new Date().toISOString()
        }));

        setTodos(normalizedTodos);

        // Onboarding checklist: If database categories are empty, seed default ones or set state
        if (normalizedCats.length === 0) {
          // Attempt to register default categories on the backend so they persist permanently
          const seededCats = [];
          for (const item of DEFAULT_CATEGORIES) {
            try {
              const res = await api.createCategory({
                name: item.name,
                color: item.color,
                icon: item.icon,
                description: item.description,
                status: item.status
              });
              const rawData = res.data?.category || res.category || res;
              seededCats.push({ ...rawData, id: rawData.id || rawData._id });
            } catch (err) {
            }
          }
          setCategories(seededCats.length > 0 ? seededCats : DEFAULT_CATEGORIES);
        } else {
          setCategories(normalizedCats);
        }

      } catch (err) {
        setError("Database Connection Notice: Make sure your API backend at http://localhost:8000 is running!");
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaceData();
  }, [user]);

  // Actions
  const addTodo = async (title, description, priority, categoryId, dueDate) => {
    try {
      const payload = {
        title,
        description,
        priority,
        category_id: categoryId && !isNaN(parseInt(categoryId)) ? parseInt(categoryId) : null,
        due_date: dueDate && dueDate !== 'No due date' ? new Date(dueDate) : null
      };

      const response = await api.createTodo(payload);
      const data = response.data?.todo || response.todo || response;

      const normalized = {
        ...data,
        id: data.id || data._id || `task_${Date.now()}`,
        completed: data.is_completed,
        category: data.category?.id || data.category?._id || data.category || data.category_id || categoryId,
        createdAt: data.createdAt || new Date().toISOString()
      };

      setTodos(prev => [...prev, normalized]);
      setIsAddTodoOpen(false);
    } catch (err) {
      alert(`Network/Validation Failure: ${err.message}`);
    }
  };

  const deleteTodo = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      // Optimistic delete
      const previousTodos = [...todos];
      setTodos(prev => prev.filter(t => t.id !== id && t._id !== id));

      try {
        await api.deleteTodo(id);
      } catch (err) {
        setTodos(previousTodos);
        alert(`Failed to delete todo from database: ${err.message}`);
      }
    }
  };

  const toggleCompleteTodo = async (id) => {
    const todoIndex = todos.findIndex(t => t.id === id || t._id === id);
    if (todoIndex === -1) return;

    const targetTodo = todos[todoIndex];
    const originalCompletedValue = targetTodo.completed;
    const nextCompletedValue = !targetTodo.completed;

    // Snappy optimistic screen render
    setTodos(prev => prev.map((t, idx) => idx === todoIndex ? { ...t, completed: nextCompletedValue } : t));

    try {
      await api.updateTodo(id, { is_completed: nextCompletedValue });
    } catch (err) {
      // Revert if database save failed
      setTodos(prev => prev.map((t, idx) => idx === todoIndex ? { ...t, completed: originalCompletedValue } : t));
      alert(`Database update rejected: ${err.message}`);
    }
  };

  const addCategory = async (name, color, icon) => {
    try {
      const payload = {
        name,
        color,
        icon,
        description: 'Custom category workspace',
        status: 'Active'
      };

      const response = await api.createCategory(payload);
      const data = response.data?.category || response.category || response;

      const normalized = {
        ...data,
        id: data.id || data._id || `cat_${Date.now()}`
      };

      setCategories(prev => [...prev, normalized]);
      setIsAddCategoryOpen(false);
    } catch (err) {
      alert(`Failed to register custom category on database: ${err.message}`);
    }
  };

const updateTodo = async (id, updates) => {
    try {
      const res = await api.updateTodo(id, updates);
      const data = res.data?.todo || res.todo || res;
      const normalized = {
        ...data,
        id: data.id || data._id,
        completed: data.is_completed,
        category: data.category?.id || data.category?._id || data.category || data.category_id,
        createdAt: data.createdAt || new Date().toISOString(),
      };
      setTodos(prev => prev.map(t => (String(t.id) === String(id) ? normalized : t)));
      setIsEditTodoOpen(false);
      setEditTodoData(null);
    } catch (err) {
      alert(`Failed to update task: ${err.message}`);
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const res = await api.updateCategory(id, updates);
      const data = res.data?.category || res.category || res;
      const normalized = { ...data, id: data.id || data._id };
      setCategories(prev => prev.map(c => (String(c.id) === String(id) ? normalized : c)));
      setIsEditCategoryOpen(false);
      setEditCategoryData(null);
    } catch (err) {
      alert(`Failed to update category: ${err.message}`);
    }
  };

return (
    <TodoContext.Provider value={{
      todos,
      categories,
      addTodo,
      deleteTodo,
      toggleCompleteTodo,
      updateTodo,
      updateCategory,
      addCategory,
      isAddTodoOpen,
      setIsAddTodoOpen,
      isAddCategoryOpen,
      setIsAddCategoryOpen,
      presetCategoryForNewTodo,
      setPresetCategoryForNewTodo,
      isEditTodoOpen,
      setIsEditTodoOpen,
      editTodoData,
      setEditTodoData,
      isEditCategoryOpen,
      setIsEditCategoryOpen,
      editCategoryData,
      setEditCategoryData,
      loading,
      error
    }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}
