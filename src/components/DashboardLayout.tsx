
import React from 'react';
import NavBar from './NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'author' | 'reviewer' | 'admin';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, role } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // If role is specified and doesn't match, redirect to appropriate dashboard
  if (requiredRole && role !== requiredRole) {
    if (role === 'author') {
      return <Navigate to="/author-dashboard" />;
    } else if (role === 'reviewer') {
      return <Navigate to="/reviewer-dashboard" />;
    } else if (role === 'admin') {
      return <Navigate to="/admin-dashboard" />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Conference Management System
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
