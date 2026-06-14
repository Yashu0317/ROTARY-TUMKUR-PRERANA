import { useEffect, useState } from 'react';
import { Calendar, Users, MapPin, ArrowRight, Filter } from 'lucide-react';

interface CommunityService {
  id: string;
  heading: string;
  description: string;
  image_url?: string;
  location?: string;
  service_date?: string;
  club_name: string;
  category?: string;
  status: 'completed' | 'ongoing' | 'upcoming';
  volunteers_count: number;
  impact_description?: string;
  created_by?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = '/api';

export default function CommunityServicePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [services, setServices] = useState<CommunityService[]>([]);
  const [filteredServices, setFilteredServices] = useState<CommunityService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadCommunityServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, selectedClub, selectedStatus, selectedCategory]);

  const loadCommunityServices = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/services`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch community services');
      }
      
      const data = await response.json();
      setServices(data || []);
      
    } catch (error) {
      console.error('Error loading community services:', error);
      alert('Failed to load community services');
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (selectedClub !== 'all') {
      filtered = filtered.filter(service => service.club_name === selectedClub);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(service => service.status === selectedStatus);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Date not specified';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getUniqueClubs = () => {
    return Array.from(new Set(services.map(service => service.club_name)));
  };

  const getUniqueCategories = () => {
    const categories = services.map(service => service.category).filter(Boolean) as string[];
    return Array.from(new Set(categories));
  };

  const getStatusCount = (status: string) => {
    return services.filter(service => service.status === status).length;
  };

  const totalServices = services.length;
  const completedCount = getStatusCount('completed');
  const ongoingCount = getStatusCount('ongoing');
  const upcomingCount = getStatusCount('upcoming');

  const totalVolunteers = services.reduce((sum, service) => sum + service.volunteers_count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center text-white z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            COMMUNITY SERVICES
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Making a difference through dedicated service projects and community initiatives
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
            <div className="flex items-center justify-center gap-4 text-lg">
              <Users size={32} className="text-yellow-400" />
              <span className="font-semibold">Total Community Services: {totalServices}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{completedCount}</div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-800">{ongoingCount}</div>
              <div className="text-sm text-yellow-600">Ongoing</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">{upcomingCount}</div>
              <div className="text-sm text-blue-600">Upcoming</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-800">{totalVolunteers}</div>
              <div className="text-sm text-purple-600">Volunteers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Club Filter */}
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-blue-900" />
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
                >
                  <option value="all">All Clubs</option>
                  {getUniqueClubs().map(club => (
                    <option key={club} value={club}>{club}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px]"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px]"
                >
                  <option value="all">All Categories</option>
                  {getUniqueCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredServices.length} of {totalServices} services
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading community services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No services found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No community services match your current filters.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Service Image */}
                  {service.image_url && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img 
                        src={service.image_url} 
                        alt={service.heading}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Service Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2">
                          {service.heading}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-blue-900 font-semibold">
                          <Users size={16} />
                          <span>{service.club_name}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        service.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : service.status === 'ongoing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {service.description}
                    </p>

                    {/* Category and Volunteers */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {service.category && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {service.category}
                        </span>
                      )}
                      {service.volunteers_count > 0 && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                          {service.volunteers_count} volunteers
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Service Footer */}
                  <div className="p-6 bg-gray-50">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{formatDate(service.service_date)}</span>
                      </div>
                      {service.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span className="max-w-[100px] truncate">{service.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => onNavigate('service-details')}
                      className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                    >
                      Read More
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Your Own Community Service</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join us in making a lasting impact in our community. Your initiative can change lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('join')}
              className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition"
            >
              Join Our Club
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition"
            >
              View All Projects
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-900" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-blue-900 mb-2">{totalServices}+</h3>
              <p className="text-gray-600">Community Services</p>
            </div>
            <div className="p-6">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-blue-900" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-blue-900 mb-2">
                {Array.from(new Set(services.map(s => s.location).filter(Boolean))).length}+
              </h3>
              <p className="text-gray-600">Locations Served</p>
            </div>
            <div className="p-6">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-blue-900" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-blue-900 mb-2">{totalVolunteers}+</h3>
              <p className="text-gray-600">Volunteers</p>
            </div>
            <div className="p-6">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-900" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-blue-900 mb-2">
                {getUniqueClubs().length}+
              </h3>
              <p className="text-gray-600">Partner Clubs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}