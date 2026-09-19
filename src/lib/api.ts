// lib/api.ts

// ✅ Get API base URL from environment or use defaults
const getApiBaseUrl = (): string => {
  // Production: Use Render backend URL
  if (import.meta.env.MODE === 'production') {
    return import.meta.env.VITE_API_URL 
      ? `${import.meta.env.VITE_API_URL}/api`
      : 'https://rotary-tumkur-prerana-1.onrender.com/api';
  }
  
  // Development: Use localhost
  return import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔗 API Base URL:', API_BASE_URL);

export const api = {
  // Generic fetch helper
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('❌ API Request Failed:', {
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  },

  // Calendar endpoints
  calendar: {
    getEvents: (filters?: any) => 
      api.request('/calendar' + (filters ? `?${new URLSearchParams(filters)}` : '')),
    createEvent: (eventData: any) => 
      api.request('/calendar', { method: 'POST', body: JSON.stringify(eventData) }),
    updateEvent: (id: string, eventData: any) => 
      api.request(`/calendar/${id}`, { method: 'PUT', body: JSON.stringify(eventData) }),
    deleteEvent: (id: string) => 
      api.request(`/calendar/${id}`, { method: 'DELETE' }),
  },

  // Newsletter endpoints
  newsletters: {
    getNewsletters: (filters?: any) => 
      api.request('/newsletters' + (filters ? `?${new URLSearchParams(filters)}` : '')),
    createNewsletter: (newsletterData: any) => 
      api.request('/newsletters', { method: 'POST', body: JSON.stringify(newsletterData) }),
  },

  // Services endpoints
  services: {
    getServices: (filters?: any) => 
      api.request('/services' + (filters ? `?${new URLSearchParams(filters)}` : '')),
    createService: (serviceData: any) => 
      api.request('/services', { method: 'POST', body: JSON.stringify(serviceData) }),
  },

  // Committee endpoints
  committee: {
    getMembers: () => api.request('/committee'),
    createMember: (memberData: any) => 
      api.request('/committee', { method: 'POST', body: JSON.stringify(memberData) }),
  },

  // Join endpoints
  join: {
    submitRequest: (formData: any) => 
      api.request('/join', { method: 'POST', body: JSON.stringify(formData) }),
  },

  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) => 
      api.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  },

  // Upload endpoints
  upload: {
    file: (file: File, type?: 'image' | 'pdf') => {
      const formData = new FormData();
      formData.append('file', file);
      if (type) {
        formData.append('type', type);
      }
      
      return fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Upload error: ${response.status}`);
          }
          return response.json();
        })
        .catch(error => {
          console.error('❌ Upload Failed:', error.message);
          throw error;
        });
    },
  },
};

// ✅ Export API URL for debugging
export const getApiUrl = () => API_BASE_URL;

export default api;
