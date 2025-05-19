
import React from 'react';
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/">
          <Button className="bg-event-primary hover:bg-indigo-600">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
