import { useEffect, useState } from 'react';
import { Search, MapPin, Clock, Users, Mail, Phone } from 'lucide-react';
import { Club } from '../types';

// Mock data based on MySQL structure
const mockClubs: Club[] = [
  {
    id: 1,
    name: 'Rotary Club of Tumkur Prerana',
    location: 'Tumkur, Karnataka',
    meeting_day: 'Tuesday',
    meeting_time: '7:00 PM',
    meeting_venue: 'Hotel Mayura International',
    president_name: 'John Doe',
    secretary_name: 'Jane Smith',
    contact_email: 'president@rotarytumkurprerana.org',
    contact_phone: '+91 9876543210',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 2,
    name: 'Rotary Club of Bangalore',
    location: 'Bangalore, Karnataka',
    meeting_day: 'Wednesday',
    meeting_time: '6:30 PM',
    meeting_venue: 'Bangalore Club',
    president_name: 'Robert Johnson',
    secretary_name: 'Sarah Wilson',
    contact_email: 'info@rotarybangalore.org',
    contact_phone: '+91 8765432109',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 3,
    name: 'Rotary Club of Mysore',
    location: 'Mysore, Karnataka',
    meeting_day: 'Monday',
    meeting_time: '7:30 PM',
    meeting_venue: 'Mysore Palace Hall',
    president_name: 'Michael Brown',
    secretary_name: 'Emily Davis',
    contact_email: 'contact@rotarymysore.org',
    contact_phone: '+91 7654321098',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 4,
    name: 'Rotary Club of Hubli',
    location: 'Hubli, Karnataka',
    meeting_day: 'Thursday',
    meeting_time: '6:00 PM',
    meeting_venue: 'Hotel Naveen',
    president_name: 'David Miller',
    secretary_name: 'Lisa Anderson',
    contact_email: 'hubli@rotary.org',
    contact_phone: '+91 6543210987',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 5,
    name: 'Rotary Club of Mangalore',
    location: 'Mangalore, Karnataka',
    meeting_day: 'Friday',
    meeting_time: '7:00 PM',
    meeting_venue: 'Ocean View Resort',
    president_name: 'James Wilson',
    secretary_name: 'Maria Garcia',
    contact_email: 'mangalore@rotary.org',
    contact_phone: '+91 5432109876',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
];

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClubs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClubs(clubs);
    } else {
      const filtered = clubs.filter(
        (club) =>
          club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          club.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClubs(filtered);
    }
  }, [searchTerm, clubs]);

  const loadClubs = async () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real application, you would fetch from your MySQL backend API
      // Example: const response = await fetch('/api/clubs');
      // const data = await response.json();
      
      setClubs(mockClubs);
      setFilteredClubs(mockClubs);
      setLoading(false);
    }, 1000);
  };

  // Alternative: If you have a backend API endpoint
  /*
  const loadClubs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/clubs');
      const data = await response.json();
      
      if (response.ok) {
        setClubs(data);
        setFilteredClubs(data);
      } else {
        console.error('Failed to load clubs');
        // Fallback to mock data
        setClubs(mockClubs);
        setFilteredClubs(mockClubs);
      }
    } catch (error) {
      console.error('Error loading clubs:', error);
      // Fallback to mock data
      setClubs(mockClubs);
      setFilteredClubs(mockClubs);
    } finally {
      setLoading(false);
    }
  };
  */

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Optional: Add header text if needed */}
        {/* <h1 className="text-4xl font-bold text-blue-900 mb-4">Club Finder</h1>
        <p className="text-lg text-gray-600 mb-8">
          Find a Rotary club in your area and connect with members making a difference.
        </p> */}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by club name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading clubs...</p>
          </div>
        ) : filteredClubs.length > 0 ? (
          /* Clubs Grid */
          <div className="grid md:grid-cols-2 gap-6">
            {filteredClubs.map((club) => (
              <div key={club.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-bold text-blue-900 mb-4">{club.name}</h3>

                {/* Club Details */}
                <div className="space-y-3 text-gray-600">
                  {club.location && (
                    <div className="flex items-start gap-2">
                      <MapPin size={20} className="flex-shrink-0 mt-1 text-blue-600" />
                      <span>{club.location}</span>
                    </div>
                  )}

                  {(club.meeting_day || club.meeting_time) && (
                    <div className="flex items-start gap-2">
                      <Clock size={20} className="flex-shrink-0 mt-1 text-blue-600" />
                      <span>
                        {club.meeting_day && club.meeting_time
                          ? `${club.meeting_day}s at ${club.meeting_time}`
                          : club.meeting_day || club.meeting_time}
                      </span>
                    </div>
                  )}

                  {club.meeting_venue && (
                    <div className="flex items-start gap-2">
                      <MapPin size={20} className="flex-shrink-0 mt-1 text-blue-600" />
                      <span>{club.meeting_venue}</span>
                    </div>
                  )}
                </div>

                {/* Club Officers */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">Club Officers</h4>
                  <div className="space-y-2 text-sm">
                    {club.president_name && (
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-600" />
                        <span><strong>President:</strong> {club.president_name}</span>
                      </div>
                    )}
                    {club.secretary_name && (
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-600" />
                        <span><strong>Secretary:</strong> {club.secretary_name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                {(club.contact_email || club.contact_phone) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    {club.contact_email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={16} className="text-blue-600" />
                        <a href={`mailto:${club.contact_email}`} className="hover:text-blue-600">
                          {club.contact_email}
                        </a>
                      </div>
                    )}
                    {club.contact_phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={16} className="text-blue-600" />
                        <a href={`tel:${club.contact_phone}`} className="hover:text-blue-600">
                          {club.contact_phone}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* No Results State */
          <div className="text-center py-12 bg-white rounded-lg">
            <Search size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">
              {searchTerm ? 'No clubs found matching your search' : 'No clubs found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}