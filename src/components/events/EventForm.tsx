
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Event } from '@/types';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface EventFormProps {
  event?: Event;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Omit<Event, 'id' | 'userId'>) => Promise<void>;
}

const EventForm: React.FC<EventFormProps> = ({ 
  event, 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<Omit<Event, 'id' | 'userId'>>({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set form data when editing an existing event
  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        imageUrl: event.imageUrl,
      });
    } else {
      // Default to today's date for new events
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        name: '',
        description: '',
        date: today,
        time: '18:00',
        location: '',
      });
    }
  }, [event, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.name || !formData.date || !formData.time || !formData.location) {
        throw new Error('Please fill all required fields');
      }

      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Only render the dialog content when it's open (for performance)
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
          <DialogDescription>
            {event 
              ? 'Update your event details below.' 
              : 'Fill out the form to create a new event.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Event Name *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter event name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date *
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">
                Time *
              </label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location *
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              required
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-event-primary hover:bg-indigo-600"
            >
              {isLoading 
                ? (event ? 'Updating...' : 'Creating...') 
                : (event ? 'Update Event' : 'Create Event')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
