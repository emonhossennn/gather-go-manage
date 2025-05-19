
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const { authState } = useAuth();
  const isOwner = authState.user && authState.user.id === event.userId;
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="h-2 bg-gradient-to-r from-event-primary to-event-accent" />
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold line-clamp-2">{event.name}</CardTitle>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Calendar size={14} className="inline" /> 
          {formatDate(event.date)} at {event.time}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-700 line-clamp-3">{event.description}</p>
          <p className="text-sm font-medium">{event.location}</p>
        </div>
      </CardContent>
      {isOwner && onEdit && onDelete && (
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(event)}
            className="text-gray-600 hover:text-event-primary"
          >
            <Edit size={16} className="mr-1" /> Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(event.id)}
            className="text-gray-600 hover:text-red-600"
          >
            <Trash2 size={16} className="mr-1" /> Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default EventCard;
