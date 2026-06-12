import React from 'react';
import { Filter, Star, Clock, ToggleLeft } from 'lucide-react';

export default function FilterTabs({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Status Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
        <span className="text-[10px] font-bold text-[#bccac1] uppercase tracking-wider mr-2 shrink-0">
          Status:
        </span>
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
            statusFilter === 'all'
              ? 'bg-[#26a37a] text-white border-transparent'
              : 'border-[#2A2A2A] text-[#bccac1] hover:border-[#68dbae]'
          }`}
        >
          All Status
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
            statusFilter === 'active'
              ? 'bg-[#26a37a] text-white border-transparent'
              : 'border-[#2A2A2A] text-[#bccac1] hover:border-[#68dbae]'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
            statusFilter === 'completed'
              ? 'bg-[#26a37a] text-white border-transparent'
              : 'border-[#2A2A2A] text-[#bccac1] hover:border-[#68dbae]'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Priority Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
        <span className="text-[10px] font-bold text-[#bccac1] uppercase tracking-wider mr-2 shrink-0">
          Priority:
        </span>
        <button
          onClick={() => setPriorityFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
            priorityFilter === 'all'
              ? 'bg-[#1D9E75]/20 text-[#68dbae] border-[#1D9E75]'
              : 'border-[#2A2A2A] text-[#bccac1] hover:border-[#bccac1]'
          }`}
        >
          All Priorities
        </button>
        <button
          onClick={() => setPriorityFilter('high')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
            priorityFilter === 'high'
              ? 'bg-[#93000a]/30 text-[#ffb4ab] border-[#93000a]'
              : 'border-[#2A2A2A] text-[#bccac1] hover:border-[#ffb4ab]'
          }`}
        >
          High
        </button>
        <button
          onClick={() => setPriorityFilter('medium')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
            priorityFilter === 'medium'
              ? 'bg-[#474746] text-[#ffb3ad] border-[#bccac1]/40'
              : 'border-[#2A2A2A] text-[#bccac1] hover:border-[#ffb3ad]'
          }`}
        >
          Medium
        </button>
        <button
          onClick={() => setPriorityFilter('low')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
            priorityFilter === 'low'
              ? 'bg-[#26a37a]/20 text-[#68dbae] border-[#26a37a]'
              : 'border-[#2A2A2A] text-[#bccac1] hover:border-[#68dbae]'
          }`}
        >
          Low
        </button>
      </div>
    </div>
  );
}
