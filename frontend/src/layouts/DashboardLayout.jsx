import React from 'react';
import { Outlet, Navigate, Link, NavLink, useNavigate } from 'react-router-dom';
import { CheckSquare, Grid, Plus, Check, Settings, HelpCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AddTodoModal from '../components/AddTodoModal';
import AddCategoryModal from '../components/AddCategoryModal';
import EditTodoModal from '../components/EditTodoModal';
import EditCategoryModal from '../components/EditCategoryModal';
import { useAuth } from '../context/AuthContext';
import { useTodos } from '../context/TodoContext';

export default function DashboardLayout() {
  const { user, loading, logout } = useAuth();
  const { setIsAddTodoOpen } = useTodos();
  const navigate = useNavigate();

  // If auth is still loading, show a clean loading screen
  if (loading) {
    return (
      <div className="bg-[#0F0F0F] min-h-screen text-[#e5e2e1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-[#bccac1]">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  // Protect route redirecting to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleMobileLogout = () => {
    if (window.confirm('Log out from Taskly?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-[#e5e2e1] font-sans antialiased flex h-screen overflow-hidden">
      
      {/* Sidebar Navigation (Visible on desktop md+) */}
      <Sidebar />

      {/* Mobile Top Navigation layout wrapper (Hidden on md+) */}
      <nav className="md:hidden bg-[#0F0F0F] border-b border-[#2A2A2A] fixed top-0 w-full h-16 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#1D9E75] flex items-center justify-center">
            <Check className="text-white w-4 h-4" />
          </div>
          <span className="text-md font-bold text-[#68dbae] tracking-tighter">Taskly</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setIsAddTodoOpen(true)}
            className="w-8 h-8 rounded-full bg-[#1D9E75] flex items-center justify-center text-white p-0 cursor-pointer"
            title="Create task"
          >
            <Plus className="w-5 h-5" />
          </button>
          <img 
            src={user.avatar} 
            alt="Profile" 
            className="w-7 h-7 rounded-full border border-[#2A2A2A] object-cover cursor-pointer"
            onClick={handleMobileLogout}
          />
        </div>
      </nav>

      {/* Main Canvas Container (Responsive offset for Sidebar) */}
      <main className="flex-grow md:ml-64 mt-16 md:mt-0 p-4 md:p-8 overflow-y-auto h-screen relative bg-[#0F0F0F]/90 pb-24 md:pb-8">
        
        {/* Subtle luminous design backdrop accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1D9E75]/5 blur-[120px] rounded-full pointer-events-none -mr-48 -mt-48" />

        <div className="max-w-[800px] mx-auto w-full h-full flex flex-col justify-between">
          
          <div className="w-full">
            {/* Swappable Route Content */}
            <Outlet />
          </div>

          {/* Footer Area */}
          <footer className="text-center text-[10px] text-[#bccac1]/40 py-6 mt-12 bg-transparent select-none">
            <p>Taskly Productivity Engine · Unified React Router &amp; Tailwind CSS &amp; Lucide Icons</p>
          </footer>
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (Hidden on md+) */}
      <nav className="md:hidden bg-[#0F0F0F] border-t border-[#2A2A2A] fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-20">
        <NavLink 
          to="/tasks"
          className={({ isActive }) => `flex flex-col items-center justify-center font-semibold text-xs px-4 py-1.5 transition-all ${
            isActive 
              ? 'text-[#68dbae] bg-[#68dbae]/10 rounded-xl' 
              : 'text-[#bccac1]'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-0.5" />
          <span>Tasks</span>
        </NavLink>
        
        <NavLink 
          to="/categories"
          className={({ isActive }) => `flex flex-col items-center justify-center font-semibold text-xs px-4 py-1.5 transition-all ${
            isActive
              ? 'text-[#68dbae] bg-[#68dbae]/10 rounded-xl' 
              : 'text-[#bccac1]'
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span>Categories</span>
        </NavLink>

        <button
          type="button"
          onClick={() => alert('Settings coming soon')}
          className="flex flex-col items-center justify-center font-semibold text-xs px-4 py-1.5 transition-all text-[#bccac1]"
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span>Settings</span>
        </button>

        <button
          type="button"
          onClick={() => alert('Help coming soon')}
          className="flex flex-col items-center justify-center font-semibold text-xs px-4 py-1.5 transition-all text-[#bccac1]"
        >
          <HelpCircle className="w-5 h-5 mb-0.5" />
          <span>Help</span>
        </button>
      </nav>

      {/* Global Creator Modals */}
      <AddTodoModal />
      <AddCategoryModal />
      <EditTodoModal />
      <EditCategoryModal />

    </div>
  );
}
