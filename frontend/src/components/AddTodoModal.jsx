import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTodos } from '../context/TodoContext';

export default function AddTodoModal() {
  const { 
    categories, 
    addTodo, 
    isAddTodoOpen, 
    setIsAddTodoOpen,
    presetCategoryForNewTodo
  } = useTodos();

  const [taskText, setTaskText] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCategory, setTaskCategory] = useState('c1');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState('Due Today');

  // Synchronize with category preset if modal is opened in a scoped category view
  useEffect(() => {
    if (isAddTodoOpen) {
      setTaskCategory(presetCategoryForNewTodo || (categories[0]?.id || 'c1'));
    }
  }, [isAddTodoOpen, presetCategoryForNewTodo, categories]);

  if (!isAddTodoOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) {
      alert('Please fill out a task Title!');
      return;
    }
    addTodo(taskText, taskDesc, taskPriority, taskCategory, taskDueDate);
    
    // Reset Form
    setTaskText('');
    setTaskDesc('');
    setTaskPriority('medium');
    setTaskDueDate('Due Today');
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl w-full max-w-[460px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#2A2A2A]">
          <h2 className="text-base font-bold text-white">New Task</h2>
          <button 
            type="button"
            onClick={() => setIsAddTodoOpen(false)}
            className="text-[#bccac1] hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 flex flex-col gap-4">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[#bccac1] mb-1.5" htmlFor="modal-title-inp">
                Title <span className="text-[#ef4444] font-bold">*</span>
              </label>
              <input 
                type="text" 
                id="modal-title-inp"
                required
                autoFocus
                value={taskText} 
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg py-2.5 px-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#1D9E75] placeholder-gray-600 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#bccac1] mb-1.5" htmlFor="modal-desc-inp">
                Description
              </label>
              <textarea 
                id="modal-desc-inp"
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Add more details..."
                rows={3}
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg py-2 px-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#1D9E75] placeholder-gray-600 transition-colors resize-none"
              />
            </div>

            {/* Category select & Due Date row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#bccac1] mb-1.5" htmlFor="modal-cat-inp">
                  Category
                </label>
                <select 
                  id="modal-cat-inp"
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg py-2 px-2.5 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#1D9E75]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#bccac1] mb-1.5" htmlFor="modal-date-inp">
                  Due Date
                </label>
                <input 
                  type="text" 
                  id="modal-date-inp"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  placeholder="e.g. Due Today, Tomorrow"
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg py-2 px-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#1D9E75] placeholder-gray-600"
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
  );
}
