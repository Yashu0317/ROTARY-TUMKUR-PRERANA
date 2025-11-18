import { useEffect, useState } from 'react';
import { Calendar, Users, MapPin, ArrowRight, Filter } from 'lucide-react';
// import { supabase } from '../lib/supabase';

interface CommunityProject {
  id: string;
  title: string;
  description: string;
  club_name: string;
  project_date: string;
  location?: string;
  image_url?: string;
  category: string;
  status: 'completed' | 'ongoing' | 'upcoming';
}

export default function CommunityServicePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [projects, setProjects] = useState<CommunityProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<CommunityProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadCommunityProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, selectedClub, selectedStatus]);

  const loadCommunityProjects = async () => {
    try {
      setLoading(true);
      // TODO: Uncomment and use your actual Supabase client
      // const { data, error } = await supabase
      //   .from('community_projects')
      //   .select('*')
      //   .order('project_date', { ascending: false });

      // Mock data based on your screenshot
      const mockData: CommunityProject[] = [
        {
          id: '1',
          title: 'Blogging against littering @estee...',
          description: 'Small packets of tobacco are sold widely...',
          club_name: 'Bangalore R.T. Neger',
          project_date: '2025-10-11',
          location: 'Bangalore',
          category: 'Environment',
          status: 'completed'
        },
        {
          id: '2',
          title: 'Project 29- UPS for UPHC Tavark...',
          description: 'As per the request received from PHC...',
          club_name: 'Bangalore Brizades',
          project_date: '2025-10-09',
          location: 'Bangalore',
          category: 'Healthcare',
          status: 'completed'
        },
        {
          id: '3',
          title: 'Project 31: Old Age Home-A-Kas...',
          description: 'On Saturday 11th October we RBB Me...',
          club_name: 'Bangalore Brizades',
          project_date: '2025-10-11',
          location: 'Bangalore',
          category: 'Elderly Care',
          status: 'completed'
        },
        {
          id: '4',
          title: 'Project 28: Fall Prevention-Welin...',
          description: 'Dear Brigadears, Project completed: o...',
          club_name: 'Bangalore Brizades',
          project_date: '2025-09-27',
          location: 'Bangalore',
          category: 'Healthcare',
          status: 'completed'
        },
        {
          id: '5',
          title: 'Project 32: Old Age Home-B-Ma...',
          description: 'On Saturday 11th October 25 we RBB ...',
          club_name: 'Bangalore Brizades',
          project_date: '2025-10-11',
          location: 'Bangalore',
          category: 'Elderly Care',
          status: 'completed'
        },
        {
          id: '6',
          title: 'Project 27-Mobile Bidi Pustak hi...',
          description: 'Rbb Project -Mobile Bidi Pustak hidi 19...',
          club_name: 'Bangalore Brizades',
          project_date: '2025-09-19',
          location: 'Bangalore',
          category: 'Education',
          status: 'completed'
        }
      ];

      // Simulate API delay
      setTimeout(() => {
        setProjects(mockData);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error loading projects:', error);
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (selectedClub !== 'all') {
      filtered = filtered.filter(project => project.club_name === selectedClub);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    setFilteredProjects(filtered);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getUniqueClubs = () => {
    return Array.from(new Set(projects.map(project => project.club_name)));
  };

  const totalProjects = projects.length;

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
              <span className="font-semibold">Total Community Services: {totalProjects}</span>
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
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredProjects.length} of {totalProjects} projects
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading community projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No community service projects match your current filters.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Project Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-blue-900 font-semibold">
                          <Users size={16} />
                          <span>{project.club_name}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : project.status === 'ongoing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Project Footer */}
                  <div className="p-6 bg-gray-50">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{formatDate(project.project_date)}</span>
                      </div>
                      {project.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{project.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <button className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
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
          <h2 className="text-3xl font-bold mb-6">Start Your Own Community Project</h2>
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
              <h3 className="text-3xl font-bold text-blue-900 mb-2">{totalProjects}+</h3>
              <p className="text-gray-600">Community Projects</p>
            </div>
            <div className="p-6">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-blue-900" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-blue-900 mb-2">15+</h3>
              <p className="text-gray-600">Cities Covered</p>
            </div>
            <div className="p-6">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-blue-900" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-blue-900 mb-2">50+</h3>
              <p className="text-gray-600">Volunteers</p>
            </div>
            <div className="p-6">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-900" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-blue-900 mb-2">10+</h3>
              <p className="text-gray-600">Partner Clubs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}