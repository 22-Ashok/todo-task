import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Inbox, Code, Palette, Megaphone, User, Pencil } from 'lucide-react';
import { useTodos } from '../context/TodoContext';
import FilterTabs from '../components/FilterTabs';
import TaskItem from '../components/TaskItem';

export default function CategoryDetailPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const { 
    todos, 
    categories, 
    toggleCompleteTodo, 
    deleteTodo, 
    setIsAddTodoOpen,
    setPresetCategoryForNewTodo,
    setIsEditTodoOpen,
    setEditTodoData,
    setIsEditCategoryOpen,
    setEditCategoryData
  } = useTodos();

  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const currentCategory = categories.find((c) => String(c.id) === String(categoryId));

  // Safeguard: Redirect if category isn't found
  useEffect(() => {
    if (!currentCategory && categories.length > 0) {
      // Small cooldown before triggering redirection
      const timer = setTimeout(() => {
        navigate('/categories');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentCategory, categories, navigate]);

  if (!currentCategory) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-[#bccac1]">Locating category workspace settings...</p>
        <Link to="/categories" className="inline-flex items-center gap-2 text-xs font-semibold text-[#68dbae] hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </Link>
      </div>
    );
  }

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

  const catTasks = todos.filter((t) => String(t.category) === String(categoryId));
  const completedCount = catTasks.filter((t) => t.completed).length;
  const highPriorityCount = catTasks.filter((t) => t.priority === 'high' && !t.completed).length;
  const percentCompleted = catTasks.length === 0 ? 0 : Math.round((completedCount / catTasks.length) * 100);

  // Filter Tasks List
  const filteredTodos = catTasks.filter((todo) => {
    // Status filter
    if (statusFilter === 'active' && todo.completed) return false;
    if (statusFilter === 'completed' && !todo.completed) return false;

    // Priority filter
    if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;

    return true;
  });

  const handleCreateTodoInline = () => {
    setPresetCategoryForNewTodo(categoryId);
    setIsAddTodoOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Back Link Breadcrumb */}
      <Link
        to="/categories"
        className="flex items-center gap-2 text-[#bccac1] hover:text-white text-xs font-semibold py-1 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Categories / Workspace</span>
      </Link>

      {/* Category Identity Info Header */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#2a2a2a] flex items-center justify-center">
            {renderCategoryIcon(currentCategory.icon, currentCategory.color)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{currentCategory.name} Category</h2>
            <p className="text-xs text-[#bccac1] mt-0.5">
              {catTasks.length} tasks remaining · {highPriorityCount} urgent unresolved
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => { setEditCategoryData(currentCategory); setIsEditCategoryOpen(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#2A2A2A] hover:border-[#1D9E75]/40 text-xs font-semibold text-[#bccac1] hover:text-white transition-all cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Category
          </button>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
          <span className="bg-[#1D9E75]/10 text-[#68dbae] px-2.5 py-1 rounded text-xs font-bold border border-[#1D9E75]/20">
            {percentCompleted}% completed
          </span>
          <div className="w-32 bg-[#2A2A2A] rounded-full h-1 overflow-hidden">
            <div className="bg-[#1D9E75] h-full transition-all duration-300" style={{ width: `${percentCompleted}%` }} />
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <FilterTabs 
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {/* Scoped category tasks list */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-[#bccac1] uppercase tracking-wider">
            Tasks in this Category:
          </span>
          <button 
            type="button"
            onClick={handleCreateTodoInline}
            className="flex items-center gap-1 text-[#68dbae] hover:text-white text-xs font-semibold cursor-pointer"
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
              category={currentCategory}
              onToggleComplete={toggleCompleteTodo}
              onDelete={deleteTodo}
              onEdit={(todo) => { setEditTodoData(todo); setIsEditTodoOpen(true); }}
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
  );
}
