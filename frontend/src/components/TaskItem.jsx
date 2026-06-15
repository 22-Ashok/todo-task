import React, { useState } from 'react';
import { 
  Calendar, 
  Folder, 
  Trash2, 
  Check, 
  AlertTriangle,
  MoreVertical,
  Clock,
  Pencil
} from 'lucide-react';

export default function TaskItem({ 
  todo, 
  category, 
  onToggleComplete, 
  onDelete,
  onEdit
}) {
  const [showOptions, setShowOptions] = useState(false);

  // Style priority labels
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="bg-[#93000a]/30 text-[#ffb4ab] border border-[#93000a]/50 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="bg-[#474746]/40 text-[#ffb3ad] border border-[#bccac1]/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Medium
          </span>
        );
      case 'low':
      default:
        return (
          <span className="bg-[#26a37a]/20 text-[#68dbae] border border-[#26a37a]/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Low
          </span>
        );
    }
  };

  // Border color based on priority
  const getLeftIndicator = () => {
    if (todo.completed) return 'bg-[#1D9E75]/40';
    switch (todo.priority) {
      case 'high': return 'bg-[#ef4444]';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-[#1D9E75]';
    }
  };

  return (
    <div 
      className={`group relative bg-[#1A1A1A] border-b border-[#2A2A2A] p-4 flex items-center gap-4 transition-all hover:bg-[#1f1f1f] rounded-lg ${
        todo.completed ? 'bg-[#1A1A1A]/50 border-inline-variant opacity-60' : ''
      }`}
    >
      {/* Target complete line-indicator */}
      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full ${getLeftIndicator()}`} />

      {/* Styled Checkbox */}
      <button 
        onClick={() => onToggleComplete(todo.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          todo.completed 
            ? 'bg-[#1D9E75] border-[#1D9E75] text-[#003827]' 
            : 'border-[#2A2A2A] hover:border-[#1D9E75] bg-transparent'
        }`}
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
      >
        {todo.completed && <Check className="w-4 h-4 stroke-[3]" />}
      </button>

      {/* Task Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-x-2 gap-y-1 mb-1">
          <h3 className={`font-semibold text-sm truncate ${
            todo.completed ? 'line-through text-[#bccac1]/70' : 'text-[#e5e2e1]'
          }`}>
            {todo.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {getPriorityBadge(todo.priority)}
          </div>
        </div>

        {todo.description && (
          <p className={`text-xs text-[#bccac1] line-clamp-2 mb-2 ${
            todo.completed ? 'opacity-55' : ''
          }`}>
            {todo.description}
          </p>
        )}

        {/* Task Metadata row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-[#bccac1]/80">
          {todo.dueDate && (
            <span className={`flex items-center gap-1 font-medium ${
              todo.priority === 'high' && !todo.completed ? 'text-[#ffb4ab]' : ''
            }`}>
              <Calendar className="w-3.5 h-3.5 opacity-85" />
              {todo.dueDate}
            </span>
          )}

          {category && (
            <span className="flex items-center gap-1 font-medium">
              <Folder className="w-3.5 h-3.5 opacity-85" />
              {category.name}
            </span>
          )}

          {!todo.completed && (
            <span className="flex items-center gap-1 text-[10px] text-[#bccac1]/60">
              <Clock className="w-3 h-3" />
              Created {new Date(todo.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative shrink-0 flex items-center self-center gap-1">
        {/* Rapid edit on hover/desktop button */}
        <button 
          onClick={() => onEdit(todo)}
          className="p-1.5 text-[#bccac1] hover:text-[#68dbae] hover:bg-[#2A2A2A] rounded-lg transition-all sm:opacity-0 group-hover:opacity-100"
          title="Edit task"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* Rapid delete on hover/desktop button */}
        <button 
          onClick={() => onDelete(todo.id)}
          className="p-1.5 text-[#bccac1] hover:text-red-400 hover:bg-[#2A2A2A] rounded-lg transition-all sm:opacity-0 group-hover:opacity-100"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Touch fallback context button */}
        <div className="sm:hidden">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-1.5 text-[#bccac1] hover:text-white rounded"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showOptions && (
            <div className="absolute right-0 bottom-8 z-50 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg shadow-xl py-1 w-28">
              <button 
                onClick={() => {
                  onEdit(todo);
                  setShowOptions(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-[#68dbae] hover:bg-[#2A2A2A] flex items-center gap-2"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button 
                onClick={() => {
                  onDelete(todo.id);
                  setShowOptions(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-[#2A2A2A] flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
