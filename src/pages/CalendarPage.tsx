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
} from 'lucide-react';
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

interface Event {
  id: string;
  event_type: 'Birthday' | 'Anniversary' | 'Event';
  event_date: string;
  event_time?: string;
  location?: string;
  description?: string;
  image_url?: string;
  person_name?: string;
  date_of_birth?: string;
  couple_name?: string;
  anniversary_date?: string;
  event_name?: string;
  created_by?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [activeCategory, setActiveCategory] = useState<'all' | 'birthday' | 'anniversary' | 'event'>('all');
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    loadEvents();
  }, [filter, activeCategory]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/calendar`;
      const params = new URLSearchParams();

      const today = new Date().toISOString().split('T')[0];

      if (filter === 'upcoming') {
        params.append('start_date', today);
      } else if (filter === 'past') {
        params.append('end_date', today);
      }

      if (activeCategory !== 'all') {
        params.append('event_type', 
          activeCategory === 'birthday' ? 'Birthday' :
          activeCategory === 'anniversary' ? 'Anniversary' : 'Event');
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data || []);
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

  const getEventTitle = (event: Event): string => {
    switch (event.event_type) {
      case 'Birthday':
        return event.person_name ? `${event.person_name}'s Birthday` : 'Birthday';
      case 'Anniversary':
        return event.couple_name ? `${event.couple_name}'s Anniversary` : 'Anniversary';
      case 'Event':
        return event.event_name || 'Event';
      default:
        return 'Event';
    }
  };

  const getEventDescription = (event: Event): string => {
    if (event.description) return event.description;
    
    switch (event.event_type) {
      case 'Birthday':
        return event.person_name ? `Celebrating ${event.person_name}'s birthday` : 'Birthday celebration';
      case 'Anniversary':
        return event.couple_name ? `Celebrating ${event.couple_name}'s anniversary` : 'Anniversary celebration';
      case 'Event':
        return event.event_name || 'Club event';
      default:
        return 'Event';
    }
  };

  const birthdayCount = events.filter(e => e.event_type === 'Birthday').length;
  const anniversaryCount = events.filter(e => e.event_type === 'Anniversary').length;
  const eventCount = events.filter(e => e.event_type === 'Event').length;

  // Get events for selected date
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ROTARY TUMKUR PRERANA Calendar
          </h1>
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            <span className="text-lg font-semibold text-gray-800">
              Date: {format(currentTime, 'dd/MM/yy')}
            </span>
          </div>
        </div>

        {/* Three Column Layout for Events */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Birthday Column */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Birthday Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <Cake className="text-pink-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Birthdays</h3>
                    <p className="text-gray-600">{birthdayCount} events</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Birthday Events List */}
            <div className="max-h-[500px] overflow-y-auto">
              <div className="p-4 space-y-4">
                {events
                  .filter(event => event.event_type === 'Birthday')
                  .map((event, index) => {
                    const eventDate = new Date(event.event_date);
                    const isPast = eventDate < new Date();

                    return (
                      <div
                        key={event.id}
                        className={`bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-100 border-l-4 border-pink-500 ${isPast ? 'opacity-75' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Cake className="text-pink-600" size={16} />
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {event.person_name ? `${event.person_name}'s Birthday` : 'Birthday'}
                            </h4>
                          </div>
                          {isPast && (
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                              Past
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-gray-600 mb-2">
                          {format(eventDate, 'MMM d, yyyy')}
                          {event.event_time && ` • ${event.event_time}`}
                        </div>

                        {event.description && (
                          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.date_of_birth && (
                            <div className="flex items-center gap-1">
                              <Cake size={12} />
                              <span>Born: {format(new Date(event.date_of_birth), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                
                {events.filter(event => event.event_type === 'Birthday').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Cake className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-sm">No birthdays scheduled</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Anniversary Column */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Anniversary Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Heart className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Anniversaries</h3>
                    <p className="text-gray-600">{anniversaryCount} events</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Anniversary Events List */}
            <div className="max-h-[500px] overflow-y-auto">
              <div className="p-4 space-y-4">
                {events
                  .filter(event => event.event_type === 'Anniversary')
                  .map((event, index) => {
                    const eventDate = new Date(event.event_date);
                    const isPast = eventDate < new Date();

                    return (
                      <div
                        key={event.id}
                        className={`bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-100 border-l-4 border-purple-500 ${isPast ? 'opacity-75' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Heart className="text-purple-600" size={16} />
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {event.couple_name ? `${event.couple_name}'s Anniversary` : 'Anniversary'}
                            </h4>
                          </div>
                          {isPast && (
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                              Past
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-gray-600 mb-2">
                          {format(eventDate, 'MMM d, yyyy')}
                          {event.event_time && ` • ${event.event_time}`}
                        </div>

                        {event.description && (
                          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.anniversary_date && (
                            <div className="flex items-center gap-1">
                              <Heart size={12} />
                              <span>Since: {format(new Date(event.anniversary_date), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                
                {events.filter(event => event.event_type === 'Anniversary').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-sm">No anniversaries scheduled</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Events Column */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Events Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CalendarIcon className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Events</h3>
                    <p className="text-gray-600">{eventCount} events</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="max-h-[500px] overflow-y-auto">
              <div className="p-4 space-y-4">
                {events
                  .filter(event => event.event_type === 'Event')
                  .map((event, index) => {
                    const eventDate = new Date(event.event_date);
                    const isPast = eventDate < new Date();

                    return (
                      <div
                        key={event.id}
                        className={`bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-100 border-l-4 border-green-500 ${isPast ? 'opacity-75' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="text-green-600" size={16} />
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {event.event_name || 'Event'}
                            </h4>
                          </div>
                          {isPast && (
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                              Past
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-gray-600 mb-2">
                          {format(eventDate, 'MMM d, yyyy')}
                          {event.event_time && ` • ${event.event_time}`}
                        </div>

                        {event.description && (
                          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                
                {events.filter(event => event.event_type === 'Event').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-sm">No events scheduled</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Real Calendar Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
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
          <div className="px-6 py-3 bg-gray-50 border-b">
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
            >
              Today
            </button>
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

                // Function to get colored dots for events
                const getEventDots = (events: Event[]) => {
                  const dots = [];
                  
                  // Color coding for different event types
                  const colors = {
                    'Birthday': 'bg-pink-500',
                    'Anniversary': 'bg-purple-500',
                    'Event': 'bg-green-500'
                  };

                  // Show one dot for each event
                  events.forEach((event, eventIndex) => {
                    const eventTitle = getEventTitle(event);
                    dots.push(
                      <div
                        key={eventIndex}
                        className={`w-2 h-2 rounded-full ${colors[event.event_type]} mb-1`}
                        title={`${event.event_type}: ${eventTitle}`}
                      />
                    );
                  });

                  return dots;
                };

                return (
                  <div
                    key={index}
                    className={`
                      min-h-[100px] p-2 border border-gray-200 rounded-lg transition-all duration-200 cursor-pointer
                      ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                      ${isTodayDate ? 'ring-2 ring-blue-500 ring-inset' : ''}
                      ${isSelected ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}
                      ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                    `}
                    onClick={() => setSelectedDate(date)}
                  >
                    {/* Date Number */}
                    <div className={`
                      text-sm font-medium mb-1 text-right
                      ${isTodayDate ? 'text-blue-600 font-bold' : ''}
                      ${isSelected ? 'text-blue-700' : ''}
                    `}>
                      {format(date, 'd')}
                    </div>

                    {/* Event Dots */}
                    <div className="flex flex-col items-center space-y-1">
                      {getEventDots(dayEvents)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Date Events Panel */}
        {selectedDate && selectedDateEvents.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CalendarIcon className="text-blue-600" size={20} />
              <h3 className="text-xl font-semibold text-gray-900">
                Events on {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
            </div>
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
                      <h4 className="font-semibold text-gray-900">{getEventTitle(event)}</h4>
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
                      {event.event_time && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon size={14} />
                          <span>Time: {event.event_time}</span>
                        </div>
                      )}
                      {event.event_type === 'Birthday' && event.person_name && (
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>{event.person_name}</span>
                        </div>
                      )}
                      {event.event_type === 'Anniversary' && event.couple_name && (
                        <div className="flex items-center gap-1">
                          <Heart size={14} />
                          <span>{event.couple_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Events Message for Selected Date */}
        {selectedDate && selectedDateEvents.length === 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
            <CalendarIcon className="mx-auto text-gray-400 mb-3" size={32} />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              No events on {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <p className="text-gray-500">
              No events scheduled for this date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}