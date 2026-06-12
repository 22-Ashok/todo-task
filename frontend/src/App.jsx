import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Bell, 
  Calendar, 
  Folder, 
  Trash2, 
  Check, 
  CheckSquare,
  X, 
  Grid, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Inbox,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
  Code,
  Palette,
  Megaphone,
  User,
  LogOut,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import TaskItem from './components/TaskItem';
import FilterTabs from './components/FilterTabs';
import AnalyticsPanel from './components/AnalyticsPanel';

const INITIAL_TODOS = [
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

const INITIAL_CATEGORIES = [
  { id: 'c1', name: 'Engineering', description: 'Software architecture & releases', icon: 'Code', color: 'primary', status: 'High Priority' },
  { id: 'c2', name: 'Product Design', description: 'Design tokens & UI systems', icon: 'Palette', color: 'secondary', status: 'In Review' },
  { id: 'c3', name: 'Marketing', description: 'Campaigns & growth initiatives', icon: 'Megaphone', color: 'tertiary', status: 'Urgent' },
  { id: 'c4', name: 'Personal', description: 'Routine & personal life goals', icon: 'User', color: 'outline', status: 'Routine' }
];

export default function App() {
  // --- State Management ---
  const [todos, setTodos] = useState([]);
  const [taskText, setTaskText] = useState('');

  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCategory, setTaskCategory] = useState('c1');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState('Due Today');
  
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('primary');
  const [categoryIcon, setCategoryIcon] = useState('Code');

  const [view, setView] = useState('all-tasks');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  const [searchTasksQuery, setSearchTasksQuery] = useState('');
  const [searchCategoriesQuery, setSearchCategoriesQuery] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  // Authentication simulator
  const [user, setUser] = useState({
    name: 'Alex Rivera',
    email: 'alex@taskly.app',
    isPro: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
  });

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isSignupView, setIsSignupView] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load from local storage or set initial data
  useEffect(() => {
    const saved = localStorage.getItem('taskly_todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    } else {
      setTodos(INITIAL_TODOS);
      localStorage.setItem('taskly_todos', JSON.stringify(INITIAL_TODOS));
    }

    const savedCats = localStorage.getItem('taskly_categories');
    if (savedCats) {
      setCategories(JSON.parse(savedCats));
    }
  }, []);

  const updateLocalStorageTodos = (updated) => {
    setTodos(updated);
    localStorage.setItem('taskly_todos', JSON.stringify(updated));
  };

  const updateLocalStorageCategories = (updated) => {
    setCategories(updated);
    localStorage.setItem('taskly_categories', JSON.stringify(updated));
  };

  // --- Core Action Handlers ---
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskText.trim()) {
      alert('Please fill out a task Title!');
      return;
    }

    const newTodo = {
      id: `task_${Date.now()}`,
      title: taskText,
      description: taskDesc,
      completed: false,
      priority: taskPriority,
      dueDate: taskDueDate || 'No due date',
      category: taskCategory,
      createdAt: new Date().toISOString()
    };

    const updated = [...todos, newTodo];
    updateLocalStorageTodos(updated);

    // Reset Form Fields
    setTaskText('');
    setTaskDesc('');
    setTaskPriority('medium');
    setTaskCategory(categories[0]?.id || 'c1');
    setTaskDueDate('Due Today');
    setIsAddTodoOpen(false);
  };

  const handleToggleComplete = (id) => {
    const updated = todos.map((t) => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    updateLocalStorageTodos(updated);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updated = todos.filter((t) => t.id !== id);
      updateLocalStorageTodos(updated);
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert('Please specify a Category name!');
      return;
    }

    const newCat = {
      id: `cat_${Date.now()}`,
      name: categoryName,
      description: 'Custom category workspace',
      icon: categoryIcon,
      color: categoryColor,
      status: 'Active'
    };

    const updated = [...categories, newCat];
    updateLocalStorageCategories(updated);

    setCategoryName('');
    setIsAddCategoryOpen(false);
  };

  const handleLoadDemoData = () => {
    updateLocalStorageTodos(INITIAL_TODOS);
    updateLocalStorageCategories(INITIAL_CATEGORIES);
  };

  const handleClearAll = () => {
    if (window.confirm('This will wipe your active database state. Proceed?')) {
      updateLocalStorageTodos([]);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!authEmail.includes('@') || authPassword.length < 4) {
      alert('Please fill out a valid email and password (min 4 characters)');
      return;
    }

    const loggedInUser = {
      name: isSignupView ? (authName || 'Taskly Member') : 'Alex Rivera',
      email: authEmail,
      isPro: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
    };

    setUser(loggedInUser);
    setView('all-tasks');
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
  };

  const renderCategoryIcon = (iconStr, colorClass) => {
    const defaultStyle = "w-5 h-5";
    let iconColor = "text-[#68dbae]";
    if (colorClass === 'secondary') iconColor = "text-purple-400";
    if (colorClass === 'tertiary') iconColor = "text-amber-400";
    if (colorClass === 'outline') iconColor = "text-blue-400";

    switch (iconStr) {
      case 'Code':
        return <Code className={`${defaultStyle} ${iconColor}`} />;
      case 'Palette':
        return <Palette className={`${defaultStyle} ${iconColor}`} />;
      case 'Megaphone':
        return <Megaphone className={`${defaultStyle} ${iconColor}`} />;
      case 'User':
      default:
        return <User className={`${defaultStyle} ${iconColor}`} />;
    }
  };

  const getCategoryMetrics = (catId) => {
    const catTasks = todos.filter((t) => t.category === catId);
    const completed = catTasks.filter((t) => t.completed).length;
    const highPriority = catTasks.filter((t) => t.priority === 'high' && !t.completed).length;
    const progressPercent = catTasks.length === 0 ? 0 : Math.round((completed / catTasks.length) * 100);

    return {
      total: catTasks.length,
      completed,
      highPriority,
      percent: progressPercent
    };
  };

  // Filter Tasks List
  const filteredTodos = todos.filter((todo) => {
    // 1. View filter
    if (view === 'category-detail' && todo.category !== selectedCategoryId) {
      return false;
    }
    // 2. Status filter
    if (statusFilter === 'active' && todo.completed) return false;
    if (statusFilter === 'completed' && !todo.completed) return false;

    // 3. Priority filter
    if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;

    // 4. Search query
    if (searchTasksQuery.trim() !== '') {
      const q = searchTasksQuery.toLowerCase();
      const matchTitle = todo.title.toLowerCase().includes(q);
      const matchDesc = todo.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  // Filter Categories Grid
  const filteredCategories = categories.filter((cat) => {
    if (searchCategoriesQuery.trim() !== '') {
      return cat.name.toLowerCase().includes(searchCategoriesQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-[#e5e2e1] font-sans antialiased flex h-screen overflow-hidden">
      
      {/* 1. Sidebar Navigation (Visible on md+ layouts) */}
      <Sidebar 
        currentView={view} 
        setView={(v) => { setView(v); setSelectedCategoryId(null); }}
        onOpenAddTodo={() => setIsAddTodoOpen(true)}
        user={user}
        onLogout={() => setUser(null)}
      />

      {/* Mobile Top Navigation layout wrapper (Hidden on md+) */}
      <nav className="md:hidden bg-[#0F0F0F] border-b border-[#2A2A2A] fixed top-0 w-full h-16 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#1D9E75] flex items-center justify-center">
            <Check className="text-white w-4 h-4" />
          </div>
          <span className="font-headline-lg-mobile text-md font-bold text-[#68dbae] tracking-tighter">Taskly</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button 
                onClick={() => setIsAddTodoOpen(true)}
                className="w-8 h-8 rounded-full bg-[#1D9E75] flex items-center justify-center text-white p-0"
                title="Create task"
              >
                <Plus className="w-5 h-5" />
              </button>
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-7 h-7 rounded-full border border-[#2A2A2A]"
                onClick={() => {
                  if (window.confirm('Log out from Taskly?')) {
                    setUser(null);
                  }
                }}
              />
            </>
          ) : (
            <button 
              onClick={() => setView('login')}
              className="text-xs bg-[#1D9E75] text-white px-3 py-1 rounded"
            >
              Log in
            </button>
          )}
        </div>
      </nav>

      {/* Main Canvas Container (Responsive offset for Sidebar) */}
      <main className="flex-grow md:ml-64 mt-16 md:mt-0 p-4 md:p-8 overflow-y-auto h-screen relative bg-[#0F0F0F]/90">
        
        {/* Subtle luminous design backdrop accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1D9E75]/5 blur-[120px] rounded-full pointer-events-none -mr-48 -mt-48" />

        <div className="max-w-[800px] mx-auto w-full h-full flex flex-col justify-between">
          <div className="w-full">

            {/* --- VIEW 1: AUTHENTICATION / LOGIN --- */}
            {(!user || view === 'login') && (
              <div className="flex flex-col items-center justify-center py-12 max-w-sm mx-auto">
                <header className="w-full text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded bg-[#1D9E75] flex items-center justify-center shadow-lg shadow-[#1D9E75]/10">
                      <Check className="text-white w-5 h-5" />
                    </div>
                    <h1 className="font-headline-lg text-2xl font-bold tracking-tight text-white">Taskly</h1>
                  </div>
                  <p className="text-sm text-[#bccac1]">Stay on top of everything</p>
                </header>

                <main className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 shadow-2xl relative z-10">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {isSignupView && (
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[#bccac1]" htmlFor="reg-name">Full Name</label>
                        <input 
                          type="text" 
                          id="reg-name"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="Alex Rivera"
                          className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#131d1a]" 
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#bccac1]" htmlFor="email">Email address</label>
                      <input 
                        type="email" 
                        id="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="name@company.com" 
                        required
                        className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#131d1a]" 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#bccac1]" htmlFor="password">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          id="password"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••" 
                          required
                          className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#131d1a] pr-10" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-[#1D9E75] hover:bg-[#15825F] rounded-full text-white font-semibold text-sm transition-all focus:ring-2 focus:ring-[#1D9E75]/30"
                    >
                      {isSignupView ? 'Sign up' : 'Log in'}
                    </button>
                  </form>

                  <div className="flex items-center gap-2 my-4">
                    <div className="h-px bg-[#2A2A2A] flex-grow"></div>
                    <span className="text-[10px] text-[#bccac1] uppercase tracking-wider font-bold">OR</span>
                    <div className="h-px bg-[#2A2A2A] flex-grow"></div>
                  </div>

                  <button 
                    onClick={() => {
                      setIsSignupView(!isSignupView);
                      setAuthName('');
                      setAuthEmail('');
                      setAuthPassword('');
                    }}
                    className="w-full py-2 bg-transparent hover:bg-[#2A2A2A] border border-[#2A2A2A] rounded-full text-white font-semibold text-sm transition-colors"
                  >
                    {isSignupView ? 'Back to login' : 'Create account'}
                  </button>

                  <div className="text-center mt-4">
                    <button 
                      onClick={() => {
                        // Quick auto-bypass
                        setUser({
                          name: 'Alex Rivera',
                          email: 'alex@taskly.app',
                          isPro: true,
                          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
                        });
                        setView('all-tasks');
                      }}
                      className="text-xs text-[#68dbae] hover:underline font-medium"
                    >
                      Bypass &amp; View Workspace (Alex Rivera)
                    </button>
                  </div>
                </main>
              </div>
            )}

            {/* --- VIEW 2: ALL TASKS LIST --- */}
            {user && view === 'all-tasks' && (
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-white tracking-tight">All Tasks</h2>
                    <p className="text-xs md:text-sm text-[#bccac1]">Stay on top of your workflow</p>
                  </div>

                  {/* Active filters / actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleLoadDemoData}
                      title="Load design template initial tasks"
                      className="px-3 py-1.5 rounded-lg border border-[#2A2A2A] hover:border-[#1D9E75]/40 text-xs font-semibold text-[#bccac1] hover:text-white transition-all bg-[#1A1A1A]"
                    >
                      Reload Demo Tasks
                    </button>
                    <button 
                      onClick={handleClearAll}
                      title="Delete all task list elements"
                      className="px-3 py-1.5 rounded-lg border border-red-900 hover:border-red-500/40 text-xs font-semibold text-[#ffb4ab]/80 hover:text-red-400 transition-all bg-[#1A1A1A]"
                    >
                      Reset State
                    </button>
                  </div>
                </div>

                {/* Interactive Search input & Shortcut box */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search tasks, descriptions..."
                    value={searchTasksQuery}
                    onChange={(e) => setSearchTasksQuery(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-2.5 pl-10 pr-12 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#1D9E75] transition-colors placeholder-gray-500"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-600 bg-[#0F0F0F] px-1.5 py-0.5 rounded border border-[#2A2A2A] hidden sm:block">
                    ⌘K
                  </span>
                </div>

                {/* Filter chip sliders */}
                <FilterTabs 
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  priorityFilter={priorityFilter}
                  setPriorityFilter={setPriorityFilter}
                />

                {/* Tasks List */}
                <div className="mt-4 flex flex-col gap-2">
                  {filteredTodos.length > 0 ? (
                    filteredTodos.map((todo) => (
                      <TaskItem 
                        key={todo.id}
                        todo={todo}
                        category={categories.find((c) => c.id === todo.category)}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                      />
                    ))
                  ) : (
                    <div className="border border-dashed border-[#2A2A2A] rounded-xl py-12 px-4 text-center ">
                      <Inbox className="w-10 h-10 mx-auto mb-2 text-gray-500 stroke-[1.5]" />
                      <h4 className="text-xs font-bold text-white mb-1">No active workspace tasks matching criteria</h4>
                      <p className="text-[11px] text-[#bccac1] max-w-xs mx-auto mb-4">
                        Filter settings are restricting items, or the database list is cleared.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTasksQuery('');
                          setStatusFilter('all');
                          setPriorityFilter('all');
                        }}
                        className="px-3 py-1.5 bg-[#1D9E75] hover:bg-[#15825F] rounded-full text-white text-xs font-semibold"
                      >
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Bento layout Analytics report */}
                <AnalyticsPanel todos={todos} />
              </div>
            )}

            {/* --- VIEW 3: CATEGORIES GRID --- */}
            {user && view === 'categories' && (
              <div className="space-y-6">
                
                {/* Header Row */}
                <div>
                  <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-white tracking-tight">Categories</h2>
                  <p className="text-xs md:text-sm text-[#bccac1]">Organize your productivity workflows</p>
                </div>

                {/* Categories search */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search categories..."
                    value={searchCategoriesQuery}
                    onChange={(e) => setSearchCategoriesQuery(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-sm text-[#e5e2e1] rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#1D9E75] transition-colors placeholder-gray-500"
                  />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredCategories.map((cat) => {
                    const metrics = getCategoryMetrics(cat.id);
                    return (
                      <div 
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategoryId(cat.id);
                          setView('category-detail');
                        }}
                        className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 flex flex-col justify-between hover:border-[#1D9E75]/40 transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center">
                              {renderCategoryIcon(cat.icon, cat.color)}
                            </div>
                            <div>
                              <h3 className="font-bold text-[#e5e2e1] text-base group-hover:text-[#68dbae] transition-colors">
                                {cat.name}
                              </h3>
                              <span className="text-xs text-[#bccac1]">{metrics.total} Tasks</span>
                            </div>
                          </div>

                          {/* Priority Status tag */}
                          {cat.status && (
                            <span className="bg-[#bccac1]/10 text-[#bccac1] px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
                              {cat.status}
                            </span>
                          )}
                        </div>

                        {/* Progress Bar inside categories */}
                        <div className="mt-4">
                          <div className="flex justify-between items-center text-[11px] text-[#bccac1]/80 mb-1.5">
                            <span>Workspace Progress</span>
                            <span className="font-semibold text-[#68dbae]">{metrics.percent}%</span>
                          </div>
                          <div className="w-full bg-[#2A2A2A] rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-[#1D9E75] h-full rounded-full transition-all duration-500" 
                              style={{ width: `${metrics.percent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Interactive Add Category Trigger card */}
                  <button 
                    onClick={() => setIsAddCategoryOpen(true)}
                    className="bg-transparent border-2 border-dashed border-[#2A2A2A] rounded-xl p-5 flex flex-col justify-center items-center gap-3 hover:border-[#1D9E75] hover:bg-[#1A1A1A]/40 transition-all group min-h-[148px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center group-hover:bg-[#1D9E75] group-hover:border-[#1D9E75] transition-all">
                      <Plus className="text-gray-400 group-hover:text-white w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-[#bccac1] group-hover:text-white transition-all">
                      Create custom category
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* --- VIEW 4: CATEGORY DETAILVIEW --- */}
            {user && view === 'category-detail' && selectedCategoryId && (
              <div className="space-y-6">
                {/* Back Link Breadcrumb */}
                <button
                  onClick={() => { setView('categories'); setSelectedCategoryId(null); }}
                  className="flex items-center gap-2 text-[#bccac1] hover:text-white text-xs font-semibold py-1 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Categories / Workspace</span>
                </button>

                {/* Category Identity Info Header */}
                {(() => {
                  const cat = categories.find((c) => c.id === selectedCategoryId);
                  if (!cat) return null;
                  const metrics = getCategoryMetrics(cat.id);
                  return (
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#2a2a2a] flex items-center justify-center">
                          {renderCategoryIcon(cat.icon, cat.color)}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white tracking-tight">{cat.name} Category</h2>
                          <p className="text-xs text-[#bccac1] mt-0.5">
                            {metrics.total} tasks remaining · {metrics.highPriority} high priority unresolved
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                        <span className="bg-[#1D9E75]/10 text-[#68dbae] px-2.5 py-1 rounded text-xs font-bold border border-[#1D9E75]/20">
                          {metrics.percent}% completed
                        </span>
                        <div className="w-32 bg-[#2A2A2A] rounded-full h-1 overflow-hidden">
                          <div className="bg-[#1D9E75] h-full" style={{ width: `${metrics.percent}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Filter chips */}
                <FilterTabs 
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  priorityFilter={priorityFilter}
                  setPriorityFilter={setPriorityFilter}
                />

                {/* Category Tasks lists */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-bold text-[#bccac1] uppercase tracking-wider">
                      Tasks in this Category:
                    </span>
                    <button 
                      onClick={() => {
                        setTaskCategory(selectedCategoryId);
                        setIsAddTodoOpen(true);
                      }}
                      className="flex items-center gap-1 text-[#68dbae] hover:text-white text-xs font-semibold"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Todo Inline
                    </button>
                  </div>

                  {filteredTodos.length > 0 ? (
                    filteredTodos.map((todo) => (
                      <TaskItem 
                        key={todo.id}
                        todo={todo}
                        category={categories.find((c) => c.id === todo.category)}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                      />
                    ))
                  ) : (
                    <div className="border border-dashed border-[#2A2A2A] rounded-xl py-12 px-4 text-center">
                      <Inbox className="w-10 h-10 mx-auto mb-2 text-gray-500" />
                      <h4 className="text-xs font-bold text-[#bccac1]">No tasks pending in this workspace</h4>
                      <p className="text-[11px] text-gray-500 mb-3">Create one or toggle completion status filters</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Footer Area notes */}
          <footer className="text-center text-[10px] text-[#bccac1]/40 py-6 mt-12 bg-transparent select-none">
            <p>Taskly Productivity Engine · Rendered with Tailwind CSS &amp; Lucide Icons</p>
          </footer>
        </div>
      </main>

      {/* --- MOBILE VIEW TAB BAR COVERS (Toggle at the bottom of the screen on small screens) --- */}
      {user && (
        <nav className="md:hidden bg-[#0F0F0F] border-t border-[#2A2A2A] fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-20">
          <button 
            onClick={() => { setView('all-tasks'); setSelectedCategoryId(null); }}
            className={`flex flex-col items-center justify-center font-semibold text-xs px-4 py-1.5 transition-all ${
              view === 'all-tasks' 
                ? 'text-[#68dbae] bg-[#68dbae]/10 rounded-xl' 
                : 'text-[#bccac1]'
            }`}
          >
            <CheckSquare className="w-5 h-5 mb-0.5" />
            <span>Tasks</span>
          </button>
          
          <button 
            onClick={() => { setView('categories'); setSelectedCategoryId(null); }}
            className={`flex flex-col items-center justify-center font-semibold text-xs px-4 py-1.5 transition-all ${
              view === 'categories' || view === 'category-detail'
                ? 'text-[#68dbae] bg-[#68dbae]/10 rounded-xl' 
                : 'text-[#bccac1]'
            }`}
          >
            <Grid className="w-5 h-5 mb-0.5" />
            <span>Categories</span>
          </button>
        </nav>
      )}

      {/* --- ADD TODO MODAL OVERLAY --- */}
      {isAddTodoOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl w-full max-w-[460px] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-[#2A2A2A]">
              <h2 className="font-headline-md text-base font-bold text-white">New todo</h2>
              <button 
                onClick={() => setIsAddTodoOpen(false)}
                className="text-[#bccac1] hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body form submit wrapper */}
            <form onSubmit={handleAddTask}>
              <div className="p-5 flex flex-col gap-4">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-[#bccac1] mb-1.5" htmlFor="title-inp">
                    Title <span className="text-[#ef4444] font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="title-inp"
                    required
                    autoFocus
                    value={taskText} 
                    onChange={(e) => setTaskText(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-2 px-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#1D9E75] placeholder-gray-600 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#bccac1] mb-1.5" htmlFor="desc-inp">
                    Description
                  </label>
                  <textarea 
                    id="desc-inp"
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    placeholder="Add more details..."
                    rows={3}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-2 px-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#1D9E75] placeholder-gray-600 transition-colors resize-none"
                  />
                </div>

                {/* Category select & Due Date row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#bccac1] mb-1.5" htmlFor="cat-inp">
                      Category
                    </label>
                    <select 
                      id="cat-inp"
                      value={taskCategory}
                      onChange={(e) => setTaskCategory(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-2 px-2.5 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#1D9E75]"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#bccac1] mb-1.5" htmlFor="date-inp">
                      Due Date
                    </label>
                    <input 
                      type="text" 
                      id="date-inp"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      placeholder="e.g. Due Today, Tomorrow"
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-2 px-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#1D9E75] placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* Priority Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#bccac1] mb-1.5">
                    Priority
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      type="button"
                      onClick={() => setTaskPriority('low')}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        taskPriority === 'low' 
                          ? 'border-[#26a37a] bg-[#26a37a]/15 text-[#68dbae]' 
                          : 'border-[#2A2A2A] text-[#bccac1] hover:bg-[#2A2A2A]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#68dbae]"></span>
                      Low
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setTaskPriority('medium')}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        taskPriority === 'medium' 
                          ? 'border-amber-400 bg-amber-500/10 text-amber-300' 
                          : 'border-[#2A2A2A] text-[#bccac1] hover:bg-[#2A2A2A]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      Medium
                    </button>

                    <button 
                      type="button"
                      onClick={() => setTaskPriority('high')}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        taskPriority === 'high' 
                          ? 'border-[#ef4444] bg-[#93000a]/30 text-[#ffb4ab]' 
                          : 'border-[#2A2A2A] text-[#bccac1] hover:bg-[#2A2A2A]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
                      High
                    </button>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-[#2A2A2A] flex justify-end gap-3 bg-[#131313]">
                <button 
                  type="button"
                  onClick={() => setIsAddTodoOpen(false)}
                  className="px-5 py-2 rounded-full border border-[#2A2A2A] text-xs font-semibold text-[#e5e2e1] hover:bg-[#2A2A2A] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#1D9E75] hover:bg-[#15825F] text-white font-semibold text-xs transition-colors"
                >
                  Create
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* --- ADD CATEGORY OVERLAY --- */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl w-full max-w-[420px] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-[#2A2A2A]">
              <h2 className="font-headline-md text-base font-bold text-white">New category</h2>
              <button 
                onClick={() => setIsAddCategoryOpen(false)}
                className="text-[#bccac1] hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddCategory}>
              <div className="p-5 flex flex-col gap-4">
                
                {/* Category Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#bccac1] mb-1.5" htmlFor="cat-name">
                    Category Name <span className="text-[#ef4444] font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="cat-name"
                    required
                    autoFocus
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. Personal, Design, Marketing"
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-2 px-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#1D9E75] placeholder-gray-600 transition-colors"
                  />
                </div>

                {/* Color Scheme Picker */}
                <div>
                  <label className="block text-xs font-semibold text-[#bccac1] mb-1.5">Color System</label>
                  <div className="flex gap-3">
                    {['primary', 'secondary', 'tertiary', 'outline'].map((color) => {
                      let bgColor = 'bg-[#1D9E75]';
                      if (color === 'secondary') bgColor = 'bg-purple-500';
                      if (color === 'tertiary') bgColor = 'bg-amber-500';
                      if (color === 'outline') bgColor = 'bg-blue-500';

                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setCategoryColor(color)}
                          className={`w-6 h-6 rounded-full ${bgColor} transition-transform ${
                            categoryColor === color ? 'scale-125 ring-2 ring-white/50' : 'opacity-80'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Icon Picker options */}
                <div>
                  <label className="block text-xs font-semibold text-[#bccac1] mb-1.5">Select Icon representation</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: 'Code', icon: <Code className="w-4 h-4" /> },
                      { name: 'Palette', icon: <Palette className="w-4 h-4" /> },
                      { name: 'Megaphone', icon: <Megaphone className="w-4 h-4" /> },
                      { name: 'User', icon: <User className="w-4 h-4" /> }
                    ].map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setCategoryIcon(item.name)}
                        className={`py-2 rounded-lg border text-xs flex justify-center items-center gap-1.5 ${
                          categoryIcon === item.name 
                            ? 'border-[#1D9E75] bg-[#1D9E75]/10 text-[#68dbae]' 
                            : 'border-[#2A2A2A] text-[#bccac1] hover:bg-[#2A2A2A]'
                        }`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-[#2A2A2A] flex justify-end gap-3 bg-[#131313]">
                <button 
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-5 py-2 rounded-full border border-[#2A2A2A] text-xs font-semibold text-[#e5e2e1] hover:bg-[#2A2A2A] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#1D9E75] hover:bg-[#15825F] text-white font-semibold text-xs transition-colors"
                >
                  Create
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
