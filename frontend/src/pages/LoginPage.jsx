import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Check, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isSignupView, setIsSignupView] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect directly to tasks dashboard
  if (user) {
    return <Navigate to="/tasks" replace />;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!authEmail.includes('@') || authPassword.length < 4) {
      setApiError('Please fill out a valid email and password (min 4 characters)');
      return;
    }

    if (isSignupView && !authName.trim()) {
      setApiError('Please enter your full name');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignupView) {
        await register(authName, authEmail, authPassword);
        // Note: register logs the user in if the token is returned, otherwise they log in:
        await login(authEmail, authPassword);
      } else {
        await login(authEmail, authPassword);
      }
      navigate('/tasks');
    } catch (error) {
      setApiError(error.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // need to remove 
  const handleBypass = async () => {
    setApiError('');
    setIsSubmitting(true);
    try {
      // Ensure the test account exists — register first, then fall back to login.
      try {
        await register('Test Account', 'email-test@gmail.com', 'Test@123');
        // register() auto-logs in if the backend returns a token
      } catch (regErr) {
        // Registration failed (account likely already exists) — try logging in instead
        await login('test@gmail.com', 'Test@123');
      }
    } catch (e) {
      // Both register and login failed — backend is offline
      setApiError('Notice: Offline/Local bypass. Make sure your Node backend at http://localhost:8000 is active!');
    } finally {
      setIsSubmitting(false);
    }
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
          
          {apiError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-300 antialiased leading-relaxed">
              {apiError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {isSignupView && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#bccac1]" htmlFor="login-name">Full Name</label>
                <input 
                  type="text" 
                  id="login-name"
                  disabled={isSubmitting}
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#1D9E75] transition-colors disabled:opacity-50" 
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#bccac1]" htmlFor="login-email">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  id="login-email"
                  disabled={isSubmitting}
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@company.com" 
                  required
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg pl-3 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#1D9E75] transition-colors disabled:opacity-50" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#bccac1]" htmlFor="login-password">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="login-password"
                  disabled={isSubmitting}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg pl-3 pr-10 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#1D9E75] transition-colors disabled:opacity-50" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#1D9E75] hover:bg-[#15825F] rounded-full text-white font-semibold text-sm transition-all focus:ring-2 focus:ring-[#1D9E75]/30 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                isSignupView ? 'Sign up' : 'Log in'
              )}
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
              setApiError('');
            }}
            disabled={isSubmitting}
            className="w-full py-2 bg-transparent hover:bg-[#2A2A2A] border border-[#2A2A2A] rounded-full text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSignupView ? 'Back to login' : 'Create account'}
          </button>

          <div className="text-center mt-4">
            <button 
              type="button"
              onClick={handleBypass}
              disabled={isSubmitting}
              className="text-xs text-[#68dbae] hover:underline font-medium cursor-pointer disabled:opacity-50"
            >
              Bypass &amp; View Workspace (Test Account)
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
