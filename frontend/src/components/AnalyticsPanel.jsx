import React from 'react';
import { Clock, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export default function AnalyticsPanel({ todos }) {
  // Calculate analytics
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const completionRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Get next urgent task
  const pendingHigh = todos
    .filter((t) => !t.completed && t.priority === 'high')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const nextTask = pendingHigh[0] || todos.filter((t) => !t.completed)[0] || null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-[#2A2A2A]/40">
      {/* Box A: Weekly Completion */}
      <div className="bg-[#1A1A1A] p-5 rounded-xl border border-[#2A2A2A] flex flex-col justify-between group overflow-hidden relative">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#1D9E75]/10 rounded-full blur-2xl group-hover:bg-[#1D9E75]/20 transition-all duration-500" />
        
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#bccac1] font-bold mb-1">
            Task Completion
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold text-[#e5e2e1]">{completionRate}%</h4>
            <span className="text-xs text-[#68dbae] flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {completedCount} of {totalCount} done
            </span>
          </div>
        </div>

        {/* Bar chart representation */}
        <div className="mt-4 flex items-end gap-1.5 h-12">
          <div className="bg-[#68dbae]/20 w-full h-[40%] rounded-t-sm hover:bg-[#68dbae]/30 transition-all cursor-crosshair" title="Mon" />
          <div className="bg-[#68dbae]/20 w-full h-[60%] rounded-t-sm hover:bg-[#68dbae]/30 transition-all cursor-crosshair" title="Tue" />
          <div className="bg-[#68dbae]/20 w-full h-[30%] rounded-t-sm hover:bg-[#68dbae]/30 transition-all cursor-crosshair" title="Wed" />
          <div className="bg-[#68dbae]/20 w-full h-[80%] rounded-t-sm hover:bg-[#68dbae]/30 transition-all cursor-crosshair" title="Thu" />
          {/* Active completion bar reflecting real active value */}
          <div 
            className="bg-[#1D9E75] w-full rounded-t-sm shadow-[0_0_12px_rgba(104,219,174,0.3)] transition-all" 
            style={{ height: `${Math.max(15, completionRate)}%` }}
            title={`Active: ${completionRate}%`}
          />
          <div className="bg-[#68dbae]/20 w-full h-[35%] rounded-t-sm hover:bg-[#68dbae]/30 transition-all cursor-crosshair" title="Sat" />
          <div className="bg-[#68dbae]/25 w-full h-[50%] rounded-t-sm hover:bg-[#68dbae]/35 transition-all cursor-crosshair" title="Sun" />
        </div>
      </div>

      {/* Box B: Next Deadline */}
      <div className="bg-[#1A1A1A] p-5 rounded-xl border border-[#2A2A2A] group overflow-hidden relative flex flex-col justify-between">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-500" />
        
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#bccac1] font-bold mb-1">
            Next Critical Task
          </p>
          <h4 className="text-md font-bold text-[#e5e2e1] line-clamp-1 mb-2">
            {nextTask ? nextTask.title : 'All targets cleared!'}
          </h4>
        </div>

        <div className="flex items-center gap-2 mt-2">
          {nextTask ? (
            <>
              <Clock className="text-[#ef4444] w-4 h-4 shrink-0 animate-pulse" />
              <span className="text-xs font-semibold text-[#ffb4ab]">
                {nextTask.priority === 'high' ? 'High Priority' : 'Next action needed'} 
                {nextTask.dueDate ? ` - Due ${nextTask.dueDate}` : ''}
              </span>
            </>
          ) : (
            <>
              <TrendingUp className="text-[#68dbae] w-4 h-4" />
              <span className="text-xs font-semibold text-[#68dbae]">
                Relax or create a new task
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
