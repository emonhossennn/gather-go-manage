
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import EventList from '../components/events/EventList';
import { useAuth } from '@/contexts/AuthContext';

const MyEventsPage = () => {
  const { authState } = useAuth();
  const { isAuthenticated, isLoading } = authState;
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">My Events</h1>
        <EventList showUserEventsOnly />
      </div>
    </Layout>
  );
};

export default MyEventsPage;
