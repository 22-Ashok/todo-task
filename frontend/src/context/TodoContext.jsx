import React, { createContext, useContext, useState, useEffect } from 'react';

const TodoContext = createContext(null);

const DEFAULT_TODOS = [
  {
    id: 't1',
    title: 'Finalize Q3 API Documentation',
    description: 'Review all endpoints with the backend team and ensure Swagger docs are up to date before deployment.',
    completed: false,
    priority: 'high',
    dueDate: 'Due Today',
    category: 'c1',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 't2',
    title: 'Review Pull Request #402',
    description: 'Refactoring the authentication middleware for better performance.',
    completed: false,
    priority: 'medium',
    dueDate: 'Due Tomorrow',
    category: 'c1',
    createdAt: new Date().toISOString()
  },
  {
    id: 't3',
    title: 'Update Design System Colors',
    description: 'Sync Figma tokens with Tailwind config to ensure emerald accents are consistent.',
    completed: true,
    priority: 'low',
    dueDate: 'Tomorrow',
    category: 'c2',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 't4',
    title: 'Client Meeting Notes',
    description: 'Synthesize user feedback on checkout patterns and compile presentation deck.',
    completed: false,
    priority: 'medium',
    dueDate: 'No due date',
    category: 'c4',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 't5',
    title: 'Bug: Mobile Nav Overlap',
    description: 'Fix the z-index overlap on small screens where the primary FAB hides the last task item.',
    completed: false,
    priority: 'high',
    dueDate: 'Due Today',
    category: 'c1',
    createdAt: new Date().toISOString()
  },
  {
    id: 't6',
    title: 'Weekly Team Sync',
    description: 'Prepare the agile retrospectives slides and grab metrics for sprint velocity.',
    completed: false,
    priority: 'medium',
    dueDate: 'Due Tomorrow',
    category: 'c1',
    createdAt: new Date().toISOString()
  },
  {
    id: 't7',
    title: 'Design System Audit',
    description: 'Review color tokens audit report for legacy component compliance.',
    completed: false,
    priority: 'medium',
    dueDate: 'Oct 24',
    category: 'c2',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_CATEGORIES = [
  { id: 'c1', name: 'Engineering', description: 'Software architecture & releases', icon: 'Code', color: 'primary', status: 'High Priority' },
  { id: 'c2', name: 'Product Design', description: 'Design tokens & UI systems', icon: 'Palette', color: 'secondary', status: 'In Review' },
  { id: 'c3', name: 'Marketing', description: 'Campaigns & growth initiatives', icon: 'Megaphone', color: 'tertiary', status: 'Urgent' },
  { id: 'c4', name: 'Personal', description: 'Routine & personal life goals', icon: 'User', color: 'outline', status: 'Routine' }
];

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  // Global Dialog controllers accessible by any subcomponent/sidebar
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [presetCategoryForNewTodo, setPresetCategoryForNewTodo] = useState('c1');

  // Load from local storage
  useEffect(() => {
    const savedTodos = localStorage.getItem('taskly_todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        setTodos(DEFAULT_TODOS);
      }
    } else {
      setTodos(DEFAULT_TODOS);
      localStorage.setItem('taskly_todos', JSON.stringify(DEFAULT_TODOS));
    }

    const savedCategories = localStorage.getItem('taskly_categories');
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (e) {
        setCategories(DEFAULT_CATEGORIES);
      }
    } else {
      localStorage.setItem('taskly_categories', JSON.stringify(DEFAULT_CATEGORIES));
    }
  }, []);

  const updateTodos = (newTodos) => {
    setTodos(newTodos);
    localStorage.setItem('taskly_todos', JSON.stringify(newTodos));
  };

  const updateCategories = (newCats) => {
    setCategories(newCats);
    localStorage.setItem('taskly_categories', JSON.stringify(newCats));
  };

  // Actions
  const addTodo = (title, description, priority, categoryId, dueDate) => {
    const newTodo = {
      id: `task_${Date.now()}`,
      title,
      description,
      completed: false,
      priority,
      dueDate: dueDate || 'No due date',
      category: categoryId,
      createdAt: new Date().toISOString()
    };
    updateTodos([...todos, newTodo]);
    setIsAddTodoOpen(false);
  };

  const deleteTodo = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      updateTodos(todos.filter(t => t.id !== id));
    }
  };

  const toggleCompleteTodo = (id) => {
    updateTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addCategory = (name, color, icon) => {
    const newCat = {
      id: `cat_${Date.now()}`,
      name,
      description: 'Custom category workspace',
      icon,
      color,
      status: 'Active'
    };
    updateCategories([...categories, newCat]);
    setIsAddCategoryOpen(false);
  };

  const reloadDemos = () => {
    updateTodos(DEFAULT_TODOS);
    updateCategories(DEFAULT_CATEGORIES);
  };

  const resetState = () => {
    if (window.confirm('This will wipe your active database state. Proceed?')) {
      updateTodos([]);
    }
  };

  return (
    <TodoContext.Provider value={{
      todos,
      categories,
      addTodo,
      deleteTodo,
      toggleCompleteTodo,
      addCategory,
      reloadDemos,
      resetState,
      isAddTodoOpen,
      setIsAddTodoOpen,
      isAddCategoryOpen,
      setIsAddCategoryOpen,
      presetCategoryForNewTodo,
      setPresetCategoryForNewTodo
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
