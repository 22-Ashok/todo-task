import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
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
import { useAuth } from '../context/AuthContext';
import { useTodos } from '../context/TodoContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { setIsAddTodoOpen } = useTodos();
  const navigate = useNavigate();

  const handleCreateTaskClick = () => {
    setIsAddTodoOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex bg-[#0F0F0F] h-screen w-64 fixed left-0 top-0 border-r border-[#2A2A2A] flex-col py-6 px-4 z-40">
      {/* Brand Header */}
      <Link to="/tasks" className="mb-8 px-2 flex items-center gap-3 hover:opacity-90">
        <div className="w-8 h-8 rounded bg-[#1D9E75] flex items-center justify-center">
          <CheckSquare className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="font-headline-md text-lg font-black text-[#68dbae] tracking-tight leading-tight">Taskly</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#bccac1] font-bold">Productivity Workspace</p>
        </div>
      </Link>

      {/* Primary CTA */}
      {user && (
        <button 
          onClick={handleCreateTaskClick}
          className="mb-6 bg-[#1D9E75] text-white hover:bg-[#15825F] w-full py-2.5 rounded-full font-label-md text-sm font-semibold flex justify-center items-center gap-2 hover:opacity-95 transition-all shadow-[0_4px_12px_rgba(29,158,117,0.2)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      )}

      {/* Primary Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {user ? (
          <>
            <NavLink
              to="/tasks"
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium text-sm text-left ${
                isActive
                  ? 'bg-[#2a2a2a] text-[#68dbae] border-l-2 border-[#1D9E75] translate-x-1'
                  : 'text-[#bccac1] hover:bg-[#1A1A1A] hover:text-[#e5e2e1]'
              }`}
            >
              <CheckSquare className="w-5 h-5" />
              All Tasks
            </NavLink>

            <NavLink
              to="/categories"
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium text-sm text-left ${
                isActive
                  ? 'bg-[#2a2a2a] text-[#68dbae] border-l-2 border-[#1D9E75] translate-x-1'
                  : 'text-[#bccac1] hover:bg-[#1A1A1A] hover:text-[#e5e2e1]'
              }`}
            >
              <Grid className="w-5 h-5" />
              Categories
            </NavLink>
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium text-sm text-left ${
              isActive
                ? 'bg-[#2a2a2a] text-[#68dbae] border-l-2 border-[#1D9E75]'
                : 'text-[#bccac1] hover:bg-[#1A1A1A]'
            }`}
          >
            <User className="w-5 h-5" />
            Join Taskly
          </NavLink>
        )}
      </nav>

      {/* Footer Navigation */}
      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-[#2A2A2A]">
        <button
          type="button"
          onClick={() => alert('Coming soon')}
          className="flex items-center gap-3 text-[#bccac1] hover:text-[#e5e2e1] px-4 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition-all font-medium text-sm text-left cursor-pointer"
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button
          type="button"
          onClick={() => alert('Coming soon')}
          className="flex items-center gap-3 text-[#bccac1] hover:text-[#e5e2e1] px-4 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition-all font-medium text-sm text-left cursor-pointer"
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
                onClick={handleLogout}
                title="Log out"
                type="button"
                className="p-1 hover:bg-[#2A2A2A] rounded text-[#bccac1] hover:text-red-400 transition-colors cursor-pointer"
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
