// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/userAuthStore'; 

export default function ProtectedRoute({ children }) {
  // 1. Check the authentication status from your global store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 2. If they are not logged in, boot them to the login route ("/")
  if (!isAuthenticated) {
    // The "replace" prop is crucial. It erases the /todos URL from the browser's 
    // history so the user cannot just click the "Back" button to bypass the guard.
    return <Navigate to="/" replace />;
  }

  // 3. If they are logged in, render the protected component (the "children")
  return children;
}