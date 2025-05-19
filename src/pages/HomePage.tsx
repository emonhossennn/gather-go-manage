
import React from 'react';
import Layout from '../components/layout/Layout';
import EventList from '../components/events/EventList';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
  const { authState } = useAuth();
  const { isAuthenticated } = authState;

  return (
    <Layout>
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find and Create Amazing Events
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Discover events that match your interests or create your own to share with others.
        </p>
        {!isAuthenticated && (
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button className="bg-event-primary hover:bg-indigo-600 text-white px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-event-primary text-event-primary hover:bg-event-primary hover:text-white">
                Learn More
              </Button>
            </Link>
          </div>
        )}
      </section>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          {isAuthenticated && (
            <Link to="/my-events" className="text-event-primary hover:underline flex items-center">
              My Events <ArrowRight size={16} className="ml-1" />
            </Link>
          )}
        </div>
        <EventList />
      </div>
    </Layout>
  );
};

export default HomePage;
