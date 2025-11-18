import { useEffect, useState } from 'react';
import {
  Calendar,
  MapPin,
  User,
  Cake,
  Heart,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from 'lucide-react';
import { Event } from '../types';
import {
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isSameDay,
  parseISO,
  isToday,
  isSameYear,
} from 'date-fns';

interface EventFormData {
  title: string;
  description: string;
  event_date: string;
  event_type: 'Birthday' | 'Anniversary' | 'Event';
  location: string;
  organizer: string;
  person_name?: string;
  date_of_birth?: string;
  couple_name?: string;
  anniversary_date?: string;
  event_name?: string;
}

interface ApiEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_type: 'Birthday' | 'Anniversary' | 'Event';
  location: string;
  organizer: string;
  person_name?: string;
  date_of_birth?: string;
  couple_name?: string;
  anniversary_date?: string;
  event_name?: string;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ApiEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    event_date: '',
    event_type: 'Event',
    location: '',
    organizer: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<EventFormData>>({});

  useEffect(() => {
    loadEvents();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/calendar`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
      alert('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
  const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDate = (date: Date) =>
    events.filter((event) => isSameDay(parseISO(event.event_date), date));

  const handleAddEvent = (date: Date) => {
    setSelectedDate(date);
    setFormData({
      title: '',
      description: '',
      event_date: format(date, 'yyyy-MM-dd'),
      event_type: 'Event',
      location: '',
      organizer: '',
    });
    setEditingEvent(null);
    setShowEventForm(true);
    setFormErrors({});
  };

  const handleEditEvent = (event: ApiEvent) => {
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date.split('T')[0],
      event_type: event.event_type,
      location: event.location || '',
      organizer: event.organizer || '',
      person_name: event.person_name || '',
      date_of_birth: event.date_of_birth ? event.date_of_birth.split('T')[0] : '',
      couple_name: event.couple_name || '',
      anniversary_date: event.anniversary_date ? event.anniversary_date.split('T')[0] : '',
      event_name: event.event_name || '',
    });
    setEditingEvent(event);
    setShowEventForm(true);
    setFormErrors({});
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/calendar/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      await loadEvents();
      alert('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<EventFormData> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.event_date) {
      errors.event_date = 'Event date is required';
    }
    if (!formData.event_type) {
      errors.event_type = 'Event type is required';
    }

    // Validate specific event type fields
    if (formData.event_type === 'Birthday' && !formData.person_name) {
      errors.person_name = 'Person name is required for birthdays';
    }
    if (formData.event_type === 'Anniversary' && !formData.couple_name) {
      errors.couple_name = 'Couple name is required for anniversaries';
    }
    if (formData.event_type === 'Event' && !formData.event_name) {
      errors.event_name = 'Event name is required for events';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('adminToken');
      const eventData = {
        title: formData.title,
        description: formData.description,
        event_date: formData.event_date,
        event_type: formData.event_type,
        location: formData.location,
        organizer: formData.organizer,
        person_name: formData.person_name,
        date_of_birth: formData.date_of_birth,
        couple_name: formData.couple_name,
        anniversary_date: formData.anniversary_date,
        event_name: formData.event_name,
      };

      let response;
      if (editingEvent) {
        // Update existing event
        response = await fetch(`${API_BASE_URL}/calendar/${editingEvent.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
      } else {
        // Create new event
        response = await fetch(`${API_BASE_URL}/calendar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save event');
      }

      await loadEvents();
      setShowEventForm(false);
      setFormData({
        title: '',
        description: '',
        event_date: '',
        event_type: 'Event',
        location: '',
        organizer: '',
      });
      setEditingEvent(null);
      alert(editingEvent ? 'Event updated successfully' : 'Event created successfully');
    } catch (error: any) {
      console.error('Error saving event:', error);
      alert('Error saving event: ' + error.message);
    }
  };

  const handleCancel = () => {
    setShowEventForm(false);
    setFormData({
      title: '',
      description: '',
      event_date: '',
      event_type: 'Event',
      location: '',
      organizer: '',
    });
    setEditingEvent(null);
    setFormErrors({});
  };

  // Render event-specific fields based on event type
  const renderEventTypeFields = () => {
    switch (formData.event_type) {
      case 'Birthday':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Person Name *
              </label>
              <input
                type="text"
                value={formData.person_name || ''}
                onChange={(e) => setFormData({ ...formData, person_name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.person_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter person's name"
              />
              {formErrors.person_name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.person_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        );
      
      case 'Anniversary':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couple Name *
              </label>
              <input
                type="text"
                value={formData.couple_name || ''}
                onChange={(e) => setFormData({ ...formData, couple_name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.couple_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter couple's name"
              />
              {formErrors.couple_name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.couple_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anniversary Date
              </label>
              <input
                type="date"
                value={formData.anniversary_date || ''}
                onChange={(e) => setFormData({ ...formData, anniversary_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        );
      
      case 'Event':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Name *
            </label>
            <input
              type="text"
              value={formData.event_name || ''}
              onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.event_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter event name"
            />
            {formErrors.event_name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.event_name}</p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  // Get events for selected date
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ROTARY TUMKUR PRERANA - Admin Calendar
          </h1>
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            <span className="text-lg font-semibold text-gray-800">
              Date: {format(currentTime, 'dd/MM/yy')}
            </span>
            <button
              onClick={() => handleAddEvent(new Date())}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Event
            </button>
          </div>
        </div>

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter event title"
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter event description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.event_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.event_date && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.event_date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type *
                    </label>
                    <select
                      value={formData.event_type}
                      onChange={(e) => setFormData({ ...formData, event_type: e.target.value as any })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.event_type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="Event">Event</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Anniversary">Anniversary</option>
                    </select>
                    {formErrors.event_type && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.event_type}</p>
                    )}
                  </div>

                  {/* Event Type Specific Fields */}
                  {renderEventTypeFields()}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter event location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organizer
                    </label>
                    <input
                      type="text"
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter organizer name"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      <Save size={20} />
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Calendar Header */}
          <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              {!isSameYear(currentDate, new Date()) && (
                <p className="text-blue-200 text-sm mt-1">
                  {format(currentDate, 'yyyy')}
                </p>
              )}
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Today Button */}
          <div className="px-6 py-3 bg-gray-50 border-b flex justify-between items-center">
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
            >
              Today
            </button>
            <div className="text-sm text-gray-600">
              {events.length} total events
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center py-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                const dayEvents = getEventsForDate(date);
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isTodayDate = isToday(date);
                const isSelected = selectedDate && isSameDay(date, selectedDate);

                return (
                  <div
                    key={index}
                    className={`
                      min-h-[120px] p-2 border border-gray-200 rounded-lg transition-all duration-200 cursor-pointer group
                      ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                      ${isTodayDate ? 'ring-2 ring-blue-500 ring-inset' : ''}
                      ${isSelected ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}
                      ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                    `}
                    onClick={() => setSelectedDate(date)}
                  >
                    {/* Date Number and Add Button */}
                    <div className="flex justify-between items-start mb-1">
                      <div className={`
                        text-sm font-medium
                        ${isTodayDate ? 'text-blue-600 font-bold' : ''}
                        ${isSelected ? 'text-blue-700' : ''}
                      `}>
                        {format(date, 'd')}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddEvent(date);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                        title="Add event"
                      >
                        <Plus size={14} className="text-gray-600" />
                      </button>
                    </div>

                    {/* Events */}
                    <div className="space-y-1 max-h-[80px] overflow-y-auto">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`
                            group text-xs px-2 py-1 rounded text-left truncate relative
                            ${event.event_type === 'Birthday' 
                              ? 'bg-pink-100 text-pink-800 border-l-2 border-pink-400' 
                              : event.event_type === 'Anniversary'
                              ? 'bg-purple-100 text-purple-800 border-l-2 border-purple-400'
                              : 'bg-green-100 text-green-800 border-l-2 border-green-400'
                            }
                          `}
                          title={event.title}
                        >
                          {event.title}
                          
                          {/* Action Buttons */}
                          <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditEvent(event);
                              }}
                              className="p-0.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                              title="Edit event"
                            >
                              <Edit size={10} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(event.id);
                              }}
                              className="p-0.5 bg-red-500 text-white rounded hover:bg-red-600"
                              title="Delete event"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Date Events Panel */}
        {selectedDate && (
          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="text-blue-600" size={20} />
                <h3 className="text-xl font-semibold text-gray-900">
                  Events on {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
              </div>
              <button
                onClick={() => handleAddEvent(selectedDate)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Plus size={16} />
                Add Event
              </button>
            </div>
            
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`
                      w-3 h-3 rounded-full mt-2 flex-shrink-0
                      ${event.event_type === 'Birthday' ? 'bg-pink-500' :
                        event.event_type === 'Anniversary' ? 'bg-purple-500' :
                        'bg-green-500'
                      }
                    `} />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <span className={`
                          text-xs px-2 py-1 rounded-full
                          ${event.event_type === 'Birthday' ? 'bg-pink-100 text-pink-800' :
                            event.event_type === 'Anniversary' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }
                        `}>
                          {event.event_type}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.organizer && (
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>By {event.organizer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        title="Edit event"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Delete event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="mx-auto mb-3 text-gray-400" size={32} />
                <p>No events scheduled for this date.</p>
                <button
                  onClick={() => handleAddEvent(selectedDate)}
                  className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add an event
                </button>
              </div>
            )}
          </div>
        )}

        {/* All Events List */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">All Events</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading events...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => {
                const eventDate = new Date(event.event_date);
                const isPast = eventDate < new Date();

                return (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        rounded-lg p-4 text-center min-w-[80px] flex-shrink-0
                        ${event.event_type === 'Birthday' ? 'bg-pink-500 text-white' :
                          event.event_type === 'Anniversary' ? 'bg-purple-500 text-white' :
                          'bg-green-500 text-white'
                        }
                      `}>
                        <div className="text-lg font-bold">{eventDate.getDate()}</div>
                        <div className="text-sm">{format(eventDate, 'MMM')}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <span className={`
                            text-xs px-2 py-1 rounded-full
                            ${event.event_type === 'Birthday' ? 'bg-pink-100 text-pink-800' :
                              event.event_type === 'Anniversary' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }
                          `}>
                            {event.event_type}
                          </span>
                          {isPast && (
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                              Past
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-gray-600 text-sm mb-1">{event.description}</p>
                        )}
                        <div className="flex gap-4 text-sm text-gray-500">
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.organizer && (
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span>By {event.organizer}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        title="Edit event"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Delete event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="mx-auto mb-3 text-gray-400" size={32} />
              <p>No events found. Create your first event!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}