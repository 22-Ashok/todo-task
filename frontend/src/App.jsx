import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import TasksPage from './pages/TasksPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';

export default function App() {
  return (
    <AuthProvider>
      <TodoProvider>
        <HashRouter>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Workspace Layout Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:categoryId" element={<CategoryDetailPage />} />
              
              {/* Global Redirect Fallback */}
              <Route path="*" element={<Navigate to="/tasks" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </TodoProvider>
    </AuthProvider>
  );
}
