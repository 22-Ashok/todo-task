import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Check, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isSignupView, setIsSignupView] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect directly to tasks dashboard
  if (user) {
    return <Navigate to="/tasks" replace />;
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!authEmail.includes('@') || authPassword.length < 4) {
      alert('Please fill out a valid email and password (min 4 characters)');
      return;
    }

    const finalName = isSignupView ? (authName || 'Taskly Member') : 'Alex Rivera';
    login(authEmail, finalName);
    navigate('/tasks');
  };

  const handleBypass = () => {
    login('alex@taskly.app', 'Alex Rivera');
    navigate('/tasks');
  };

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-[#e5e2e1] font-sans antialiased flex flex-col items-center justify-center py-12 px-4 relative">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1D9E75]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm flex flex-col items-center">
        {/* App Logo & Title */}
        <header className="w-full text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-9 h-9 rounded bg-[#1D9E75] flex items-center justify-center shadow-lg shadow-[#1D9E75]/10">
              <Check className="text-white w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Taskly</h1>
          </div>
          <p className="text-sm text-[#bccac1]">Stay on top of everything</p>
        </header>

        {/* Auth Box Sheet */}
        <main className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 shadow-2xl relative z-10">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {isSignupView && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#bccac1]" htmlFor="login-name">Full Name</label>
                <input 
                  type="text" 
                  id="login-name"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#1D9E75] transition-colors" 
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#bccac1]" htmlFor="login-email">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  id="login-email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@company.com" 
                  required
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg pl-3 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#1D9E75] transition-colors" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#bccac1]" htmlFor="login-password">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="login-password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg pl-3 pr-10 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#1D9E75] transition-colors" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-[#1D9E75] hover:bg-[#15825F] rounded-full text-white font-semibold text-sm transition-all focus:ring-2 focus:ring-[#1D9E75]/30 cursor-pointer"
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
            type="button"
            onClick={() => {
              setIsSignupView(!isSignupView);
              setAuthName('');
              setAuthEmail('');
              setAuthPassword('');
            }}
            className="w-full py-2 bg-transparent hover:bg-[#2A2A2A] border border-[#2A2A2A] rounded-full text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            {isSignupView ? 'Back to login' : 'Create account'}
          </button>

          <div className="text-center mt-4">
            <button 
              type="button"
              onClick={handleBypass}
              className="text-xs text-[#68dbae] hover:underline font-medium cursor-pointer"
            >
              Bypass &amp; View Workspace (Alex Rivera)
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
