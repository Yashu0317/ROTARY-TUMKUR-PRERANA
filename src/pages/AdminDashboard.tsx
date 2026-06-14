import { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  Calendar, 
  FileText, 
  Target, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Filter
} from 'lucide-react';

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

interface Newsletter {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  published_date: string;
  location?: string;
  description?: string;
  uploaded_by?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  newsletter_type: 'club' | 'governor';
}

interface ClubProject {
  id: string;
  heading: string;
  description: string;
  image_url?: string;
  location?: string;
  service_date?: string;
  club_name?: string;
  category: 'community_service' | 'club_service' | 'vocational_service' | 'new_generation_service' | 'international_service' | 'public_image_initiative';
  status: 'completed' | 'ongoing' | 'upcoming';
  volunteers_count: number;
  impact_description?: string;
  created_by?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CommitteeMember {
  id: string;
  name: string;
  position: string;
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

type AdminItem = Event | Newsletter | ClubProject | CommitteeMember;

const API_BASE_URL = '/api';

function getTabTitle(tab: string): string {
  switch (tab) {
    case 'events': return 'Events & Calendar';
    case 'newsletters': return 'Newsletters';
    case 'projects': return 'Club Projects';
    case 'committee': return 'Committee Members';
    default: return '';
  }
}

function getDefaultFormData(type: string, newsletterType: 'club' | 'governor' = 'club'): any {
  const today = new Date().toISOString().split('T')[0];

  switch (type) {
    case 'events':
      return {
        event_type: 'Event',
        event_date: today,
        event_time: '',
        location: '',
        description: '',
        person_name: '',
        date_of_birth: '',
        couple_name: '',
        anniversary_date: '',
        event_name: '',
        is_active: true
      };
    case 'newsletters':
      return {
        title: '',
        file_url: '',
        file_name: '',
        file_size: 0,
        published_date: today,
        location: '',
        description: '',
        newsletter_type: newsletterType,
        is_active: true
      };
    case 'projects':
      return {
        heading: '',
        description: '',
        location: '',
        service_date: today,
        club_name: 'ROTARY TUMKUR PRERANA',
        category: 'community_service',
        status: 'upcoming',
        volunteers_count: 0,
        impact_description: '',
        is_active: true
      };
    case 'committee':
      return {
        name: '',
        position: '',
        category: 'board_of_directors',
        email: '',
        phone: '',
        bio: '',
        position_order: 0,
        is_active: true
      };
    default:
      return {};
  }
}

// Item Row Component
function ItemRow({ 
  item, 
  type, 
  title,
  onEdit, 
  onDelete 
}: { 
  item: AdminItem; 
  type: string;
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryDisplayName = (category?: string) => {
    if (!category) return 'No category';
    
    switch (category) {
      case 'community_service': return 'Community Service';
      case 'club_service': return 'Club Service';
      case 'vocational_service': return 'Vocational Service';
      case 'new_generation_service': return 'New Generation Service';
      case 'international_service': return 'International Service';
      case 'public_image_initiative': return 'Public Image Initiative';
      case 'board_of_directors': return 'Board of Directors';
      case 'chairmans': return 'Chairmans';
      case 'avenues_of_service': return 'Avenues of Service';
      default: return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl || imageUrl.includes('undefined')) return '/default-avatar.png';
    
    if (imageUrl.startsWith('/')) {
      return `${imageUrl}`;
    }
    
    return imageUrl;
  };

  const getAdditionalInfo = () => {
    switch (type) {
      case 'events':
        const event = item as Event;
        return (
          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 flex-wrap gap-2">
            <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {event.event_type}
            </span>
            <span>Date: {formatDate(event.event_date)}</span>
            {event.location && <span>Location: {event.location}</span>}
            {event.person_name && <span>Person: {event.person_name}</span>}
            {event.couple_name && <span>Couple: {event.couple_name}</span>}
          </div>
        );
      
      case 'newsletters':
        const newsletter = item as Newsletter;
        return (
          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 flex-wrap gap-2">
            <span className={`capitalize px-2 py-1 rounded-full text-xs ${
              newsletter.newsletter_type === 'club' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {newsletter.newsletter_type} newsletter
            </span>
            <span>Published: {formatDate(newsletter.published_date)}</span>
            <span>File: {newsletter.file_name}</span>
            {newsletter.location && <span>Location: {newsletter.location}</span>}
          </div>
        );
      
      case 'projects':
        const project = item as ClubProject;
        return (
          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 flex-wrap gap-2">
            <span className={`px-2 py-1 rounded-full text-xs capitalize ${
              project.status === 'completed' ? 'bg-green-100 text-green-800' :
              project.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {project.status}
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
              {getCategoryDisplayName(project.category)}
            </span>
            {project.service_date && <span>Date: {formatDate(project.service_date)}</span>}
            {project.club_name && <span>Club: {project.club_name}</span>}
            {project.volunteers_count > 0 && <span>Volunteers: {project.volunteers_count}</span>}
          </div>
        );
      
      case 'committee':
        const member = item as CommitteeMember;
        return (
          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 flex-wrap gap-2">
            <span className="capitalize bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
              {getCategoryDisplayName(member.category)}
            </span>
            <span className="font-medium text-blue-600">Position: {member.position}</span>
            {member.email && <span>Email: {member.email}</span>}
            {member.phone && <span>Phone: {member.phone}</span>}
          </div>
        );
      
      default:
        return null;
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'events':
        return (item as Event).description;
      case 'newsletters':
        return (item as Newsletter).description;
      case 'projects':
        return (item as ClubProject).description;
      case 'committee':
        return (item as CommitteeMember).bio;
      default:
        return '';
    }
  };

  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{title}</h3>
        {getAdditionalInfo()}
        {getDescription() && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{getDescription()}</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
          title="Edit"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

// Form Component for Create/Edit
function ItemForm({ 
  item, 
  type, 
  newsletterType,
  onSubmit, 
  onCancel,
  onFileUpload,
  uploadingFile
}: { 
  item?: AdminItem | null;
  type: string;
  newsletterType?: 'club' | 'governor';
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onFileUpload: (file: File, type: 'image' | 'pdf') => Promise<string | null>;
  uploadingFile: boolean;
}) {
  const [formData, setFormData] = useState<any>(
    item || getDefaultFormData(type, newsletterType)
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);

  // Reset form when item changes
  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData(getDefaultFormData(type, newsletterType));
    }
  }, [item, type, newsletterType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let finalData = { ...formData };
      
      // Handle file uploads first if needed
      if (selectedImage) {
        const imageUrl = await onFileUpload(selectedImage, 'image');
        if (imageUrl && !imageUrl.startsWith('blob:')) {
          // Only use the URL if it's not a blob URL (temporary client-side URL)
          finalData.image_url = imageUrl;
        } else if (imageUrl && imageUrl.startsWith('blob:')) {
          // If it's a blob URL, don't save it to database
          console.warn('Using temporary blob URL, image will not persist');
          finalData.image_url = null; // Don't save blob URLs to database
        }
      }
      
      if (selectedPdf && type === 'newsletters') {
        const pdfUrl = await onFileUpload(selectedPdf, 'pdf');
        if (pdfUrl) {
          finalData.file_url = pdfUrl;
          finalData.file_name = selectedPdf.name;
          finalData.file_size = selectedPdf.size;
        }
      }

      // Process form data to ensure proper values
      const processedData = processFormData(finalData, type);
      console.log('Final processed data before submit:', processedData);
      
      onSubmit(processedData);
    } catch (error) {
      console.error('Error in form submission:', error);
      alert('Form submission failed. Please check your inputs and try again.');
    }
  };

  // Process form data to ensure no undefined values
  const processFormData = (data: any, dataType: string) => {
    const processed: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) {
        continue; // Skip undefined values entirely
      }
      
      if (value === '') {
        processed[key] = null;
      } else if (typeof value === 'number') {
        processed[key] = value;
      } else if (key === 'is_active') {
        processed[key] = Boolean(value);
      } else {
        processed[key] = value;
      }
    }
    
    // Ensure required fields for newsletters
    if (dataType === 'newsletters') {
      if (!processed.file_url && selectedPdf) {
        processed.file_url = 'pending_upload';
      }
      if (!processed.file_name && selectedPdf) {
        processed.file_name = selectedPdf.name;
      }
      processed.file_size = processed.file_size || 0;
    }
    
    // Ensure position_order is always a number for committee
    if (dataType === 'committee') {
      processed.position_order = parseInt(processed.position_order) || 0;
    }

    // Ensure volunteers_count is always a number for projects
    if (dataType === 'projects') {
      processed.volunteers_count = parseInt(processed.volunteers_count) || 0;
    }
    
    return processed;
  };

  const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl || imageUrl.includes('undefined')) return '/default-avatar.png';
    
    if (imageUrl.startsWith('/')) {
      return `${imageUrl}`;
    }
    
    if (imageUrl.startsWith('blob:')) {
      return imageUrl; // Keep blob URLs for preview
    }
    
    return imageUrl;
  };

  const renderEventTypeFields = () => {
    if (type !== 'events') return null;

    switch (formData.event_type) {
      case 'Birthday':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Person Name *</label>
              <input
                type="text"
                required
                value={formData.person_name || ''}
                onChange={(e) => setFormData({ ...formData, person_name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter person's name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        );
      
      case 'Anniversary':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Couple Name *</label>
              <input
                type="text"
                required
                value={formData.couple_name || ''}
                onChange={(e) => setFormData({ ...formData, couple_name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter couple's name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Anniversary Date</label>
              <input
                type="date"
                value={formData.anniversary_date || ''}
                onChange={(e) => setFormData({ ...formData, anniversary_date: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        );
      
      case 'Event':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Name *</label>
            <input
              type="text"
              required
              value={formData.event_name || ''}
              onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter event name"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderFileUpload = () => {
    if (type === 'newsletters') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700">PDF File *</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setSelectedPdf(e.target.files?.[0] || null)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required={!item}
          />
          {uploadingFile && <p className="text-sm text-blue-600 mt-1">Uploading file...</p>}
        </div>
      );
    }

    // IMAGE UPLOAD FOR COMMITTEE, PROJECTS, EVENTS
    if (type === 'projects' || type === 'committee' || type === 'events') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {type === 'committee' ? 'Profile Image' : 'Image'}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {/* Show current image if editing */}
          {item && (item as any).image_url && !(item as any).image_url.includes('undefined') && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Current Image:</p>
              <img 
                src={getImageUrl((item as any).image_url)} 
                alt="Current" 
                className="h-20 w-20 object-cover rounded mt-1 border"
                onError={(e) => {
                  console.error('Image failed to load:', (item as any).image_url);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          {uploadingFile && <p className="text-sm text-blue-600 mt-1">Uploading image...</p>}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Common Fields */}
          {(type === 'events' || type === 'newsletters') && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {type === 'events' ? 'Event Title' : 'Newsletter Title'} *
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {type === 'projects' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Heading *</label>
              <input
                type="text"
                required
                value={formData.heading || ''}
                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {type === 'committee' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position *</label>
                <input
                  type="text"
                  required
                  value={formData.position || ''}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., President, Secretary, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <select
                  required
                  value={formData.category || 'board_of_directors'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="board_of_directors">Board of Directors</option>
                  <option value="chairmans">Chairmans</option>
                  <option value="avenues_of_service">Avenues of Service</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position Order</label>
                <input
                  type="number"
                  value={formData.position_order || 0}
                  onChange={(e) => setFormData({ ...formData, position_order: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {/* Newsletter Type Selector */}
          {type === 'newsletters' && !item && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Newsletter Type *</label>
              <select
                required
                value={formData.newsletter_type || 'club'}
                onChange={(e) => setFormData({ ...formData, newsletter_type: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="club">Club Newsletter</option>
                <option value="governor">Governor Newsletter</option>
              </select>
            </div>
          )}

          {/* Type-specific fields */}
          {type === 'events' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Type *</label>
                <select
                  required
                  value={formData.event_type || ''}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Event">Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Date *</label>
                <input
                  type="date"
                  required
                  value={formData.event_date || ''}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Time</label>
                <input
                  type="time"
                  value={formData.event_time || ''}
                  onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {type === 'newsletters' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Published Date *</label>
                <input
                  type="date"
                  required
                  value={formData.published_date || ''}
                  onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {type === 'projects' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Date</label>
                <input
                  type="date"
                  value={formData.service_date || ''}
                  onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <select
                  required
                  value={formData.category || 'community_service'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="community_service">Community Service</option>
                  <option value="club_service">Club Service</option>
                  <option value="vocational_service">Vocational Service</option>
                  <option value="new_generation_service">New Generation Service</option>
                  <option value="international_service">International Service</option>
                  <option value="public_image_initiative">Public Image Initiative</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status || 'upcoming'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="completed">Completed</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Club Name</label>
                <input
                  type="text"
                  value={formData.club_name || ''}
                  onChange={(e) => setFormData({ ...formData, club_name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Volunteers Count</label>
                <input
                  type="number"
                  value={formData.volunteers_count || 0}
                  onChange={(e) => setFormData({ ...formData, volunteers_count: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {/* Event Type Specific Fields */}
          {type === 'events' && renderEventTypeFields()}

          {/* Location Field for multiple types */}
          {(type === 'events' || type === 'projects' || type === 'newsletters') && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {/* File Upload */}
          {renderFileUpload()}
        </div>

        {/* Description/Bio Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {type === 'committee' ? 'Bio' : 'Description'}
          </label>
          <textarea
            rows={3}
            value={formData.description || formData.bio || ''}
            onChange={(e) => {
              if (type === 'committee') {
                setFormData({ ...formData, bio: e.target.value });
              } else {
                setFormData({ ...formData, description: e.target.value });
              }
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Impact Description for Projects */}
        {type === 'projects' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Impact Description</label>
            <textarea
              rows={2}
              value={formData.impact_description || ''}
              onChange={(e) => setFormData({ ...formData, impact_description: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X size={16} className="inline mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploadingFile}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} className="inline mr-2" />
            {uploadingFile ? 'Uploading...' : (item ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'events' | 'newsletters' | 'projects' | 'committee'>('events');
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<AdminItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newsletterType, setNewsletterType] = useState<'club' | 'governor'>('club');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      switch (activeTab) {
        case 'events':
          endpoint = '/calendar';
          break;
        case 'newsletters':
          endpoint = '/newsletters';
          break;
        case 'projects':
          endpoint = '/services';
          break;
        case 'committee':
          endpoint = '/committee';
          break;
      }

      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
      }
      
      const result = await response.json();

if (activeTab === 'newsletters') {
  setItems(Array.isArray(result.data) ? result.data : []);
} else {
  setItems(Array.isArray(result) ? result : []);
}
    } catch (error) {
      console.error('Error loading items:', error);
      alert('Failed to load items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced function to remove undefined values and ensure proper data types
  const sanitizeDataForDatabase = (obj: any): any => {
    if (obj === null || obj === undefined) {
      return null;
    }
    
    if (typeof obj === 'object' && !Array.isArray(obj)) {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Convert undefined to null, empty strings to null, and ensure proper types
        if (value === undefined) {
          cleaned[key] = null;
        } else if (value === '') {
          cleaned[key] = null;
        } else if (typeof value === 'number') {
          cleaned[key] = value;
        } else if (key === 'is_active') {
          cleaned[key] = Boolean(value);
        } else if (key === 'volunteers_count' || key === 'position_order' || key === 'file_size') {
          // Ensure numeric fields are properly converted
          cleaned[key] = parseInt(value) || 0;
        } else {
          cleaned[key] = value;
        }
      }
      return cleaned;
    }
    
    return obj;
  };

  const handleCreate = async (itemData: any) => {
    try {
      console.log('Creating item with data:', itemData);
      
      let endpoint = '';
      switch (activeTab) {
        case 'events':
          endpoint = '/calendar';
          break;
        case 'newsletters':
          endpoint = '/newsletters';
          itemData.newsletter_type = newsletterType;
          break;
        case 'projects':
          endpoint = '/services';
          break;
        case 'committee':
          endpoint = '/committee';
          break;
      }

      // Sanitize data to remove undefined values and ensure proper data types
      const finalData = sanitizeDataForDatabase(itemData);
      console.log('Final sanitized data to send:', finalData);

      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Create response:', result);
      
      setIsCreating(false);
      await loadItems();
      alert('Item created successfully!');
    } catch (error) {
      console.error('Error creating item:', error);
      alert(`Failed to create item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpdate = async (itemData: any) => {
    try {
      console.log('Updating item with data:', itemData);
      
      // Remove any blob URLs from the data before sending to server
      const dataToSend = { ...itemData };
      if (dataToSend.image_url && dataToSend.image_url.startsWith('blob:')) {
        delete dataToSend.image_url; // Remove blob URLs
      }
      
      let endpoint = '';
      switch (activeTab) {
        case 'events':
          endpoint = `/calendar/${dataToSend.id}`;
          break;
        case 'newsletters':
          endpoint = `/newsletters/${dataToSend.id}`;
          break;
        case 'projects':
          endpoint = `/services/${dataToSend.id}`;
          break;
        case 'committee':
          endpoint = `/committee/${dataToSend.id}`;
          break;
      }

      // Sanitize data to remove undefined values and ensure proper data types
      const finalData = sanitizeDataForDatabase(dataToSend);
      console.log('Final sanitized data to send:', finalData);

      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Full error response:', errorText);
        console.log('Status:', response.status);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update response:', result);
      
      setEditingItem(null);
      await loadItems();
      alert('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
      alert(`Failed to update item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (item: AdminItem) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      let endpoint = '';
      switch (activeTab) {
        case 'events':
          endpoint = `/calendar/${item.id}`;
          break;
        case 'newsletters':
          endpoint = `/newsletters/${item.id}`;
          break;
        case 'projects':
          endpoint = `/services/${item.id}`;
          break;
        case 'committee':
          endpoint = `/committee/${item.id}`;
          break;
      }

      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.statusText}`);
      }

      await loadItems();
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

 const handleFileUpload = async (
  file: File,
  type: "image" | "pdf" = "image"
): Promise<string | null> => {
  setUploadingFile(true);

  try {
    const formData = new FormData();
    formData.append("file", file);       // Backend expects 'file'
    formData.append("type", type);       // Extra metadata (optional)

    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Optional token if authenticated
      },
      body: formData,
    });

    if (!response.ok) {
      console.warn("Upload failed with status:", response.status);

      // Development fallback: provide preview blob URL for images
      if (type === "image") {
        return URL.createObjectURL(file);
      }
      return null;
    }

    const result = await response.json();
    console.log("✅ Upload successful:", result);

    // Support multiple possible backend response formats
    return result.fileUrl || result.url || result.image_url;
  } catch (error) {
    console.error("❌ Error uploading file:", error);

    // Dev fallback for image only
    if (type === "image") {
      return URL.createObjectURL(file);
    }

    return null;
  } finally {
    setUploadingFile(false);
  }
};

  const getItemTitle = (item: AdminItem): string => {
    switch (activeTab) {
      case 'events':
        const event = item as Event;
        return event.title || event.event_name || event.person_name || event.couple_name || 'Untitled Event';
      case 'newsletters':
        return (item as Newsletter).title;
      case 'projects':
        return (item as ClubProject).heading;
      case 'committee':
        return (item as CommitteeMember).name;
      default:
        return '';
    }
  };

  const filteredItems = items.filter(item => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      getItemTitle(item).toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter for projects
    let matchesStatus = true;
    if (activeTab === 'projects' && statusFilter !== 'all') {
      matchesStatus = (item as ClubProject).status === statusFilter;
    }
    
    // Category filter for projects and committee
    let matchesCategory = true;
    if (categoryFilter !== 'all') {
      if (activeTab === 'projects') {
        matchesCategory = (item as ClubProject).category === categoryFilter;
      } else if (activeTab === 'committee') {
        matchesCategory = (item as CommitteeMember).category === categoryFilter;
      }
    }
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const renderFilters = () => {
    if (activeTab === 'projects') {
      return (
        <div className="flex space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="community_service">Community Service</option>
            <option value="club_service">Club Service</option>
            <option value="vocational_service">Vocational Service</option>
            <option value="new_generation_service">New Generation Service</option>
            <option value="international_service">International Service</option>
            <option value="public_image_initiative">Public Image Initiative</option>
          </select>
        </div>
      );
    } else if (activeTab === 'committee') {
      return (
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="board_of_directors">Board of Directors</option>
          <option value="chairmans">Chairmans</option>
          <option value="avenues_of_service">Avenues of Service</option>
        </select>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-sm text-gray-700 hover:text-gray-900">
                <Settings size={16} className="mr-1" />
                Settings
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  window.location.href = '/admin/login';
                }}
                className="flex items-center text-sm text-red-600 hover:text-red-800"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'events', icon: Calendar, label: 'Events & Calendar' },
              { key: 'newsletters', icon: FileText, label: 'Newsletters' },
              { key: 'projects', icon: Users, label: 'Club Projects' },
              { key: 'committee', icon: Users, label: 'Committee Members' },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key as any);
                  setIsCreating(false);
                  setEditingItem(null);
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Actions */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getTabTitle(activeTab)}</h1>
              <p className="text-gray-600 mt-1">
                Manage {activeTab === 'events' ? 'events and calendar entries' : 
                       activeTab === 'newsletters' ? 'newsletters and publications' :
                       activeTab === 'projects' ? 'club projects and service activities' : 
                       'committee members and leadership'}
              </p>
            </div>
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingItem(null);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Add New
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {renderFilters()}
            </div>
          </div>
        </div>

        {/* Newsletter Type Selector */}
        {activeTab === 'newsletters' && !editingItem && !isCreating && (
          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setNewsletterType('club')}
                className={`px-4 py-2 rounded-md font-medium ${
                  newsletterType === 'club'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Club Newsletters
              </button>
              <button
                onClick={() => setNewsletterType('governor')}
                className={`px-4 py-2 rounded-md font-medium ${
                  newsletterType === 'governor'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Governor Newsletters
              </button>
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {(isCreating || editingItem) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Edit' : 'Create New'} {getTabTitle(activeTab).slice(0, -1)}
              </h2>
            </div>
            <ItemForm
              item={editingItem}
              type={activeTab}
              newsletterType={newsletterType}
              onSubmit={editingItem ? handleUpdate : handleCreate}
              onCancel={() => {
                setIsCreating(false);
                setEditingItem(null);
              }}
              onFileUpload={handleFileUpload}
              uploadingFile={uploadingFile}
            />
          </div>
        )}

        {/* Items List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No items found</p>
              <p className="text-gray-400 mt-2">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : `Get started by creating your first ${getTabTitle(activeTab).toLowerCase()}`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  type={activeTab}
                  title={getItemTitle(item)}
                  onEdit={() => {
                    setEditingItem(item);
                    setIsCreating(false);
                  }}
                  onDelete={() => handleDelete(item)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}