
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Event } from '@/types';
import { useAuth } from './AuthContext';

interface EventContextType {
  events: Event[];
  userEvents: Event[];
  isLoading: boolean;
  createEvent: (eventData: Omit<Event, 'id' | 'userId'>) => Promise<void>;
  updateEvent: (id: string, eventData: Partial<Omit<Event, 'id' | 'userId'>>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventById: (id: string) => Event | undefined;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Generate a mock event
const generateMockEvent = (id: string, userId: string): Event => {
  const cities = ['San Francisco', 'New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney'];
  const eventTypes = ['Conference', 'Workshop', 'Meetup', 'Hackathon', 'Webinar', 'Summit'];
  const topics = ['React', 'Node.js', 'TypeScript', 'Web Development', 'UI/UX Design', 'DevOps'];
  
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  
  // Generate a date between today and 90 days from now
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 90));
  
  const dateStr = futureDate.toISOString().split('T')[0];
  const hours = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
  const minutes = Math.random() > 0.5 ? '00' : '30';
  const timeStr = `${hours.toString().padStart(2, '0')}:${minutes}`;
  
  return {
    id,
    name: `${randomTopic} ${randomType}`,
    description: `Join us for an exciting ${randomTopic} ${randomType.toLowerCase()} where you'll learn about the latest trends and best practices.`,
    date: dateStr,
    time: timeStr,
    location: randomCity,
    userId,
  };
};

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { authState } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    // Try to get events from localStorage first
    const storedEvents = localStorage.getItem('events');
    
    if (storedEvents) {
      try {
        setEvents(JSON.parse(storedEvents));
      } catch (error) {
        console.error('Failed to parse events from localStorage', error);
        // If parsing fails, generate new mock events
        generateInitialEvents();
      }
    } else {
      // If no events in localStorage, generate mock data
      generateInitialEvents();
    }
    
    setIsLoading(false);
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events]);

  const generateInitialEvents = () => {
    // Generate 20 mock events
    const mockEvents: Event[] = [];
    for (let i = 1; i <= 20; i++) {
      // Alternate between the current user and other users
      const userId = i % 3 === 0 && authState.user 
        ? authState.user.id 
        : `other-user-${Math.floor(i / 3)}`;
      
      mockEvents.push(generateMockEvent(`event-${i}`, userId));
    }
    setEvents(mockEvents);
  };

  // Filter events created by the current user
  const userEvents = events.filter(
    event => authState.user && event.userId === authState.user.id
  );

  const createEvent = async (eventData: Omit<Event, 'id' | 'userId'>) => {
    try {
      if (!authState.user) {
        throw new Error('You must be logged in to create an event');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newEvent: Event = {
        ...eventData,
        id: `event-${Date.now()}`,
        userId: authState.user.id,
      };
      
      setEvents(prev => [newEvent, ...prev]);
      
      toast({
        title: "Event Created",
        description: "Your event has been created successfully",
      });
    } catch (error) {
      console.error('Create event error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create event",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Omit<Event, 'id' | 'userId'>>) => {
    try {
      if (!authState.user) {
        throw new Error('You must be logged in to update an event');
      }
      
      const eventIndex = events.findIndex(e => e.id === id);
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }
      
      const event = events[eventIndex];
      if (event.userId !== authState.user.id) {
        throw new Error('You can only update your own events');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedEvent = {
        ...event,
        ...eventData,
      };
      
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = updatedEvent;
      setEvents(updatedEvents);
      
      toast({
        title: "Event Updated",
        description: "Your event has been updated successfully",
      });
    } catch (error) {
      console.error('Update event error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update event",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      if (!authState.user) {
        throw new Error('You must be logged in to delete an event');
      }
      
      const event = events.find(e => e.id === id);
      if (!event) {
        throw new Error('Event not found');
      }
      
      if (event.userId !== authState.user.id) {
        throw new Error('You can only delete your own events');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setEvents(prev => prev.filter(event => event.id !== id));
      
      toast({
        title: "Event Deleted",
        description: "Your event has been deleted successfully",
      });
    } catch (error) {
      console.error('Delete event error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete event",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  return (
    <EventContext.Provider 
      value={{ 
        events, 
        userEvents, 
        isLoading, 
        createEvent, 
        updateEvent, 
        deleteEvent, 
        getEventById 
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
