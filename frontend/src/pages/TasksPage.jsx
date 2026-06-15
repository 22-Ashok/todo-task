import React, { useState } from 'react';
import { Search, Inbox } from 'lucide-react';
import { useTodos } from '../context/TodoContext';
import FilterTabs from '../components/FilterTabs';
import TaskItem from '../components/TaskItem';
import AnalyticsPanel from '../components/AnalyticsPanel';

export default function TasksPage() {
  const { 
    todos, 
    categories, 
    toggleCompleteTodo, 
    deleteTodo,
    setIsEditTodoOpen,
    setEditTodoData,
    loading,
    error
  } = useTodos();

  const [searchTasksQuery, setSearchTasksQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Filter Tasks List
  const filteredTodos = todos.filter((todo) => {
    // Status filter
    if (statusFilter === 'active' && todo.completed) return false;
    if (statusFilter === 'completed' && !todo.completed) return false;

    // Priority filter
    if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;

    // Search query
    if (searchTasksQuery.trim() !== '') {
      const q = searchTasksQuery.toLowerCase();
      const matchTitle = todo.title.toLowerCase().includes(q);
      const matchDesc = todo.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">All Tasks</h2>
          <p className="text-xs md:text-sm text-[#bccac1]">Stay on top of your workflow</p>
        </div>

      </div>

      {error && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-semibold text-amber-300 antialiased leading-relaxed">
          {error}
        </div>
      )}

      {loading && todos.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-[#bccac1]">Loading Workspace Database...</p>
        </div>
      ) : (
        <>
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

          {/* Filter tabs */}
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
                  onToggleComplete={toggleCompleteTodo}
                  onDelete={deleteTodo}
                  onEdit={(todo) => { setEditTodoData(todo); setIsEditTodoOpen(true); }}
                />
              ))
            ) : (
              <div className="border border-dashed border-[#2A2A2A] rounded-xl py-12 px-4 text-center">
                <Inbox className="w-10 h-10 mx-auto mb-2 text-gray-500 stroke-[1.5]" />
                <h4 className="text-xs font-bold text-white mb-1">No active workspace tasks matching criteria</h4>
                <p className="text-[11px] text-[#bccac1] max-w-xs mx-auto mb-4">
                  Filter settings are restricting items, or the database list is cleared.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTasksQuery('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                  }}
                  className="px-3 py-1.5 bg-[#1D9E75] hover:bg-[#15825F] rounded-full text-white text-xs font-semibold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Bento layout Analytics report */}
          <AnalyticsPanel todos={todos} />
        </>
      )}
    </div>
  );
}
