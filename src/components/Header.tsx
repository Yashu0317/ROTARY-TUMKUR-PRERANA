import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const pageToRouteMap: Record<string, string> = {
    home: "/",
    committee: "/committee",
    clubs: "/clubs",
    projects: "/projects",
    newsletters: "/newsletters",
    calendar: "/calendar",
    join: "/join",
    clubNewsletter: "/club-newsletter",
    governorsLetters: "/governors-letters",
    CommunityService: "/club-service",
    ClubService: "/club-service",
    VocationalService: "/vocational-service",
    NewGenerationService: "/new-generation-service",
    InternationalService: "/international-service",
    PublicImageInitiative: "/public-image-initiative",
    admin: "/admin-login",
  };

  useEffect(() => {
    const pathToPageMap: Record<string, string> = {
      "/": "home",
      "/committee": "committee",
      "/clubs": "clubs",
      "/projects": "projects",
      "/newsletters": "newsletters",
      "/calendar": "calendar",
      "/join": "join",
      "/club-newsletter": "clubNewsletter",
      "/governors-letters": "governorsLetters",
      "/club-service": "ClubService",
      "/vocational-service": "VocationalService",
      "/new-generation-service": "NewGenerationService",
      "/international-service": "InternationalService",
      "/public-image-initiative": "PublicImageInitiative",
      "/admin-login": "admin",
    };

    const currentPath = location.pathname;
    const page = pathToPageMap[currentPath] || "home";
    if (page !== currentPage) onNavigate(page);
  }, [location.pathname, currentPage, onNavigate]);

  const handleNavigation = (page: string) => {
    const route = pageToRouteMap[page];
    if (route) {
      navigate(route);
      setIsMenuOpen(false);
    }
  };

  const handleAdminNavigation = () => {
    navigate("/admin-login");
    setIsMenuOpen(false);
  };

  const handleJoinNavigation = () => {
    navigate("/join");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
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

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => handleNavigation("home")}
          >
            <img src="/images/logo1.png" alt="Rotary Logo" className="h-16 w-16 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">
                ROTARY TUMKUR PRERANA
              </h1>
              <p className="text-sm text-gray-600">Club of Tumkur</p>
            </div>
          </div>

          <button
            className="lg:hidden text-blue-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <nav className="hidden lg:block">
            <ul className="flex gap-6 items-center">
              <li>
                <button
                  onClick={() => handleNavigation("home")}
                  className={`font-semibold hover:text-blue-600 transition ${
                    currentPage === "home"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  HOME
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation("committee")}
                  className={`font-semibold hover:text-blue-600 transition ${
                    currentPage === "committee"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  CLUB COMMITTEE
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation("ClubService")}
                  className={`font-semibold hover:text-blue-600 transition ${
                    currentPage === "club_service"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  CLUB PROJECTS
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation("clubNewsletter")}
                  className={`font-semibold hover:text-blue-600 transition ${
                    currentPage === "clubNewsletter" 
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  NEWSLETTERS
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation("calendar")}
                  className={`font-semibold hover:text-blue-600 transition ${
                    currentPage === "calendar"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  CALENDAR
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-gray-200 mt-4">
            <ul className="flex flex-col gap-0">
              <li>
                <button
                  onClick={() => handleNavigation("home")}
                  className={`w-full text-left py-3 px-4 font-semibold border-b border-gray-100 ${
                    currentPage === "home"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  HOME
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation("committee")}
                  className={`w-full text-left py-3 px-4 font-semibold border-b border-gray-100 ${
                    currentPage === "committee"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  CLUB COMMITTEE
                </button>
              </li>



              <li>
                <button
                  onClick={() => handleNavigation("CommunityService")}
                  className={`w-full text-left py-3 px-4 font-semibold border-b border-gray-100 ${
                    currentPage === "CommunityService" ||
                    currentPage === "ClubService" ||
                    currentPage === "VocationalService" ||
                    currentPage === "NewGenerationService" ||
                    currentPage === "InternationalService" ||
                    currentPage === "PublicImageInitiative"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  CLUB PROJECTS
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation("clubNewsletter")}
                  className={`w-full text-left py-3 px-4 font-semibold border-b border-gray-100 ${
                    currentPage === "clubNewsletter" ||
                    currentPage === "governorsLetters"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  NEWSLETTERS
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleNavigation("calendar")}
                  className={`w-full text-left py-3 px-4 font-semibold ${
                    currentPage === "calendar"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
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
