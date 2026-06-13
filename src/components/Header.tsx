import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isNewslettersOpen, setIsNewslettersOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Map page names to routes
  const pageToRouteMap: { [key: string]: string } = {
    'home': '/',
    'committee': '/committee',
    'clubs': '/clubs',
    'projects': '/projects',
    'newsletters': '/newsletters',
    'calendar': '/calendar',
    'join': '/join',
    'clubNewsletter': '/club-newsletter',
    'governorsLetters': '/governors-letters',
    'CommunityService': '/community-service',
    'ClubService': '/club-service',
    'VocationalService': '/vocational-service',
    'NewGenerationService': '/new-generation-service',
    'InternationalService': '/international-service',
    'PublicImageInitiative': '/public-image-initiative',
    'admin': '/admin-login'
  };

  // Update current page based on URL
  useEffect(() => {
    const pathToPageMap: { [key: string]: string } = {
      '/': 'home',
      '/committee': 'committee',
      '/clubs': 'clubs',
      '/projects': 'projects',
      '/newsletters': 'newsletters',
      '/calendar': 'calendar',
      '/join': 'join',
      '/club-newsletter': 'clubNewsletter',
      '/governors-letters': 'governorsLetters',
      '/community-service': 'CommunityService',
      '/club-service': 'ClubService',
      '/vocational-service': 'VocationalService',
      '/new-generation-service': 'NewGenerationService',
      '/international-service': 'InternationalService',
      '/public-image-initiative': 'PublicImageInitiative',
      '/admin': 'admin',
      '/admin-login': 'admin'
    };

    const currentPath = location.pathname;
    const page = pathToPageMap[currentPath] || 'home';
    
    if (page !== currentPage) {
      onNavigate(page);
    }
  }, [location.pathname, currentPage, onNavigate]);

  const handleNavigation = (page: string) => {
    const route = pageToRouteMap[page];
    if (route) {
      // Only navigate and let the App component handle the state update via the useEffect
      navigate(route);
    }
    
    setIsMenuOpen(false);
    setIsProjectsOpen(false);
    setIsNewslettersOpen(false);
  };

  const handleAdminNavigation = () => {
    navigate('/admin-login');
    setIsMenuOpen(false);
  };

  const handleJoinNavigation = () => {
    navigate('/join');
    setIsMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProjectsOpen(false);
      setIsNewslettersOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isProjectsActive = 
    currentPage === 'CommunityService' ||
    currentPage === 'ClubService' ||
    currentPage === 'VocationalService' ||
    currentPage === 'NewGenerationService' ||
    currentPage === 'InternationalService' ||
    currentPage === 'PublicImageInitiative';

  const isNewslettersActive = 
    currentPage === 'clubNewsletter' || 
    currentPage === 'governorsLetters';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-900 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="text-white text-sm font-semibold">
            ROTARY TUMKUR PRERANA
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleJoinNavigation}
              className="bg-yellow-500 text-blue-900 px-4 py-1 rounded text-sm font-semibold hover:bg-yellow-400 transition"
            >
              Join Rotary
            </button>
            <button
              onClick={handleAdminNavigation}
              className="bg-white text-blue-900 px-4 py-1 rounded text-sm font-semibold hover:bg-gray-100 transition"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div 
            className="flex items-center gap-4 cursor-pointer" 
            onClick={() => handleNavigation('home')}
          >
            <img
              src="/src/images/logo1.png"
              alt="Rotary Logo"
              className="h-16 w-16 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">ROTARY TUMKUR PRERANA</h1>
              <p className="text-sm text-gray-600">Club of Tumkur</p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-blue-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Menu */}
          <nav className="hidden lg:block">
            <ul className="flex gap-6 items-center">
              {/* Home */}
              <li>
                <button
                  onClick={() => handleNavigation('home')}
                  className={`font-semibold hover:text-blue-600 transition ${
                    currentPage === 'home' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                  }`}
                >
                  HOME
                </button>
              </li>

              {/* Committee */}
              <li>
                <button
                  onClick={() => handleNavigation('committee')}
                  className={`font-semibold hover:text-blue-600 transition ${
                    currentPage === 'committee' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                  }`}
                >
                  DISTRICT COMMITTEE
                </button>
              </li>

              {/* Clubs */}
              {/* <li>
                <button
                  onClick={() => handleNavigation('clubs')}
                  className={`font-semibold hover:text-blue-600 transition ${
                    currentPage === 'clubs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                  }`}
                >
                  CLUBS
                </button>
              </li> */}

              {/* Club Projects Dropdown */}
              <li className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProjectsOpen(!isProjectsOpen);
                  }}
                  className={`font-semibold hover:text-blue-600 transition flex items-center gap-1 ${
                    isProjectsActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                  }`}
                >
                  CLUB PROJECTS
                  <ChevronDown size={16} className={`${isProjectsOpen ? 'rotate-180' : ''} transition-transform`} />
                </button>
                {isProjectsOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md py-2 min-w-[220px] z-50 border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {[
                      { label: 'COMMUNITY SERVICE', page: 'CommunityService' },
                      { label: 'CLUB SERVICE', page: 'ClubService' },
                      { label: 'VOCATIONAL SERVICE', page: 'VocationalService' },
                      { label: 'NEW GENERATION SERVICE', page: 'NewGenerationService' },
                      { label: 'INTERNATIONAL SERVICE', page: 'InternationalService' },
                      { label: 'PUBLIC IMAGE INITIATIVE', page: 'PublicImageInitiative' },
                    ].map((item) => (
                      <button
                        key={item.page}
                        onClick={() => handleNavigation(item.page)}
                        className={`block w-full text-left px-4 py-2 hover:bg-blue-50 transition ${
                          currentPage === item.page ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>

              {/* Newsletters Dropdown */}
              <li className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNewslettersOpen(!isNewslettersOpen);
                  }}
                  className={`font-semibold hover:text-blue-600 transition flex items-center gap-1 ${
                    isNewslettersActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                  }`}
                >
                  NEWSLETTERS
                  <ChevronDown size={16} className={`${isNewslettersOpen ? 'rotate-180' : ''} transition-transform`} />
                </button>
                {isNewslettersOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md py-2 min-w-[220px] z-50 border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {[
                      { label: 'GOVERNORS MONTHLY LETTER', page: 'governorsLetters' },
                      { label: 'CLUB NEWS LETTER', page: 'clubNewsletter' },
                    ].map((item) => (
                      <button
                        key={item.page}
                        onClick={() => handleNavigation(item.page)}
                        className={`block w-full text-left px-4 py-2 hover:bg-blue-50 transition ${
                          currentPage === item.page ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>

              {/* Calendar */}
              <li>
                <button
                  onClick={() => handleNavigation('calendar')}
                  className={`font-semibold hover:text-blue-600 transition ${
                    currentPage === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                  }`}
                >
                  CALENDAR
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-gray-200 mt-4">
            <ul className="flex flex-col gap-0">
              {/* Home */}
              <li>
                <button
                  onClick={() => handleNavigation('home')}
                  className={`w-full text-left py-3 px-4 font-semibold border-b border-gray-100 ${
                    currentPage === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  HOME
                </button>
              </li>

              {/* Committee */}
              <li>
                <button
                  onClick={() => handleNavigation('committee')}
                  className={`w-full text-left py-3 px-4 font-semibold border-b border-gray-100 ${
                    currentPage === 'committee' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  DISTRICT COMMITTEE
                </button>
              </li>

              {/* Clubs */}
              {/* <li>
                <button
                  onClick={() => handleNavigation('clubs')}
                  className={`w-full text-left py-3 px-4 font-semibold border-b border-gray-100 ${
                    currentPage === 'clubs' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  CLUBS
                </button>
              </li> */}

              {/* Club Projects Mobile Dropdown */}
              <li className="border-b border-gray-100">
                <button
                  onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                  className="w-full text-left py-3 px-4 font-semibold flex justify-between items-center text-gray-700 hover:bg-gray-50"
                >
                  CLUB PROJECTS
                  <ChevronDown className={`transition-transform ${isProjectsOpen ? 'rotate-180' : ''}`} size={16} />
                </button>
                {isProjectsOpen && (
                  <div className="bg-gray-50">
                    {[
                      { label: 'COMMUNITY SERVICE', page: 'CommunityService' },
                      { label: 'CLUB SERVICE', page: 'ClubService' },
                      { label: 'VOCATIONAL SERVICE', page: 'VocationalService' },
                      { label: 'NEW GENERATION SERVICE', page: 'NewGenerationService' },
                      { label: 'INTERNATIONAL SERVICE', page: 'InternationalService' },
                      { label: 'PUBLIC IMAGE INITIATIVE', page: 'PublicImageInitiative' },
                    ].map((item) => (
                      <button
                        key={item.page}
                        onClick={() => handleNavigation(item.page)}
                        className={`block w-full text-left py-2 px-8 text-sm font-medium border-b border-gray-100 last:border-b-0 ${
                          currentPage === item.page ? 'text-blue-600 bg-blue-100' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>

              {/* Newsletters Mobile Dropdown */}
              <li className="border-b border-gray-100">
                <button
                  onClick={() => setIsNewslettersOpen(!isNewslettersOpen)}
                  className="w-full text-left py-3 px-4 font-semibold flex justify-between items-center text-gray-700 hover:bg-gray-50"
                >
                  NEWSLETTERS
                  <ChevronDown className={`transition-transform ${isNewslettersOpen ? 'rotate-180' : ''}`} size={16} />
                </button>
                {isNewslettersOpen && (
                  <div className="bg-gray-50">
                    {[
                      { label: 'GOVERNORS MONTHLY LETTER', page: 'governorsLetters' },
                      { label: 'CLUB NEWS LETTER', page: 'clubNewsletter' },
                    ].map((item) => (
                      <button
                        key={item.page}
                        onClick={() => handleNavigation(item.page)}
                        className={`block w-full text-left py-2 px-8 text-sm font-medium border-b border-gray-100 last:border-b-0 ${
                          currentPage === item.page ? 'text-blue-600 bg-blue-100' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>

              {/* Calendar */}
              <li>
                <button
                  onClick={() => handleNavigation('calendar')}
                  className={`w-full text-left py-3 px-4 font-semibold ${
                    currentPage === 'calendar' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  CALENDAR
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}