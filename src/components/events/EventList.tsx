
import React, { useState } from 'react';
import EventCard from './EventCard';
import EventForm from './EventForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Event } from '@/types';
import { useEvents } from '@/contexts/EventContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EventListProps {
  showUserEventsOnly?: boolean;
}

const EventList: React.FC<EventListProps> = ({ showUserEventsOnly = false }) => {
  const { events, userEvents, createEvent, updateEvent, deleteEvent } = useEvents();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Event filtering logic
  const filteredEvents = (showUserEventsOnly ? userEvents : events).filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = selectedDate ? event.date === selectedDate : true;
    const matchesLocation = selectedLocation ? 
      event.location.toLowerCase().includes(selectedLocation.toLowerCase()) : 
      true;

    return matchesSearch && matchesDate && matchesLocation;
  });

  // Extract unique locations for the filter dropdown
  const uniqueLocations = Array.from(
    new Set(events.map(event => event.location))
  ).sort();

  const handleCreateEvent = () => {
    setEditingEvent(undefined);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      await deleteEvent(eventToDelete);
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const handleSubmit = async (eventData: Omit<Event, 'id' | 'userId'>) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, eventData);
    } else {
      await createEvent(eventData);
    }
  };

  // Calculate locations count for the filter
  const locationCount: Record<string, number> = {};
  events.forEach(event => {
    locationCount[event.location] = (locationCount[event.location] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          >
            <option value="">All Dates</option>
            {Array.from(new Set(events.map(event => event.date)))
              .sort()
              .map(date => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))}
          </select>
          
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>
                {location} ({locationCount[location]})
              </option>
            ))}
          </select>
          
          {!showUserEventsOnly && (
            <Button 
              onClick={handleCreateEvent} 
              className="bg-event-primary hover:bg-indigo-600"
            >
              <Plus size={18} className="mr-1" /> Add Event
            </Button>
          )}
        </div>
      </div>
      
      {/* Create button for user events page */}
      {showUserEventsOnly && (
        <div className="flex justify-end">
          <Button 
            onClick={handleCreateEvent} 
            className="bg-event-primary hover:bg-indigo-600"
          >
            <Plus size={18} className="mr-1" /> Create New Event
          </Button>
        </div>
      )}
      
      {/* Event Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No events found</h3>
          <p className="text-gray-500 mt-2">
            {showUserEventsOnly 
              ? "You haven't created any events yet." 
              : "No events match your search criteria."}
          </p>
          {showUserEventsOnly && (
            <Button 
              onClick={handleCreateEvent} 
              className="mt-4 bg-event-primary hover:bg-indigo-600"
            >
              <Plus size={18} className="mr-1" /> Create Your First Event
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onEdit={handleEditEvent}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}
      
      {/* Event Form Dialog */}
      <EventForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        event={editingEvent}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventList;
