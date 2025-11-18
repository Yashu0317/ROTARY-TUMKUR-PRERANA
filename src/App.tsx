import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CommitteePage from './pages/CommitteePage';
import ClubsPage from './pages/ClubsPage';
import ProjectsPage from './pages/ProjectsPage';
import NewslettersPage from './pages/NewslettersPage';
import CalendarPage from './pages/CalendarPage';
import JoinPage from './pages/JoinPage';
import ClubNewsLetter from './pages/ClubNewsLetter';
import GovernorsLettersPage from './pages/GovernorsLettersPage';
import CommunityServicePage from './pages/CommunityServicePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCalendarPage from './pages/admin/AdminCalendarPage'; // Add this import
import ProtectedRoute from './components/ProtectedRoute';

// Main App component with routing
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Separate component that uses hooks
function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    
    // Map page names to routes
    const routeMap: { [key: string]: string } = {
      home: '/',
      committee: '/committee',
      clubs: '/clubs',
      projects: '/projects',
      newsletters: '/newsletters',
      calendar: '/calendar',
      admin: '/admin',
      join: '/join',
      clubNewsletter: '/club-newsletter',
      governorsLetters: '/governors-letters',
      CommunityService: '/community-service',
      ClubService: '/club-service',
      VocationalService: '/vocational-service',
      NewGenerationService: '/new-generation-service',
      InternationalService: '/international-service',
      PublicImageInitiative: '/public-image-initiative'
    };

    if (routeMap[page]) {
      navigate(routeMap[page]);
    }
  };

  // Layout component that conditionally shows header/footer
  const Layout = ({ children, showHeaderFooter = true }: { children: React.ReactNode; showHeaderFooter?: boolean }) => (
    <div className="min-h-screen bg-white">
      {showHeaderFooter && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}
      <main>{children}</main>
      {showHeaderFooter && <Footer />}
    </div>
  );

  return (
    <Routes>
      {/* Public routes with header/footer */}
      <Route path="/" element={
        <Layout>
          <HomePage onNavigate={handleNavigate} />
        </Layout>
      } />
      <Route path="/committee" element={
        <Layout>
          <CommitteePage />
        </Layout>
      } />
      <Route path="/clubs" element={
        <Layout>
          <ClubsPage />
        </Layout>
      } />
      <Route path="/projects" element={
        <Layout>
          <ProjectsPage />
        </Layout>
      } />
      <Route path="/newsletters" element={
        <Layout>
          <NewslettersPage />
        </Layout>
      } />
      <Route path="/calendar" element={
        <Layout>
          <CalendarPage />
        </Layout>
      } />
      <Route path="/join" element={
        <Layout>
          <JoinPage onNavigate={handleNavigate} />
        </Layout>
      } />
      <Route path="/club-newsletter" element={
        <Layout>
          <ClubNewsLetter />
        </Layout>
      } />
      <Route path="/governors-letters" element={
        <Layout>
          <GovernorsLettersPage />
        </Layout>
      } />
      <Route path="/community-service" element={
        <Layout>
          <CommunityServicePage onNavigate={handleNavigate} />
        </Layout>
      } />

      {/* Service pages - using CommunityServicePage as placeholder for now */}
      <Route path="/club-service" element={
        <Layout>
          <CommunityServicePage onNavigate={handleNavigate} />
        </Layout>
      } />
      <Route path="/vocational-service" element={
        <Layout>
          <CommunityServicePage onNavigate={handleNavigate} />
        </Layout>
      } />
      <Route path="/new-generation-service" element={
        <Layout>
          <CommunityServicePage onNavigate={handleNavigate} />
        </Layout>
      } />
      <Route path="/international-service" element={
        <Layout>
          <CommunityServicePage onNavigate={handleNavigate} />
        </Layout>
      } />
      <Route path="/public-image-initiative" element={
        <Layout>
          <CommunityServicePage onNavigate={handleNavigate} />
        </Layout>
      } />

      {/* Admin routes without header/footer */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Calendar Management Route */}
      <Route 
        path="/admin/calendar" 
        element={
          <ProtectedRoute>
            <AdminCalendarPage />
          </ProtectedRoute>
        } 
      />

      {/* 404 fallback */}
      <Route path="*" element={
        <Layout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
              <button 
                onClick={() => handleNavigate('home')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Go Home
              </button>
            </div>
          </div>
        </Layout>
      } />
    </Routes>
  );
}

export default App;