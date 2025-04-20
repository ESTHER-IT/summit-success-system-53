
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo and title */}
          <Link to="/" className="text-2xl font-bold">
            Conference Management System
          </Link>

          {/* User info and logout */}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User size={20} />
                <span className="hidden md:inline">{user.name}</span>
                <span className="bg-white text-primary px-2 py-1 rounded-full text-xs font-medium">
                  {user.role}
                </span>
              </div>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-primary/80" 
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-primary/80"
                onClick={() => navigate('/')}
              >
                Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
