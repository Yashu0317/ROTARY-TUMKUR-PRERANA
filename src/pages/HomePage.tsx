import { useEffect, useState } from 'react';
import { Calendar, Users, Target, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define types locally since we're not using the external types file
interface DistrictOfficer {
  id: number;
  name: string;
  title: string;
  club_name?: string;
  photo_url?: string;
  order_position: number;
}

interface ClubProject {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url?: string;
  created_at: string;
  
}

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location?: string;
  organizer?: string;
}

interface HomePageProps {
  onNavigate: (page: string) => void;
}

// Mock data
const mockOfficers: DistrictOfficer[] = [
  {
    id: 1,
    name: 'Umamahesha A',
    title: 'PRESIDENT',
    club_name: 'Rotary Tumkur Prerana',
    photo_url: '/src/images/Rtn-Umamahesha-A.jpg',
    order_position: 1
  },
  {
    id: 2,
    name: 'Vijayakumari N',
    title: 'SECRETARY',
    club_name: 'Rotary Tumkur Prerana',
    photo_url: '/src/images/Rtn-Vijaya-Kumari-N.jpg',
    order_position: 2
  },
];

const mockProjects: ClubProject[] = [
  {
    id: 1,
    title: 'Community Cleanup',
    description: 'Helping clean up local parks and public spaces',
    category: 'Environment',
    image_url: '',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Education Support',
    description: 'Providing educational materials to underprivileged children',
    category: 'Education',
    image_url: '',
    created_at: new Date().toISOString()
  },
];

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Monthly Meeting',
    description: 'Regular monthly club meeting',
    event_date: new Date().toISOString(),
    location: 'Club House',
    organizer: 'Rotary Club'
  },
  {
    id: 2,
    title: 'Charity Event',
    description: 'Annual charity fundraising event',
    event_date: new Date(Date.now() + 86400000).toISOString(),
    location: 'Community Hall',
    organizer: 'Rotary Club'
  },
];

// Work section projects data - FIXED IMAGE PATHS
const workProjects = [
  {
    id: 1,
    title: "Community Health Camp",
    description: "Free health checkups and medical camps for underserved communities",
    category: "Healthcare",
    image: "/src/images/Healthcare.jpg",
    // impact: "500+ people served"
  },
  {
    id: 2,
    title: "Education for All",
    description: "Scholarships and educational support for underprivileged children",
    category: "Education",
    image: "/src/images/Education.jpg",
    // impact: "200+ students supported"
  },
  {
  id: 3,
  title: "Community Orientation Program",
  description: "Educational orientation sessions on health, hygiene, and community development",
  category: "Education",
  image: "/src/images/Social welfare.jpg",
  // impact: "500+ community members oriented"
},
  {
    id: 4,
    title: "Women Empowerment",
    description: "Skill development and entrepreneurship programs for women",
    category: "Social Welfare",
    image: "/src/images/womenemp.jpg",
    // impact: "150+ women trained"
  },
  {
    id: 5,
    title: "Tree Plantation Drive",
    description: "Large-scale tree plantation to combat climate change",
    category: "Environment",
    image: "/src/images/plantation.jpg",
    // impact: "5000+ trees planted"
  },
  {
    id: 6,
    title: "Disaster Relief",
    description: "Emergency aid and support during natural calamities",
    category: "Relief",
    image: "/src/images/relief.jpg",
    // impact: "1000+ families helped"
  }
];

// Fallback images in case your local images don't load
const fallbackImages = [
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400", // Healthcare
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400", // Education
  "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400", // Water
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400", // Women
  "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deae?w=400", // Environment
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400"  // Relief
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const [officers, setOfficers] = useState<DistrictOfficer[]>([]);
  const [projects, setProjects] = useState<ClubProject[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});
  const navigate = useNavigate();

  const loadData = async () => {
    // Use mock data instead of Supabase
    setOfficers(mockOfficers);
    setProjects(mockProjects);
    setEvents(mockEvents);
  };

  // Navigation handlers
  const handleJoinNavigation = () => {
    navigate('/join');
  };

  const handleProjectsNavigation = () => {
    navigate('/projects');
  };

  const handleEventsNavigation = () => {
    navigate('/events');
  };

  const handleNewslettersNavigation = () => {
    navigate('/newsletters');
  };

  const handleCommitteeNavigation = () => {
    navigate('/committee');
  };

  const handleEventNavigation = () => {
    navigate('/calendar');
  };

  const handleProjectNavigation = () => {
    navigate('/projects');
  };

  // Handle image loading errors
  const handleImageError = (projectId: number) => {
    setImageErrors(prev => ({ ...prev, [projectId]: true }));
  };

  // Get image source with fallback
  const getImageSource = (project: typeof workProjects[0]) => {
    if (imageErrors[project.id]) {
      return fallbackImages[project.id - 1];
    }
    return project.image;
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 py-10 md:py-14 overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 bg-black/30"
          style={{
            backgroundImage:
              "url('https://rcporvorim.org/wp-content/uploads/2020/05/wicked-bg-the7-5.svg')",
            mixBlendMode: "color-dodge",
            opacity: 0.4,
          }}
        ></div>

        {/* Content (Reduced Left & Right Padding) */}
        <div className="relative w-full px-2 sm:px-4 text-white z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ROTARY TUMKUR PRERANA
          </h1>

          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
            Service Above Self - Building communities and creating lasting change
          </p>

          <button
            onClick={handleJoinNavigation}
            className="bg-yellow-500 text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition text-lg"
          >
            Join Rotary
          </button>

          {/* Images Row */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
            <img
              src="src/images/ClubBanner.png"
              alt="Rotary Banner"
              className="rounded-2xl shadow-xl"
              style={{
                width: "100%",
                maxWidth: "450px",
                height: "auto",
                transition: "transform 0.6s ease-in-out, opacity 1s ease-in-out",
                animation: "fadeZoom 2s ease-in-out",
                opacity: 0.9,
              }}
            />

            <img
              src="src/images/ClubAdvirtisment.png"
              alt="Rotary Logo"
              className="rounded-2xl shadow-xl"
              style={{
                width: "100%",
                maxWidth: "450px",
                height: "auto",
                transition: "transform 0.6s ease-in-out, opacity 1s ease-in-out",
                animation: "fadeZoom 2s ease-in-out",
                opacity: 0.9,
              }}
            />
          </div>

          {/* Animations */}
          <style>
            {`
              @keyframes fadeZoom {
                0% { transform: scale(0.8); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
              }
            `}
          </style>
        </div>
      </section>

      {/* Rotary Dignitaries Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl text-center mb-12 text-blue-900">
              <span className="font-normal">ROTARY </span>
              <span className="font-bold">DIGNITARIES</span>
            </h2>

            <div className="flex justify-center gap-8 flex-wrap">
              {/* President Card */}
              <div
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ width: '280px' }}
              >
                <div className="w-40 h-56 rounded-xl border-4 border-yellow-500 mx-auto mb-4 overflow-hidden">
                  <img
                    src="/src/images/Rtn-Umamahesha-A.jpg"
                    alt="Umamahesha A"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/src/images/Rtn-Umamahesha-A.jpg';
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Umamahesha A</h3>
                <p className="text-gray-600 mb-4 font-semibold">PRESIDENT</p>
              </div>

              {/* Secretary Card */}
              <div
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ width: '280px' }}
              >
                <div className="w-40 h-56 rounded-xl border-4 border-yellow-500 mx-auto mb-4 overflow-hidden">
                  <img
                    src="/src/images/Rtn-Vijaya-Kumari-N.jpg"
                    alt="Vijayakumari N"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/src/images/Rtn-Vijaya-Kumari-N.jpg';
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Vijayakumari N</h3>
                <p className="text-gray-600 mb-4 font-semibold">SECRETARY</p>
              </div>
            </div>
            <br></br>
            <button
              onClick={handleCommitteeNavigation}
              className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition inline-flex items-center gap-2"
            >
              View Full Committee
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Work Section - Our Projects */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              Our <span className="text-yellow-500">Work</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the impactful projects and initiatives that are making a difference 
              in our community and beyond.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getImageSource(project)}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={() => handleImageError(project.id)}
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-500 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {project.category}
                    </span>
                  </div>

                  {/* Impact Badge */}
                  <div className="absolute top-4 right-4 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {project.impact}
                    </span>
                  </div>

                  {/* Hover Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Default Content */}
                <div className="p-6 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {/* Hover Button */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProjectNavigation();
                    }}
                    className="bg-white text-blue-900 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300 shadow-lg"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Projects Button */}
          <div className="text-center mt-12">
            <button
              onClick={handleProjectNavigation}
              className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition inline-flex items-center gap-2"
            >
              View All Projects
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Join Rotary Section */}
      <section className="relative py-16 bg-blue-900 text-white overflow-hidden">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://rcporvorim.org/wp-content/uploads/2020/05/wicked-bg-the7-5.svg')",
            mixBlendMode: "color-dodge",
            opacity: 0.5,
          }}
        ></div>

        {/* Content Layer */}
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Rotary Today</h2>

          <p className="text-xl mb-8 text-blue-100">
            Be part of a global network of leaders who exchange ideas, form lifelong
            friendships, and make a lasting impact in communities around the world.
          </p>

          <button
            onClick={handleJoinNavigation}
            className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition inline-flex items-center gap-2"
          >
            Become a Member
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}