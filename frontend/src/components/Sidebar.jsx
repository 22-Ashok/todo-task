import React from 'react';
import { 
  CheckSquare, 
  Grid, 
  Settings, 
  HelpCircle, 
  Plus, 
  LogOut,
  User,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ 
  currentView, 
  setView, 
  onOpenAddTodo, 
  user, 
  onLogout 
}) {
  return (
    <aside className="hidden md:flex bg-[#0F0F0F] h-screen w-64 fixed left-0 top-0 border-r border-[#2A2A2A] flex-col py-6 px-4 z-40">
      {/* Brand Header */}
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-[#1D9E75] flex items-center justify-center">
          <CheckSquare className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="font-headline-md text-lg font-black text-[#68dbae] tracking-tight leading-tight">Taskly</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#bccac1] font-bold">Productivity Workspace</p>
        </div>
      </div>

      {/* Primary CTA */}
      {user && (
        <button 
          onClick={onOpenAddTodo}
          className="mb-6 bg-[#1D9E75] text-white hover:bg-[#15825F] w-full py-2.5 rounded-full font-label-md text-sm font-semibold flex justify-center items-center gap-2 hover:opacity-95 transition-all shadow-[0_4px_12px_rgba(29,158,117,0.2)]"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      )}

      {/* Primary Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {user ? (
          <>
            <button
              onClick={() => setView('all-tasks')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium text-sm text-left ${
                currentView === 'all-tasks'
                  ? 'bg-[#2a2a2a] text-[#68dbae] border-l-2 border-[#1D9E75] translate-x-1'
                  : 'text-[#bccac1] hover:bg-[#1A1A1A] hover:text-[#e5e2e1]'
              }`}
            >
              <CheckSquare className="w-5 h-5" />
              All Tasks
            </button>

            <button
              onClick={() => setView('categories')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium text-sm text-left ${
                currentView === 'categories' || currentView === 'category-detail'
                  ? 'bg-[#2a2a2a] text-[#68dbae] border-l-2 border-[#1D9E75] translate-x-1'
                  : 'text-[#bccac1] hover:bg-[#1A1A1A] hover:text-[#e5e2e1]'
              }`}
            >
              <Grid className="w-5 h-5" />
              Categories
            </button>
          </>
        ) : (
          <button
            onClick={() => setView('login')}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#2a2a2a] text-[#68dbae] font-medium text-sm text-left border-l-2 border-[#1D9E75]"
          >
            <User className="w-5 h-5" />
            Join Taskly
          </button>
        )}
      </nav>

      {/* Footer Navigation */}
      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-[#2A2A2A]">
        <button
          onClick={() => alert('Settings is a placeholder module')}
          className="flex items-center gap-3 text-[#bccac1] hover:text-[#e5e2e1] px-4 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition-all font-medium text-sm text-left"
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button
          onClick={() => alert('Support Hub coming soon!')}
          className="flex items-center gap-3 text-[#bccac1] hover:text-[#e5e2e1] px-4 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition-all font-medium text-sm text-left"
        >
          <HelpCircle className="w-5 h-5" />
          Help
        </button>

        {user && (
          <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-[#1A1A1A]/40 mb-3">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-8 h-8 rounded-full border border-[#2A2A2A] object-cover"
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${user.name}`;
                }}
              />
              <div className="overflow-hidden flex-1">
                <p className="font-semibold text-xs text-[#e5e2e1] truncate">{user.name}</p>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#68dbae]" />
                  <span className="text-[10px] text-[#bccac1]">{user.isPro ? 'Pro Member' : 'Free tier'}</span>
                </div>
              </div>
              <button 
                onClick={onLogout}
                title="Log out"
                className="p-1 hover:bg-[#2A2A2A] rounded text-[#bccac1] hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
