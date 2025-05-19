
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../components/auth/AuthContainer';
import Layout from '../components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const { authState } = useAuth();
  const { isAuthenticated } = authState;
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Welcome to EventGo</h1>
          <AuthContainer />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
