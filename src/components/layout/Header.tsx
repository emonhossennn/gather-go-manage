
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { authState, logout } = useAuth();
  const { isAuthenticated, user } = authState;

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-event-primary to-event-accent rounded-md flex items-center justify-center text-white font-bold text-lg">
                E
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">EventGo</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-event-primary">
              Home
            </Link>
            {isAuthenticated && (
              <Link to="/my-events" className="px-3 py-2 text-gray-700 hover:text-event-primary">
                My Events
              </Link>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="hidden md:inline text-sm text-gray-600">
                  Welcome, {user?.name}
                </span>
                <Button 
                  onClick={logout}
                  variant="outline"
                  className="border-event-primary text-event-primary hover:bg-event-primary hover:text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="bg-event-primary hover:bg-indigo-600">
                  Login / Register
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
