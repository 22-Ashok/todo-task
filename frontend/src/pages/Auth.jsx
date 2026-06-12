import { useState } from 'react';
import { Check, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/userAuthStore';
import { API_ENDPOINTS } from '../components/config/api';
import { useNavigate } from 'react-router-dom';


export default function Signup() {
  const [isSignupView, setIsSignupView] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loginSuccess = useAuthStore((state) => state.loginSuccess);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
  try {  
    e.preventDefault();
    const endpointURL = isSignupView ? API_ENDPOINTS.auth.register : API_ENDPOINTS.auth.login;

    const payload = isSignupView 
        ? { name: authName, email: authEmail, password: authPassword }
        : { email: authEmail, password: authPassword };

      const response = await fetch(endpointURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        loginSuccess(data.user, data.token);
        navigate('/todos'); 
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Could not connect to the server.");
    }

  };

  return (
    <>
          
              <div className="flex flex-col items-center justify-center py-12 max-w-sm mx-auto">
                <header className="w-full text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded bg-[#1D9E75] flex items-center justify-center shadow-lg shadow-[#1D9E75]/10">
                      <Check className="text-white w-5 h-5" />
                    </div>
                    <h1 className="font-headline-lg text-2xl font-bold tracking-tight text-white">Taskly</h1>
                  </div>
                  <p className="text-sm text-[#bccac1]">Stay on top of everything</p>
                </header>

                <main className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 shadow-2xl relative z-10">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {isSignupView && (
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[#bccac1]" htmlFor="reg-name">Full Name</label>
                        <input 
                          type="text" 
                          id="reg-name"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="Alex Rivera"
                          className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#131d1a]" 
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#bccac1]" htmlFor="email">Email address</label>
                      <input 
                        type="email" 
                        id="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="name@company.com" 
                        required
                        className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#131d1a]" 
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#bccac1]" htmlFor="password">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          id="password"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••" 
                          required
                          className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#131d1a] pr-10" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-[#1D9E75] hover:bg-[#15825F] rounded-full text-white font-semibold text-sm transition-all focus:ring-2 focus:ring-[#1D9E75]/30"
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
                    onClick={() => {
                      setIsSignupView(!isSignupView);
                      setAuthName('');
                      setAuthEmail('');
                      setAuthPassword('');
                    }}
                    className="w-full py-2 bg-transparent hover:bg-[#2A2A2A] border border-[#2A2A2A] rounded-full text-white font-semibold text-sm transition-colors"
                  >
                    {isSignupView ? 'Back to login' : 'Create account'}
                  </button>
                </main>
              </div>
        
    </>
  );
}