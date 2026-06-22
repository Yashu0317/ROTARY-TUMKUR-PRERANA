import { useEffect, useState } from 'react';
import { Mail, Phone, User, Loader } from 'lucide-react';

interface CommitteeMember {
  id: string;
  name: string;
  title: string; // CHANGED: Using 'title' instead of 'position'
  image_url?: string;
  category: 'board_of_directors' | 'chairmans' | 'avenues_of_service';
  email?: string;
  phone?: string;
  bio?: string;
  position_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = '/api';

export default function CommitteePage() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCommitteeMembers();
  }, []);

  const loadCommitteeMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/committee`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch committee members');
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      setMembers(data || []);
      
    } catch (error) {
      console.error('Error loading committee members:', error);
      setError('Failed to load committee members. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getMembersByCategory = (category: CommitteeMember['category']) => {
    return members
      .filter(member => member.is_active)
      .filter(member => member.category === category)
      .sort((a, b) => a.position_order - b.position_order);
  };

  const boardMembers = getMembersByCategory('board_of_directors');
  const chairmans = getMembersByCategory('chairmans');
  const serviceAvenues = getMembersByCategory('avenues_of_service');

  const handleKnowMore = (member: CommitteeMember) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading committee members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-600 mb-4">
              <User className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Committee</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadCommitteeMembers}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-blue-900 mb-4 text-left">CLUB Committee</h1>
        <p className="text-lg text-gray-600 mb-12 text-left">
          Meet the dedicated leaders of ROTARY TUMKUR PRERANA working together to serve our communities.
        </p>

        {/* Board of Directors Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl text-center mb-12 text-blue-900">
                <span className="font-normal">BOARD OF </span>
                <span className="font-bold"> DIRECTORS </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
                {boardMembers.map((member, index) => (
                  <MemberCard 
                    key={member.id}
                    member={member}
                    index={index}
                    onKnowMore={handleKnowMore}
                  />
                ))}
              </div>

              {boardMembers.length === 0 && (
                <div className="text-center py-12">
                  <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500">No board members found.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Chairmans Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl text-center mb-12 text-blue-900">
                <span className="font-bold">CHAIRPERSONS</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
                {chairmans.map((member, index) => (
                  <MemberCard 
                    key={member.id}
                    member={member}
                    index={index}
                    onKnowMore={handleKnowMore}
                  />
                ))}
              </div>

              {chairmans.length === 0 && (
                <div className="text-center py-12">
                  <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500">No chairpersons found.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Avenues of Service Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl text-center mb-12 text-blue-900">
                <span className="font-normal">AVENUES OF</span>
                <span className="font-bold"> SERVICE</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
                {serviceAvenues.map((member, index) => (
                  <MemberCard 
                    key={member.id}
                    member={member}
                    index={index}
                    onKnowMore={handleKnowMore}
                  />
                ))}
              </div>

              {serviceAvenues.length === 0 && (
                <div className="text-center py-12">
                  <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500">No service avenue members found.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Member Detail Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-blue-900">Member Details</h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="text-center mb-6">
                  <div className="w-32 h-32 rounded-full border-4 border-yellow-500 overflow-hidden mx-auto mb-4">
                    <img
                      src={getImageUrl(selectedMember.image_url, selectedMember.name)}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getDefaultAvatar(selectedMember.name);
                      }}
                    />
                  </div>
                  <h4 className="text-xl font-bold text-blue-900">{selectedMember.name}</h4>
                  <p className="text-gray-600 font-semibold text-lg mt-1">
                    {selectedMember.title}
                  </p>
                </div>

                {selectedMember.bio && (
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-700 mb-2">About</h5>
                    <p className="text-gray-600 text-sm leading-relaxed">{selectedMember.bio}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {selectedMember.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <a 
                        href={`mailto:${selectedMember.email}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {selectedMember.email}
                      </a>
                    </div>
                  )}

                  {selectedMember.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <a 
                        href={`tel:${selectedMember.phone}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {selectedMember.phone}
                      </a>
                    </div>
                  )}
                </div>

                <button
                  onClick={closeModal}
                  className="w-full mt-6 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Member Card Component
function MemberCard({ 
  member, 
  index, 
  onKnowMore 
}: { 
  member: CommitteeMember;
  index: number;
  onKnowMore: (member: CommitteeMember) => void;
}) {
  return (
    <div
      className="bg-white rounded-xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2 cursor-pointer group"
      style={{
        animation: `fadeInUp 0.8s forwards`,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="w-24 h-24 rounded-full border-4 border-yellow-500 overflow-hidden mx-auto mb-4 group-hover:border-yellow-600 transition-colors">
        <img
          src={getImageUrl(member.image_url, member.name)}
          alt={member.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getDefaultAvatar(member.name);
          }}
        />
      </div>
      
      <h3 className="text-lg font-bold text-blue-900 mb-2 group-hover:text-blue-700 transition-colors">
        {member.name}
      </h3>
      
      {/* POSITION DISPLAY - Using title field */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-medium min-h-[2.5rem] flex items-center justify-center">
        {member.title || 'Committee Member'}
      </p>

      <div className="flex justify-center space-x-2 mb-4">
        {member.email && (
          <a 
            href={`mailto:${member.email}`}
            className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Mail size={16} />
          </a>
        )}
        {member.phone && (
          <a 
            href={`tel:${member.phone}`}
            className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone size={16} />
          </a>
        )}
      </div>

      <button
        onClick={() => onKnowMore(member)}
        className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-sm"
      >
        Know More
      </button>
    </div>
  );
}

// Helper functions for image handling
function getImageUrl(imageUrl?: string, name?: string): string {
  // If image_url is undefined or contains 'undefined', use avatar
  if (!imageUrl || imageUrl.includes('undefined')) {
    return getDefaultAvatar(name);
  }
  
  // If it's a relative path, make it absolute
  if (imageUrl.startsWith('/')) {
    return `${imageUrl}`;
  }
  
  return imageUrl;
}

function getDefaultAvatar(name?: string): string {
  // Use a placeholder service with the member's name
  if (name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=100`;
  }
  return `https://ui-avatars.com/api/?name=Member&background=0D8ABC&color=fff&size=100`;
}

// Add CSS animations
const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
